import { parseBarlauProductPage, extractCategoryProductLinks, extractMaxPageNumber } from "./parseBarlauProduct.js"

// Регулярное (см. api/cron/sync-catalog.ts) наполнение каталога `products` из
// категорий IP-камер HiWatch/Hikvision + регистраторов и сетевого оборудования
// на barlau.kz. Узкий, вручную составленный список категорий (не весь сайт),
// с ограничениями по объёму (см. MAX_PAGES_PER_CATEGORY/TIME_BUDGET_MS ниже).
//
// Фото товара НЕ берётся с barlau.kz (тот же принцип, что и в
// scripts/scrape-barlau.ts) — imageUrl всегда null. Автоматический поиск
// официального фото на hiwatch.ru/hikvision.com проверен и признан
// ненадёжным (hikvision.com отдаёт 403 на автоматические запросы, у
// hiwatch.ru нет предсказуемого поиска по модели) — фото оператор
// добавляет вручную.

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
const BARLAU_ORIGIN = "https://barlau.kz"
const MAX_PAGES_PER_CATEGORY = 2
const PRODUCT_FETCH_CONCURRENCY = 4
const TIME_BUDGET_MS = 4.5 * 60 * 1000

// Значение — категория в enum `products.category` (cctv | network).
// Обнаружено вручную через хабы /catalog/ip_videonablyudenie_hiwatch/ и
// /catalog/videonablyudenie_hikvision/, плюс корневой /catalog/ для сетевых
// категорий.
const CATEGORIES: Record<string, "cctv" | "network"> = {
  ip_kupolnye_videokamery: "cctv", // HiWatch, купольные камеры
  ip_kubicheskie_videokamery: "cctv", // HiWatch, кубические камеры
  ip_tsilindricheskie_videokamery: "cctv", // HiWatch, цилиндрические камеры
  ip_ptz_pozitsionnye_videokamery: "cctv", // HiWatch, PTZ камеры
  ip_kamery_avtonomnye: "cctv", // Hikvision, автономные камеры
  ip_kamery_panoramnye: "cctv", // Hikvision, панорамные камеры
  ip_kamery_seriya_1: "cctv", // Hikvision, камеры серия 1
  ip_kamery_seriya_2: "cctv", // Hikvision, камеры серия 2
  ip_kamery_teplovizionnye: "cctv", // Hikvision, тепловизионные камеры
  ip_pt_kamery: "cctv", // Hikvision, PT камеры
  ip_ptz_kamery_pozitsionnye: "cctv", // Hikvision, PTZ камеры
  ip_zapisyvayushchie_ustroystva: "cctv", // HiWatch, регистраторы (NVR)
  ip_videoregistratory: "cctv", // Hikvision, регистраторы (NVR)
  wifi_routery: "network", // WiFi роутеры
  wifi_tochki_dostupa: "network", // WiFi точки доступа
  wifi_radiomosty_i_tochki_dostupa: "network", // WiFi радиомосты
  poe_kommutatory: "network", // PoE коммутаторы
  kommutatory: "network", // Коммутаторы
}

interface SyncResult {
  categoriesScanned: number
  productUrlsDiscovered: number
  productsUpserted: number
  productsFailed: number
  stoppedEarly: boolean
  errors: string[]
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`)
  }
  return response.text()
}

async function discoverProductUrls(slug: string, deadline: number): Promise<string[]> {
  const firstPageUrl = `${BARLAU_ORIGIN}/catalog/${slug}/`
  const firstPageHtml = await fetchHtml(firstPageUrl)
  const maxPage = Math.min(extractMaxPageNumber(firstPageHtml), MAX_PAGES_PER_CATEGORY)

  const urls = new Set(extractCategoryProductLinks(firstPageHtml, BARLAU_ORIGIN))

  for (let page = 2; page <= maxPage; page++) {
    if (Date.now() > deadline) break
    const pageHtml = await fetchHtml(`${BARLAU_ORIGIN}/catalog/${slug}/?PAGEN_1=${page}`)
    for (const url of extractCategoryProductLinks(pageHtml, BARLAU_ORIGIN)) urls.add(url)
  }

  return [...urls]
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const current = nextIndex++
      results[current] = await fn(items[current])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

function slugFromUrl(url: string): string {
  const path = new URL(url).pathname.replace(/\/$/, "")
  const last = path.split("/").pop()
  return last && last.length > 0 ? last : "unknown"
}

export async function syncBarlauCatalog(): Promise<SyncResult> {
  const { db } = await import("../../src/db/index.js")
  const { products } = await import("../../src/db/schema.js")

  const deadline = Date.now() + TIME_BUDGET_MS
  const result: SyncResult = {
    categoriesScanned: 0,
    productUrlsDiscovered: 0,
    productsUpserted: 0,
    productsFailed: 0,
    stoppedEarly: false,
    errors: [],
  }

  const urlCategory = new Map<string, "cctv" | "network">()

  for (const [slug, category] of Object.entries(CATEGORIES)) {
    if (Date.now() > deadline) {
      result.stoppedEarly = true
      break
    }
    try {
      const urls = await discoverProductUrls(slug, deadline)
      urls.forEach((url) => {
        if (!urlCategory.has(url)) urlCategory.set(url, category)
      })
      result.categoriesScanned++
    } catch (err) {
      result.errors.push(`category ${slug}: ${(err as Error).message}`)
    }
  }

  result.productUrlsDiscovered = urlCategory.size
  let sortOrder = 0

  await mapWithConcurrency([...urlCategory.entries()], PRODUCT_FETCH_CONCURRENCY, async ([url, category]) => {
    if (Date.now() > deadline) {
      result.stoppedEarly = true
      return
    }
    try {
      const html = await fetchHtml(url)
      const parsed = parseBarlauProductPage(html, url)
      const id = `barlau-${parsed.articul ?? slugFromUrl(url)}`

      await db
        .insert(products)
        .values({
          id,
          category,
          environment: "universal",
          name: parsed.name,
          brand: parsed.brand,
          imageUrl: null,
          specs: parsed.specs,
          basePrice: parsed.basePrice,
          active: true,
          sortOrder: sortOrder++,
        })
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: parsed.name,
            brand: parsed.brand,
            specs: parsed.specs,
            basePrice: parsed.basePrice,
          },
        })

      result.productsUpserted++
    } catch (err) {
      result.productsFailed++
      result.errors.push(`product ${url}: ${(err as Error).message}`)
    }
  })

  return result
}

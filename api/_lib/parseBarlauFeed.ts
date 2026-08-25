import { XMLParser } from "fast-xml-parser"
import type { ProductCategory } from "../../src/lib/catalog.js"

// Разбор YML-выгрузки b2b.barlau.kz (Yandex Market Language) — заменяет
// прежний HTML-скрейпинг (см. историю parseBarlauProduct.ts). Один фид на
// ~9800 offer вместо сотен точечных HTTP-запросов по страницам сайта.

export interface ParsedBarlauOffer {
  id: string
  category: ProductCategory
  name: string
  brand: string | null
  imageUrl: string | null
  specs: Record<string, string | number>
  price: number
}

export interface ParseFeedResult {
  offers: ParsedBarlauOffer[]
  offersInFeed: number
  skippedNoCategory: number
  skippedNoPrice: number
}

const FEED_URL = "https://b2b.barlau.kz/bitrix/catalog_export/export_p2P.xml"

// Поля с логистикой/упаковкой — не нужны покупателю, засоряют карточку
// (например "Количество шт в коробке" вылезало на каждой карточке).
const EXCLUDED_PARAMS = new Set(["Количество шт в коробке", "Размер единицы мм", "Вес единицы кг."])

// Изредка в фиде в значении параметра встречается внутренний GUID элемента
// Bitrix вместо реального значения (наблюдалось на "Вес единицы кг.") —
// мусор в источнике, не наша ошибка парсинга. Отбрасываем такое значение.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Категория в дереве Barlau определяется по ключевым словам в пути
// (бренд > тип > подтип > ...). Путь, не матчащий ни одно правило,
// пропускается целиком — так из каталога уходят лицензии/софт
// (HikCentral, Hik-Connect), расходники, кронштейны, отдельные HDD.
const CATEGORY_KEYWORDS: Array<[RegExp, ProductCategory]> = [
  [/контроль доступа|скуд|турникет/i, "access"],
  [/сигнализац/i, "fire"],
  [/сетевое оборудован|коммутатор|wifi|маршрутизатор/i, "network"],
  [/видеонаблюден|камер|видеорегистратор|домофон/i, "cctv"],
]

interface RawCategory {
  id: string
  parentId?: string
  name: string
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function isLikelyGarbageValue(value: string): boolean {
  return UUID_PATTERN.test(value)
}

function buildCategoryPath(id: string, index: Map<string, RawCategory>): string[] {
  const path: string[] = []
  const seen = new Set<string>()
  let current: string | undefined = id
  while (current && !seen.has(current)) {
    seen.add(current)
    const cat = index.get(current)
    if (!cat) break
    path.unshift(cat.name)
    current = cat.parentId
  }
  return path
}

function resolveCategory(path: string[]): ProductCategory | null {
  const joined = path.join(" > ")
  for (const [pattern, category] of CATEGORY_KEYWORDS) {
    if (pattern.test(joined)) return category
  }
  return null
}

// #text — куда fast-xml-parser кладёт текст узла, у которого есть атрибуты
// (например <param name="...">значение</param>).
interface RawParam {
  "@_name"?: string
  "#text"?: string | number
}

interface RawOffer {
  "@_id"?: string | number
  price?: string | number
  categoryId?: string | number
  picture?: Array<string | number>
  name?: string
  vendor?: string
  param?: RawParam[]
}

export async function parseBarlauFeed(): Promise<ParseFeedResult> {
  const response = await fetch(FEED_URL)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching Barlau feed`)
  }
  const xml = await response.text()

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: true,
    trimValues: true,
    isArray: (name) => ["category", "offer", "param", "picture"].includes(name),
  })
  const doc = parser.parse(xml)
  const shop = doc?.yml_catalog?.shop
  if (!shop) throw new Error("Barlau feed: unexpected structure (no yml_catalog/shop)")

  const rawCategories: RawCategory[] = (shop.categories?.category ?? []).map((c: Record<string, unknown>) => ({
    id: String(c["@_id"]),
    parentId: c["@_parentId"] !== undefined ? String(c["@_parentId"]) : undefined,
    name: normalizeWhitespace(String(c["#text"] ?? "")),
  }))
  const categoryIndex = new Map(rawCategories.map((c) => [c.id, c]))
  const categoryResolutionCache = new Map<string, ProductCategory | null>()

  const resolveByCategoryId = (categoryId: string): ProductCategory | null => {
    const cached = categoryResolutionCache.get(categoryId)
    if (cached !== undefined) return cached
    const resolved = resolveCategory(buildCategoryPath(categoryId, categoryIndex))
    categoryResolutionCache.set(categoryId, resolved)
    return resolved
  }

  const rawOffers: RawOffer[] = shop.offers?.offer ?? []
  const result: ParseFeedResult = { offers: [], offersInFeed: rawOffers.length, skippedNoCategory: 0, skippedNoPrice: 0 }

  for (const offer of rawOffers) {
    const price = Number(offer.price ?? 0)
    if (!Number.isFinite(price) || price <= 0) {
      result.skippedNoPrice++
      continue
    }

    const category = resolveByCategoryId(String(offer.categoryId ?? ""))
    if (!category) {
      result.skippedNoCategory++
      continue
    }

    const name = normalizeWhitespace(String(offer.name ?? ""))
    if (!name) continue

    const specs: Record<string, string | number> = {}
    for (const param of offer.param ?? []) {
      const paramName = normalizeWhitespace(String(param["@_name"] ?? ""))
      if (!paramName || EXCLUDED_PARAMS.has(paramName)) continue
      const rawValue = param["#text"]
      if (rawValue === undefined) continue
      if (typeof rawValue === "string") {
        const value = normalizeWhitespace(rawValue)
        if (!value || isLikelyGarbageValue(value)) continue
        specs[paramName] = value
      } else {
        specs[paramName] = rawValue
      }
    }

    const picture = offer.picture?.[0]

    result.offers.push({
      id: String(offer["@_id"] ?? ""),
      category,
      name,
      brand: offer.vendor ? normalizeWhitespace(offer.vendor) : null,
      imageUrl: picture !== undefined ? String(picture) : null,
      specs,
      price,
    })
  }

  return result
}

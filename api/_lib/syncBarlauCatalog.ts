import { eq, inArray } from "drizzle-orm"
import { parseBarlauFeed } from "./parseBarlauFeed.js"

// Наполнение каталога `products` из YML-фида b2b.barlau.kz (см.
// parseBarlauFeed.ts). Один fetch + разбор в памяти — раньше здесь был
// HTML-скрейпинг сотен страниц barlau.kz с троттлингом/паузами, фид
// снял всю эту сложность.

interface SyncResult {
  offersInFeed: number
  offersSkippedNoCategory: number
  offersSkippedNoPrice: number
  productsUpserted: number
  productsDeactivated: number
  errors: string[]
}

export async function syncBarlauCatalog(): Promise<SyncResult> {
  const { db } = await import("../../src/db/index.js")
  const { products } = await import("../../src/db/schema.js")

  const result: SyncResult = {
    offersInFeed: 0,
    offersSkippedNoCategory: 0,
    offersSkippedNoPrice: 0,
    productsUpserted: 0,
    productsDeactivated: 0,
    errors: [],
  }

  const feed = await parseBarlauFeed()
  result.offersInFeed = feed.offersInFeed
  result.offersSkippedNoCategory = feed.skippedNoCategory
  result.offersSkippedNoPrice = feed.skippedNoPrice

  const seenIds = new Set<string>()
  let sortOrder = 0

  for (const offer of feed.offers) {
    const id = `barlau-${offer.id}`
    seenIds.add(id)
    try {
      await db
        .insert(products)
        .values({
          id,
          category: offer.category,
          environment: "universal",
          name: offer.name,
          brand: offer.brand,
          imageUrl: offer.imageUrl,
          specs: offer.specs,
          basePrice: offer.price,
          active: true,
          sortOrder: sortOrder++,
        })
        .onConflictDoUpdate({
          target: products.id,
          set: {
            category: offer.category,
            name: offer.name,
            brand: offer.brand,
            imageUrl: offer.imageUrl,
            specs: offer.specs,
            basePrice: offer.price,
            active: true,
          },
        })
      result.productsUpserted++
    } catch (err) {
      result.errors.push(`offer ${offer.id}: ${(err as Error).message}`)
    }
  }

  // Товары, которых больше нет в фиде (сняты с продажи Barlau, ушли в
  // другую категорию и т.п.) — деактивируем, а не удаляем, чтобы не рвать
  // ссылки на них (корзина, старые заказы).
  const existingBarlauIds = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.active, true))
  const staleIds = existingBarlauIds
    .map((r) => r.id)
    .filter((id) => id.startsWith("barlau-") && !seenIds.has(id))

  if (staleIds.length > 0) {
    await db.update(products).set({ active: false }).where(inArray(products.id, staleIds))
    result.productsDeactivated = staleIds.length
  }

  return result
}

import { db } from '../src/db/index'
import { products } from '../src/db/schema'
import { CATALOG_SEED } from '../src/lib/catalogSeed'
import type { Product } from '../src/lib/catalog'

// Отдаёт витрине список товаров. Если таблица products в базе пустая или
// недоступна — отдаёт встроенный стартовый набор (catalogSeed.ts), чтобы
// каталог работал сразу после деплоя без обязательного ручного наполнения
// БД. См. .wednesday/plans/PLAN.md, фаза 0.
export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let items: Product[] = CATALOG_SEED
  let source: 'db' | 'seed' = 'seed'

  try {
    const rows = await db.select().from(products)
    if (rows.length > 0) {
      items = rows
        .filter((r) => r.active)
        .map((r) => ({
          id: r.id,
          category: r.category,
          environment: r.environment,
          name: r.name,
          brand: r.brand,
          imageUrl: r.imageUrl,
          specs: (r.specs as Record<string, string | number>) ?? {},
          basePrice: r.basePrice,
          active: r.active,
          sortOrder: r.sortOrder,
        }))
      source = 'db'
    }
  } catch {
    // БД недоступна — остаёмся на встроенном наборе, каталог не падает
  }

  return new Response(JSON.stringify({ source, items }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

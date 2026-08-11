import { CATALOG_SEED } from '../src/lib/catalogSeed'
import type { Product } from '../src/lib/catalog'

// Отдаёт витрине список товаров. Если таблица products в базе пустая или
// недоступна — отдаёт встроенный стартовый набор (catalogSeed.ts), чтобы
// каталог работал сразу после деплоя без обязательного ручного наполнения
// БД. См. .wednesday/plans/PLAN.md, фаза 0.
//
// ВАЖНО: db и products импортируются ДИНАМИЧЕСКИ внутри try/catch ниже, а
// не статически в начале файла. src/db/index.ts вызывает neon(DATABASE_URL)
// на верхнем уровне модуля — если переменная окружения не задана (например,
// в Preview-окружении Vercel, где DATABASE_URL может быть не сконфигурирован),
// этот вызов бросает исключение прямо при импорте модуля, ДО того как
// выполнение доходит до самого try/catch. При статическом импорте это
// крашит всю serverless-функцию (500) ещё до её тела, и фоллбэк на
// CATALOG_SEED никогда не срабатывает. Динамический import() внутри try
// гарантирует, что даже сбой инициализации БД перехватывается и каталог
// всё равно отдаётся (на встроенных данных).
export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  let items: Product[] = CATALOG_SEED
  let source: 'db' | 'seed' = 'seed'

  try {
    const { db } = await import('../src/db/index')
    const { products } = await import('../src/db/schema')
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

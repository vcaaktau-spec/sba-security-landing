import type { VercelRequest, VercelResponse } from '@vercel/node';
import { syncBarlauCatalog } from "../_lib/syncBarlauCatalog.js"

// Еженедельный фоновый пересбор каталога из YML-фида b2b.barlau.kz
// (см. vercel.json → crons, api/_lib/parseBarlauFeed.ts).
//
// Доступ ограничен: Vercel Cron помечает свои запросы заголовком
// `user-agent: vercel-cron/1.0` — этого достаточно как барьер от случайных
// внешних вызовов (это не публичная кнопка "обнови каталог", а фоновая
// задача). Ручной прогон для проверки — через `?secret=`, если задана
// переменная окружения SYNC_SECRET; без неё ручной прогон отключён.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isCron = req.headers["user-agent"] === "vercel-cron/1.0"
  const secret = process.env.SYNC_SECRET
  const isAuthorizedManualTrigger = Boolean(secret) && req.query.secret === secret

  if (!isCron && !isAuthorizedManualTrigger) {
    return res.status(403).json({ error: "Forbidden" })
  }

  try {
    const result = await syncBarlauCatalog()
    return res.status(200).json(result)
  } catch (error) {
    console.error("Barlau catalog sync failed:", error)
    const message = error instanceof Error ? error.message : "Unknown sync error"
    return res.status(500).json({ error: message })
  }
}

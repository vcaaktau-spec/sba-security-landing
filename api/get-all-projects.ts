import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { projects } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

// Функция-броня: повторяет запрос, если Neon отвалился из-за fetch failed
const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error; // Если последняя попытка тоже провалилась — выдаем ошибку
      console.warn(`Neon DB fetch failed. Попытка ${i + 1} из ${retries}...`);
      await new Promise(res => setTimeout(res, 500)); // Ждем полсекунды перед повтором
    }
  }
  throw new Error("Unreachable");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Оборачиваем запрос к БД в нашу функцию withRetry
    const allProjects = await withRetry(() => 
      db.query.projects.findMany({
        where: eq(projects.showOnMain, true),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
        limit: 10,
      })
    );

    res.status(200).json(allProjects);
  } catch (error) {
    console.error("Ошибка при получении всех объектов:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
import { db } from '../src/db/index.js';
import { projects, documents } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

// Такая же броня для личного кабинета
const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === retries - 1) throw error;
      console.warn(`Neon DB fetch failed. Попытка ${i + 1} из ${retries}...`);
      await new Promise(res => setTimeout(res, 500));
    }
  }
  throw new Error("Unreachable");
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Оборачиваем каждый запрос к базе данных
    const userProjects = await withRetry(() => db.select().from(projects).where(eq(projects.userId, userId)));
    const allDocs = await withRetry(() => db.select().from(documents));

    const result = userProjects.map(p => ({
      ...p,
      documents: allDocs.filter(d => d.projectId === p.id)
    }));

    result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Ошибка при получении объектов:", error);
    res.status(500).json({ error: error.message });
  }
}
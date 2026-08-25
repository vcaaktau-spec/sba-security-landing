import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  try {
    const rows = await db
      .select({ id: sbaPlans.id, name: sbaPlans.name, updatedAt: sbaPlans.updatedAt })
      .from(sbaPlans)
      .where(eq(sbaPlans.userId, userId))
      .orderBy(desc(sbaPlans.updatedAt));
    res.status(200).json(rows);
  } catch (error) {
    console.error('Ошибка получения списка планов:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

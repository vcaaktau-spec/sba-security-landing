import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id обязателен' });
  }

  try {
    const rows = await db.select().from(sbaPlans).where(eq(sbaPlans.id, id));
    if (rows.length === 0) return res.status(404).json({ error: 'План не найден' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Ошибка получения плана:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body as { id?: string; userId?: string; name?: string; data?: unknown };
    if (!body.userId || !body.name || body.data === undefined) {
      return res.status(400).json({ error: 'userId, name и data обязательны' });
    }

    if (body.id) {
      const updated = await db
        .update(sbaPlans)
        .set({ name: body.name, data: body.data, updatedAt: new Date() })
        .where(and(eq(sbaPlans.id, body.id), eq(sbaPlans.userId, body.userId)))
        .returning();
      if (updated.length === 0) return res.status(404).json({ error: 'План не найден' });
      return res.status(200).json({ id: updated[0].id, name: updated[0].name, updatedAt: updated[0].updatedAt });
    }

    const inserted = await db
      .insert(sbaPlans)
      .values({ id: crypto.randomUUID(), userId: body.userId, name: body.name, data: body.data })
      .returning();
    return res.status(201).json({ id: inserted[0].id, name: inserted[0].name, updatedAt: inserted[0].updatedAt });
  } catch (error) {
    console.error('Ошибка сохранения плана:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}

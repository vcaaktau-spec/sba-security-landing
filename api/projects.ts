import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { projects } from '../src/db/schema.js';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log("Данные с фронтенда:", body); // Логируем в терминал

    const newProject = await db.insert(projects).values({
      id: crypto.randomUUID(),
      userId: body.userId,
      category: body.category,
      name: body.name,
      address: body.address,
      status: 'active',
      price: body.price,
      imageUrl: body.imageUrl,
      showOnMain: body.showOnMain || false,
      equipment: body.equipment || [], 
      credentials: body.credentials || [],
      maintenanceDays: body.maintenanceDays ? parseInt(body.maintenanceDays) : null,
    }).returning();

    res.status(201).json(newProject[0]);
  } catch (error) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА БАЗЫ ДАННЫХ:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Неизвестная ошибка БД' });
  }
}
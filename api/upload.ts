import { put } from '@vercel/blob';
import { db } from '../src/db/index';
import { documents } from '../src/db/schema';


export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename');
    const projectId = searchParams.get('projectId');

    if (!filename || !projectId || !req.body) {
      return new Response('Missing parameters', { status: 400 });
    }

    // 1. Грузим в Vercel Blob
    const blob = await put(filename, req.body, { access: 'public' });

    // 2. Сохраняем в БД Neon
    await db.insert(documents).values({
      id: crypto.randomUUID(),
      projectId: projectId,
      name: filename,
      url: blob.url,
      size: "Uploaded", // Можно добавить логику расчета размера если нужно
    });

    return new Response(JSON.stringify(blob), { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
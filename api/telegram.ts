// /api/telegram.ts (В КОРНЕ ПРОЕКТА)
export const config = {
  runtime: 'edge', // Используем Edge, чтобы работали стандартные веб-API (FormData)
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const rating = formData.get("rating") as string;
    const text = formData.get("text") as string;
    const photo = formData.get("photo") as File | null;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response(JSON.stringify({ error: "Отсутствуют ключи Telegram" }), { status: 500 });
    }

    // Собираем красивое сообщение
    const message = `
🔥 <b>Новый отзыв SBA (На модерацию)</b>

👤 <b>Имя:</b> ${name}
🏢 <b>Объект/Компания:</b> ${company}
⭐️ <b>Оценка:</b> ${rating} / 5
💬 <b>Текст:</b> 
<i>${text}</i>
    `;

    // Если клиент прикрепил фото, отправляем как фото с подписью
    // (Если фото нет, мы позже при добавлении на сайт просто подставим дефолтный аватар)
    if (photo && photo.size > 0) {
      const tgFormData = new FormData();
      tgFormData.append("chat_id", CHAT_ID);
      tgFormData.append("photo", photo);
      tgFormData.append("caption", message);
      tgFormData.append("parse_mode", "HTML");

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: tgFormData,
      });
    } else {
      // Если фото нет, просто шлем текст
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Telegram API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
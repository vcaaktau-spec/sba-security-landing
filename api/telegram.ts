export const config = {
  runtime: 'edge', 
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

    // --- ДИНАМИЧЕСКОЕ ФОРМИРОВАНИЕ СООБЩЕНИЯ ---
    let message = "";

    if (company === "КАЛЬКУЛЯТОР") {
      // Шаблон для Калькулятора
      message = `
🧮 <b>НОВЫЙ РАСЧЕТ ИЗ КАЛЬКУЛЯТОРА</b>
${text}
      `;
    } else if (company === "ЗАЯВКА С САЙТА") {
      // Шаблон для формы СТА (Заявка на расчет)
      message = `
⚡️ <b>НОВАЯ ЗАЯВКА НА УСЛУГИ</b>
👤 <b>Имя:</b> ${name}
${text}
      `;
    } else {
      // Стандартный шаблон для Отзывов
      message = `
🔥 <b>Новый отзыв SBA (На модерацию)</b>

👤 <b>Имя:</b> ${name}
🏢 <b>Объект:</b> ${company}
⭐️ <b>Оценка:</b> ${rating} / 5
💬 <b>Текст:</b> 
<i>${text}</i>
      `;
    }

    // --- ОТПРАВКА В TELEGRAM ---
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
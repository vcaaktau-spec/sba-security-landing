import type { VercelRequest, VercelResponse } from '@vercel/node';

type ClerkUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: { email_address: string }[];
  image_url: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Достаем секретный ключ
  const SECRET_KEY = process.env.CLERK_SECRET_KEY;

  if (!SECRET_KEY) {
    console.error("ОШИБКА: CLERK_SECRET_KEY не найден в .env");
    return res.status(500).json({ error: 'CLERK_SECRET_KEY is missing' });
  }

  try {
    // Делаем прямой запрос к Clerk API (работает на 100% надежно в любых средах)
    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clerk API Error: ${response.status} ${errorText}`);
    }

    const users: ClerkUser[] = await response.json();

    // Форматируем данные (Clerk REST API использует snake_case)
    const safeUsers = users.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email_addresses[0]?.email_address,
      imageUrl: user.image_url,
    }));
    
    res.status(200).json(safeUsers);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Ошибка при получении пользователей:", message);
    res.status(500).json({ error: message });
  }
}
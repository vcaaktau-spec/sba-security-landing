// Стартовый набор товаров для витрины — используется как запасной вариант
// (api/products.ts), пока таблица `products` в базе пустая/недоступна.
// Так каталог работает сразу после деплоя, без обязательного шага
// "кто-то должен зайти и добавить товары в БД".
//
// ЦЕНЫ ОРИЕНТИРОВОЧНЫЕ — расставлены по памяти о рынке охранного
// оборудования РК, НЕ сверены с реальным прайсом поставщика. Это
// нормально для фазы 0 (план явно допускает тестовые/условные позиции),
// но перед тем как показывать каталог реальным клиентам, стоит пройтись
// по каждой позиции и поправить цену/характеристики на актуальные —
// через Neon/Drizzle Studio, когда таблица `products` будет наполняться
// по-настоящему (см. .wednesday/plans/PLAN.md, фаза 2).

import type { Product } from "./catalog.js"

export const CATALOG_SEED: Product[] = [
  // --- Видеонаблюдение ---
  {
    id: "seed-cam-2mp-dome",
    category: "cctv",
    environment: "indoor",
    name: "IP-камера купольная 2MP",
    brand: "HiWatch",
    specs: { "Разрешение": "2MP (1920×1080)", "Объектив": "2.8мм", "ИК-подсветка": "до 20м" },
    basePrice: 34000,
    active: true,
    sortOrder: 1,
  },
  {
    id: "seed-cam-4mp-dome",
    category: "cctv",
    environment: "universal",
    name: "IP-камера купольная 4MP",
    brand: "HiWatch",
    specs: { "Разрешение": "4MP (2560×1440)", "Объектив": "2.8мм", "ИК-подсветка": "до 30м" },
    basePrice: 44000,
    active: true,
    sortOrder: 2,
  },
  {
    id: "seed-cam-4mp-bullet-out",
    category: "cctv",
    environment: "outdoor",
    name: "IP-камера уличная цилиндрическая 4MP",
    brand: "Hikvision",
    specs: { "Разрешение": "4MP", "Объектив": "2.8мм", "ИК-подсветка": "до 40м", "Класс защиты": "IP67" },
    basePrice: 52000,
    active: true,
    sortOrder: 3,
  },
  {
    id: "seed-cam-8mp-dome",
    category: "cctv",
    environment: "universal",
    name: "IP-камера купольная 8MP (4K)",
    brand: "Hikvision",
    specs: { "Разрешение": "8MP / 4K", "Объектив": "2.8мм", "ИК-подсветка": "до 30м" },
    basePrice: 119000,
    active: true,
    sortOrder: 4,
  },
  {
    id: "seed-nvr-4ch",
    category: "cctv",
    environment: "indoor",
    name: "Видеорегистратор NVR на 4 канала",
    brand: "HiWatch",
    specs: { "Каналы": 4, "Поддержка HDD": "1×10ТБ", "PoE": "нет" },
    basePrice: 46000,
    active: true,
    sortOrder: 5,
  },
  {
    id: "seed-nvr-8ch",
    category: "cctv",
    environment: "indoor",
    name: "Видеорегистратор NVR на 8 каналов",
    brand: "Hikvision",
    specs: { "Каналы": 8, "Поддержка HDD": "1×10ТБ", "PoE": "8 портов" },
    basePrice: 73000,
    active: true,
    sortOrder: 6,
  },
  {
    id: "seed-nvr-16ch",
    category: "cctv",
    environment: "indoor",
    name: "Видеорегистратор NVR на 16 каналов",
    brand: "Hikvision",
    specs: { "Каналы": 16, "Поддержка HDD": "2×10ТБ", "PoE": "16 портов" },
    basePrice: 115000,
    active: true,
    sortOrder: 7,
  },
  {
    id: "seed-hdd-4tb",
    category: "cctv",
    environment: "indoor",
    name: "Жёсткий диск для видеонаблюдения 4ТБ",
    brand: "Western Digital Purple",
    specs: { "Объём": "4ТБ", "Наработка": "24/7" },
    basePrice: 82500,
    active: true,
    sortOrder: 8,
  },

  // --- Контроль доступа (СКУД) ---
  {
    id: "seed-access-reader",
    category: "access",
    environment: "indoor",
    name: "Считыватель карт доступа + контроллер",
    brand: "Hikvision",
    specs: { "Тип": "RFID карта/брелок", "Двери": 1 },
    basePrice: 58000,
    active: true,
    sortOrder: 1,
  },
  {
    id: "seed-access-turnstile",
    category: "access",
    environment: "indoor",
    name: "Турникет-триога",
    brand: "PERCo",
    specs: { "Тип": "трипод", "Пропускная способность": "до 30 чел/мин" },
    basePrice: 340000,
    active: true,
    sortOrder: 2,
  },

  // --- Пожарная сигнализация ---
  {
    id: "seed-fire-panel",
    category: "fire",
    environment: "indoor",
    name: "Прибор приёмно-контрольный пожарный (ППКП), 4 шлейфа",
    brand: "Болид",
    specs: { "Шлейфы": 4, "Тип": "адресно-аналоговый" },
    basePrice: 78000,
    active: true,
    sortOrder: 1,
  },
  {
    id: "seed-fire-smoke-detector",
    category: "fire",
    environment: "indoor",
    name: "Дымовой извещатель",
    brand: "Болид",
    specs: { "Тип": "оптико-электронный" },
    basePrice: 6500,
    active: true,
    sortOrder: 2,
  },

  // --- Сетевое оборудование ---
  {
    id: "seed-poe-8",
    category: "network",
    environment: "indoor",
    name: "PoE-коммутатор на 8 портов",
    brand: "HiWatch",
    specs: { "Порты": "8×PoE + 2×Uplink", "Бюджет PoE": "120Вт" },
    basePrice: 36000,
    active: true,
    sortOrder: 1,
  },
]

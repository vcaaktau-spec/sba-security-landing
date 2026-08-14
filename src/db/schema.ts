import { pgTable, text, timestamp, jsonb, integer, boolean, pgEnum } from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum('category', ['cctv', 'network', 'access', 'fire']);
export const statusEnum = pgEnum('status', ['active', 'warning', 'offline']);

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  category: categoryEnum("category").notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  status: statusEnum("status").notNull().default('active'),
  
  price: text("price").default("По запросу"),
  imageUrl: text("image_url"),
  
  // НОВОЕ ПОЛЕ ДЛЯ ТУМБЛЕРА
  showOnMain: boolean("show_on_main").notNull().default(false),

  equipment: jsonb("equipment").$type<string[]>().notNull().default([]),
  credentials: jsonb("credentials").$type<{ label: string; value: string; isSecret: boolean }[]>().notNull().default([]),
  maintenanceDays: integer("maintenance_days"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  size: text("size").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Кэш цен на оборудование, спарсенных с barlau.kz для СТАРОГО калькулятора
// (Calculator.tsx). Не путать с каталогом товаров (products) ниже — это
// разные сущности для разных фич, см. .wednesday/plans/PLAN.md §4.
// key — внутренний ключ позиции (см. api/_lib/barlauSources.ts), например
// "camera.2MP", "nvr.8", "poe.16", "hdd.4".
export const equipmentPrices = pgTable("equipment_prices", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  price: integer("price").notNull(),
  sourceUrl: text("source_url"),
  ok: boolean("ok").notNull().default(true), // false = последний парсинг не удался, цена устаревшая
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Каталог товаров для нового интерактивного подбора оборудования
// (см. .wednesday/plans/PLAN.md, фаза 0). Конкретные SKU, а не тиры/ценовые
// категории — используется каталогом, корзиной и (позже) AI-рекомендателем.
// Переиспользует categoryEnum, объявленный выше для projects.
export const environmentEnum = pgEnum('environment', ['indoor', 'outdoor', 'universal']);

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  category: categoryEnum("category").notNull(),
  environment: environmentEnum("environment").notNull().default('universal'),

  name: text("name").notNull(),
  brand: text("brand"),
  imageUrl: text("image_url"),

  // Свободные характеристики товара (разрешение, каналы, порты и т.д.) —
  // структура намеренно не типизирована жёстко, разные категории имеют
  // разный набор полей.
  specs: jsonb("specs").$type<Record<string, string | number>>().notNull().default({}),

  basePrice: integer("base_price").notNull(),
  // Необязательная связь с тиром старого калькулятора (equipment_prices.key),
  // если в будущем понадобится сверять/синхронизировать цены между фичами.
  priceTierKey: text("price_tier_key"),

  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// План из конструктора SbaPlanner (см. src/components/SbaPlanner.tsx).
// Намеренно отдельная таблица, не привязана к projects — projects сейчас
// нигде в UI не используется (нет страницы выбора проекта), см. design doc
// 2026-08-14-sba-planner-annotations-export-design.md "Non-goals".
export const sbaPlans = pgTable("sba_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
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
// Общая модель каталога товаров — используется клиентом (Catalog.tsx) и
// сервером (api/products.ts). См. .wednesday/plans/PLAN.md, фаза 0.

export type ProductCategory = "cctv" | "network" | "access" | "fire"
export type ProductEnvironment = "indoor" | "outdoor" | "universal"

export interface Product {
  id: string
  category: ProductCategory
  environment: ProductEnvironment
  name: string
  brand?: string | null
  imageUrl?: string | null
  specs: Record<string, string | number>
  basePrice: number
  active: boolean
  sortOrder: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  cctv: "Видеонаблюдение",
  network: "Сетевое оборудование",
  access: "Контроль доступа (СКУД)",
  fire: "Пожарная сигнализация",
}

export function groupByCategory(products: Product[]): Array<{ category: ProductCategory; label: string; items: Product[] }> {
  const order: ProductCategory[] = ["cctv", "access", "fire", "network"]
  return order
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      items: products
        .filter((p) => p.category === category && p.active)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    }))
    .filter((group) => group.items.length > 0)
}

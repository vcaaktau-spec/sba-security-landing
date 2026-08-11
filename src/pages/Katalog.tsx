"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Layers, Loader2, PackageSearch, Search } from "lucide-react"
import { ServiceLayout } from "@/components/ServiceLayout"
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/catalog"

const PAGE_SIZE = 24

// Полноценная страница каталога — заменяет прежнюю модалку (Catalog.tsx).
// С ростом каталога (регулярный парсинг barlau.kz, см. api/cron/sync-catalog.ts)
// объём вырос до сотен позиций — модалка без фильтров/поиска на таком объёме
// нечитаема, разложил всё в отдельный маршрут с фильтрами и постраничной
// подгрузкой вместо рендера всего списка разом.
export const Katalog = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState(false)

  const [category, setCategory] = useState<ProductCategory | "all">("all")
  const [brand, setBrand] = useState<string | "all">("all")
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data?.items) ? data.items : [])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const availableCategories = useMemo(() => {
    if (!products) return []
    const present = new Set(products.filter((p) => p.active).map((p) => p.category))
    return (Object.keys(CATEGORY_LABELS) as ProductCategory[]).filter((c) => present.has(c))
  }, [products])

  const availableBrands = useMemo(() => {
    if (!products) return []
    const brands = new Set(
      products.filter((p) => p.active && p.brand).map((p) => p.brand as string),
    )
    return [...brands].sort((a, b) => a.localeCompare(b))
  }, [products])

  const filtered = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => p.active)
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => brand === "all" || p.brand === brand)
      .filter((p) => q.length === 0 || p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  }, [products, category, brand, query])

  // Сброс постраничной подгрузки при смене любого фильтра
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category, brand, query])

  const visible = filtered.slice(0, visibleCount)

  return (
    <ServiceLayout>
      <section className="relative py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-white/10 text-foreground font-medium text-[10px] uppercase tracking-widest mb-3">
              <Layers size={14} /> Каталог оборудования
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground leading-tight">
              Что мы <span className="text-red-600 dark:text-red-500">устанавливаем</span>
            </h1>
            <p className="text-muted-foreground max-w-xl text-sm">
              Оборудование не продаётся отдельно — только вместе с монтажом. Цены ориентировочные, точная стоимость
              уточняется при выезде специалиста.
            </p>
          </div>

          {products && products.length > 0 && (
            <div className="flex flex-col gap-3 mb-8 sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/40">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск по названию или бренду…"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-red-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("all")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors ${
                    category === "all"
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Все категории
                </button>
                {availableCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors ${
                      category === c
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}

                {availableBrands.length > 1 && (
                  <>
                    <span className="w-px bg-border/60 mx-1" />
                    <button
                      onClick={() => setBrand("all")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors ${
                        brand === "all"
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Все бренды
                    </button>
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrand(b)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors ${
                          brand === b
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                            : "bg-slate-100 dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {products === null && !error && (
            <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground text-sm">
              <Loader2 className="animate-spin" size={18} /> Загружаем каталог…
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground text-sm text-center">
              <PackageSearch size={28} />
              Не получилось загрузить каталог. Обновите страницу или напишите нам в WhatsApp.
            </div>
          )}

          {products && products.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground text-sm text-center">
              <PackageSearch size={28} />
              Ничего не нашлось по этому фильтру.
            </div>
          )}

          {products !== null && products.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground text-sm text-center">
              <PackageSearch size={28} />
              Каталог пока пуст.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] rounded-xl p-5 shadow-sm"
              >
                {item.brand && (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    {item.brand}
                  </span>
                )}
                <h4 className="font-bold text-base mb-3 text-foreground leading-snug">{item.name}</h4>

                <ul className="space-y-1 mb-4 flex-grow">
                  {Object.entries(item.specs).map(([label, value]) => (
                    <li key={label} className="flex justify-between gap-2 text-xs text-muted-foreground">
                      <span>{label}</span>
                      <span className="font-semibold text-foreground text-right">{value}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-gray-100 dark:border-[#1a1a1a] flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Цена</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {item.basePrice.toLocaleString("ru-RU")} <span className="text-red-600 dark:text-red-500 text-sm">₸</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 h-11 rounded-xl border border-slate-200 dark:border-white/[0.08] text-sm font-semibold text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors"
              >
                Показать ещё ({filtered.length - visibleCount})
              </button>
            </div>
          )}
        </div>
      </section>
    </ServiceLayout>
  )
}

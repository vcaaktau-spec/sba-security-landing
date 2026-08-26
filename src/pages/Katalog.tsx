"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Layers, Loader2, Minus, PackageSearch, Plus, Search, ShoppingCart, X } from "lucide-react"
import { ServiceLayout } from "@/components/ServiceLayout"
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/catalog"
import { useCart } from "@/contexts/CartContext"

const PAGE_SIZE = 24
const DEVICE_TYPE_SPEC_KEY = "Тип устройства"
const CARD_SPEC_LIMIT = 4

type SortKey = "default" | "price_asc" | "price_desc" | "name_asc"

const SORT_LABELS: Record<SortKey, string> = {
  default: "По умолчанию",
  price_asc: "Сначала дешевле",
  price_desc: "Сначала дороже",
  name_asc: "По алфавиту",
}

const matchesCategory = (p: Product, v: ProductCategory | "all") => v === "all" || p.category === v
const matchesBrand = (p: Product, v: string | "all") => v === "all" || p.brand === v
const matchesType = (p: Product, v: string | "all") => v === "all" || (p.specs[DEVICE_TYPE_SPEC_KEY] ?? "") === v
const matchesPrice = (p: Product, min: number | null, max: number | null) =>
  (min === null || p.basePrice >= min) && (max === null || p.basePrice <= max)

function sortProducts(items: Product[], key: SortKey): Product[] {
  const sorted = [...items]
  switch (key) {
    case "price_asc":
      return sorted.sort((a, b) => a.basePrice - b.basePrice)
    case "price_desc":
      return sorted.sort((a, b) => b.basePrice - a.basePrice)
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
  }
}

// Полноценная страница каталога — заменяет прежнюю модалку (Catalog.tsx).
// С ростом каталога (регулярный парсинг barlau.kz, см. api/cron/sync-catalog.ts)
// фильтры разрослись до пяти осей (категория/бренд/тип устройства/цена/сортировка).
// Каждая ось считает свои доступные варианты по ВСЕМ ОСТАЛЬНЫМ активным
// фильтрам (кроме себя) — так пункты, которые дали бы 0 результатов, просто
// не показываются, а не висят мёртвым грузом в списке.
export const Katalog = () => {
  const { getQty, addItem, setQty } = useCart()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState(false)

  const [category, setCategory] = useState<ProductCategory | "all">("all")
  const [brand, setBrand] = useState<string | "all">("all")
  const [deviceType, setDeviceType] = useState<string | "all">("all")
  const [query, setQuery] = useState("")
  const [minPriceInput, setMinPriceInput] = useState("")
  const [maxPriceInput, setMaxPriceInput] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("default")
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

  const activeProducts = useMemo(() => (products ?? []).filter((p) => p.active), [products])

  const priceBounds = useMemo(() => {
    if (activeProducts.length === 0) return { min: 0, max: 0 }
    const prices = activeProducts.map((p) => p.basePrice)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [activeProducts])

  const minPrice = minPriceInput.trim() === "" ? null : Number(minPriceInput)
  const maxPrice = maxPriceInput.trim() === "" ? null : Number(maxPriceInput)

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length === 0) return activeProducts
    return activeProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q),
    )
  }, [activeProducts, query])

  const availableCategories = useMemo(() => {
    const present = new Set(
      searched
        .filter((p) => matchesBrand(p, brand) && matchesType(p, deviceType) && matchesPrice(p, minPrice, maxPrice))
        .map((p) => p.category),
    )
    return (Object.keys(CATEGORY_LABELS) as ProductCategory[]).filter((c) => present.has(c))
  }, [searched, brand, deviceType, minPrice, maxPrice])

  const availableBrands = useMemo(() => {
    const brands = new Set(
      searched
        .filter((p) => matchesCategory(p, category) && matchesType(p, deviceType) && matchesPrice(p, minPrice, maxPrice) && p.brand)
        .map((p) => p.brand as string),
    )
    return [...brands].sort((a, b) => a.localeCompare(b))
  }, [searched, category, deviceType, minPrice, maxPrice])

  const availableTypes = useMemo(() => {
    const types = new Set(
      searched
        .filter((p) => matchesCategory(p, category) && matchesBrand(p, brand) && matchesPrice(p, minPrice, maxPrice))
        .map((p) => p.specs[DEVICE_TYPE_SPEC_KEY])
        .filter((t): t is string => Boolean(t)),
    )
    return [...types].sort((a, b) => a.localeCompare(b))
  }, [searched, category, brand, minPrice, maxPrice])

  const filtered = useMemo(() => {
    const matched = searched.filter(
      (p) =>
        matchesCategory(p, category) &&
        matchesBrand(p, brand) &&
        matchesType(p, deviceType) &&
        matchesPrice(p, minPrice, maxPrice),
    )
    return sortProducts(matched, sortKey)
  }, [searched, category, brand, deviceType, minPrice, maxPrice, sortKey])

  // Сброс постраничной подгрузки при смене любого фильтра
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category, brand, deviceType, query, minPrice, maxPrice, sortKey])

  const visible = filtered.slice(0, visibleCount)

  const hasActiveFilters =
    category !== "all" || brand !== "all" || deviceType !== "all" || query !== "" || minPriceInput !== "" || maxPriceInput !== ""

  const resetFilters = () => {
    setCategory("all")
    setBrand("all")
    setDeviceType("all")
    setQuery("")
    setMinPriceInput("")
    setMaxPriceInput("")
    setSortKey("default")
  }

  const pillClass = (active: boolean, variant: "red" | "dark" = "red") =>
    `px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wide transition-colors ${
      active
        ? variant === "red"
          ? "bg-red-600 text-white"
          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
        : "bg-slate-100 dark:bg-white/[0.05] text-muted-foreground hover:text-foreground"
    }`

  const selectClass =
    "h-10 px-3 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] text-xs text-foreground outline-none focus:border-red-500/50 transition-colors dark:[color-scheme:dark]"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://toosba.kz/" },
      { "@type": "ListItem", position: 2, name: "Каталог оборудования" },
    ],
  }

  return (
    <ServiceLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
            <div className="flex flex-col gap-3 mb-6 sticky top-16 z-20 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-border/40">
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
                <button onClick={() => setCategory("all")} className={pillClass(category === "all")}>
                  Все категории
                </button>
                {availableCategories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={pillClass(category === c)}>
                    {CATEGORY_LABELS[c]}
                  </button>
                ))}

                {availableBrands.length > 1 && (
                  <>
                    <span className="w-px bg-border/60 mx-1" />
                    <button onClick={() => setBrand("all")} className={pillClass(brand === "all", "dark")}>
                      Все бренды
                    </button>
                    {availableBrands.map((b) => (
                      <button key={b} onClick={() => setBrand(b)} className={pillClass(brand === b, "dark")}>
                        {b}
                      </button>
                    ))}
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {availableTypes.length > 1 && (
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="all">Тип устройства: все</option>
                    {availableTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    placeholder={`от ${priceBounds.min.toLocaleString("ru-RU")}`}
                    className={`${selectClass} w-28`}
                  />
                  <span className="text-muted-foreground text-xs">—</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    placeholder={`до ${priceBounds.max.toLocaleString("ru-RU")}`}
                    className={`${selectClass} w-28`}
                  />
                  <span className="text-muted-foreground text-xs">₸</span>
                </div>

                <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className={selectClass}>
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                    <option key={k} value={k}>
                      {SORT_LABELS[k]}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <X size={13} /> Сбросить фильтры
                  </button>
                )}

                <span className="ml-auto text-xs text-muted-foreground">
                  Показано {Math.min(visibleCount, filtered.length)} из {filtered.length}
                </span>
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
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground text-sm text-center">
              <PackageSearch size={28} />
              Ничего не нашлось по этому фильтру.
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-red-600 dark:text-red-400 font-semibold hover:underline">
                  Сбросить фильтры
                </button>
              )}
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
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-[#222] rounded-xl p-5 shadow-sm"
              >
                <Link to={`/katalog/${item.id}`} className="group">
                  {item.imageUrl && (
                    <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden bg-slate-50 dark:bg-white/[0.03]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {item.brand && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1 block">
                      {item.brand}
                    </span>
                  )}
                  <h4 className="font-bold text-base mb-3 text-foreground leading-snug group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">{item.name}</h4>

                  <ul className="space-y-1 mb-4">
                    {Object.entries(item.specs).slice(0, CARD_SPEC_LIMIT).map(([label, value]) => (
                      <li key={label} className="flex justify-between gap-2 text-xs text-muted-foreground">
                        <span>{label}</span>
                        <span className="font-semibold text-foreground text-right">{value}</span>
                      </li>
                    ))}
                  </ul>
                </Link>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-[#1a1a1a] flex items-baseline justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Цена</span>
                  <span className="text-lg font-extrabold text-foreground">
                    {item.basePrice.toLocaleString("ru-RU")} <span className="text-red-600 dark:text-red-500 text-sm">₸</span>
                  </span>
                </div>

                {getQty(item.id) === 0 ? (
                  <button
                    onClick={() => addItem(item.id)}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold uppercase tracking-wide text-foreground hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                  >
                    <ShoppingCart size={13} /> В корзину
                  </button>
                ) : (
                  <div className="flex items-center justify-between h-10 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06] px-1.5">
                    <button
                      onClick={() => setQty(item.id, getQty(item.id) - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                      aria-label="Уменьшить количество"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-bold tabular-nums text-red-600 dark:text-red-400">{getQty(item.id)} в корзине</span>
                    <button
                      onClick={() => addItem(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                      aria-label="Увеличить количество"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                )}
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

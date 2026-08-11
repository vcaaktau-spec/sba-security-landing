"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Layers, Loader2, PackageSearch } from "lucide-react"
import { groupByCategory, type Product } from "@/lib/catalog"

// Витрина оборудования — фаза 0 (.wednesday/plans/PLAN.md).
// Только просмотр: список + карточка, без фильтров, без корзины —
// это добавится в фазе 1. Не импортирует и не меняет Calculator.tsx.
// Закрытие модалки управляется снаружи (Home.tsx), как и у Calculator.
export const Catalog = () => {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState(false)

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

  const groups = products ? groupByCategory(products) : []

  return (
    <section className="relative py-8 md:py-12 bg-white dark:bg-[#000] text-foreground font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-white/10 text-foreground font-medium text-[10px] uppercase tracking-widest mb-3">
            <Layers size={14} /> Каталог оборудования
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground leading-tight">
            Что мы <span className="text-red-600 dark:text-red-500">устанавливаем</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-sm lg:mx-0 mx-auto">
            Оборудование не продаётся отдельно — только вместе с монтажом. Цены ориентировочные, точная стоимость
            уточняется при выезде специалиста.
          </p>
        </div>

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

        {groups.length === 0 && products !== null && !error && (
          <div className="flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground text-sm text-center">
            <PackageSearch size={28} />
            Каталог пока пуст.
          </div>
        )}

        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.category}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item) => (
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

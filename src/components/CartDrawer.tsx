"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, Minus, Plus, Trash2, Loader2, CheckCircle2, ArrowRight, Loader } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { computeEstimate } from "@/lib/estimate"
import type { Product } from "@/lib/catalog"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

// Смета корзины — оборудование (точная сумма basePrice из каталога) +
// ориентировочный монтаж (см. src/lib/estimate.ts). Отправка заявки
// переиспользует уже работающий паттерн (api/telegram.ts), как и
// Cta.tsx/Calculator.tsx — отдельного PDF-пайплайна в проекте нет
// (вопреки более раннему допущению в PLAN.md), поэтому не изобретаем его
// здесь заново.
export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, setQty, removeItem, clear } = useCart()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [productsError, setProductsError] = useState(false)

  const [showContactForm, setShowContactForm] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen || products !== null) return
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setProducts(Array.isArray(data?.items) ? data.items : []))
      .catch(() => setProductsError(true))
  }, [isOpen, products])

  useEffect(() => {
    if (!isOpen) {
      setShowContactForm(false)
      setIsSuccess(false)
    }
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const estimate = products ? computeEstimate(items, products) : null

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "")
    if (input.startsWith("7") || input.startsWith("8")) input = input.substring(1)
    let formatted = "+7"
    if (input.length > 0) formatted += ` (${input.substring(0, 3)}`
    if (input.length > 3) formatted += `) ${input.substring(3, 6)}`
    if (input.length > 6) formatted += `-${input.substring(6, 8)}`
    if (input.length > 8) formatted += `-${input.substring(8, 10)}`
    setPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estimate || phone.length !== 18) return
    setIsSubmitting(true)

    const lines = estimate.lines
      .map((l) => `• ${l.product.name} — ${l.qty} шт. × ${l.product.basePrice.toLocaleString("ru-RU")} ₸ = ${l.lineTotal.toLocaleString("ru-RU")} ₸`)
      .join("\n")

    const text = `📞 Тел: ${phone}

📦 СОСТАВ КОРЗИНЫ:
${lines}

💰 Оборудование: ${estimate.equipmentTotal.toLocaleString("ru-RU")} ₸
🛠 Монтаж (ориентировочно): ${estimate.installEstimate.toLocaleString("ru-RU")} ₸
💰 ИТОГО (ориентировочно): ${estimate.grandTotalApprox.toLocaleString("ru-RU")} ₸`

    const formData = new FormData()
    formData.append("name", name)
    formData.append("company", "КОРЗИНА")
    formData.append("text", text)

    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      setIsSuccess(true)
      clear()
    } catch {
      alert("Ошибка отправки. Пожалуйста, напишите нам в WhatsApp.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end text-foreground overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/92 backdrop-blur-lg cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease }}
            className="relative w-full max-w-md h-full bg-white dark:bg-[#0a0f1a] border-l border-slate-200 dark:border-white/[0.08] shadow-2xl flex flex-col z-[10001]"
          >
            <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={17} className="text-red-500" />
                </div>
                <h3 className="font-bold text-base tracking-tight">Корзина</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-red-500/30 hover:text-red-500 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar px-4 sm:px-6 py-6 flex flex-col">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full gap-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                    <CheckCircle2 size={30} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Заявка отправлена!</h4>
                    <p className="text-sm text-muted-foreground">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                  </div>
                </motion.div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center h-full gap-3 text-muted-foreground">
                  <ShoppingCart size={28} className="opacity-40" />
                  <p className="text-sm">Корзина пуста. Добавьте оборудование из каталога.</p>
                </div>
              ) : products === null && !productsError ? (
                <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground text-sm">
                  <Loader className="animate-spin" size={18} /> Загружаем цены…
                </div>
              ) : productsError ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm text-center">
                  Не получилось загрузить каталог. Обновите страницу.
                </div>
              ) : !showContactForm ? (
                <>
                  <div className="flex flex-col gap-3 mb-6">
                    {estimate?.lines.map(({ product, qty, lineTotal }) => (
                      <div
                        key={product.id}
                        className="flex flex-col gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/60 dark:bg-white/[0.02]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold leading-snug">{product.name}</span>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                            aria-label="Удалить из корзины"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setQty(product.id, qty - 1)}
                              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-white/[0.08] flex items-center justify-center hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
                            <button
                              onClick={() => setQty(product.id, qty + 1)}
                              className="w-7 h-7 rounded-lg border border-slate-200 dark:border-white/[0.08] flex items-center justify-center hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-sm font-extrabold tabular-nums">{lineTotal.toLocaleString("ru-RU")} ₸</span>
                        </div>
                      </div>
                    ))}

                    {estimate && estimate.missingProductIds.length > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {estimate.missingProductIds.length} товар(ов) из корзины больше нет в каталоге и они исключены из сметы.
                      </p>
                    )}
                  </div>

                  {estimate && (
                    <div className="mt-auto pt-5 border-t border-slate-200 dark:border-white/[0.07] flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Оборудование</span>
                        <span className="font-semibold tabular-nums">{estimate.equipmentTotal.toLocaleString("ru-RU")} ₸</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Монтаж (ориентировочно)</span>
                        <span className="font-semibold tabular-nums">{estimate.installEstimate.toLocaleString("ru-RU")} ₸</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-200 dark:border-white/[0.07]">
                        <span className="text-sm font-bold uppercase tracking-wide">Итого</span>
                        <span className="text-xl font-extrabold tabular-nums">{estimate.grandTotalApprox.toLocaleString("ru-RU")} ₸</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 leading-relaxed mt-1">
                        Цены ориентировочные, точная стоимость фиксируется после бесплатного выезда специалиста.
                      </p>

                      <button
                        onClick={() => setShowContactForm(true)}
                        className="group mt-4 w-full h-12 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-red-600/10"
                      >
                        Получить КП
                        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-7 h-full">
                  <p className="text-sm text-muted-foreground leading-relaxed px-4 py-3 rounded-lg bg-red-600/[0.06]">
                    Оставьте контакты — пришлём точную смету и свяжемся для бесплатного выезда специалиста.
                  </p>

                  <div className="relative group">
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/[0.12] text-sm placeholder-transparent focus:border-red-500 outline-none transition-colors"
                    />
                    <label className="absolute left-0 -top-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-red-500 pointer-events-none">
                      Ваше имя
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      required
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      maxLength={18}
                      placeholder=" "
                      className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/[0.12] text-sm font-mono placeholder-transparent focus:border-red-500 outline-none transition-colors"
                    />
                    <label className="absolute left-0 -top-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-red-500 pointer-events-none">
                      Номер телефона (WhatsApp)
                    </label>
                    {phone.length > 2 && phone.length < 18 && (
                      <p className="text-xs text-red-500 mt-2 font-medium">Пожалуйста, введите полный номер телефона</p>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || phone.length !== 18}
                      className="w-full h-12 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-red-600/10"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Отправить заявку"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Назад к корзине
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

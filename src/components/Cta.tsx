"use client"

import React, { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next"
import { X, ArrowRight, ShieldCheck, CheckCircle2, Loader2, ChevronDown, MessageCircle, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const SERIF = "'Source Serif 4', serif"

/* ── Radar ring component ── */
function RadarRing({ radius, delay }: { radius: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: radius * 2,
        height: radius * 2,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        border: "1px solid rgba(239, 68, 68, 0.35)",
      }}
      animate={{ scale: [1, 1.4], opacity: [0.75, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeOut", delay }}
    />
  )
}

// Третий заход. Остальная страница ушла в сдержанную типографику — тонкие
// линии вместо рамок, один спокойный акцент вместо блеска. CTA — намеренное
// исключение: это последняя точка перед конверсией, и весь предыдущий
// сдержанный скролл должен разрешиться во что-то громкое. Общий язык
// (Source Serif 4, красный акцент, без градиентных "SaaS" трюков вроде
// shine-sweep на кнопке) сохранён, но масштаб, насыщенность и движение —
// сознательно на максимум: это единственное место на странице, где можно
// быть громким, и весь бюджет громкости потрачен именно здесь.
export const Cta = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState(t("cta.opt_1", "Видеонаблюдение"))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [isModalOpen])

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
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("company", "ЗАЯВКА С САЙТА")
    formData.append("text", `📞 Телефон: ${phone}\n🛠 Услуга: ${service}`)
    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error()
      setIsSuccess(true)
      setTimeout(() => {
        setIsModalOpen(false)
        setTimeout(() => { setIsSuccess(false); setName(""); setPhone(""); }, 500)
      }, 3000)
    } catch {
      alert(t("cta.error_msg"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceOptions = [
    t("cta.opt_1"), t("cta.opt_2"), t("cta.opt_3"), t("cta.opt_4"), t("cta.opt_5"),
  ]

  const metrics = [
    { value: "5 000+", label: t("stats.stat1") },
    { value: "300+",   label: t("stats.stat2") },
    { value: "10+",    label: t("stats.stat3") },
    { value: "24/7",   label: t("stats.stat4") },
  ]

  return (
    <>
      <section
        id="cta"
        ref={sectionRef}
        className="relative py-28 lg:py-44 overflow-hidden flex items-center"
      >
        {/* ── Радар — единственный на странице момент атмосферного фона ── */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="absolute w-[750px] h-[750px] rounded-full bg-red-600/[0.14] dark:bg-red-600/[0.16] blur-[100px]" />
          {[120, 200, 300, 420, 550].map((r, i) => (
            <RadarRing key={r} radius={r} delay={i * 0.65} />
          ))}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-red-500/[0.1]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6">

          {/* ── Живой бейдж ── */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-red-600/10 dark:bg-red-500/15 border border-red-600/25 dark:border-red-500/25">
              <div className="relative flex items-center justify-center w-5 h-5">
                <Clock size={14} className="text-red-600 dark:text-red-400" />
                <motion.div
                  className="absolute inset-[-3px] rounded-full border border-red-500/50"
                  animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground/90">
                {t("cta.badge_before")}<span className="text-red-600 dark:text-red-400 font-bold">{t("cta.badge_highlight")}</span>{t("cta.badge_after")}
              </span>
            </div>
          </motion.div>

          {/* ── Заголовок — та же гарнитура, что и по всей странице, но на максимум масштаба ── */}
          <div className="text-center max-w-4xl mx-auto mb-14">
            <motion.h2
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.08 }}
              className="font-semibold leading-[1.02] text-foreground mb-6"
              style={{ fontFamily: SERIF, fontSize: "clamp(3rem, 7.5vw, 6.5rem)", letterSpacing: "-0.015em" }}
            >
              {t("cta.title1")}
              <span className="relative inline-block">
                <span className="text-red-600 dark:text-red-500">{t("cta.title2")}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/70 to-red-500/0"
                  initial={false}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease, delay: 0.6 }}
                />
              </span>
            </motion.h2>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.18 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              {t("cta.subtitle")}
            </motion.p>
          </div>

          {/* ── Кнопки — без shine-sweep, но крупные и с фирменным свечением ── */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.26 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group w-full sm:w-auto h-14 px-9 rounded-xl bg-red-600 text-white font-bold text-[15px] tracking-wide hover:bg-red-700 transition-all duration-300 shadow-[0_0_40px_rgba(239,68,68,0.25)] hover:shadow-[0_0_60px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3"
            >
              <span>{t("cta.btn_main")}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto h-14 px-9 rounded-xl bg-white/[0.04] border border-white/[0.1] text-foreground font-semibold text-[15px] hover:bg-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <MessageCircle size={18} className="text-green-400" />
              <span>{t("cta.btn_wa")}</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
            </a>
          </motion.div>

          {/* ── Метрики — та же полоса с разделителями, что в "В цифрах", крупнее ── */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.38 }}
            className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200/60 dark:divide-white/[0.08] border-y border-slate-200/60 dark:border-white/[0.08] max-w-3xl mx-auto"
          >
            {metrics.map((m, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-6 px-4">
                <span
                  className="font-semibold leading-none text-foreground tabular-nums"
                  style={{ fontFamily: SERIF, fontSize: "clamp(1.65rem, 2.6vw, 2.1rem)" }}
                >
                  {m.value}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground/60 mt-2 text-center leading-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── Боковая форма ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[10000] flex justify-end text-foreground overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-950/95 cursor-pointer"
              />

              <motion.div
                initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }}
                transition={{ duration: 0.45, ease }}
                className="relative w-full max-w-md h-full bg-white dark:bg-[#0a0f1a] border-l border-slate-200 dark:border-white/[0.08] shadow-[0_0_100px_rgba(0,0,0,0.2)] dark:shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col z-[10001] overflow-hidden"
              >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-white/[0.07] relative z-10 bg-white dark:bg-[#0a0f1a]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                      <ShieldCheck size={17} className="text-red-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white" style={{ fontFamily: SERIF }}>{t("cta.form_title")}</h3>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col custom-scrollbar relative z-10">
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center h-full gap-5"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                        <CheckCircle2 size={30} className="text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{t("cta.success_title")}</h4>
                        <p className="text-sm text-muted-foreground">{t("cta.success_desc")}</p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6 sm:mb-8 px-4 py-3 rounded-lg bg-red-600/[0.06] dark:bg-red-600/[0.08] break-words hyphens-auto">
                        {t("cta.form_desc")}
                      </p>

                      <form onSubmit={handleSubmit} className="flex flex-col gap-7 flex-grow">

                        {/* Name */}
                        <div className="relative group">
                          <input
                            required type="text" value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder=" "
                            className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/[0.12] text-slate-900 dark:text-white text-sm placeholder-transparent focus:border-red-500 outline-none transition-colors"
                          />
                          <label className="absolute left-0 -top-3.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-red-500 dark:peer-focus:text-red-400 cursor-text pointer-events-none whitespace-nowrap">
                            {t("cta.name_label")}
                          </label>
                        </div>

                        {/* Phone */}
                        <div className="relative group">
                          <input
                            required type="tel" value={phone}
                            onChange={handlePhoneChange}
                            maxLength={18} placeholder=" "
                            className="peer w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/[0.12] text-slate-900 dark:text-white text-sm font-mono placeholder-transparent focus:border-red-500 outline-none transition-colors"
                          />
                          <label className="absolute left-0 -top-3.5 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:text-slate-400 dark:peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[9px] peer-focus:text-red-500 dark:peer-focus:text-red-400 cursor-text pointer-events-none whitespace-nowrap">
                            {t("cta.phone_label")}
                          </label>
                        </div>

                        {/* Service */}
                        <div className="relative">
                          <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block mb-2 break-words">
                            {t("cta.service_label")}
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full h-12 bg-transparent border-b border-slate-300 dark:border-white/[0.12] flex items-center justify-between text-sm transition-colors outline-none hover:border-slate-400 dark:hover:border-white/[0.2]"
                          >
                            <span className="truncate pr-4 text-slate-900 dark:text-white">{service}</span>
                            <ChevronDown size={14} className={`transition-transform duration-300 shrink-0 text-slate-400 ${isDropdownOpen ? "rotate-180 text-red-500" : ""}`} />
                          </button>

                          {isDropdownOpen && (
                             <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                          )}

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.18 }}
                                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.1] shadow-2xl z-50 flex flex-col py-1.5 rounded-xl overflow-hidden"
                              >
                                {serviceOptions.map((opt, i) => (
                                  <button
                                    key={i} type="button"
                                    onClick={() => { setService(opt); setIsDropdownOpen(false) }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors break-words ${
                                      service === opt
                                        ? "bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting || phone.length !== 18}
                          className="mt-auto w-full h-13 py-3.5 flex justify-center items-center gap-3 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-sm tracking-wide transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                        >
                          {isSubmitting
                            ? <Loader2 size={18} className="animate-spin" />
                            : <><span>{t("cta.btn_submit")}</span><ArrowRight size={16} /></>
                          }
                        </button>

                        <p className="text-center text-[10px] text-muted-foreground/40 leading-tight">
                          {t("cta.disclaimer")}
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

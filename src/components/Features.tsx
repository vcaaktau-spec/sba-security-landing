"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ShieldCheck, Cpu, HardDrive, Shield, Check } from "lucide-react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const Features = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const isInView = useInView(containerRef, { once: true, margin: "-10%" })
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const capabilities = [
    t("features.list.0", "IP Видеонаблюдение"),
    t("features.list.1", "СКУД"),
    t("features.list.2", "Домофония"),
    t("features.list.3", "Умный дом"),
    t("features.list.4", "Охранные системы"),
    t("features.list.5", "Сети"),
    t("features.list.6", "Аналитика ИИ"),
  ]

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      <div className="absolute top-0 inset-x-0 section-divider" />

      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5"
          >
            {t("features.title1", "Почему выбирают")}{" "}
            <span className="text-red-650 text-red-600 dark:text-red-500">{t("features.title2", "именно нас")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            {t("features.subtitle", "Узнайте, почему нам доверяют безопасность самых сложных объектов в Актау.")}
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">

          {/* Card 1 — Guarantee (2-col) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="group relative lg:col-span-2 bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-7 sm:p-9 flex flex-col md:flex-row gap-8 items-center hover:border-slate-350 dark:hover:border-white/[0.14] shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none transition-all duration-400 overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/[0.03] dark:from-emerald-500/[0.05] to-transparent pointer-events-none" />

            <div className="flex-1 space-y-4 text-center md:text-left z-10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-250 border-emerald-200 dark:border-emerald-500/20">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("features.f1_title")}
              </h3>
              <p className="text-sm sm:text-base text-slate-650 text-slate-650 text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("features.f1_desc")}
              </p>
            </div>

            {/* Animated shield */}
            <div className="relative w-[160px] h-[160px] shrink-0 flex items-center justify-center z-10">
              <svg viewBox="0 0 100 100" className="absolute w-full h-full">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-emerald-500/10 dark:text-emerald-500/20" strokeWidth="0.5" strokeDasharray="1 3" />
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="currentColor"
                  className="text-emerald-500/20 dark:text-emerald-500/30"
                  strokeWidth="0.6"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              <Shield
                size={58}
                className="text-emerald-650 text-emerald-600 dark:text-emerald-400 opacity-85 drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-pulse"
                style={{ animationDuration: "3s" }}
              />
            </div>
          </motion.div>

          {/* Card 2 — Brands (1-col) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.18 }}
            className="group relative bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-7 flex flex-col justify-between hover:border-slate-350 dark:hover:border-white/[0.14] shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none transition-all duration-400 overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/[0.03] dark:from-red-500/[0.04] to-transparent pointer-events-none" />

            <div className="space-y-4 z-10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-650 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                <Cpu size={22} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("features.f2_title")}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t("features.f2_desc")}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 z-10">
              {["Hikvision", "Dahua", "Ezviz", "Uniview"].map((brand, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/[0.05] border border-slate-150 dark:border-white/[0.08] text-slate-700 dark:text-slate-300 group-hover:border-slate-250 dark:group-hover:border-white/[0.14] transition-colors duration-300"
                >
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 3 — Capabilities (3-col) */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.28 }}
            className="group relative lg:col-span-3 bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-7 sm:p-9 flex flex-col lg:flex-row gap-10 items-start lg:items-center hover:border-slate-350 dark:hover:border-white/[0.14] shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none transition-all duration-400 overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-red-500/[0.03] dark:from-red-500/[0.04] to-transparent pointer-events-none" />

            <div className="flex-1 space-y-4 z-10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-650 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                <HardDrive size={22} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("features.f3_title")}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                {t("features.f3_desc")}
              </p>
            </div>

            {/* Capabilities grid */}
            <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 shrink-0 z-10">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.04 }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-150 dark:border-white/[0.07] text-[12px] font-medium text-slate-700 dark:text-slate-300 group-hover:border-slate-250 dark:group-hover:border-white/[0.12] transition-colors duration-300"
                >
                  <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                    <Check size={9} strokeWidth={3} className="text-red-600 dark:text-red-400" />
                  </div>
                  {cap}
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AlertTriangle, ShieldCheck, Flame, EyeOff, Radio } from "lucide-react"
import { motion } from "framer-motion"

export const PainSection = () => {
  const { t } = useTranslation()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const cases = [
    {
      icon: EyeOff,
      badge: "pain.case1_badge",
      title: "pain.case1_title",
      desc: "pain.case1_desc",
      cheap: "pain.case1_cheap",
      sba: "pain.case1_sba",
      realHeadline: "Криминальная хроника СНГ: хищения на складах временного хранения",
      realLabel: "АЛМАТЫ / АСТАНА"
    },
    {
      icon: Radio,
      badge: "pain.case2_badge",
      title: "pain.case2_title",
      desc: "pain.case2_desc",
      cheap: "pain.case2_cheap",
      sba: "pain.case2_sba",
      realHeadline: "Массовые кибератаки: компрометация IP-камер видеонаблюдения популярных вендоров",
      realLabel: "УЯЗВИМОСТИ ПРОШИВОК"
    },
    {
      icon: Flame,
      badge: "pain.case3_badge",
      title: "pain.case3_title",
      desc: "pain.case3_desc",
      cheap: "pain.case3_cheap",
      sba: "pain.case3_sba",
      realHeadline: "Сводки МЧС: короткие замыкания кабельной продукции в системах мониторинга",
      realLabel: "ПОЖАРООПАСНЫЙ МОНТАЖ"
    }
  ]

  return (
    <section className="relative py-24 bg-transparent border-t border-border/10 overflow-hidden">
      {/* Background glow and HUD grid line */}
      <div className="absolute inset-0 z-0 opacity-35 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
        <div className="absolute right-10 top-20 text-[10px] font-mono text-red-500/20 tracking-widest hidden md:block">
          STATUS: THREATS_DETECTED // VOLTAGE: 220V
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold uppercase tracking-wider mb-6"
          >
            <AlertTriangle size={14} className="animate-pulse" />
            <span>{t("pain.badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[32px] sm:text-[44px] lg:text-[52px] font-black tracking-tighter leading-[1.1] text-foreground mb-6"
          >
            {t("pain.title1")}{" "}
            <span className="text-red-600 block sm:inline">{t("pain.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground"
          >
            {t("pain.subtitle")}
          </motion.p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((item, idx) => {
            const Icon = item.icon
            const isHovered = hoveredIndex === idx

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative bg-card/40 backdrop-blur-md border border-border/40 rounded-[24px] p-6 sm:p-8 flex flex-col justify-between h-full transition-all duration-500 hover:border-red-500/30 overflow-hidden shadow-lg"
              >
                {/* HUD corner borders */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />
                </div>

                {/* Animated scanner overlay */}
                {isHovered && (
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: "200%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-red-500/20 blur-[1px] pointer-events-none"
                  />
                )}

                <div>
                  {/* Top card metadata */}
                  <div className="flex items-center justify-between mb-6 border-b border-border/20 pb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded">
                      <Icon size={12} className="shrink-0" />
                      <span>{t(item.badge)}</span>
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60">
                      {item.realLabel}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-4 leading-snug group-hover:text-red-500 transition-colors duration-300">
                    {t(item.title)}
                  </h3>

                  {/* Real News citation */}
                  <div className="mb-6 p-3 rounded-lg bg-black/40 border-l border-red-600/70">
                    <div className="text-[10px] font-mono text-red-500 mb-1">
                      РЕАЛЬНЫЙ КЕЙС / ИСТОЧНИК СМИ
                    </div>
                    <p className="text-xs text-muted-foreground/90 italic leading-relaxed">
                      «{item.realHeadline}»
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground/90 leading-relaxed mb-6">
                    {t(item.desc)}
                  </p>
                </div>

                {/* Comparison block */}
                <div className="mt-auto space-y-4 pt-6 border-t border-border/20">
                  {/* Cheap side */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/10 border border-red-900/10">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[11px] font-mono font-bold text-red-500 uppercase tracking-wide">
                        Дешевый подход
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-normal mt-0.5">
                        {t(item.cheap)}
                      </p>
                    </div>
                  </div>

                  {/* SBA premium side */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/10 border border-emerald-900/10">
                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                    <div>
                      <div className="text-[11px] font-mono font-bold text-emerald-500 uppercase tracking-wide">
                        Стандарты SBA
                      </div>
                      <p className="text-[12px] text-muted-foreground leading-normal mt-0.5">
                        {t(item.sba)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA hook at the bottom */}
        <div className="mt-16 text-center">
          <p className="text-sm font-mono text-muted-foreground">
            // Не рискуйте имуществом. Инвестируйте в надежную безопасность.
          </p>
        </div>
      </div>
    </section>
  )
}

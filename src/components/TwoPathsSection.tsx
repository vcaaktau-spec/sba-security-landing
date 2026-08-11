"use client"

import type { ElementType } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { Layers, Calculator as CalcIcon, ArrowRight, Check } from "lucide-react"
import Magnetic from "./ui/magnetic"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface TwoPathsSectionProps {
  onOpenCatalog: () => void
  onOpenCalc: () => void
}

interface PathPanelProps {
  tag: string
  badge?: string
  Icon: ElementType
  title: string
  desc: string
  features: string[]
  btnLabel: string
  onClick: () => void
  accent: "primary" | "secondary"
  delay: number
}

// Единая карточка "протокола расчёта" — переиспользует тактические классы
// из index.css (crosshair-container/-corner) вместо новых стилей, чтобы
// сохранить визуальный язык Hero/PainSection.
const PathPanel = ({ tag, badge, Icon, title, desc, features, btnLabel, onClick, accent, delay }: PathPanelProps) => {
  const isPrimary = accent === "primary"

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease, delay }}
      className={`crosshair-container relative flex flex-col h-full p-7 sm:p-9 rounded-2xl border transition-colors duration-300 ${
        isPrimary
          ? "bg-white dark:bg-white/[0.02] border-red-200/70 dark:border-red-500/20"
          : "bg-white dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.06]"
      }`}
    >
      <span className="crosshair-corner crosshair-tl">+</span>
      <span className="crosshair-corner crosshair-tr">+</span>
      <span className="crosshair-corner crosshair-bl">+</span>
      <span className="crosshair-corner crosshair-br">+</span>

      <div className="flex items-start justify-between gap-3 mb-6">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">{tag}</span>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            {badge}
          </span>
        )}
      </div>

      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 border ${
          isPrimary
            ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
            : "bg-slate-50 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]"
        }`}
      >
        <Icon size={22} />
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{desc}</p>

      <ul className="space-y-2.5 mb-8 mt-auto">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-slate-700 dark:text-slate-300">
            <span
              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                isPrimary ? "bg-red-100 dark:bg-red-500/10" : "bg-slate-100 dark:bg-white/[0.06]"
              }`}
            >
              <Check size={9} strokeWidth={3} className={isPrimary ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Magnetic strength={0.1}>
        <button
          onClick={onClick}
          className={`group w-full relative flex items-center justify-center gap-2 h-12 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden transition-all duration-300 ${
            isPrimary
              ? "btn-shine text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/10 hover:shadow-red-600/20"
              : "border border-slate-200 dark:border-white/[0.08] text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
          }`}
        >
          {btnLabel}
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </Magnetic>
    </motion.div>
  )
}

// "Два пути расчёта" — главный CTA-блок концепта 2026 (docs/CONCEPT-2026.md,
// раздел 3). Оба пути сейчас ведут в уже существующие модалки (Catalog,
// Calculator) — это сознательный промежуточный шаг: корзина/смета/AI-подбор
// (фазы 1-3, .wednesday/plans/PLAN.md) ещё не построены, поэтому секция не
// обещает AI-режим раньше времени и опирается только на то, что реально
// работает сегодня.
export const TwoPathsSection = ({ onOpenCatalog, onOpenCalc }: TwoPathsSectionProps) => {
  const { t } = useTranslation()

  const path1Features = [t("twoPaths.path1_f1"), t("twoPaths.path1_f2"), t("twoPaths.path1_f3")]
  const path2Features = [t("twoPaths.path2_f1"), t("twoPaths.path2_f2"), t("twoPaths.path2_f3")]

  return (
    <section id="two-paths" className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.06]">
      <div className="absolute inset-0 -z-10 dot-grid opacity-70" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest mb-6"
          >
            {t("twoPaths.eyebrow")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {t("twoPaths.title1")} <span className="text-red-600 dark:text-red-500">{t("twoPaths.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {t("twoPaths.subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-0 items-stretch">
          <PathPanel
            tag={t("twoPaths.path1_tag")}
            badge={t("twoPaths.path1_badge")}
            Icon={Layers}
            title={t("twoPaths.path1_title")}
            desc={t("twoPaths.path1_desc")}
            features={path1Features}
            btnLabel={t("twoPaths.path1_btn")}
            onClick={onOpenCatalog}
            accent="primary"
            delay={0}
          />

          <div className="hidden lg:flex flex-col items-center justify-center px-6">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/[0.14] to-transparent" />
            <span className="my-4 w-9 h-9 shrink-0 rounded-full border border-slate-200 dark:border-white/[0.12] bg-background flex items-center justify-center text-[10px] font-mono font-bold text-muted-foreground uppercase">
              {t("twoPaths.divider")}
            </span>
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-slate-300 dark:via-white/[0.14] to-transparent" />
          </div>

          <div className="flex lg:hidden items-center justify-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">{t("twoPaths.divider")}</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/[0.08]" />
          </div>

          <PathPanel
            tag={t("twoPaths.path2_tag")}
            Icon={CalcIcon}
            title={t("twoPaths.path2_title")}
            desc={t("twoPaths.path2_desc")}
            features={path2Features}
            btnLabel={t("twoPaths.path2_btn")}
            onClick={onOpenCalc}
            accent="secondary"
            delay={0.12}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
          className="mt-14 text-center text-[11px] font-mono text-muted-foreground uppercase tracking-widest"
        >
          {t("twoPaths.footer_note")}
        </motion.p>
      </div>
    </section>
  )
}

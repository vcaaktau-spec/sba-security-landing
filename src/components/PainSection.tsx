"use client"

import React from "react"
import { AlertTriangle, ShieldCheck, ExternalLink, Flame, Eye, Lock, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Category = "fire" | "cctv" | "theft" | "electrical"

interface IncidentMeta {
  category: Category
  Icon: React.ElementType
  newsSource: string
  newsLink: string
  caseKey: string // e.g. "case1"
}

const categoryStyle: Record<Category, { badge: string; statColor: string; iconBg: string }> = {
  fire:       { badge: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400",        statColor: "text-red-600 dark:text-red-400",    iconBg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
  cctv:       { badge: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400", statColor: "text-orange-600 dark:text-orange-400", iconBg: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  theft:      { badge: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400", statColor: "text-amber-700 dark:text-amber-400", iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  electrical: { badge: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400",   statColor: "text-amber-700 dark:text-amber-400",  iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
}

const incidentsMeta: IncidentMeta[] = [
  { category: "fire",       Icon: Flame, newsSource: "BBC Русская служба", newsLink: "https://www.bbc.com/russian/news-43506603",                                                                                                               caseKey: "case1" },
  { category: "cctv",       Icon: Eye,   newsSource: "Zakon.kz",           newsLink: "https://www.zakon.kz/sobytiya/6008892-bolee-6-tysyach-kamer-vzlomali-khakery-v-kazakhstane-kak-obezopasit-sebya.html",                                   caseKey: "case2" },
  { category: "theft",      Icon: Lock,  newsSource: "Tengrinews.kz",      newsLink: "https://tengrinews.kz/crime/krupnuyu-kraju-so-sklada-raskryili-v-almatyi-508544/",                                                                        caseKey: "case3" },
  { category: "electrical", Icon: Zap,   newsSource: "МЧС РК / Zakon.kz", newsLink: "https://www.zakon.kz/obshestvo/6011400-korotkoe-zamykanie-v-provodke-kak-izbezhat-pozhara-rekomendatsii-mchs.html",                                       caseKey: "case4" },
]

export const PainSection = () => {
  const { t } = useTranslation()

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.06]">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-red-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">

        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in"
          >
            <AlertTriangle size={12} className="animate-pulse" />
            {t("pain.real_cases")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5" style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {t("pain.title1")}{" "}
            <span className="text-red-600 dark:text-red-500">{t("pain.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {t("pain.subtitle")}
          </motion.p>
        </div>

        {/* ── NEWS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {incidentsMeta.map((meta, idx) => {
            const style = categoryStyle[meta.category]
            const Icon = meta.Icon
            const k = meta.caseKey

            const problemPoints = [
              t(`pain.${k}_p1`),
              t(`pain.${k}_p2`),
              t(`pain.${k}_p3`),
              t(`pain.${k}_p4`),
            ]
            const sbaPoints = [
              t(`pain.${k}_s1`),
              t(`pain.${k}_s2`),
              t(`pain.${k}_s3`),
              t(`pain.${k}_s4`),
            ]

            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: idx * 0.1, ease }}
                className="news-card-hover group relative flex flex-col bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 dark:hover:border-white/[0.12]"
              >
                {/* Top gradient accent line */}
                <div className={`h-px w-full ${
                  meta.category === "fire" ? "bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
                  : meta.category === "cctv" ? "bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
                  : meta.category === "theft" ? "bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"
                  : "bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
                }`} />

                <div className="flex flex-col gap-5 p-6 sm:p-7 flex-1">

                  {/* Card header: category + date/location */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider border ${style.badge}`}>
                      <Icon size={11} />
                      {t(`pain.${k}_badge`)}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-tight">{t(`pain.${k}_date`)}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-tight">{t(`pain.${k}_loc`)}</div>
                    </div>
                  </div>

                  {/* Impact metric */}
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-[52px] sm:text-[60px] font-black tracking-tight leading-none tabular-nums ${style.statColor}`}>
                      {t(`pain.${k}_stat`)}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                      {t(`pain.${k}_unit`)}
                    </span>
                  </div>

                  {/* Incident headline */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {t(`pain.${k}_title`)}
                  </h3>

                  {/* Problem vs SBA comparison */}
                  <div className="space-y-3 mt-auto">

                    {/* What went wrong */}
                    <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30">
                      <div className="flex items-center gap-2 mb-2.5">
                        <AlertTriangle size={13} className="text-red-600 dark:text-red-400 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">{t("pain.what_wrong")}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {problemPoints.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/30 dark:bg-red-400/30 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SBA solution */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30">
                      <div className="flex items-center gap-2 mb-2.5">
                        <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t("pain.sba_solution")}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {sbaPoints.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/30 dark:bg-emerald-400/30 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* News source link */}
                  <a
                    href={meta.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2.5 pt-4 border-t border-slate-150 dark:border-white/[0.06] text-[11px] font-mono text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <ExternalLink size={11} className="shrink-0 group-hover/link:text-red-500 dark:group-hover/link:text-red-400 transition-colors" />
                    <span className="font-bold uppercase tracking-wider">{t("pain.source")}</span>
                    <span>{meta.newsSource}</span>
                    <span className="ml-auto text-slate-300 dark:text-slate-650">→ {t("pain.read_news")}</span>
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* ── BOTTOM HOOK ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] text-sm text-slate-600 dark:text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            {t("pain.footer_msg")}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

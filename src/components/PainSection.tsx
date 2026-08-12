"use client"

import React from "react"
import { ExternalLink, Flame, Eye, Lock, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const SERIF = "'Source Serif 4', serif"

type Category = "fire" | "cctv" | "theft" | "electrical"

interface IncidentMeta {
  category: Category
  Icon: React.ElementType
  newsSource: string
  newsLink: string
  caseKey: string // e.g. "case1"
}

// Ссылки проверены вручную (curl + WebFetch) 12 августа 2026 — прежние
// (BBC/Zakon.kz/Tengrinews) все оказались битыми: BBC отдавал 404, оба
// zakon.kz и tengrinews.kz технически отвечали 200, но редиректили на
// совершенно не связанные статьи (переиспользованные числовые ID). Кейсы
// 2 и 3 заменены на реальные истории, которые удалось подтвердить —
// содержание case2/case3 в i18n.ts переписано под них.
const incidentsMeta: IncidentMeta[] = [
  { category: "fire",       Icon: Flame, newsSource: "Lenta.ru",   newsLink: "https://lenta.ru/articles/2023/03/24/vishnya/",                                                                        caseKey: "case1" },
  { category: "cctv",       Icon: Eye,   newsSource: "BBC News",   newsLink: "https://www.bbc.com/news/technology-65975446",                                                                         caseKey: "case2" },
  { category: "theft",      Icon: Lock,  newsSource: "Caravan.kz", newsLink: "https://www.caravan.kz/crime/kak-sluchajnyj-kljuch-s-rynka-podoshel-k-skladu-ktzh-istorija-krazhi-9-millionov-tenge/",  caseKey: "case3" },
  { category: "electrical", Icon: Zap,   newsSource: "Inform.kz",  newsLink: "https://www.inform.kz/ru/pozhari-v-kazahstane-ot-chelovecheskih-oshibok-k-tsifrovoy-zashite-4b0e65",                    caseKey: "case4" },
]

// Второй заход, под язык Hero (см. Hero.tsx): раньше секция была ровно
// тем самым "SaaS-дашбордом", от которого мы ушли в заголовке — пилюля-
// бейдж с иконкой, чёрный жирный sans-заголовок, у каждой карточки своя
// цветная категория (красный/оранжевый/жёлтый/янтарный), градиентная
// полоска сверху, две цветные плашки-заливки "проблема/решение". Здесь
// один акцент (красный) вместо четырёх, заголовки — Source Serif 4,
// плашки-заливки заменены на тонкую левую линию (как в цитате), боковая
// пилюля-подвал — на простую строку без рамки.
export const PainSection = () => {
  const { t } = useTranslation()

  return (
    <section className="relative py-24 lg:py-32 border-b border-slate-200/60 dark:border-white/[0.06]">
      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10">

        {/* ── SECTION HEADER — тот же приём, что и в Hero ── */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-6 h-px bg-red-600/70 shrink-0" />
            <span className="text-[13px] tracking-wide text-muted-foreground">
              {t("pain.real_cases")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="font-semibold leading-[1.15] text-foreground mb-5"
            style={{ fontFamily: SERIF, fontSize: "clamp(1.85rem, 3.4vw, 2.75rem)", letterSpacing: "-0.01em" }}
          >
            {t("pain.title1")}{" "}
            <span className="text-red-600 dark:text-red-500">{t("pain.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="text-base leading-relaxed text-muted-foreground"
          >
            {t("pain.subtitle")}
          </motion.p>
        </div>

        {/* ── NEWS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {incidentsMeta.map((meta, idx) => {
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
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease }}
                className="news-card-hover group relative flex flex-col bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-lg overflow-hidden transition-colors duration-300 dark:hover:border-white/[0.12]"
              >
                <div className="flex flex-col gap-5 p-6 sm:p-7 flex-1">

                  {/* Category + date/location */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="inline-flex items-center gap-2 text-[11px] tracking-wider uppercase text-muted-foreground/80">
                      <Icon size={12} className="text-red-600/70 dark:text-red-500/70 shrink-0" />
                      {t(`pain.${k}_badge`)}
                    </div>
                    <div className="text-right shrink-0 text-[11px] text-muted-foreground/70 leading-tight">
                      <div>{t(`pain.${k}_date`)}</div>
                      <div>{t(`pain.${k}_loc`)}</div>
                    </div>
                  </div>

                  {/* Impact metric */}
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="font-semibold leading-none text-red-600 dark:text-red-500"
                      style={{ fontFamily: SERIF, fontSize: "clamp(2.25rem, 4vw, 3rem)" }}
                    >
                      {t(`pain.${k}_stat`)}
                    </span>
                    <span className="text-sm text-muted-foreground leading-tight">
                      {t(`pain.${k}_unit`)}
                    </span>
                  </div>

                  {/* Incident headline */}
                  <h3 className="text-base sm:text-[17px] font-medium text-foreground leading-snug">
                    {t(`pain.${k}_title`)}
                  </h3>

                  {/* Problem vs SBA comparison — тонкая линия слева вместо цветной плашки */}
                  <div className="space-y-5 mt-auto pt-1">
                    <div className="border-l-2 border-red-500/30 pl-4">
                      <span className="block text-[11px] tracking-widest uppercase text-red-600/80 dark:text-red-500/80 mb-2">
                        {t("pain.what_wrong")}
                      </span>
                      <ul className="space-y-1.5">
                        {problemPoints.map((point, pi) => (
                          <li key={pi} className="text-[13px] text-muted-foreground leading-snug">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-l-2 border-emerald-500/30 pl-4">
                      <span className="block text-[11px] tracking-widest uppercase text-emerald-700/80 dark:text-emerald-400/80 mb-2">
                        {t("pain.sba_solution")}
                      </span>
                      <ul className="space-y-1.5">
                        {sbaPoints.map((point, pi) => (
                          <li key={pi} className="text-[13px] text-muted-foreground leading-snug">
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
                    className="group/link inline-flex items-center gap-2 pt-4 mt-1 border-t border-slate-150 dark:border-white/[0.06] text-[13px] text-muted-foreground/80 hover:text-foreground transition-colors duration-200 w-fit"
                  >
                    <span className="relative">
                      {t("pain.source")} {meta.newsSource}
                      <span className="absolute left-0 -bottom-0.5 h-px w-full bg-current scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300" />
                    </span>
                    <ExternalLink size={12} className="shrink-0" />
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* ── BOTTOM HOOK — простая строка вместо пилюли ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="mt-14 text-center text-[15px] text-muted-foreground"
          style={{ fontFamily: SERIF, fontStyle: "italic" }}
        >
          {t("pain.footer_msg")}
        </motion.p>
      </div>
    </section>
  )
}

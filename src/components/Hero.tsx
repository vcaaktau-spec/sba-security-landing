"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Magnetic from "./ui/magnetic"

const E = [0.22, 1, 0.36, 1] as const

// Второй заход на Hero (первый — Blueprint Reveal с SVG-планом этажа,
// см. docs/superpowers/plans/2026-06-25-hero-blueprint-reveal.md) —
// заменён полностью: (1) узкая колонка под текст (5/12 сетки) переполнялась
// на широких экранах (1920×1200) — clamp() для шрифта не учитывал ширину
// именно этой колонки, а overflow-hidden обёртки (нужной для анимации
// выезда строк) обрезал слово по горизонтали; (2) ручная отрисовка стен и
// камер через SVG-path выглядела предельно просто на масштабе. Здесь текст
// на всю ширину — обрезать нечего, а вместо иллюстрации инструментальная
// рамка (crosshair-container/-corner, уже используется по сайту),
// blueprint-сетка фоном и один короткий, честный технический факт
// (координаты Актау) — материал самого бренда, а не декоративная картинка.
// Sticky-pin с многостадийным скроллом (стены→камеры→покрытие) убран — тут
// нет многоступенчатого сюжета, который его оправдывал; скролл двигает
// линию сканирования и мягкий параллакс фона через обычный useScroll без
// pin, что заодно убирает целый класс багов с overflow/зажатым вьюпортом.
export const Hero = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const scanLineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const scanLineOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="crosshair-container relative min-h-screen flex flex-col justify-center overflow-hidden bg-background text-foreground border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      <span className="crosshair-corner crosshair-tl">+</span>
      <span className="crosshair-corner crosshair-tr">+</span>
      <span className="crosshair-corner crosshair-bl">+</span>
      <span className="crosshair-corner crosshair-br">+</span>

      {/* Фон: blueprint-сетка с лёгким параллаксом + линия сканирования,
          привязанная к прогрессу скролла секции. */}
      <motion.div className="absolute inset-0 blueprint-grid opacity-60 dark:opacity-40 pointer-events-none" style={{ y: gridY }} aria-hidden="true" />
      <motion.div
        className="absolute inset-x-0 h-px pointer-events-none"
        style={{
          top: scanLineY,
          opacity: scanLineOpacity,
          background: "linear-gradient(to right, transparent, rgba(220,38,38,0.5) 20%, rgba(220,38,38,0.5) 80%, transparent)",
          boxShadow: "0 0 12px 1px rgba(220,38,38,0.35)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16 py-28 lg:py-0">
        {/* Верхняя строка: локация слева, координаты справа — техническая "шапка" */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: E }}
            className="text-xs font-mono tracking-widest uppercase text-foreground/40"
          >
            {t("hero.locationLabel")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: E }}
            className="hidden sm:block text-xs font-mono tracking-widest text-foreground/40"
          >
            43.65&deg; N &middot; 51.20&deg; E
          </motion.p>
        </div>

        {/* H1 — на всю ширину контейнера, обрезать больше нечему */}
        <h1 className="mb-8 flex flex-col gap-1 select-none" style={{ letterSpacing: "-0.03em" }}>
          <span className="sr-only">Видеонаблюдение в Актау — Установка систем безопасности под ключ</span>
          {[
            { text: t("hero.titleLine1"), cls: "text-foreground", delay: 0.6 },
            { text: t("hero.titleLine2"), cls: "text-foreground/35", delay: 0.75 },
            { text: t("hero.titleLine3"), cls: "text-red-600 dark:text-red-500", delay: 0.9 },
          ].map(({ text, cls, delay }) => (
            <div key={text} className="overflow-hidden">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, ease: E, delay }}
                className={`block font-black leading-[0.92] whitespace-nowrap ${cls}`}
                style={{ fontSize: "clamp(1.85rem, 11.5vw, 8.5rem)" }}
              >
                {text}
              </motion.span>
            </div>
          ))}
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: E }}
              className="text-base leading-relaxed mb-8 text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.25, ease: E }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Magnetic strength={0.15}>
                <Link
                  to="/katalog"
                  className="group relative flex items-center justify-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-600/20"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("hero.btn")}</span>
                  <ArrowRight size={14} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </Magnetic>

              <Magnetic strength={0.15}>
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-slate-200 dark:border-white/[0.08]"
                >
                  <MessageCircle size={14} className="text-emerald-500 shrink-0" />
                  WhatsApp
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* Живой индикатор — короткий, честный факт, не дублирует блок статистики ниже по странице */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4, ease: E }}
            className="hidden lg:flex items-center gap-3 pb-1"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono tracking-widest uppercase text-foreground/50">
              {t("hero.liveStat")}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

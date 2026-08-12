"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Magnetic from "./ui/magnetic"

const E = [0.22, 1, 0.36, 1] as const

// Третий заход на Hero. Второй (типографика на всю ширину, blueprint-сетка
// + crosshair-рамка, шрифт Unbounded) решил проблему переполнения на
// 1920×1200, но два новых замечания: (1) Unbounded не несёт казахских
// букв Ә/Ғ/Қ/Ң/Ө/Ұ/Ү/Һ/І — браузер молча подменяет их системным шрифтом,
// получается разнобой прямо внутри одного слова ("ӘРБІР", "ҚОРҒАУ"); (2)
// сетка на фоне и уголки-прицелы читаются как шаблонный "тактический"
// декор, а не как деталь бренда. Здесь: заголовок набран Manrope (тот же
// шрифт, что и весь текст сайта — глифы кириллицы+казахского уже
// проверены на теле страницы), регистр обычный, а не капс — тише и
// дороже; фон вместо сетки — один мягкий градиентный блик у бренд-красного,
// который слегка смещается и гаснет при скролле (та же логика
// useScroll/useTransform, что и раньше, просто без сканирующей линии).
export const Hero = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background text-foreground border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      {/* Единственный акцент фона: мягкое пятно бренд-красного за заголовком. */}
      <motion.div
        className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[620px] max-w-[140vw] rounded-full bg-red-600/[0.10] dark:bg-red-600/[0.14] blur-[120px] pointer-events-none"
        style={{ y: glowY, opacity: glowOpacity }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 sm:px-10 py-32 lg:py-0 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: E }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-white/[0.1] bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm mb-8"
        >
          <ShieldCheck size={13} className="text-red-500 shrink-0" />
          <span className="text-[13px] font-medium text-foreground/70">
            {t("hero.locationLabel")}
          </span>
        </motion.div>

        <h1 className="mb-7 flex flex-col select-none" style={{ letterSpacing: "-0.025em" }}>
          <span className="sr-only">Видеонаблюдение в Актау — Установка систем безопасности под ключ</span>
          {[
            { text: t("hero.titleLine1"), cls: "text-foreground", delay: 0.28 },
            { text: t("hero.titleLine2"), cls: "text-foreground/40", delay: 0.38 },
            { text: t("hero.titleLine3"), cls: "text-red-600 dark:text-red-500", delay: 0.48 },
          ].map(({ text, cls, delay }) => (
            <div key={text} className="overflow-hidden">
              <motion.span
                initial={{ y: "105%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.8, ease: E, delay }}
                className={`block font-extrabold leading-[1.02] whitespace-nowrap ${cls}`}
                style={{ fontFamily: "'Manrope', sans-serif", fontSize: "clamp(2.25rem, 8vw, 5.25rem)" }}
              >
                {text}
              </motion.span>
            </div>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62, ease: E }}
          className="max-w-lg text-base sm:text-lg leading-relaxed mb-10 text-muted-foreground"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.74, ease: E }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          <Magnetic strength={0.15}>
            <Link
              to="/katalog"
              className="group flex items-center justify-center gap-2 px-7 h-12 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <span>{t("hero.btn")}</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </Magnetic>

          <Magnetic strength={0.15}>
            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 text-sm font-medium rounded-lg transition-colors duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] text-foreground/80 hover:text-foreground border border-slate-200 dark:border-white/[0.1]"
            >
              <MessageCircle size={15} className="text-emerald-500 shrink-0" />
              WhatsApp
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9, ease: E }}
          className="flex items-center gap-2"
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-xs text-muted-foreground/70">
            {t("hero.liveStat")}
          </span>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import Magnetic from "./ui/magnetic"

const E = [0.22, 1, 0.36, 1] as const

// Четвёртый заход. Третий (по центру, мягкое красное пятно-блик за
// заголовком, Manrope extrabold, pill-бейдж с иконкой) решил проблему с
// казахскими глифами, но по ощущениям — тот же жанр SaaS-лендинга, что и
// у всех: центр, размытое цветное пятно, бейдж-таблетка, кнопка-пилюля.
// Здесь ставка на типографику как единственный приём: заголовок — Source
// Serif 4 (проверен на казахской раскладке отдельным тестом, см. историю
// правок), набран обычным регистром без капса; композиция сдвинута влево
// внутри широкого контейнера — вместо центрирования нарочитая асимметрия
// (текстовый блок ~половины ширины, справа тишина). Фон — чистый, без
// пятен и сеток. Кнопка вторичного действия — это якорь на секцию #cta
// (тот же приём, что уже используется в футере), а не ещё одна кнопка:
// одно сплошное действие + одна тихая ссылка читается спокойнее, чем два
// одинаковых по весу CTA. Анимация — только заход при загрузке
// (staggered fade/slide), без scroll-linked эффектов: сдержанность здесь
// важнее ещё одного скролл-трюка.
export const Hero = () => {
  const { t } = useTranslation()

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex items-center bg-background text-foreground border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-10 py-28 lg:py-0">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: E }}
            className="flex items-center gap-3 mb-7"
          >
            <span className="w-6 h-px bg-red-600/70 shrink-0" />
            <span className="text-[13px] tracking-wide text-muted-foreground">
              {t("hero.locationLabel")}
            </span>
          </motion.div>

          <h1 className="mb-7 flex flex-col select-none" style={{ letterSpacing: "-0.01em" }}>
            <span className="sr-only">Видеонаблюдение в Актау — Установка систем безопасности под ключ</span>
            {[
              { text: t("hero.titleLine1"), cls: "text-foreground", delay: 0.2 },
              { text: t("hero.titleLine2"), cls: "text-foreground", delay: 0.32 },
              { text: t("hero.titleLine3"), cls: "text-red-600 dark:text-red-500", delay: 0.44 },
            ].map(({ text, cls, delay }) => (
              <div key={text} className="overflow-hidden">
                <motion.span
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.7, ease: E, delay }}
                  className={`block font-semibold leading-[1.08] whitespace-nowrap ${cls}`}
                  style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(2.5rem, 5.2vw, 4.5rem)" }}
                >
                  {text}
                </motion.span>
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.56, ease: E }}
            className="text-base leading-relaxed mb-10 text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.68, ease: E }}
            className="flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <Magnetic strength={0.12}>
              <Link
                to="/katalog"
                className="group inline-flex items-center gap-2 h-12 px-7 rounded-md text-[15px] font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <span>{t("hero.btn")}</span>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Magnetic>

            <a
              href="#cta"
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-foreground/70 hover:text-foreground transition-colors duration-200"
            >
              <span className="relative">
                {t("hero.btnSecondary")}
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </span>
              <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform duration-200" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

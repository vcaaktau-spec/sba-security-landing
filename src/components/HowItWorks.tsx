"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion, useScroll } from "framer-motion"

const E = [0.22, 1, 0.36, 1] as const
const SERIF = "'Source Serif 4', serif"

interface Step {
  step: string
  title: string
  description: string
}

function StepRow({ step }: { step: Step }) {
  return (
    <div className="group relative pl-10 sm:pl-16 py-10 lg:py-14">
      {/* Узел на треке */}
      <div className="absolute left-[-4px] top-12 lg:top-14 w-[9px] h-[9px] rounded-full bg-background border-2 border-slate-300 dark:border-white/20 transition-all duration-400 group-hover:border-red-600 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.35)] z-10" />

      {/* Фантомная цифра — водяной знак позади заголовка, а не в отдельной колонке */}
      <motion.span
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: E }}
        aria-hidden
        className="pointer-events-none select-none absolute -top-3 sm:-top-5 left-6 sm:left-14 font-semibold text-foreground/[0.05] dark:text-white/[0.045] group-hover:text-red-600/[0.08] dark:group-hover:text-red-500/[0.09] transition-colors duration-500 tabular-nums"
        style={{ fontFamily: SERIF, fontSize: "clamp(4.5rem, 9vw, 7.5rem)", lineHeight: 1 }}
      >
        {step.step}
      </motion.span>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: E, delay: 0.1 }}
        className="relative max-w-xl"
      >
        <h3
          className="font-semibold text-foreground mb-3 transition-transform duration-400 group-hover:translate-x-1"
          style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem, 1.8vw, 1.75rem)" }}
        >
          {step.title}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

// Второй заход. Первый выглядел уже неплохо (реальная последовательность
// шагов — единственное место на странице, где нумерация 01-02-03-04
// оправдана содержанием), но нёс тот же шаблонный груз, что и остальные
// секции до редизайна: пилюля-бейдж, иконка в скруглённом квадрате с
// рамкой, отдельная колонка под цифру+иконку. Здесь: иконки убраны
// совсем (пусть у секции будет свой почерк, не как в "Преимуществах"),
// фантомная цифра — Source Serif 4, наложена водяным знаком за
// заголовком вместо отдельной колонки, а вдоль трека вместе с уже
// существующей заливкой прогресса добавлена бегущая точка — движется по
// вертикали синхронно со скроллом, как индикатор чтения в лонгриде.
export const HowItWorks = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const steps: Step[] = [
    { step: "01", title: t("how.s1_title"), description: t("how.s1_desc") },
    { step: "02", title: t("how.s2_title"), description: t("how.s2_desc") },
    { step: "03", title: t("how.s3_title"), description: t("how.s3_desc") },
    { step: "04", title: t("how.s4_title"), description: t("how.s4_desc") },
  ]

  return (
    <section ref={sectionRef} id="howItWorks" className="relative py-24 lg:py-36 border-b border-slate-200/60 dark:border-white/[0.06]">
      <div className="mx-auto w-full max-w-[1000px] px-6 sm:px-10">

        {/* Header */}
        <div className="flex flex-col mb-20 lg:mb-28">
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: E }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-6 h-px bg-red-600/70 shrink-0" />
            <span className="text-[13px] tracking-wide text-muted-foreground">
              {t("how.eyebrow", "Этапы работы")}
            </span>
          </motion.div>

          <motion.h2
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: E }}
            className="font-semibold leading-[1.15] text-foreground max-w-2xl"
            style={{ fontFamily: SERIF, fontSize: "clamp(1.85rem, 3.4vw, 2.75rem)", letterSpacing: "-0.01em" }}
          >
            {t("how.title1")}
            <span className="text-red-600 dark:text-red-500">{t("how.title2")}</span>
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-8 bottom-8 left-0 w-px">
            <div className="absolute inset-0 bg-slate-200 dark:bg-white/[0.06]" />
            <motion.div style={{ scaleY: scrollYProgress }} className="absolute inset-0 bg-red-600 origin-top" />
            <motion.div
              style={{ top: scrollYProgress }}
              className="absolute -left-[3.5px] w-[8px] h-[8px] rounded-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            />
          </div>

          <div className="flex flex-col">
            {steps.map((step) => (
              <StepRow key={step.step} step={step} />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: E }}
          className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/[0.06] text-[15px] text-muted-foreground"
          style={{ fontFamily: SERIF, fontStyle: "italic" }}
        >
          {t("how.subtitle")}
        </motion.p>

      </div>
    </section>
  )
}

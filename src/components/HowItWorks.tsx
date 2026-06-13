"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { DotMatrix } from "./DotMatrix"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Step {
  step: string
  Icon: React.ElementType
  title: string
  description: string
}

/* ── Single step row ── */
function StepRow({ step, index, isLast }: { step: Step; index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })

  return (
    <div ref={ref}>
      {/* Animated divider */}
      <div className="h-px bg-white/[0.06] relative overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-left"
          style={{
            background: "linear-gradient(90deg, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0.15) 60%, transparent 100%)",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.85, ease, delay: index * 0.08 }}
        />
      </div>

      {/* Content row */}
      <div className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] lg:grid-cols-[100px_1fr] gap-4 lg:gap-10 py-9 lg:py-12 items-start">

        {/* Large step number (decorative watermark) */}
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease, delay: index * 0.08 + 0.12 }}
          className="text-[3rem] sm:text-[4rem] lg:text-[5.5rem] font-black text-red-500/[0.12] tracking-tighter leading-none select-none tabular-nums pt-1"
          aria-hidden
        >
          {step.step}
        </motion.div>

        {/* Icon + text */}
        <div className="flex items-start gap-4 sm:gap-6 lg:gap-8">

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, ease, delay: index * 0.08 + 0.18 }}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-red-500/10 border border-red-500/[0.22] flex items-center justify-center text-red-400 shrink-0"
          >
            <step.Icon size={22} />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease, delay: index * 0.08 + 0.22 }}
          >
            <div className="text-[10px] font-mono font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">
              Шаг {step.step}
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 leading-snug">
              {step.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground/70 leading-relaxed max-w-xl">
              {step.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider for the last step */}
      {isLast && (
        <div className="h-px bg-white/[0.06] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 origin-left"
            style={{
              background: "linear-gradient(90deg, rgba(239,68,68,0.5) 0%, rgba(239,68,68,0.15) 60%, transparent 100%)",
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.85, ease, delay: index * 0.08 + 0.3 }}
          />
        </div>
      )}
    </div>
  )
}

/* ── Section ── */
export const HowItWorks = () => {
  const { t } = useTranslation()
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })

  const steps: Step[] = [
    { step: "01", Icon: PhoneCall,     title: t("how.s1_title"), description: t("how.s1_desc") },
    { step: "02", Icon: ClipboardList, title: t("how.s2_title"), description: t("how.s2_desc") },
    { step: "03", Icon: Truck,         title: t("how.s3_title"), description: t("how.s3_desc") },
    { step: "04", Icon: Settings,      title: t("how.s4_title"), description: t("how.s4_desc") },
  ]

  return (
    <section id="howItWorks" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
              className="text-[10px] font-mono font-bold text-red-400/60 uppercase tracking-[0.25em] mb-4"
            >
              — Процесс работы
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.05]"
            >
              {t("how.title1")}{" "}
              <span className="text-red-500">{t("how.title2")}</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="shrink-0"
          >
            <DotMatrix cols={10} rows={4} className="text-white/20" />
          </motion.div>
        </div>

        {/* Step rows */}
        <div>
          {steps.map((step, i) => (
            <StepRow
              key={step.step}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease }}
          className="mt-10 flex items-center gap-3 text-sm text-muted-foreground/40"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70 shrink-0" />
          {t("how.subtitle")}
        </motion.div>

      </div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  )
}

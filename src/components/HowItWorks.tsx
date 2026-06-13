"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings } from "lucide-react"
import { motion, useInView } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Step {
  step: string
  Icon: React.ElementType
  title: string
  description: string
}

function StepCard({ step, index, total }: { step: Step; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15%" })
  const isLast = index === total - 1

  return (
    <div ref={ref} className="relative flex flex-col items-center">

      {/* ── Connector line (half from left edge to icon center + half from icon center to right edge) ── */}
      <div className="absolute top-[27px] inset-x-0 pointer-events-none hidden lg:block">
        {/* Left half-line (except first item) */}
        {index > 0 && (
          <div className="absolute top-0 left-0 right-1/2 h-px bg-white/[0.07]">
            <motion.div
              className="h-full bg-red-500/70 origin-right"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, ease, delay: index * 0.15 }}
            />
          </div>
        )}
        {/* Right half-line (except last item) */}
        {!isLast && (
          <div className="absolute top-0 left-1/2 right-0 h-px bg-white/[0.07]">
            <motion.div
              className="h-full bg-red-500/70 origin-left"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, ease, delay: index * 0.15 + 0.1 }}
            />
          </div>
        )}
      </div>

      {/* ── Mobile: vertical left-edge line ── */}
      {!isLast && (
        <div className="absolute top-[54px] left-[27px] w-px bottom-0 bg-white/[0.07] lg:hidden">
          <motion.div
            className="w-full bg-red-500/60 origin-top"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          />
        </div>
      )}

      {/* ── Icon circle ── */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.55, ease, delay: index * 0.12 }}
        className="relative z-10 shrink-0"
      >
        <motion.div
          animate={inView ? {
            boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.35)", "0 0 12px rgba(239,68,68,0.2)"],
          } : {}}
          transition={{ duration: 1.2, delay: index * 0.12 + 0.3 }}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
            inView
              ? "bg-red-500/15 border-red-500/40 text-red-400"
              : "bg-white/[0.04] border-white/[0.08] text-muted-foreground"
          }`}
        >
          <step.Icon size={22} />
        </motion.div>
      </motion.div>

      {/* ── Content card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease, delay: index * 0.12 + 0.18 }}
        className="mt-6 w-full text-center lg:text-left"
      >
        <div className="text-[10px] font-mono font-bold text-muted-foreground/35 uppercase tracking-[0.2em] mb-2.5">
          {step.step}
        </div>
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">
          {step.title}
        </h3>
        <p className="text-sm text-muted-foreground/80 leading-relaxed">
          {step.description}
        </p>
      </motion.div>
    </div>
  )
}

export const HowItWorks = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })

  const steps: Step[] = [
    { step: "01", Icon: PhoneCall,     title: t("how.s1_title"), description: t("how.s1_desc") },
    { step: "02", Icon: ClipboardList, title: t("how.s2_title"), description: t("how.s2_desc") },
    { step: "03", Icon: Truck,         title: t("how.s3_title"), description: t("how.s3_desc") },
    { step: "04", Icon: Settings,      title: t("how.s4_title"), description: t("how.s4_desc") },
  ]

  return (
    <section id="howItWorks" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.1] mb-5"
          >
            {t("how.title1")}{" "}
            <span className="text-red-500">{t("how.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-muted-foreground"
          >
            {t("how.subtitle")}
          </motion.p>
        </div>

        {/* Steps — desktop: 4-col row | mobile: vertical stack */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
          {steps.map((step, i) => (
            <StepCard key={step.step} step={step} index={i} total={steps.length} />
          ))}
        </div>

      </div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  )
}

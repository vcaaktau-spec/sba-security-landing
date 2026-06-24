"use client"

import React, { useRef } from "react"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings } from "lucide-react"
import { motion, useScroll, useInView } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Step {
  step: string
  Icon: React.ElementType
  title: string
  description: string
}

function StepRow({ step }: { step: Step }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <div ref={ref} className="relative pl-12 sm:pl-16 lg:pl-28 py-10 lg:py-16 group">
      
      {/* Node Indicator */}
      <div className="absolute left-[-5px] top-12 lg:top-20 w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 z-10 transition-colors duration-500 group-hover:border-red-500" />

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-6 lg:gap-12 items-start">
        
        {/* Large step number & Icon */}
        <div className="flex items-center gap-6 lg:flex-col lg:items-start lg:gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease, delay: 0.1 }}
            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-sm"
          >
            <step.Icon size={24} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="text-[3rem] lg:text-[4.5rem] font-black text-slate-200 dark:text-white/[0.04] tracking-tighter leading-none select-none tabular-nums"
            aria-hidden
          >
            {step.step}
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          className="pt-2"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
            {step.title}
          </h3>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {step.description}
          </p>
        </motion.div>

      </div>
    </div>
  )
}

export const HowItWorks = () => {
  const { t } = useTranslation()
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const steps: Step[] = [
    { step: "01", Icon: PhoneCall,     title: t("how.s1_title"), description: t("how.s1_desc") },
    { step: "02", Icon: ClipboardList, title: t("how.s2_title"), description: t("how.s2_desc") },
    { step: "03", Icon: Truck,         title: t("how.s3_title"), description: t("how.s3_desc") },
    { step: "04", Icon: Settings,      title: t("how.s4_title"), description: t("how.s4_desc") },
  ]

  return (
    <section ref={sectionRef} id="howItWorks" className="relative py-24 lg:py-40 border-b border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-background">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1000px] px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="flex flex-col mb-20 lg:mb-32">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] max-w-3xl" style={{ textWrap: "balance" } as React.CSSProperties}
          >
            {t("how.title1")}{" "}
            <span className="text-red-600 dark:text-red-500">{t("how.title2")}</span>
          </motion.h2>
        </div>

        {/* Timeline Area */}
        <div className="relative">
          {/* Background Track */}
          <div className="absolute top-8 bottom-8 left-0 w-px bg-slate-200 dark:bg-white/[0.06]" />
          
          {/* Scroll Animated Progress Line */}
          <motion.div 
            style={{ scaleY: scrollYProgress }}
            className="absolute top-8 bottom-8 left-0 w-px bg-gradient-to-b from-red-500 via-rose-500 to-red-600 origin-top z-10"
          />

          {/* Steps */}
          <div className="flex flex-col">
            {steps.map((step) => (
              <StepRow
                key={step.step}
                step={step}
              />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease }}
          className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center gap-3 text-sm font-mono tracking-wide text-slate-500 dark:text-muted-foreground/50 uppercase"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          {t("how.subtitle")}
        </motion.div>

      </div>
    </section>
  )
}

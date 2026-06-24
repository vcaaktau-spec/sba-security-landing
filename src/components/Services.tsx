"use client"

import React, { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Shield, Network, Laptop, FileText, Check } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "./ui/badge"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Service {
  id: string
  Icon: React.ElementType
  accentColor: string
  glowColor: string
  title: string
  subtitle: string
  description: string
  features: string[]
}

function ServiceBlock({
  service,
  index,
  setActive,
}: {
  service: Service
  index: number
  setActive: (idx: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Trigger active state when block is near the vertical center
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" })

  useEffect(() => {
    if (inView) {
      setActive(index)
    }
  }, [inView, index, setActive])

  return (
    <div ref={ref} className="relative py-16 sm:py-24 first:pt-0 last:pb-0">
      {/* Mobile Title (hidden on desktop where sticky side handles it) */}
      <div className="lg:hidden mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-sm font-bold tracking-widest text-slate-400">
            {service.id}
          </span>
          <div className={`p-2.5 rounded-xl border ${service.accentColor}`}>
            <service.Icon size={20} />
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          {service.title}
        </h3>
      </div>

      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
        {service.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {service.features.map((feat, fi) => (
          <div
            key={fi}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.01] hover:bg-white/80 dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
              <Check size={10} strokeWidth={3} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[14px] text-slate-700 dark:text-slate-300 font-medium">
              {feat}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Services = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const services: Service[] = [
    {
      id: "01",
      Icon: Shield,
      accentColor: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
      glowColor: "rgba(239, 68, 68, 0.15)",
      title: t("services.s1_title"),
      subtitle: t("services.s1_sub"),
      description: t("services.s1_desc"),
      features: [t("services.s1_f1"), t("services.s1_f2"), t("services.s1_f3"), t("services.s1_f4")],
    },
    {
      id: "02",
      Icon: Network,
      accentColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
      glowColor: "rgba(59, 130, 246, 0.15)",
      title: t("services.s2_title"),
      subtitle: t("services.s2_sub"),
      description: t("services.s2_desc"),
      features: [t("services.s2_f1"), t("services.s2_f2"), t("services.s2_f3"), t("services.s2_f4")],
    },
    {
      id: "03",
      Icon: Laptop,
      accentColor: "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20",
      glowColor: "rgba(139, 92, 246, 0.15)",
      title: t("services.s3_title"),
      subtitle: t("services.s3_sub"),
      description: t("services.s3_desc"),
      features: [t("services.s3_f1"), t("services.s3_f2"), t("services.s3_f3"), t("services.s3_f4")],
    },
    {
      id: "04",
      Icon: FileText,
      accentColor: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
      glowColor: "rgba(245, 158, 11, 0.15)",
      title: t("services.s4_title"),
      subtitle: t("services.s4_sub"),
      description: t("services.s4_desc"),
      features: [t("services.s4_f1"), t("services.s4_f2"), t("services.s4_f3"), t("services.s4_f4")],
    },
  ]

  const activeService = services[activeIndex]
  const ActiveIcon = activeService.Icon

  return (
    <section id="services" className="relative py-24 lg:py-40 border-b border-slate-200/60 dark:border-white/[0.06] bg-slate-50 dark:bg-[#06080c]">
      <div className="absolute top-0 inset-x-0 section-divider" />

      {/* Global Ambient Glow connected to active service */}
      <motion.div
        className="absolute top-1/2 left-0 w-full h-[800px] -translate-y-1/2 rounded-full blur-[120px] pointer-events-none opacity-40 dark:opacity-20 transition-colors duration-1000 ease-in-out"
        style={{ background: `radial-gradient(ellipse at center, ${activeService.glowColor} 0%, transparent 60%)` }}
      />

      <div className="mx-auto w-full max-w-[1300px] px-6 lg:px-12 relative z-10">
        
        {/* Main Section Header */}
        <div className="mb-20 max-w-2xl">
          <Badge variant="outline" className="mb-6 font-mono tracking-widest uppercase border-red-500/30 text-red-600 dark:text-red-500 bg-red-500/5">
            // Оперативный профиль
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]" style={{ textWrap: "balance" } as React.CSSProperties}>
            {t("services.title1")}{" "}
            <span className="text-red-600 dark:text-red-500">
              {t("services.title2")}
            </span>
          </h2>
        </div>

        {/* Sticky Scroll Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left: Sticky Display */}
          <div className="hidden lg:block w-5/12 shrink-0">
            <div className="sticky top-32 flex flex-col h-[70vh] justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease }}
                  className="flex flex-col"
                >
                  <div className="flex items-center gap-6 mb-8">
                    <span className="font-mono text-7xl font-black text-slate-200 dark:text-white/[0.04] select-none tracking-tighter">
                      {activeService.id}
                    </span>
                    <div className={`p-4 rounded-2xl border ${activeService.accentColor}`}>
                      <ActiveIcon size={32} />
                    </div>
                  </div>
                  
                  <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">
                    {activeService.subtitle}
                  </div>
                  
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {activeService.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Scrolling Content */}
          <div className="w-full lg:w-7/12 flex flex-col">
            {/* Guide line for desktop */}
            <div className="hidden lg:block absolute left-[41.666%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-slate-200 dark:via-white/[0.06] to-transparent -translate-x-12" />

            <div className="pb-[20vh] lg:pb-[50vh]">
              {services.map((service, i) => (
                <ServiceBlock
                  key={service.id}
                  service={service}
                  index={i}
                  setActive={setActiveIndex}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

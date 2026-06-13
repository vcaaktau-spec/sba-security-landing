"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { Shield, Network, Laptop, FileText, Check } from "lucide-react"
import { motion, useInView } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Service {
  id: string
  Icon: React.ElementType
  accentColor: string
  title: string
  subtitle: string
  description: string
  features: string[]
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12%" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease, delay: index * 0.1 }}
      className="group relative bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.08] rounded-2xl p-7 sm:p-8 flex flex-col gap-6 hover:border-white/[0.16] transition-all duration-500 overflow-hidden"
    >
      {/* Hover gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ${service.accentColor}`} />

      {/* Top row: number + icon */}
      <div className="flex items-start justify-between z-10">
        <span className="text-[11px] font-mono font-bold text-muted-foreground/30 tracking-[0.25em] uppercase">
          {service.id}
        </span>
        <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 group-hover:border-red-500/35 transition-all duration-500">
          <service.Icon size={20} />
        </div>
      </div>

      {/* Title block */}
      <div className="z-10">
        <div className="text-[10px] font-mono font-semibold text-muted-foreground/50 uppercase tracking-widest mb-2">
          {service.subtitle}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-tight">
          {service.title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/80 leading-relaxed z-10">
        {service.description}
      </p>

      {/* Feature list */}
      <div className="mt-auto grid grid-cols-1 gap-2 z-10">
        {service.features.map((feat, fi) => (
          <div key={fi} className="flex items-center gap-2.5 text-[13px] text-foreground/70">
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Check size={9} strokeWidth={3} className="text-emerald-400" />
            </div>
            {feat}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export const Services = () => {
  const { t } = useTranslation()
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })

  const services: Service[] = [
    {
      id: "01",
      Icon: Shield,
      accentColor: "bg-gradient-to-br from-red-500/[0.06] to-transparent",
      title:       t("services.s1_title"),
      subtitle:    t("services.s1_sub"),
      description: t("services.s1_desc"),
      features:    [t("services.s1_f1"), t("services.s1_f2"), t("services.s1_f3"), t("services.s1_f4")],
    },
    {
      id: "02",
      Icon: Network,
      accentColor: "bg-gradient-to-br from-blue-500/[0.05] to-transparent",
      title:       t("services.s2_title"),
      subtitle:    t("services.s2_sub"),
      description: t("services.s2_desc"),
      features:    [t("services.s2_f1"), t("services.s2_f2"), t("services.s2_f3"), t("services.s2_f4")],
    },
    {
      id: "03",
      Icon: Laptop,
      accentColor: "bg-gradient-to-br from-violet-500/[0.05] to-transparent",
      title:       t("services.s3_title"),
      subtitle:    t("services.s3_sub"),
      description: t("services.s3_desc"),
      features:    [t("services.s3_f1"), t("services.s3_f2"), t("services.s3_f3"), t("services.s3_f4")],
    },
    {
      id: "04",
      Icon: FileText,
      accentColor: "bg-gradient-to-br from-amber-500/[0.05] to-transparent",
      title:       t("services.s4_title"),
      subtitle:    t("services.s4_sub"),
      description: t("services.s4_desc"),
      features:    [t("services.s4_f1"), t("services.s4_f2"), t("services.s4_f3"), t("services.s4_f4")],
    },
  ]

  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.1] mb-5"
          >
            {t("services.title1")}{" "}
            <span className="text-red-500">{t("services.title2")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-muted-foreground"
          >
            {t("services.subtitle")}
          </motion.p>
        </div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

      </div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  )
}

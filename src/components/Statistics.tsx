"use client"

import { useRef, useEffect, useState } from "react"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const Statistics = () => {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const stats = [
    { quantity: 5000, suffix: "+",  label: t("stats.stat1"), icon: Camera,    animated: true,  delay: 0.05 },
    { quantity: 300,  suffix: "+",  label: t("stats.stat2"), icon: ShieldCheck,animated: true,  delay: 0.12 },
    { quantity: 10,   suffix: "+",  label: t("stats.stat3"), icon: Award,      animated: false, delay: 0.18 },
    { quantity: 24,   suffix: "/7", label: t("stats.stat4"), icon: Headset,    animated: false, delay: 0.24 },
  ]

  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.15 })
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  return (
    <section
      id="statistics"
      ref={containerRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle top divider */}
      <div className="absolute top-0 inset-x-0 section-divider" />

      <motion.div
        ref={inViewRef}
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6"
      >

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.1] mb-5"
          >
            {t("stats.title1")}{" "}
            <span className="text-red-500">{t("stats.title2")}</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t("stats.desc") }}
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease, delay: stat.delay }}
              className="group relative bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-300 dark:hover:border-white/[0.15] hover:bg-white dark:hover:bg-white/[0.03] transition-all duration-400 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none"
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/[0.03] to-transparent pointer-events-none" />

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-400 bg-slate-50 dark:bg-white/5 border-slate-200/50 dark:border-white/10 group-hover:bg-red-500/10 group-hover:border-red-500/20">
                <stat.icon size={18} className="text-slate-500 dark:text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-400" />
              </div>

              {/* Counter */}
              <div className="flex items-baseline gap-0.5 font-black tracking-tight text-foreground leading-none tabular-nums">
                <span className="text-[42px] sm:text-[48px]">
                  {stat.animated ? (
                    inView ? (
                      <CountUp start={0} end={stat.quantity} duration={2.2} useEasing separator=" " />
                    ) : <span>0</span>
                  ) : stat.quantity}
                </span>
                <span className="text-[22px] text-red-500 ml-0.5">{stat.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-[11px] font-mono font-bold text-slate-500/85 dark:text-muted-foreground/60 uppercase tracking-[0.08em] leading-tight">
                {stat.label}
              </p>

              {/* Live dot */}
              <div className="absolute top-4 right-4">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-red-500 group-hover:shadow-[0_0_6px_rgba(239,68,68,0.6)] transition-all duration-400" />
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  )
}

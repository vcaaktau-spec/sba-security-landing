"use client"

import { useRef, useEffect, useState } from "react"
import CountUp from "react-countup"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

export const Statistics = () => {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const stats = [
    { quantity: 5000, suffix: "+", descriptionKey: "stats.stat1", icon: Camera, isAnimated: true, delay: 0.1, status: "SYS_ACTIVE" },
    { quantity: 300, suffix: "+", descriptionKey: "stats.stat2", icon: ShieldCheck, isAnimated: true, delay: 0.2, status: "SEC_GUARANTEED" },
    { quantity: 10, suffix: "+", descriptionKey: "stats.stat3", icon: Award, isAnimated: false, delay: 0.3, status: "EXP_VERIFIED" },
    { quantity: 24, suffix: "/7", descriptionKey: "stats.stat4", icon: Headset, isAnimated: false, delay: 0.4, status: "SUPPORT_ONLINE" },
  ]

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["6%", "-6%"])
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section 
      id="statistics" 
      ref={containerRef} 
      className="magnet-section relative min-h-[80vh] flex flex-col justify-center py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      {/* HUD scanning grid background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-35">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/5 to-transparent" />
      </div>

      <motion.div 
        ref={inViewRef} 
        style={{ y: contentY }} 
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6"
      >
        
        {/* HEADER SECTION */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-[32px] sm:text-[46px] lg:text-[56px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("stats.title1", "Безопасность вашего бизнеса")}
            </span>
            <span className="block w-full text-red-600 mt-2">
              {t("stats.title2", "наша зона ответственности")}
            </span>
          </h2>

          <div 
            className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center"
            dangerouslySetInnerHTML={{ __html: t("stats.desc", "Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.") }}
          />
        </div>

        {/* METRICS HUD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: stat.delay }}
              className="group relative bg-card/30 backdrop-blur-md border border-border/40 hover:border-red-500/30 rounded-[20px] p-6 flex flex-col justify-between min-h-[180px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-500"
            >
              {/* Corner brackets */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
              </div>

              {/* Upper row: Icon & Live status indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                  <stat.icon size={22} />
                </div>
                <span className="text-[9px] font-mono text-muted-foreground/60 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500/40 group-hover:bg-red-500 animate-pulse" />
                  {stat.status}
                </span>
              </div>

              {/* Middle row: Large Counter */}
              <div>
                <div className="flex items-baseline font-black tracking-tighter text-foreground text-[44px] sm:text-[50px] leading-none mb-2 tabular-nums">
                  {stat.isAnimated ? (
                    inView ? (
                      <CountUp start={0} end={stat.quantity} duration={2.5} useEasing={true} separator=" " />
                    ) : (
                      <span>0</span>
                    )
                  ) : (
                    <span>{stat.quantity}</span>
                  )}
                  <span className="text-red-600 text-[24px] sm:text-[28px] ml-0.5">{stat.suffix}</span>
                </div>

                {/* Lower row: Description */}
                <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-[0.1em] mt-1">
                  {t(stat.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  )
}
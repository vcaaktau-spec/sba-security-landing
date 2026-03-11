"use client"

import { useRef, useEffect, useState } from "react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"

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
    { quantity: 5000, suffix: "+", descriptionKey: "stats.stat1", icon: Camera, isAnimated: true, delay: 0.1 },
    { quantity: 300, suffix: "+", descriptionKey: "stats.stat2", icon: ShieldCheck, isAnimated: true, delay: 0.2 },
    { quantity: 10, suffix: "+", descriptionKey: "stats.stat3", icon: Award, isAnimated: false, delay: 0.3 },
    { quantity: 24, suffix: "/7", descriptionKey: "stats.stat4", icon: Headset, isAnimated: false, delay: 0.4 },
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

  // Параллакс только для контента
  const contentYMobileSafe = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: smoothEase as any, delay }
    })
  }

  const flyInVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: smoothEase as any, delay }
    })
  }

  return (
    // Убрали bg-background, поставили bg-transparent
    <section 
      id="statistics" 
      ref={containerRef} 
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-transparent border-t border-border/10"
    >
      <motion.div 
        ref={inViewRef} 
        style={{ y: contentYMobileSafe }} 
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6"
      >
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Типографика */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <motion.span 
              custom={0.1} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-foreground"
            >
              {t("stats.title1", "Безопасность вашего бизнеса")}
            </motion.span>
            
            <motion.span 
              custom={0.3} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-red-600 mt-1 sm:mt-2"
            >
              {t("stats.title2", "наша зона ответственности")}
            </motion.span>
          </h2>

          <motion.div 
            custom={0.5} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center"
            dangerouslySetInnerHTML={{ __html: t("stats.desc", "Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.") }}
          />
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Вылетающие HUD-карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-12 relative before:absolute before:inset-x-0 before:-top-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border/30 before:to-transparent">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={stat.delay}
              variants={flyInVariants}
              initial="hidden" 
              animate={inView ? "visible" : "hidden"}
              className="group flex flex-col items-center sm:items-start text-center sm:text-left relative p-4"
            >
              {/* Декоративные углы захвата цели (HUD Corners) */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
              </div>

              <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-muted/50 border border-border/50 text-red-500 transition-all duration-500 group-hover:bg-red-600/10 group-hover:border-red-500/30 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] relative overflow-hidden">
                <stat.icon size={24} strokeWidth={2} className="relative z-10" />
              </div>

              <div className="flex items-baseline font-black tracking-tighter text-foreground text-[40px] sm:text-[48px] lg:text-[56px] mb-2 tabular-nums leading-none">
                {stat.isAnimated ? (
                  inView ? (
                    <CountUp start={0} end={stat.quantity} duration={3} useEasing={true} separator=" " />
                  ) : (
                    <span>0</span>
                  )
                ) : (
                  <span>{stat.quantity}</span>
                )}
                <span className="text-red-600 text-[24px] sm:text-[28px] lg:text-[32px] ml-1">{stat.suffix}</span>
              </div>

              <p className="text-[12px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-[0.1em] leading-snug mt-2">
                {t(stat.descriptionKey)}
              </p>

              {/* Разделитель на мобилках */}
              <div className="absolute -bottom-6 left-1/4 right-1/4 h-px bg-border/40 sm:hidden last:hidden" />
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  )
}
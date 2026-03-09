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

  // Определяем мобилку при загрузке, чтобы отключить тяжелый параллакс
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const stats = [
    { quantity: 5000, suffix: "+", descriptionKey: "stats.stat1", icon: Camera, isAnimated: true, delay: 0.2 },
    { quantity: 300, suffix: "+", descriptionKey: "stats.stat2", icon: ShieldCheck, isAnimated: true, delay: 0.1 },
    { quantity: 10, suffix: "+", descriptionKey: "stats.stat3", icon: Award, isAnimated: false, delay: 0.3 },
    { quantity: 24, suffix: "/7", descriptionKey: "stats.stat4", icon: Headset, isAnimated: false, delay: 0.15 },
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

  // Отключаем параллакс на мобилках (передаем статику)
  const bgYMobileSafe = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-10%", "10%"])
  const contentYMobileSafe = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const smoothEase = [0.22, 1, 0.36, 1]

  // === ВАЖНО: АНИМАЦИИ БЕЗ БЛЮРА ===
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
    <section 
      id="statistics" 
      ref={containerRef} 
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-background border-t border-border"
    >
      {/* === ОПТИМИЗИРОВАННЫЙ ФОН === */}
      <motion.div style={{ y: bgYMobileSafe }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Статичная сетка вместо сканера (0 FPS drop) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Шар скрыт на мобилках */}
        <div className="hidden md:block absolute w-[600px] h-[600px] bg-red-600/5 blur-[100px] rounded-full mix-blend-screen" />
      </motion.div>

      {/* === КОНТЕНТ === */}
      <motion.div 
        ref={inViewRef} 
        style={{ y: contentYMobileSafe }} 
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6"
      >
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Типографика */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6 flex flex-col items-center justify-center w-full">
            <motion.span 
              custom={0.2} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-foreground"
            >
              {t("stats.title1", "Безопасность вашего бизнеса")}
            </motion.span>
            
            <motion.span 
              custom={0.4} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-red-600 italic mt-1 sm:mt-2"
            >
              {t("stats.title2", "наша зона ответственности")}
            </motion.span>
          </h2>

          <motion.div 
            custom={0.6} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl text-center"
            dangerouslySetInnerHTML={{ __html: t("stats.desc", "Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.") }}
          />
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Вылетающие карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative before:absolute before:inset-x-0 before:-top-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={stat.delay}
              variants={flyInVariants}
              initial="hidden" 
              animate={inView ? "visible" : "hidden"}
              className="group flex flex-col items-center sm:items-start text-center sm:text-left relative"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 border border-border text-red-600 transition-all duration-500 group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white group-hover:-translate-y-1">
                <stat.icon size={22} strokeWidth={2} />
              </div>

              <div className="flex items-baseline font-black tracking-tighter text-foreground text-4xl sm:text-5xl lg:text-6xl mb-2 tabular-nums">
                {stat.isAnimated ? (
                  inView ? (
                    <CountUp start={0} end={stat.quantity} duration={3.5} useEasing={true} separator=" " />
                  ) : (
                    <span>0</span>
                  )
                ) : (
                  <span>{stat.quantity}</span>
                )}
                <span className="text-red-600 text-2xl sm:text-3xl lg:text-4xl ml-1">{stat.suffix}</span>
              </div>

              <p className="text-[13px] sm:text-sm font-semibold text-muted-foreground uppercase tracking-widest leading-snug mt-1">
                {t(stat.descriptionKey)}
              </p>

              <div className="absolute -bottom-4 left-1/4 right-1/4 h-px bg-border sm:hidden opacity-50 last:hidden" />
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  )
}
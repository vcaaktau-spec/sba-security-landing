"use client"

import { useRef } from "react"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"

export const Statistics = () => {
  const { t } = useTranslation()

  // Добавили кастомный delay для каждой карточки, чтобы они вылетали вразнобой
  const stats = [
    { quantity: 5000, suffix: "+", descriptionKey: "stats.stat1", icon: Camera, isAnimated: true, delay: 0.3 },
    { quantity: 300, suffix: "+", descriptionKey: "stats.stat2", icon: ShieldCheck, isAnimated: true, delay: 0.1 },
    { quantity: 10, suffix: "+", descriptionKey: "stats.stat3", icon: Award, isAnimated: false, delay: 0.4 },
    { quantity: 24, suffix: "/7", descriptionKey: "stats.stat4", icon: Headset, isAnimated: false, delay: 0.2 },
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

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])

  const smoothEase = [0.22, 1, 0.36, 1]

  // Варианты для текста (с блюром, так как их мало)
  const fadeVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  // Облегченные варианты вылета для карточек (БЕЗ blur, только transform - 0% нагрузки на CPU)
  const flyInVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.9, ease: smoothEase as any, delay }
    })
  }

  return (
    <section 
      id="statistics" 
      ref={containerRef} 
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-background"
    >
      {/* ПАРАЛЛАКС ФОН */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] bg-red-600/5 blur-[120px] rounded-full" />
        
        <motion.div
          animate={{ translateY: ["-100%", "1000%"] }} 
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        />
      </motion.div>

      {/* ПАРАЛЛАКС КОНТЕНТ */}
      <motion.div 
        ref={inViewRef} 
        style={{ y: contentY }} 
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6"
      >
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Типографика (Задержка увеличена, чтобы текст появлялся ПОСЛЕ карточек) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 flex flex-col items-center justify-center w-full">
            <motion.span 
              custom={0.6} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-center"
            >
              {t("stats.title1", "Безопасность вашего бизнеса")}
            </motion.span>
            
            <motion.span 
              custom={0.8} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="block w-full text-center text-red-600 drop-shadow-sm mt-1 sm:mt-2"
            >
              {t("stats.title2", "наша зона ответственности")}
            </motion.span>
          </h2>

          <motion.div 
            custom={1.1} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl text-center"
            dangerouslySetInnerHTML={{ __html: t("stats.desc", "Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.") }}
          />
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Вылетающие карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative before:absolute before:inset-x-0 before:-top-10 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={stat.delay} // Берем индивидуальную задержку из массива
              variants={flyInVariants} // Используем легкий flyIn
              initial="hidden" 
              animate={inView ? "visible" : "hidden"}
              className="group flex flex-col items-center sm:items-start text-center sm:text-left relative"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-red-600 transition-all duration-500 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <stat.icon size={22} strokeWidth={2} />
              </div>

              <div className="flex items-baseline font-black tracking-tighter text-foreground text-4xl sm:text-5xl lg:text-6xl mb-3">
                {stat.isAnimated ? (
                  inView ? (
                    <CountUp start={0} end={stat.quantity} duration={4} useEasing={true} separator=" " />
                  ) : (
                    <span>0</span>
                  )
                ) : (
                  <span>{stat.quantity}</span>
                )}
                <span className="text-red-600 text-2xl sm:text-3xl lg:text-4xl ml-1">{stat.suffix}</span>
              </div>

              <p className="text-sm font-medium text-muted-foreground tracking-wide leading-snug">
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
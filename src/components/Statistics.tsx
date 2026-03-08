"use client"

import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"

export const Statistics = () => {
  const { t } = useTranslation()

  const stats = [
    {
      quantity: 5000,
      suffix: "+",
      descriptionKey: "stats.stat1",
      icon: Camera
    },
    {
      quantity: 300,
      suffix: "+",
      descriptionKey: "stats.stat2",
      icon: ShieldCheck
    },
    {
      quantity: 10,
      suffix: "+",
      descriptionKey: "stats.stat3",
      icon: Award
    },
    {
      quantity: 24,
      suffix: "/7",
      descriptionKey: "stats.stat4",
      icon: Headset
    },
  ]

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15, 
  })

  // Ультра-плавные настройки
  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 1, ease: smoothEase as any, delay }
    })
  }

  return (
    <section 
      id="statistics" 
      ref={ref} 
      className="relative min-h-screen snap-start flex flex-col justify-center py-20 overflow-hidden bg-background"
    >
      {/* === ОПТИМИЗИРОВАННЫЙ BACKGROUND === */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
        
        {/* Статичное мягкое свечение */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/5 blur-[120px] rounded-full" />
        
        {/* GPU-Ускоренная линия сканирования */}
        <motion.div
          animate={{ translateY: ["-100%", "1000%"] }} // Используем transform вместо top
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.4)]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        
        {/* === ВЕРХНЯЯ ЧАСТЬ: Типографика === */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2 
            custom={0.1} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6"
          >
            {t("stats.title1", "Безопасность вашего бизнеса — ")} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              {t("stats.title2", "наша зона ответственности")}
            </span>
          </motion.h2>

          <motion.div 
            custom={0.3} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t("stats.desc", "Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.") }}
          />
        </div>

        {/* === НИЖНЯЯ ЧАСТЬ: Современный Bento Skeleton === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const baseDelay = 0.4 + (i * 0.1);

            return (
              <motion.div
                key={i}
                custom={baseDelay} 
                variants={cardVariants} 
                initial="hidden" 
                animate={inView ? "visible" : "hidden"}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.4, ease: smoothEase as any}}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-red-900/5 min-h-[220px]"
              >
                {/* Радиальный градиент при наведении (Apple style) */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Иконка в правом верхнем углу */}
                <div className="flex justify-end w-full relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-transform duration-500 group-hover:scale-110 group-hover:bg-red-500/20">
                    <stat.icon size={22} strokeWidth={2} />
                  </div>
                </div>

                <div className="relative z-10 mt-8">
                  {/* Анимированные цифры */}
                  <div className="flex items-baseline font-black tracking-tighter text-foreground text-5xl sm:text-6xl mb-2">
                    {inView ? (
                      <CountUp
                        start={0}
                        end={stat.quantity}
                        duration={3}
                        useEasing
                      />
                    ) : (
                      <span>0</span>
                    )}
                    <span className="text-red-600 text-3xl sm:text-4xl ml-1">{stat.suffix}</span>
                  </div>

                  {/* Описание */}
                  <p className="text-sm font-semibold text-muted-foreground tracking-wide">
                    {t(stat.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
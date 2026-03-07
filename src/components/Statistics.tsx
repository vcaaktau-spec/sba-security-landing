"use client"

import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"

interface StatsProps {
  quantity: number
  suffix?: string
  description: string
  icon: any
}

export const Statistics = () => {
  const stats: StatsProps[] = [
    {
      quantity: 5000,
      suffix: "+",
      description: "Установленных камер",
      icon: Camera
    },
    {
      quantity: 300,
      suffix: "+",
      description: "Объектов под защитой",
      icon: ShieldCheck
    },
    {
      quantity: 10,
      suffix: "+",
      description: "Лет опыта работы",
      icon: Award
    },
    {
      quantity: 24,
      suffix: "/7",
      description: "Поддержка клиентов",
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
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.4, ease: smoothEase as any, delay }
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  return (
    <section 
      id="statistics" 
      ref={ref} 
      className="relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-background"
    >
      {/* УНИКАЛЬНЫЙ BACKGROUND: Эффект сканера и глубокого свечения */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
        
        {/* Центральное свечение */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-600/5 blur-[150px] rounded-full" />
        
        {/* Медленная линия сканирования (Security Theme) */}
        <motion.div
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Централизованная кинематографичная типографика */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 lg:mb-24">

          <motion.h2 
            custom={0.1} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-8"
          >
            Безопасность вашего бизнеса — <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              наша зона ответственности
            </span>
          </motion.h2>

          <motion.div 
            custom={0.3} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            <p>
              Компания <strong>«Система безопасности Актау»</strong> — это более 10 лет опыта в проектировании, чистом монтаже и настройке систем видеонаблюдения. Мы не просто вешаем камеры, мы создаем безотказную инфраструктуру контроля.
            </p>
          </motion.div>
          
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Панорамный Bento Grid (4 в ряд) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => {
            const baseDelay = 0.5 + (i * 0.15); // Подправил задержку после удаления бейджа

            return (
              <motion.div
                key={i}
                custom={baseDelay} 
                variants={cardVariants} 
                initial="hidden" 
                animate={inView ? "visible" : "hidden"}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                }}
                transition={{ duration: 0.6, ease: smoothEase as any}}
                className="relative group bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-3xl p-8 overflow-hidden flex flex-col justify-between min-h-[260px]"
              >
                {/* Анимированная красная линия сверху карточки */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100 transition-all duration-700 ease-[0.22,1,0.36,1]" />
                
                {/* Глянцевый блик при ховере (сделал мягче для светлой темы) */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 dark:from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Иконка */}
                  <motion.div 
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 text-red-500 dark:bg-gradient-to-br dark:from-red-500/20 dark:to-red-900/10 dark:border dark:border-red-500/10 mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-red-100 dark:group-hover:bg-red-500/20"
                  >
                    <stat.icon size={26} strokeWidth={1.5} />
                  </motion.div>

                  <div>
                    {/* Анимированные цифры */}
                    <div className="text-5xl font-extrabold text-foreground mb-3 flex items-baseline tracking-tight">
                      {inView ? (
                        <CountUp
                          start={0}
                          end={stat.quantity}
                          duration={3.5}
                          useEasing
                          className="drop-shadow-sm"
                        />
                      ) : (
                        <span>0</span>
                      )}
                      <span className="text-red-600 text-4xl ml-1">{stat.suffix}</span>
                    </div>

                    {/* Описание */}
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
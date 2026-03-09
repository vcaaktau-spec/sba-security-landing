"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ShieldCheck, Cctv, Route } from "lucide-react"

export const Features = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобилку, чтобы отключить параллакс и ховеры
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  
  const isInView = useInView(containerRef, { once: true, margin: "-10%" })

  // === ПАРАЛЛАКС ТОЛЬКО ДЛЯ ДЕСКТОПА ===
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-10%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const featuresData = [
    {
      title: t("features.f1_title", "Бескомпромиссная гарантия"),
      description: t("features.f1_desc", "Предоставляем официальную гарантию на оборудование и монтаж. Мы уверены в каждом соединении и несем личную ответственность."),
      icon: ShieldCheck,
      delay: 0.2 // Ускорили задержки
    },
    {
      title: t("features.f2_title", "Мировые бренды"),
      description: t("features.f2_desc", "Никаких безымянных аналогов. Работаем исключительно с сертифицированным оборудованием от лидеров: Hikvision, Dahua, Ezviz."),
      icon: Cctv,
      delay: 0.4
    },
    {
      title: t("features.f3_title", "Эстетика монтажа"),
      description: t("features.f3_desc", "Устанавливаем камеры без строительной пыли и висящих проводов. Скрытая прокладка кабеля и бережное отношение к интерьеру."),
      icon: Route,
      delay: 0.6
    },
  ]

  const smoothEase = [0.22, 1, 0.36, 1]

  // === АНИМАЦИИ БЕЗ БЛЮРА ===
  const fadeVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  const wrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1, 
      transition: { duration: 1.5, ease: smoothEase as any, delay: 0.1 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: smoothEase as any, delay }
    })
  }

  return (
    <section
      id="features"
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 lg:py-24 overflow-hidden bg-background"
    >
      {/* === ФОН === */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Прячем блюр на мобилках */}
        <div className="hidden md:block absolute w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full" />
      </motion.div>

      {/* === КОНТЕНТ === */}
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col">
        
        {/* ЗАГОЛОВОК */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 flex flex-col items-center justify-center w-full">
          <motion.h2 
            custom={0} variants={fadeVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-4 w-full text-center"
          >
            <span className="block">{t("features.title1", "Почему выбирают ")}</span>
            <span className="block text-red-600 italic mt-1 sm:mt-2">{t("features.title2", "именно нас")}</span>
          </motion.h2>
          
          <motion.p
            custom={0.2} variants={fadeVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground font-medium w-full text-center"
          >
            {t("features.subtitle", "Узнайте, почему нам доверяют безопасность самых сложных объектов в Актау.")}
          </motion.p>
        </div>

        {/* ВНУТРЕННИЙ ВДАВЛЕННЫЙ БЛОК */}
        <motion.div
          variants={wrapperVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative w-full rounded-[32px] sm:rounded-[48px] bg-slate-100/50 dark:bg-neutral-900/50 p-3 sm:p-5 lg:p-6 shadow-[inset_0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)] border border-black/5 dark:border-white/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 h-full">
            {featuresData.map((feature) => (
              <motion.div
                key={feature.title}
                custom={feature.delay}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                // Отключаем hover-анимацию y-смещения на тач-устройствах
                whileHover={!isMobile ? { y: -6, scale: 1.01 } : {}}
                transition={{ duration: 0.4, ease: smoothEase as any }}
                className="group relative bg-white dark:bg-[#0c0c0e] rounded-[24px] sm:rounded-[36px] p-8 sm:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.2)] transition-all duration-500 border border-transparent dark:border-white/[0.02] overflow-hidden"
              >
                
                {/* ИКОНКА */}
                <div className="relative w-20 h-20 rounded-[20px] bg-slate-50 dark:bg-white/[0.03] flex items-center justify-center mb-8 border border-black/5 dark:border-white/5 transition-all duration-500 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:border-red-100 dark:group-hover:border-red-500/20 group-hover:scale-110">
                  
                  {/* Заднее свечение иконки (Скрыто на мобилках) */}
                  <div className="hidden md:block absolute inset-0 bg-red-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none" />
                  
                  <feature.icon 
                    size={32} 
                    strokeWidth={1.5} 
                    className="relative z-10 text-foreground group-hover:text-red-600 transition-colors duration-500" 
                  />
                </div>

                {/* ТЕКСТ */}
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground tracking-tight transition-colors duration-300 group-hover:text-red-600">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Декоративная линия */}
                <div className="mt-8 h-[3px] w-12 bg-neutral-200 dark:bg-neutral-800 rounded-full group-hover:w-20 group-hover:bg-red-500 transition-all duration-500 ease-[0.22,1,0.36,1]" />
                
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  )
}
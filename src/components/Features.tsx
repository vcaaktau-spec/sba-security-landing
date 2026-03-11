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

  // === ПАРАЛЛАКС ТОЛЬКО ДЛЯ ДЕСКТОПА (Контент) ===
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const featuresData = [
    {
      title: t("features.f1_title", "Бескомпромиссная гарантия"),
      description: t("features.f1_desc", "Предоставляем официальную гарантию на оборудование и монтаж. Мы уверены в каждом соединении и несем личную ответственность."),
      icon: ShieldCheck,
      delay: 0.1
    },
    {
      title: t("features.f2_title", "Мировые бренды"),
      description: t("features.f2_desc", "Никаких безымянных аналогов. Работаем исключительно с сертифицированным оборудованием от лидеров: Hikvision, Dahua, Ezviz."),
      icon: Cctv,
      delay: 0.2
    },
    {
      title: t("features.f3_title", "Эстетика монтажа"),
      description: t("features.f3_desc", "Устанавливаем камеры без строительной пыли и висящих проводов. Скрытая прокладка кабеля и бережное отношение к интерьеру."),
      icon: Route,
      delay: 0.3
    },
  ]

  const smoothEase = [0.22, 1, 0.36, 1]

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
      // bg-transparent для просвечивания GlobalBackground
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 lg:py-24 overflow-hidden bg-transparent"
    >
      {/* === КОНТЕНТ === */}
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Типографика (СТАТИЧНАЯ, СИНХРОНИЗИРОВАНА С ОСТАЛЬНЫМИ) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("features.title1", "Почему выбирают")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("features.title2", "именно нас")}
            </span>
          </h2>
          
          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("features.subtitle", "Узнайте, почему нам доверяют безопасность самых сложных объектов в Актау.")}
          </div>
        </div>

        {/* ВНУТРЕННИЙ ВДАВЛЕННЫЙ БЛОК */}
        <motion.div
          variants={wrapperVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          // Полупрозрачный фон для интеграции с радаром
          className="relative w-full rounded-[32px] sm:rounded-[48px] bg-background/40 dark:bg-black/40 backdrop-blur-sm p-3 sm:p-5 lg:p-6 shadow-[inset_0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_4px_24px_rgba(0,0,0,0.4)] border border-border/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 h-full">
            {featuresData.map((feature) => (
              <motion.div
                key={feature.title}
                custom={feature.delay}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={!isMobile ? { y: -6, scale: 1.01 } : {}}
                transition={{ duration: 0.4, ease: smoothEase as any}}
                className="group relative bg-background/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-[24px] sm:rounded-[36px] p-8 sm:p-10 flex flex-col items-center text-center shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.2)] transition-all duration-500 border border-border/50 hover:border-red-500/30 overflow-hidden"
              >
                {/* Декоративные углы захвата цели (HUD Corners) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />
                </div>

                {/* Радиальное свечение при наведении */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                {/* ИКОНКА */}
                <div className="relative z-10 w-20 h-20 rounded-[20px] bg-muted/50 dark:bg-white/[0.03] flex items-center justify-center mb-8 border border-border/50 transition-all duration-500 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:border-red-200 dark:group-hover:border-red-500/30 group-hover:scale-110">
                  <feature.icon 
                    size={32} 
                    strokeWidth={1.5} 
                    className="relative z-10 text-foreground group-hover:text-red-600 transition-colors duration-500" 
                  />
                </div>

                {/* ТЕКСТ */}
                <h3 className="relative z-10 text-xl sm:text-2xl font-bold mb-4 text-foreground tracking-tight transition-colors duration-300 group-hover:text-red-600">
                  {feature.title}
                </h3>
                <p className="relative z-10 text-sm sm:text-base text-muted-foreground font-medium leading-relaxed flex-grow">
                  {feature.description}
                </p>

                {/* Декоративная линия (Progress indicator) */}
                <div className="relative z-10 mt-8 h-[3px] w-12 bg-border rounded-full group-hover:w-20 group-hover:bg-red-500 transition-all duration-500 ease-[0.22,1,0.36,1]" />
                
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </motion.div>
    </section>
  )
}
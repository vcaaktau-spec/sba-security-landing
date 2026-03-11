"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings, ArrowRight } from "lucide-react"

export const HowItWorks = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Определяем мобилку, чтобы отключить параллакс
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

  const features = [
    {
      step: "01",
      icon: <PhoneCall size={26} strokeWidth={1.5} />,
      title: t("how.s1_title", "Оставляете заявку"),
      description: t("how.s1_desc", "Свяжитесь с нами по телефону или оставьте заявку на сайте. Мы уточним задачи и предложим оптимальное решение."),
      delay: 0.1
    },
    {
      step: "02",
      icon: <ClipboardList size={26} strokeWidth={1.5} />,
      title: t("how.s2_title", "Проектируем систему"),
      description: t("how.s2_desc", "Подбираем оборудование, рассчитываем точное количество камер и готовим индивидуальный проект."),
      delay: 0.2
    },
    {
      step: "03",
      icon: <Truck size={26} strokeWidth={1.5} />,
      title: t("how.s3_title", "Привозим оборудование"),
      description: t("how.s3_desc", "Мы сами закупаем, проверяем и доставляем камеры, регистраторы и всё необходимое для монтажа."),
      delay: 0.3
    },
    {
      step: "04",
      icon: <Settings size={26} strokeWidth={1.5} />,
      title: t("how.s4_title", "Монтаж и настройка"),
      description: t("how.s4_desc", "Устанавливаем камеры без грязи, прокладываем кабель, настраиваем систему и удалённый доступ на ваш смартфон."),
      delay: 0.4
    },
  ]

  const smoothEase = [0.22, 1, 0.36, 1]

  const flyInVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.8, ease: smoothEase as any, delay }
    }),
  }

  return (
    <section
      id="howItWorks"
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden bg-transparent"
    >
      {/* === КОНТЕНТ === */}
      <motion.div style={{ y: contentY }} className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px]">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Типографика (СТАТИЧНАЯ) */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("how.title1", "Как мы")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("how.title2", "работаем")}
            </span>
          </h2>

          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("how.subtitle", "Полный цикл установки видеонаблюдения — от вашей первой заявки до полностью настроенной и работающей системы.")}
          </div>
        </div>

        {/* СЕТКА КАРТОЧЕК */}
        <div className="relative">
          {/* Линия связи шагов */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: smoothEase as any, delay: 0.8 }}
            className="absolute top-[52px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent hidden lg:block z-0 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.step}
                custom={feature.delay}
                variants={flyInVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={!isMobile ? { y: -6 } : {}}
                transition={{ duration: 0.4, ease: smoothEase as any }}
                className="group relative bg-background/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md border border-border/50 rounded-[24px] p-8 flex flex-col h-full shadow-sm hover:border-red-500/30 transition-all duration-500 overflow-hidden"
              >
                {/* Декоративные углы захвата цели (HUD Corners) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
                </div>

                {/* Радиальное свечение */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/[0.05] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                {/* Цифра на фоне */}
                <div className="absolute -right-2 -top-4 text-[140px] font-black text-black/[0.03] dark:text-white/[0.02] pointer-events-none select-none transition-transform duration-700 group-hover:scale-105">
                  {feature.step}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
                      {feature.icon}
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
                      {t("how.step", "Шаг")} {feature.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {index !== features.length - 1 && (
                    <div className="absolute -bottom-4 right-8 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground lg:hidden z-20 opacity-50 pointer-events-none">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
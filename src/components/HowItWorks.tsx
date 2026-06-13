"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings, ArrowRight } from "lucide-react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

export const HowItWorks = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isInView = useInView(containerRef, { once: true, margin: "-10%" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Laser path drawing effect linked to scroll progress
  const pathLength = useTransform(scrollYProgress, [0.25, 0.75], [0, 1])

  const steps = [
    {
      step: "01",
      icon: PhoneCall,
      title: t("how.s1_title", "Оставляете заявку"),
      description: t("how.s1_desc", "Свяжитесь с нами по телефону или оставьте заявку на сайте. Мы уточним задачи и предложим оптимальное решение."),
      delay: 0.1
    },
    {
      step: "02",
      icon: ClipboardList,
      title: t("how.s2_title", "Проектируем систему"),
      description: t("how.s2_desc", "Подбираем оборудование, рассчитываем точное количество камер и готовим индивидуальный проект."),
      delay: 0.2
    },
    {
      step: "03",
      icon: Truck,
      title: t("how.s3_title", "Привозим оборудование"),
      description: t("how.s3_desc", "Мы сами закупаем, проверяем и доставляем камеры, регистраторы и всё необходимое для монтажа."),
      delay: 0.3
    },
    {
      step: "04",
      icon: Settings,
      title: t("how.s4_title", "Монтаж и настройка"),
      description: t("how.s4_desc", "Устанавливаем камеры без грязи, прокладываем кабель, настраиваем систему и удалённый доступ на ваш смартфон."),
      delay: 0.4
    },
  ]

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section
      id="howItWorks"
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden bg-transparent"
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1200px]">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("how.title1", "Как мы")}
            </span>
            <span className="block w-full text-red-600 mt-2">
              {t("how.title2", "работаем")}
            </span>
          </h2>

          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("how.subtitle", "Полный цикл установки видеонаблюдения — от вашей первой заявки до полностью настроенной и работающей системы.")}
          </div>
        </div>

        {/* TIMELINE CARDS */}
        <div className="relative">
          
          {/* Scroll-Linked SVG Connector Path (V-shaped on mobile, horizontal on desktop) */}
          {!isMobile ? (
            <div className="absolute top-[48px] left-[10%] right-[10%] h-[10px] z-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 800 10" fill="none" preserveAspectRatio="none" className="overflow-visible">
                {/* Background static line */}
                <line x1="0" y1="5" x2="800" y2="5" stroke="currentColor" strokeWidth="1" className="text-foreground/10 dark:text-foreground/15" />
                {/* Scroll-drawn laser line */}
                <motion.line
                  x1="0" y1="5" x2="800" y2="5"
                  stroke="#ef4444"
                  strokeWidth="2"
                  style={{ pathLength }}
                  className="filter drop-shadow-[0_0_8px_#ef4444]"
                />
              </svg>
            </div>
          ) : (
            <div className="absolute left-[39px] top-[40px] bottom-[40px] w-[2px] z-0 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 2 800" fill="none" preserveAspectRatio="none" className="overflow-visible">
                <line x1="1" y1="0" x2="1" y2="800" stroke="currentColor" strokeWidth="1" className="text-foreground/10 dark:text-foreground/15" />
                <motion.line
                  x1="1" y1="0" x2="1" y2="800"
                  stroke="#ef4444"
                  strokeWidth="2"
                  style={{ pathLength }}
                  className="filter drop-shadow-[0_0_8px_#ef4444]"
                />
              </svg>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.step}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: smoothEase, delay: feature.delay }}
                  className="group relative bg-card/40 backdrop-blur-md border border-border/40 hover:border-red-500/30 rounded-[24px] p-6 flex flex-col justify-between h-full shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden"
                >
                  {/* HUD corners */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
                  </div>

                  {/* Step metadata */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500 relative z-20">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
                      {t("how.step", "Шаг")} {feature.step}
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <div className="relative z-10 flex-grow">
                    <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-red-500 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Micro-arrow indicators for horizontal steps */}
                  {index !== steps.length - 1 && !isMobile && (
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground z-20 shadow-sm opacity-50 group-hover:opacity-100 group-hover:text-red-500 group-hover:border-red-500/20 transition-all duration-300">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
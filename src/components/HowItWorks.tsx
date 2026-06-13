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
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1200px]">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.1] mb-5"
          >
            {t("how.title1", "Как мы")}{" "}
            <span className="text-red-500">{t("how.title2", "работаем")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
            className="text-lg text-muted-foreground"
          >
            {t("how.subtitle")}
          </motion.p>
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
                  className="group relative bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.15] rounded-2xl p-6 flex flex-col justify-between h-full transition-all duration-400 overflow-hidden"
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/[0.05] to-transparent pointer-events-none" />

                  {/* Step metadata */}
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-400">
                      <Icon size={19} />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">
                      {t("how.step", "Шаг")} {feature.step}
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <div className="relative z-10 flex-grow">
                    <h3 className="text-base font-bold mb-2.5 text-foreground group-hover:text-foreground/90 transition-colors duration-300">
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
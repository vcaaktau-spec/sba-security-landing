"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Shield, Network, Laptop, FileText, Check, ArrowRight, Activity } from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"

export const Services = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  const servicesData = [
    {
      id: "01",
      title: t("services.s1_title", "Комплексная безопасность"),
      subtitle: t("services.s1_sub", "CCTV, ОПС и СКУД"),
      description: t("services.s1_desc", "Проектирование и внедрение систем безопасности любого масштаба. От умного видеонаблюдения для частного дома до сложных систем контроля доступа."),
      features: [
        t("services.s1_f1", "IP-видеонаблюдение и аналитика"),
        t("services.s1_f2", "Охранно-пожарная сигнализация"),
        t("services.s1_f3", "Биометрические системы доступа"),
        t("services.s1_f4", "Интеграция систем")
      ],
      icon: Shield,
      netCode: "MODULE: SECURITY_CORE // LATENCY: 0.8ms"
    },
    {
      id: "02",
      title: t("services.s2_title", "Инфраструктура и Сети"),
      subtitle: t("services.s2_sub", "СКС, Wi-Fi и Телеком"),
      description: t("services.s2_desc", "Создаем надежный цифровой фундамент. Проектирование и монтаж локально-вычислительных сетей, настройка бесшовного Wi-Fi."),
      features: [
        t("services.s2_f1", "Монтаж и тестирование СКС"),
        t("services.s2_f2", "Оптика и маршрутизация"),
        t("services.s2_f3", "Бесшовный корпоративный Wi-Fi"),
        t("services.s2_f4", "Обустройство серверных")
      ],
      icon: Network,
      netCode: "MODULE: NETWORK_LAYER // PKT_LOSS: 0.0%"
    },
    {
      id: "03",
      title: t("services.s3_title", "IT-Аутсорсинг & Digital"),
      subtitle: t("services.s3_sub", "Поддержка ПК и Web"),
      description: t("services.s3_desc", "Обеспечиваем бесперебойную работу техники, настраиваем ПО, а также разрабатываем современные веб-сайты для вашего бренда."),
      features: [
        t("services.s3_f1", "Абонентское IT-обслуживание"),
        t("services.s3_f2", "Ремонт ПК и Серверов"),
        t("services.s3_f3", "Разработка сайтов под ключ"),
        t("services.s3_f4", "Поддержка 24/7")
      ],
      icon: Laptop,
      netCode: "MODULE: CLOUD_DEV // UPTIME: 99.99%"
    },
    {
      id: "04",
      title: t("services.s4_title", "Проектная документация"),
      subtitle: t("services.s4_sub", "От лицензированных партнеров"),
      description: t("services.s4_desc", "Официальное проектирование систем безопасности и сетей. Мы работаем с проверенными партнерами для сдачи объектов в эксплуатацию по всем ГОСТам."),
      features: [
        t("services.s4_f1", "Рабочие проекты (РП)"),
        t("services.s4_f2", "Сметная документация"),
        t("services.s4_f3", "Согласование в инстанциях"),
        t("services.s4_f4", "Авторский надзор")
      ],
      icon: FileText,
      netCode: "MODULE: GOST_DOCS // COMPLIANCE: 100%"
    },
  ]

  useEffect(() => {
    if (!inView || !isAutoPlaying) return

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % servicesData.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [inView, isAutoPlaying, servicesData.length])

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]
  const activeService = servicesData[activeIndex]
  const ActiveIcon = activeService.icon

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      <motion.div 
        ref={inViewRef}
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col lg:flex-row gap-12 items-stretch min-h-[580px]"
      >
        
        {/* LEFT SERVICE SELECTOR */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-[34px] sm:text-[44px] lg:text-[52px] font-black tracking-tighter leading-[1.1] mb-6 text-foreground">
              <span className="block">{t("services.title1", "Больше, чем")}</span>
              <span className="text-red-600 block mt-1">
                {t("services.title2", "видеонаблюдение")}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              {t("services.subtitle", "Мы предоставляем полный спектр услуг: от прокладки кабеля до проектной документации и IT-решений. Ваш бизнес под нашей защитой.")}
            </p>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex flex-col gap-3 relative">
            {servicesData.map((service, index) => {
              const isActive = activeIndex === index
              
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-500 group overflow-hidden ${
                    isActive 
                      ? "bg-card/60 border border-border/50 shadow-md" 
                      : "hover:bg-card/20 border border-transparent"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500 shrink-0 ${
                      isActive ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-neutral-100 dark:bg-neutral-900 text-muted-foreground"
                    }`}>
                      {isActive ? <ArrowRight size={14} className="animate-pulse" /> : service.id}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base font-bold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {service.title}
                      </h4>
                    </div>
                  </div>

                  {isActive && isAutoPlaying && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5.5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2px] bg-red-500/40"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT DASHBOARD PANEL */}
        <div className="w-full lg:w-[58%] flex items-center">
          <div className="relative w-full rounded-[30px] bg-card/40 backdrop-blur-xl border border-border/40 shadow-2xl overflow-hidden min-h-[460px] flex flex-col group p-8 sm:p-10">
            
            {/* Corner brackets */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
            </div>

            <div className="absolute top-4 right-4 text-[9px] font-mono text-muted-foreground/45 flex items-center gap-1.5 pointer-events-none">
              <Activity size={10} className="text-red-500 animate-pulse" />
              <span>{activeService.netCode}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="relative z-10 flex flex-col justify-between h-full flex-1"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <ActiveIcon size={26} />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-red-500">
                        {activeService.subtitle}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed mb-8">
                    {activeService.description}
                  </p>
                </div>

                {/* Features checklists */}
                <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-black/30 border border-border/30">
                  {activeService.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-foreground/95 leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </section>
  )
}
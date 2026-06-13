"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ShieldCheck, Cpu, HardDrive, Shield, Check } from "lucide-react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

export const Features = () => {
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
  
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  const extraCapabilities = [
    t("features.list.0", "IP Видеонаблюдение"),
    t("features.list.1", "СКУД"),
    t("features.list.2", "Домофония"),
    t("features.list.3", "Умный дом"),
    t("features.list.4", "Охранные системы"),
    t("features.list.5", "Сети"),
    t("features.list.6", "Аналитика ИИ")
  ]

  return (
    <section
      id="features"
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-transparent"
    >
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[60px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("features.title1", "Почему выбирают")}
            </span>
            <span className="block w-full text-red-600 mt-2">
              {t("features.title2", "именно нас")}
            </span>
          </h2>
          
          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("features.subtitle", "Узнайте, почему нам доверяют безопасность самых сложных объектов в Актау.")}
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full auto-rows-[minmax(240px,_auto)]">
          
          {/* Card 1: Guarantee (Spans 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
            className="group relative lg:col-span-2 bg-card/40 backdrop-blur-md rounded-[30px] border border-border/40 p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between hover:border-red-500/30 transition-all duration-500 overflow-hidden shadow-lg"
          >
            {/* Corner brackets */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {t("features.f1_title", "Бескомпромиссная гарантия")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {t("features.f1_desc", "Предоставляем официальную гарантию на оборудование и монтаж. Мы уверены в каждом соединении и несем личную ответственность за стабильность системы.")}
              </p>
            </div>

            {/* Interactive Vector Art (Guarantee shield with telemetry rays) */}
            <div className="relative w-[180px] h-[180px] shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-500/20">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
                <motion.circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              <div className="absolute text-emerald-500">
                <Shield size={64} className="filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Brands (Spans 1 column on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.25 }}
            className="group relative bg-card/40 backdrop-blur-md rounded-[30px] border border-border/40 p-8 flex flex-col justify-between hover:border-red-500/30 transition-all duration-500 overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {t("features.f2_title", "Мировые бренды")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("features.f2_desc", "Никаких безымянных аналогов с маркетплейсов. Работаем исключительно с сертифицированным оборудованием от лидеров: Hikvision, Dahua, Ezviz.")}
              </p>
            </div>

            {/* Micro brand list layout */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Hikvision", "Dahua", "Ezviz", "SBA Pro"].map((brand, i) => (
                <span key={i} className="text-[10px] font-mono font-bold tracking-wider uppercase bg-foreground/5 text-foreground/85 px-3 py-1.5 rounded-lg border border-border/50 group-hover:border-red-500/25 transition-colors duration-300">
                  {brand}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Installation Aesthetics (Spans all columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: smoothEase, delay: 0.4 }}
            className="group relative lg:col-span-3 bg-card/40 backdrop-blur-md rounded-[30px] border border-border/40 p-8 sm:p-10 flex flex-col lg:flex-row gap-10 items-center justify-between hover:border-red-500/30 transition-all duration-500 overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50" />
            </div>

            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                <HardDrive size={24} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {t("features.f3_title", "Эстетика монтажа")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                {t("features.f3_desc", "Устанавливаем камеры без строительной пыли и висящих проводов. Скрытая прокладка кабеля, идеальные стыки и бережное отношение к интерьеру.")}
              </p>
            </div>

            {/* List of services tags (Bento grid visual) */}
            <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 shrink-0">
              {extraCapabilities.map((capability, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/40 font-mono text-xs text-foreground/90 group-hover:border-red-500/20 transition-all duration-300"
                >
                  <div className="w-4 h-4 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </motion.div>
    </section>
  )
}
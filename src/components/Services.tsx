"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Shield, Network, Laptop, FileText, Check, ArrowRight } from "lucide-react"
import { useInView } from "react-intersection-observer"

export const Services = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  // === ПАРАЛЛАКС ЛОГИКА ===
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])

  // Вернули все 4 услуги!
  const servicesData = [
    {
      id: "01",
      title: t("services.s1_title"),
      subtitle: t("services.s1_sub"),
      description: t("services.s1_desc"),
      features: [t("services.s1_f1"), t("services.s1_f2"), t("services.s1_f3"), t("services.s1_f4")],
      icon: Shield,
    },
    {
      id: "02",
      title: t("services.s2_title"),
      subtitle: t("services.s2_sub"),
      description: t("services.s2_desc"),
      features: [t("services.s2_f1"), t("services.s2_f2"), t("services.s2_f3"), t("services.s2_f4")],
      icon: Network,
    },
    {
      id: "03",
      title: t("services.s3_title"),
      subtitle: t("services.s3_sub"),
      description: t("services.s3_desc"),
      features: [t("services.s3_f1"), t("services.s3_f2"), t("services.s3_f3"), t("services.s3_f4")],
      icon: Laptop,
    },
    {
      id: "04",
      title: t("services.s4_title"),
      subtitle: t("services.s4_sub"),
      description: t("services.s4_desc"),
      features: [t("services.s4_f1"), t("services.s4_f2"), t("services.s4_f3"), t("services.s4_f4")],
      icon: FileText, 
    },
  ]

  // === АВТОПЛЕЙ ТАБОВ ===
  useEffect(() => {
    if (!inView || !isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % servicesData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [inView, isAutoPlaying, servicesData.length]);

  const smoothEase = [0.22, 1, 0.36, 1]
  const activeService = servicesData[activeIndex]
  const ActiveIcon = activeService.icon

  const fadeVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  return (
    <section 
      id="services" 
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 lg:py-0 overflow-hidden bg-slate-50 dark:bg-background"
    >
      {/* === ПАРАЛЛАКС ФОН === */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </motion.div>

      {/* === ПАРАЛЛАКС КОНТЕНТ === */}
      <motion.div 
        ref={inViewRef}
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1300px] px-4 sm:px-6 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-stretch min-h-[600px]"
      >
        
        {/* === ЛЕВАЯ ЧАСТЬ: Навигация === */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center">
          
          <div className="mb-10">
            <motion.h2 
              custom={0.1} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground"
            >
              <span className="block">{t("services.title1")}</span>
              <span className="text-red-600 block mt-1 sm:mt-2">
                {t("services.title2")}
              </span>
            </motion.h2>
            <motion.p 
              custom={0.3} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="text-base text-muted-foreground max-w-md"
            >
              {t("services.subtitle")}
            </motion.p>
          </div>

          {/* СПИСОК УСЛУГ (Табы) */}
          <motion.div 
            custom={0.5} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-2 relative"
          >
            <div className="hidden lg:block absolute left-[15px] top-4 bottom-4 w-[2px] bg-black/5 dark:bg-white/5 rounded-full" />

            {servicesData.map((service, index) => {
              const isActive = activeIndex === index;
              
              return (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl text-left transition-all duration-500 group overflow-hidden ${
                    isActive 
                      ? "bg-white dark:bg-white/[0.05] shadow-sm lg:shadow-none border border-black/5 dark:border-white/5 lg:border-transparent lg:bg-transparent" 
                      : "hover:bg-black/5 dark:hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-white/[0.05] rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hidden lg:block"
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-4 sm:gap-6 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500 shrink-0 ${
                      isActive ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-neutral-200 dark:bg-neutral-800 text-muted-foreground"
                    }`}>
                      {isActive ? <ArrowRight size={14} /> : service.id}
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base sm:text-lg font-bold transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                        {service.title}
                      </h4>
                    </div>
                  </div>

                  {isActive && isAutoPlaying && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2px] bg-red-500/30 lg:hidden"
                    />
                  )}
                </button>
              )
            })}
          </motion.div>
        </div>

        {/* === ПРАВАЯ ЧАСТЬ: Окно контента === */}
        <div className="w-full lg:w-[60%] flex items-center lg:py-12">
          <motion.div 
            custom={0.7} variants={fadeVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            onMouseEnter={() => setIsAutoPlaying(false)} 
            className="relative w-full rounded-[32px] sm:rounded-[40px] bg-white dark:bg-[#0c0c0e] border border-black/5 dark:border-white/5 shadow-2xl dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden min-h-[480px] flex flex-col"
          >
            <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-[60px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: smoothEase as any }}
                className="relative z-10 p-8 sm:p-12 flex flex-col h-full"
              >
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-red-50 dark:bg-white/[0.03] flex items-center justify-center text-red-600 dark:text-red-500 border border-red-100 dark:border-white/5 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <ActiveIcon size={36} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold tracking-wider uppercase mb-3 border border-red-500/20">
                      {activeService.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10">
                  {activeService.description}
                </p>

                <div className="mt-auto grid sm:grid-cols-2 gap-4 sm:gap-6 bg-slate-50 dark:bg-white/[0.02] p-6 sm:p-8 rounded-[24px] border border-black/5 dark:border-white/5">
                  {activeService.features.map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 mt-0.5">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="font-semibold text-sm sm:text-base text-foreground leading-snug">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </motion.div>
    </section>
  )
}
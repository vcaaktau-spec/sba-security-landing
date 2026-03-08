"use client"

import { useState, useEffect } from "react"
// 1. ДОБАВИЛИ useScroll и useTransform ИЗ FRAMER MOTION
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion" 
import { useTranslation } from "react-i18next" 
import { Button } from "@/components/ui/button"
import { Smartphone, SlidersHorizontal, X } from "lucide-react"

import { Calculator } from "./Calculator" 

// === ОБНОВЛЕННЫЙ КОМПОНЕНТ АНИМАЦИИ (Идеальный перенос и посимвольное появление) ===
const StaggerText = ({ text, className, delayOffset = 0 }: { text: string, className?: string, delayOffset?: number }) => {
  const words = text.split(" ");
  let globalIndex = 0;

  const letterVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] as any,
        delay: delayOffset + (i * 0.035), 
      }
    }),
  };

  return (
    <span className={`flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex whitespace-nowrap mr-[0.25em] last:mr-0">
          {Array.from(word).map((letter, letterIndex) => {
            const currentIndex = globalIndex++; 
            return (
              <motion.span
                key={letterIndex}
                custom={currentIndex} 
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};
// ==========================================


export const Hero = () => {
  const { t } = useTranslation() 
  const [isCalcOpen, setIsCalcOpen] = useState(false)

  // === 2. НАСТРОЙКА ПАРАЛЛАКСА ===
  const { scrollY } = useScroll()
  // Фон уезжает вниз (создает глубину)
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300])
  // Монитор поднимается вверх (эффект 3D вылета)
  const monitorY = useTransform(scrollY, [0, 1000], [0, -150])
  // ===============================

  useEffect(() => {
    if (isCalcOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isCalcOpen])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  return (
    <>
      <section className="magnet-section relative min-h-screen flex items-center overflow-hidden bg-background">
        
        {/* 3. ДОБАВИЛИ ПАРАЛЛАКС К ФОНУ (style={{ y: backgroundY }}) */}
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-muted/20" />
          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-red-600/10 blur-[120px] rounded-full" />

          <svg className="absolute inset-0 w-full h-full opacity-[0.35]">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgba(220, 38, 38, 0.6)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <motion.path
              d="M-200 200 Q400 50 800 300 T1800 200"
              stroke="url(#line-gradient)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 12, ease: "linear" }}
            />
            <motion.path
              d="M-200 600 Q500 400 900 650 T1800 500"
              stroke="url(#line-gradient)" strokeWidth="1.5" fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 15, ease: "linear", delay: 1 }}
            />
          </svg>

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
              style={{ left: `${15 + Math.random() * 70}%`, top: `${15 + Math.random() * 70}%` }}
              animate={{ y: [0, -30, 0], x: [0, Math.random() * 20 - 10, 0], scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 5 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-0">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <StaggerText 
                text={t("hero.title_part1", "Система")} 
                className="block" 
                delayOffset={0.1} 
              />
              <StaggerText 
                text={t("hero.title_part2", "Безопасности")} 
                className="block" 
                delayOffset={0.4} 
              />
              {/* 4. ИСПРАВИЛИ БАГ С ЦВЕТОМ ТЕКСТА "АКТАУ" */}
              <StaggerText 
                text={t("hero.title_part3", "Актау")} 
                className="block text-red-600 drop-shadow-sm mt-1 sm:mt-2" 
                delayOffset={0.8} 
              />
            </h1>

            <motion.p custom={1.4} variants={textVariants} initial="hidden" animate="visible" className="mt-6 text-base sm:text-lg text-muted-foreground max-w-[500px] leading-relaxed">
              {t("hero.subtitle", "Проектируем и устанавливаем премиальные системы видеонаблюдения для домов, бизнеса и складов.")}
            </motion.p>

            <motion.div custom={1.7} variants={textVariants} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button 
                onClick={() => setIsCalcOpen(true)}
                size="lg" 
                className="relative group overflow-hidden bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto h-14 px-8 text-base transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-500/50 hover:border-red-400 rounded-xl"
              >
                <span className="relative z-10 font-semibold tracking-wide">{t("hero.btn", "Рассчитать систему")}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />
              </Button>
            </motion.div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-14 text-[15px] font-medium text-foreground/90">
              {[
                { icon: Smartphone, text: t("hero.feature1", "Удаленный доступ"), delay: 2.0 },
                { icon: SlidersHorizontal, text: t("hero.feature2", "Полный Контроль"), delay: 2.1 }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  custom={item.delay} 
                  variants={textVariants} 
                  initial="hidden" 
                  animate="visible"
                  className="flex items-center gap-3 group cursor-default"
                >
                  <motion.div 
                    animate={{ y: [0, -4, 0] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-[42px] h-[42px] rounded-2xl bg-red-500/10 text-red-500 transition-all duration-300 group-hover:bg-red-500/20 group-hover:scale-105"
                  >
                    <item.icon size={20} />
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT (Монитор) */}
          {/* 5. ДОБАВИЛИ ПАРАЛЛАКС К МОНИТОРУ (style={{ y: monitorY }}) Обернули в отдельный div чтобы не сбить анимации появления */}
          <motion.div style={{ y: monitorY }} className="flex justify-center lg:justify-end mt-8 lg:mt-0 w-full z-10">
            <motion.div 
              initial={{ opacity: 0, y: 60, filter: "blur(10px)" }} 
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
              transition={{ duration: 1.2, ease: smoothEase as any, delay: 0.8 }} 
            >
              <motion.div 
                animate={{ y: [-8, 8, -8] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                className="w-full max-w-[540px]"
              >
                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} 
                  className="relative group cursor-pointer"
                >
                  <div className="absolute -inset-4 sm:-inset-10 bg-gradient-to-r from-red-600/10 to-red-500/10 blur-[60px] sm:blur-[80px] rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
                  
                  <div className="relative w-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-[12px] sm:rounded-[18px] p-1.5 sm:p-2 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:border-white/20">
                    <div className="relative bg-black rounded-[8px] sm:rounded-[12px] overflow-hidden border border-white/5 shadow-inner">
                      
                      <div className="grid grid-cols-2 gap-0.5 sm:gap-[2px] bg-neutral-950">
                        {[
                          "/cam1.webp?size=small",
                          "/cam2.webp?size=small",
                          "/cam3.webp?size=small",
                          "/cam4.webp?size=small"
                        ].map((src, i) => (
                          <div key={i} className="relative overflow-hidden group/cam aspect-video sm:aspect-auto sm:h-[150px] bg-neutral-900">
                            <img 
                              src={src} 
                              alt={`Camera View ${i + 1}`} 
                              loading={i === 0 ? "eager" : "lazy"} 
                              fetchPriority={i === 0 ? "high" : "low"} 
                              decoding="async" 
                              className="w-full h-full object-cover transition-all duration-700 ease-[0.22,1,0.36,1] group-hover/cam:scale-110 saturate-50 group-hover/cam:saturate-100 opacity-75 group-hover/cam:opacity-100" 
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover/cam:bg-transparent transition-colors duration-500" />
                          </div>
                        ))}
                      </div>

                      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                        <div className="absolute top-2 left-2 text-[9px] sm:text-[10px] font-bold tracking-wider text-white flex gap-1.5 items-center bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" /> REC
                        </div>
                        <div className="absolute top-2 right-2 text-[9px] sm:text-[10px] font-bold tracking-wider text-green-400 flex gap-1.5 items-center bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-white/10">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,1)]" /> ONLINE
                        </div>
                        <motion.div animate={{ translateY: ["-100%", "500%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent via-red-500/10 to-red-500/20 border-b border-red-500/40 shadow-[0_2px_15px_rgba(239,68,68,0.3)]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center relative z-[-1]">
                    <div className="w-[20px] sm:w-[30px] h-[30px] sm:h-[45px] bg-gradient-to-b from-neutral-800 to-neutral-900 border-x border-white/10" />
                    <div className="w-[120px] sm:w-[180px] h-[6px] sm:h-[8px] bg-gradient-to-b from-neutral-600 to-neutral-900 rounded-t-sm rounded-b-xl shadow-[0_15px_30px_rgba(0,0,0,0.8)] border-t border-white/20" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* === КАЛЬКУЛЯТОР MODAL === */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-background overflow-y-auto"
          >
            <button
              onClick={() => setIsCalcOpen(false)}
              className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[101] w-12 h-12 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted border border-border shadow-lg transition-colors"
            >
              <X size={24} className="text-foreground" />
            </button>
            <Calculator onClose={() => setIsCalcOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion" 
import { useTranslation } from "react-i18next" 
import { Button } from "@/components/ui/button"
import { Smartphone, X, Crosshair } from "lucide-react"

import { Calculator } from "./Calculator" 
import Magnetic from "./ui/magnetic" 

export const Hero = () => {
  const { t } = useTranslation() 
  const [isCalcOpen, setIsCalcOpen] = useState(false)

  const { scrollY } = useScroll()
  
  // Кинематографичный параллакс только для контента
  const monitorY = useTransform(scrollY, [0, 1000], [0, -100])
  const monitorScale = useTransform(scrollY, [0, 500], [1, 1.05])

  useEffect(() => {
    document.body.style.overflow = isCalcOpen ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isCalcOpen])

  const initialDelay = 0.5;
  const smoothEase = [0.22, 1, 0.36, 1]

  return (
    <>
      {/* ВАЖНО: Убрали bg-background, поставили bg-transparent, чтобы было видно GlobalBackground */}
      <section className="magnet-section relative min-h-screen flex items-center overflow-hidden bg-transparent">
        
        <div className="relative z-30 mx-auto w-full max-w-[1200px] px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 lg:py-0">
          
          {/* LEFT CONTENT */}
          <div className="flex flex-col items-start">
            <h1 className="text-[40px] leading-[1.1] sm:text-[48px] lg:text-[64px] font-extrabold tracking-tight text-foreground drop-shadow-sm">
              <span className="block">{t("hero.title1", "Система Безопасности")}</span>
              <span className="block text-red-600 mt-2">{t("hero.title2", "Актау")}</span>
            </h1>

            <p className="mt-6 text-[16px] leading-[1.6] sm:text-[18px] text-muted-foreground max-w-[500px]">
              {t("hero.subtitle", "Проектируем и устанавливаем премиальные системы видеонаблюдения для домов, бизнеса и складов.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <Magnetic strength={0.3}>
                <Button 
                  onClick={() => setIsCalcOpen(true)}
                  size="lg" 
                  className="relative group overflow-hidden bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto h-14 px-8 text-[16px] transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-500/50 hover:border-red-400 rounded-xl"
                >
                  <span className="relative z-10 font-semibold tracking-wide">{t("hero.btn", "Рассчитать систему")}</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />
                </Button>
              </Magnetic>
            </div>

            {/* Анимированные бейджи */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: initialDelay }}
              className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-12 text-[15px] font-medium text-foreground/90"
            >
              {[
                { icon: Smartphone, text: t("hero.feature1", "Удаленный доступ") },
                { icon: Crosshair, text: t("hero.feature2", "Полный Контроль") }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-[42px] h-[42px] rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                    <item.icon size={20} />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT CONTENT (Монитор) */}
          <motion.div 
            style={{ y: monitorY, scale: monitorScale }} 
            className="flex justify-center lg:justify-end mt-12 lg:mt-0 w-full z-10 relative"
          >
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-[30px] bg-black/20 dark:bg-black/40 blur-[20px] rounded-[100%] z-0" />

            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, ease: smoothEase as any, delay: initialDelay }} 
              className="w-full max-w-[540px] relative z-10"
            >
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-4 sm:-inset-10 bg-gradient-to-r from-red-600/20 to-red-500/10 blur-[60px] rounded-full opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
                
                <div className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-[12px] sm:rounded-[18px] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-colors duration-500 group-hover:border-white/20">
                  <div className="relative bg-black rounded-[8px] sm:rounded-[12px] overflow-hidden border border-white/5">
                    
                    <div className="grid grid-cols-2 gap-[2px] bg-neutral-950">
                      {["/cam1.webp", "/cam2.webp", "/cam3.webp", "/cam4.webp"].map((src, i) => (
                        <div key={i} className="relative overflow-hidden group/cam aspect-video sm:aspect-auto sm:h-[150px] bg-neutral-900">
                          <img 
                            src={src} 
                            alt={`Cam ${i + 1}`} 
                            loading={i === 0 ? "eager" : "lazy"} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-[0.22,1,0.36,1] group-hover/cam:scale-110" 
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover/cam:bg-transparent transition-colors duration-500" />
                        </div>
                      ))}
                    </div>

                    <div className="absolute inset-0 pointer-events-none z-20">
                      <div className="absolute top-2 left-2 text-[10px] font-bold tracking-wider text-white flex gap-1.5 items-center bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" /> REC
                      </div>
                      <div className="absolute top-2 right-2 text-[10px] font-bold tracking-wider text-green-400 flex gap-1.5 items-center bg-black/60 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)]" /> LIVE
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center relative z-[-1]">
                  <div className="w-[30px] h-[30px] sm:h-[45px] bg-gradient-to-b from-neutral-800 to-neutral-900 border-x border-white/10" />
                  <div className="w-[140px] sm:w-[180px] h-[6px] sm:h-[8px] bg-gradient-to-b from-neutral-600 to-neutral-900 rounded-b-xl border-t border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* КАЛЬКУЛЯТОР MODAL */}
      <AnimatePresence>
        {isCalcOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5, ease: smoothEase as any}}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[101]">
              <button
                onClick={() => setIsCalcOpen(false)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted border border-border transition-colors shadow-lg"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>
            <Calculator onClose={() => setIsCalcOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
"use client"

import { motion, useScroll, useTransform } from "framer-motion" 
import { useTranslation } from "react-i18next" 
import { Button } from "@/components/ui/button"
import { Smartphone, Crosshair } from "lucide-react"
import Magnetic from "./ui/magnetic" 

interface HeroProps {
  onOpenCalc: () => void;
}

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation() 

  const { scrollY } = useScroll()
  
  // Параллакс для монитора
  const monitorY = useTransform(scrollY, [0, 1000], [0, -100])
  const monitorScale = useTransform(scrollY, [0, 500], [1, 1.05])

  const initialDelay = 0.5;
  const smoothEase = [0.22, 1, 0.36, 1]

  return (
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
                onClick={onOpenCalc}
                size="lg" 
                className="relative group overflow-hidden bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto h-14 px-8 text-[16px] transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] border border-red-500/50 hover:border-red-400 rounded-xl"
              >
                <span className="relative z-10 font-semibold tracking-wide">{t("hero.btn", "Рассчитать систему")}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />
              </Button>
            </Magnetic>
          </div>

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
        <motion.div style={{ y: monitorY, scale: monitorScale }} className="flex justify-center lg:justify-end mt-12 lg:mt-0 w-full z-10 relative">
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-[30px] bg-black/20 dark:bg-black/40 blur-[20px] rounded-[100%] z-0" />
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2, ease: smoothEase as any, delay: initialDelay }} 
            className="w-full max-w-[540px] relative z-10"
          >
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 sm:-inset-10 bg-gradient-to-r from-red-600/20 to-red-500/10 blur-[60px] rounded-full opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-[12px] sm:rounded-[18px] p-1.5 sm:p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="relative bg-black rounded-[8px] sm:rounded-[12px] overflow-hidden border border-white/5">
                  <div className="grid grid-cols-2 gap-[2px] bg-neutral-950">
                    {["/cam1.webp", "/cam2.webp", "/cam3.webp", "/cam4.webp"].map((src, i) => (
                      <div key={i} className="relative overflow-hidden group/cam aspect-video sm:h-[150px] bg-neutral-900">
                        <img src={src} alt={`Cam ${i}`} className="w-full h-full object-cover group-hover/cam:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/20 group-hover/cam:bg-transparent transition-colors duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
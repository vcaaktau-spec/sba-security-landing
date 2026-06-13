"use client"

import { useTranslation } from "react-i18next"
import { Smartphone, Crosshair, Cpu, Eye } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import Magnetic from "./ui/magnetic"

interface HeroProps {
  onOpenCalc: () => void;
}

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const { scrollY } = useScroll()

  // Scroll animations for art objects
  const casingY = useTransform(scrollY, [0, 800], [0, -60])
  const lensY = useTransform(scrollY, [0, 800], [0, -110])
  const lensRotate = useTransform(scrollY, [0, 1000], [0, 120])
  const lensScale = useTransform(scrollY, [0, 600], [1, 1.08])
  
  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section className="magnet-section relative min-h-screen flex items-center overflow-hidden bg-transparent pt-20">
      
      {/* HUD Scanner lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-35 z-0">
        <div className="absolute top-10 left-10 text-[9px] font-mono text-foreground/50 tracking-wider space-y-1">
          <p>SYS.LOC: AKTAU_KZ [44.5152° N, 50.1717° E]</p>
          <p>SYS.NET: SECURE_VLAN_77</p>
          <p>STATUS: OPERATIONAL_24_7</p>
        </div>
        
        {/* Fine crosshairs in the background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[80vw] h-[80vw] max-w-[800px] border border-foreground/5 rounded-full border-dashed" />
          <div className="w-[60vw] h-[60vw] max-w-[600px] border border-foreground/5 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-0">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-start text-left">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-mono tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>SBA SECURITY SYSTEMS</span>
          </motion.div>

          <h1 className="text-[38px] leading-[1.05] sm:text-[48px] lg:text-[60px] font-extrabold tracking-tight text-foreground drop-shadow-sm">
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
            className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-12 text-[14px] font-mono text-foreground/80"
          >
            {[
              { icon: Smartphone, text: t("hero.feature1", "Удаленный доступ") },
              { icon: Crosshair, text: t("hero.feature2", "Полный Контроль") }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-[40px] h-[40px] rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <item.icon size={18} />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT CONTENT: Dynamic SVG Aperture Art Object & Moniter */}
        <div className="relative flex items-center justify-center w-full min-h-[350px] sm:min-h-[450px]">
          
          {/* Parallax Background HUD Ring */}
          <motion.div 
            style={{ y: casingY, scale: lensScale }}
            className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] z-0 opacity-40 dark:opacity-60"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground/15 dark:text-foreground/25">
              {/* Outer ticking boundary */}
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1, 3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.2" />
              {/* Telemetry markers */}
              <path d="M 50 2 L 50 8 M 50 98 L 50 92 M 2 50 L 8 50 M 98 50 L 92 50" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </motion.div>

          {/* Core Lens SVG Aperture (Rotating Scroll-Linked Art Object) */}
          <motion.div 
            style={{ y: lensY, rotate: lensRotate, scale: lensScale }}
            className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] z-10 filter drop-shadow-[0_10px_30px_rgba(220,38,38,0.15)] cursor-pointer"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-red-600/70 dark:text-red-500/80">
              <defs>
                <radialGradient id="lensGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="80%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Glow center */}
              <circle cx="50" cy="50" r="30" fill="url(#lensGlow)" />

              {/* Aperture blades */}
              <path d="M 50 15 L 68 32 L 54 44 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
              <path d="M 85 50 L 68 68 L 56 54 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
              <path d="M 50 85 L 32 68 L 46 56 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
              <path d="M 15 50 L 32 32 L 44 46 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />

              {/* Lens housing details */}
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3, 1" />
              <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              
              {/* Outer hud brackets */}
              <path d="M 20 10 A 42 42 0 0 1 80 10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
              <path d="M 80 90 A 42 42 0 0 1 20 90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 5" />
            </svg>
          </motion.div>

          {/* Floating Telemetry Box (Parallax Card) */}
          <motion.div
            style={{ y: useTransform(scrollY, [0, 800], [40, -140]) }}
            className="absolute bottom-6 right-2 sm:right-6 bg-black/70 backdrop-blur-md border border-red-500/20 rounded-xl p-4 z-20 w-[160px] sm:w-[190px] font-mono text-[10px] text-red-500/90 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2 border-b border-red-500/25 pb-1">
              <Cpu size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold">TELEMETRY_LIVE</span>
            </div>
            <div className="space-y-1 text-foreground/80">
              <p>REC_RATE: 60 FPS</p>
              <p>ENCRYPTION: AES-256</p>
              <p>BANDWIDTH: 1.2 GB/S</p>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-red-500/10">
                <span>SIGNAL</span>
                <span className="text-emerald-500 font-bold">100% OK</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Target Overlay (Micro-interaction) */}
          <motion.div
            style={{ y: useTransform(scrollY, [0, 800], [-30, -50]) }}
            className="absolute top-10 left-2 sm:left-6 border border-foreground/10 rounded-lg p-2.5 bg-background/40 backdrop-blur-sm z-20 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 animate-pulse">
              <Eye size={16} />
            </div>
            <div className="font-mono text-[9px] text-foreground/75">
              <p className="font-bold text-foreground">LASER_SCAN</p>
              <p className="text-muted-foreground">LOCK ACTIVE</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
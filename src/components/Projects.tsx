"use client"

import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Instagram, Eye, ExternalLink } from "lucide-react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

export const Projects = () => {
  const { t } = useTranslation()
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const monitorRef = useRef<HTMLDivElement>(null)
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

  const handleMove = (clientX: number) => {
    if (!monitorRef.current) return
    const rect = monitorRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(position)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-[34px] sm:text-[46px] lg:text-[56px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("projects.insta_title1", "Процесс работы")}
            </span>
            <span className="block w-full text-red-600 mt-2">
              {t("projects.insta_title2", "в реальном времени")}
            </span>
          </h2>
          
          <div className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("projects.insta_subtitle", "Сравните качество: дешевое аналоговое оборудование с слепыми зонами против цифровых систем SBA 4K.")}
          </div>
        </div>

        {/* COMPARISON SCREEN (Art Object / Interactive Monitor) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: smoothEase }}
          className="relative w-full max-w-[900px] aspect-video bg-black border border-border/50 rounded-[28px] overflow-hidden shadow-2xl select-none cursor-ew-resize"
          ref={monitorRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleTouchMove}
        >
          {/* Base Layer: CHEAP CAMERA (Blurred, low resolution, scanlines) */}
          <div className="absolute inset-0 w-full h-full filter blur-[3px] grayscale saturate-50 brightness-[65%] contrast-125 z-0 bg-[#151515]">
            {/* Simulated warehouse grid view */}
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              {/* Scanline pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none" />
              <div className="text-center space-y-2 opacity-80">
                <p className="text-xl font-mono tracking-widest text-neutral-500">// ANALOG_SIGNAL_LOST</p>
                <p className="text-xs font-mono text-neutral-600">RESOLUTION: 240p @ 12FPS // EXPOSURE: AUTO_LOW</p>
              </div>
            </div>
          </div>

          {/* Cheap HUD Overlays */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-red-500 bg-red-950/40 px-2.5 py-1 rounded border border-red-500/20 tracking-wider">
            ANALOG CAM // 240p // NO WDR
          </div>

          {/* Top Layer: SBA PREMIUM CAMERA (Sharp, active target lock, high contrast) */}
          <div 
            className="absolute inset-0 w-full h-full z-10 overflow-hidden bg-neutral-950"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            {/* Crisp Simulated View */}
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
              {/* Thin digital HUD lines */}
              <div className="absolute inset-8 border border-emerald-500/10 rounded-lg pointer-events-none">
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-emerald-500" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-emerald-500" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-emerald-500" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-emerald-500" />
              </div>

              {/* Central Target Lock */}
              <motion.div 
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 border border-emerald-500/35 rounded-full flex items-center justify-center relative"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute -top-1 w-4 h-1 bg-emerald-500" />
                <div className="absolute -bottom-1 w-4 h-1 bg-emerald-500" />
              </motion.div>

              <div className="text-center mt-4 space-y-1 relative z-20">
                <p className="text-base font-mono font-bold tracking-widest text-emerald-500">SBA DIGITAL 4K [LIVE]</p>
                <p className="text-[10px] font-mono text-emerald-500/70">WDR: ON // 8MP @ 60FPS // COLOR_NIGHT: ON</p>
              </div>
            </div>
          </div>

          {/* Premium HUD Overlays */}
          <div className="absolute top-4 right-4 z-20 font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30 tracking-wider">
            SBA DIGITAL // 4K UHD // ENCRYPTED
          </div>

          {/* Target Indicators (Lock elements) */}
          <div className="absolute bottom-4 left-4 z-20 font-mono text-[9px] text-foreground/50 tracking-wider">
            // SLIDE MOUSE TO COMPARE QUALITY
          </div>

          {/* Split bar handle */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-600 z-30 pointer-events-none filter drop-shadow-[0_0_6px_rgba(220,38,38,0.8)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-600 border border-red-400/50 flex items-center justify-center text-white shadow-2xl">
              <Eye size={14} className="animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Instagram profile linkage */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <Instagram size={20} className="text-red-500" />
            <span className="font-mono text-sm font-bold">@toosba7292</span>
          </div>
          <a 
            href="https://instagram.com/toosba7292" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-md"
          >
            <span>{t("projects.insta_watch", "Смотреть в Instagram")}</span>
            <ExternalLink size={14} />
          </a>
        </div>

      </motion.div>
    </section>
  )
}
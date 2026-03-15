"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

export const Preloader = () => {
  const location = useLocation()
  // Проверяем, находимся ли мы на странице дашборда
  const isDashboard = location.pathname.startsWith("/dashboard")

  const [progress, setProgress] = useState(0)
  // Если это дашборд, изначально ставим false, чтобы прелоадер не появился вообще
  const [isLoading, setIsLoading] = useState(!isDashboard)

  useEffect(() => {
    // Если мы на дашборде, сразу выходим из useEffect и возвращаем скролл
    if (isDashboard) {
      document.body.style.overflow = "unset"
      return
    }

    document.body.style.overflow = "hidden"
    window.scrollTo(0, 0)

    let start = 0;
    let animationFrameId: number;
    const duration = 2000; // 2 секунды для комфортной загрузки

    const easeInOutQuart = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

    const animateProgress = (timestamp: number) => {
      if (!start) start = timestamp;
      const progressTime = timestamp - start;
      const percent = Math.min(progressTime / duration, 1);
      const easedPercent = easeInOutQuart(percent);
      setProgress(Math.floor(easedPercent * 100));

      if (progressTime < duration) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "unset";
        }, 400); // Небольшая пауза после заполнения полосы на 100%
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = "unset";
    }
  }, [isDashboard])

  // Если это дашборд, возвращаем null, чтобы полностью исключить рендер
  if (isDashboard) return null;

  const slideUp = {
    initial: { y: 0 },
    exit: {
      y: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any}
    }
  }

  const contentOut = {
    initial: { opacity: 1, y: 0 },
    exit: { 
      opacity: 0, 
      y: -40, // Взлет контента перед уходом фона
      transition: { duration: 0.6, ease: "easeIn" as any} 
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground"
        >
          {/* Аккуратная SVG сетка, подстраивающаяся под тему */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="preloaderGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#preloaderGrid)" />
            </svg>
          </div>
          
          <motion.div variants={contentOut} className="relative z-10 w-full max-w-[400px] flex flex-col items-center px-6">
            
            {/* Большой бейдж СБА */}
            <div className="flex flex-col items-center">
              <h1 className="text-[80px] sm:text-[120px] font-black tracking-tighter leading-none drop-shadow-sm">
                СБА
              </h1>
              <div className="flex items-center gap-2 mt-2 sm:mt-4">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Система Безопасности
                </span>
              </div>
            </div>
            
            {/* Игровая полоса загрузки (Progress Bar) */}
            <div className="w-full max-w-[200px] sm:max-w-[260px] h-[2px] sm:h-[3px] bg-foreground/10 mt-12 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
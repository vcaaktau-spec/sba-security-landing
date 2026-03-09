"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const Preloader = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    window.scrollTo(0, 0)

    let start = 0;
    let animationFrameId: number;
    const duration = 2000; // Немного ускорим до 2с для мобилок

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
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = "unset";
    }
  }, [])

  const slideUp = {
    initial: { top: 0 },
    exit: {
      top: "-100vh",
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any, delay: 0.1 }
    }
  }

  const contentOut = {
    initial: { opacity: 1, y: 0 },
    exit: { 
      opacity: 0, 
      y: -40, // Уводим вверх для логики "взлета"
      transition: { duration: 0.6, ease: "easeIn" as any } 
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          {/* Сетка без блюра (маска сама по себе тяжелая) */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <motion.div variants={contentOut} className="relative z-10 w-full max-w-[300px] flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">SBA SYSTEM</span>
            </div>
            
            <div className="text-[90px] sm:text-[130px] font-black tracking-tighter leading-none flex items-baseline tabular-nums">
              {progress}
              <span className="text-2xl sm:text-4xl text-white/10 ml-2">%</span>
            </div>
            
            <div className="w-full h-[1px] bg-white/5 mt-10 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-red-600"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
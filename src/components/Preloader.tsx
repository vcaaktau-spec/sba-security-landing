"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export const Preloader = () => {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Блокируем скролл и принудительно сбрасываем страницу в самый верх
    document.body.style.overflow = "hidden"
    window.scrollTo(0, 0)

    let start = 0;
    let animationFrameId: number;
    const duration = 2400; // 2.4 секунды на идеальную загрузку

    // Математическая функция плавности (Ease In Out Quart)
    const easeInOutQuart = (t: number) => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

    const animateProgress = (timestamp: number) => {
      if (!start) start = timestamp;
      const progressTime = timestamp - start;
      const percent = Math.min(progressTime / duration, 1);
      
      // Применяем кривую к нашему счетчику
      const easedPercent = easeInOutQuart(percent);
      setProgress(Math.floor(easedPercent * 100));

      if (progressTime < duration) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else {
        // Как только 100%, даем паузу в 600мс и убираем прелоадер
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = "unset";
        }, 600);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.overflow = "unset";
    }
  }, [])

  // Кинематографичный вылет фона вверх
  const slideUp = {
    initial: { top: 0 },
    exit: {
      top: "-100vh",
      transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] as any, delay: 0.2 }
    }
  }

  // Параллакс: контент уходит вниз и растворяется, пока фон летит вверх
  const contentOut = {
    initial: { opacity: 1, y: 0 },
    exit: { 
      opacity: 0, 
      y: 80, 
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as any } 
    }
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white"
        >
          {/* Деликатный шум/сетка на фоне */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          
          <motion.div
            variants={contentOut}
            className="relative z-10 w-full max-w-[300px] flex flex-col items-center"
          >
            {/* Бренд */}
            <div className="flex items-center gap-3 mb-8 overflow-hidden">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="w-2 h-2 bg-red-600 rounded-full" 
              />
              <motion.span 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70"
              >
                SBA SYSTEM
              </motion.span>
            </div>
            
            {/* Огромный счетчик с Tabular Nums (чтобы цифры не дергались по ширине) */}
            <div className="text-[100px] sm:text-[140px] font-black tracking-tighter leading-none flex items-baseline justify-center tabular-nums w-full">
              {progress}
              <span className="text-3xl sm:text-5xl text-white/20 ml-2">%</span>
            </div>
            
            {/* Прогресс-бар: Идеально плавный (GPU accelerated) */}
            <div className="w-full h-[1px] bg-white/10 mt-12 overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, ease: [0.76, 0, 0.24, 1] }} // Синхронизировано с JS функцией
              />
            </div>
            
            {/* Статус */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
              className="mt-6 text-[9px] uppercase tracking-[0.3em] text-white/30 font-semibold"
            >
              Инициализация интерфейса...
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
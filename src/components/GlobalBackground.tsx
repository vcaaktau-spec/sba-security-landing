"use client"

import { motion, useScroll, useTransform } from "framer-motion"

export const GlobalBackground = () => {
  const { scrollY } = useScroll()
  
  // Легкий глобальный параллакс для фона, чтобы он немного реагировал на скролл страницы
  const backgroundY = useTransform(scrollY, [0, 2000], [0, 150])
  const gridY = useTransform(scrollY, [0, 2000], [0, 50])

  // Точки для радара
  const radarTargets = [
    { top: "35%", left: "40%", delay: 0 },
    { top: "60%", left: "65%", delay: 1.5 },
    { top: "25%", left: "70%", delay: 3 },
    { top: "75%", left: "30%", delay: 4.5 },
    { top: "45%", left: "20%", delay: 6 },
    { top: "15%", left: "50%", delay: 2.5 },
    { top: "85%", left: "55%", delay: 5.5 },
    { top: "50%", left: "80%", delay: 1 },
  ]

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 flex items-center justify-center w-full h-full">
        
        {/* Базовое пульсирующее свечение */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] bg-red-600/10 rounded-full blur-[100px]" 
        />

        {/* Надежная SVG Сетка */}
        <motion.div style={{ y: gridY }} className="absolute inset-0 opacity-20 dark:opacity-30">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="globalGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                <circle cx="60" cy="60" r="1.5" fill="currentColor" opacity="0.8"/>
              </pattern>
              <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
                <stop offset="10%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#globalGrid)" mask="url(#mask)" />
            <mask id="mask">
              <rect width="100%" height="100%" fill="url(#vignette)" />
            </mask>
          </svg>
        </motion.div>

        {/* Радар */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[800px] border border-red-500/10 rounded-full flex items-center justify-center opacity-70"
        >
           <div className="w-[400px] h-[400px] border border-red-500/10 rounded-full" />
           <div className="absolute top-0 w-[2px] h-[400px] bg-gradient-to-b from-transparent to-red-500/20" />
           <div className="absolute right-0 h-[2px] w-[400px] bg-gradient-to-l from-transparent to-red-500/20" />
        </motion.div>

        {/* Пульсирующие точки радара */}
        <div className="absolute w-[800px] h-[800px]">
          {radarTargets.map((target, index) => (
            <motion.div
              key={index}
              className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
              style={{ top: target.top, left: target.left }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [0.5, 1.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: target.delay,
                ease: "easeInOut",
                repeatDelay: 1.5 
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-red-500 rounded-full animate-ping opacity-60" />
            </motion.div>
          ))}
        </div>

      </motion.div>

      {/* Глобальный сканирующий лазер */}
      <motion.div
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-20"
      />
    </div>
  )
}
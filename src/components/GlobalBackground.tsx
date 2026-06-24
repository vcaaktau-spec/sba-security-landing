"use client"

import { motion, useScroll, useTransform } from "framer-motion"

export const GlobalBackground = () => {
  const { scrollY } = useScroll()
  
  // Параллакс эффект для глубины
  const backgroundY = useTransform(scrollY, [0, 2000], [0, 100])
  const gridY = useTransform(scrollY, [0, 2000], [0, 40])

  // Точки для радара в процентах (идеально для мобилок и ПК)
  const cctvTargets = [
    { top: "25%", left: "20%", delay: 0, code: "SYS-01" },
    { top: "65%", left: "75%", delay: 1.2, code: "NET-44" },
    { top: "15%", left: "70%", delay: 3.5, code: "SEC-9" },
    { top: "80%", left: "30%", delay: 2.1, code: "DAT-2" },
    { top: "45%", left: "85%", delay: 4.8, code: "UPL-5" },
    { top: "55%", left: "15%", delay: 0.5, code: "CAM-3" },
  ]

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none select-none">
      
      {/* Углы видоискателя камеры (CCTV Corners) */}
      <div className="absolute inset-4 md:inset-8 opacity-45 dark:opacity-60 transition-opacity duration-700">
        <div className="absolute top-0 left-0 w-8 h-8 md:w-16 md:h-16 border-t border-l border-slate-300 dark:border-white/[0.08]" />
        <div className="absolute top-0 right-0 w-8 h-8 md:w-16 md:h-16 border-t border-r border-slate-300 dark:border-white/[0.08]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 md:w-16 md:h-16 border-b border-l border-slate-300 dark:border-white/[0.08]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 md:w-16 md:h-16 border-b border-r border-slate-300 dark:border-white/[0.08]" />
      </div>

      <motion.div style={{ y: backgroundY }} className="absolute inset-0 flex items-center justify-center w-full h-full">
        
        {/* Базовое техно-свечение в тонах бренда */}
        <motion.div 
          animate={{ scale: [1, 1.03, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[120vw] max-w-[1000px] aspect-square bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[100px] md:blur-[120px]" 
        />

        {/* Адаптивная IT Сетка */}
        <motion.div style={{ y: gridY }} className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cctvGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                {/* Линии сетки */}
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground/5 dark:text-foreground/10"/>
                {/* Перекрестия на стыках (IT style) */}
                <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke="currentColor" strokeWidth="1" className="text-foreground/10 dark:text-foreground/20" />
              </pattern>
              <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
                <stop offset="20%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#cctvGrid)" mask="url(#mask)" />
            <mask id="mask">
              <rect width="100%" height="100%" fill="url(#vignette)" />
            </mask>
          </svg>
        </motion.div>

        {/* Центральный Радар / Компас */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute w-[150vw] sm:w-[90vw] max-w-[700px] aspect-square border border-foreground/[0.03] dark:border-foreground/[0.06] rounded-full flex items-center justify-center opacity-60"
        >
           {/* Внутренние кольца */}
           <div className="w-[60%] h-[60%] border border-foreground/[0.03] dark:border-foreground/[0.06] rounded-full border-dashed" />
           <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/[0.05] to-transparent" />
           <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-foreground/[0.05] to-transparent" />
        </motion.div>

        {/* Захват целей (Target Locks) */}
        <div className="absolute inset-0 max-w-7xl mx-auto">
          {cctvTargets.map((target, index) => (
            <div key={index} className="absolute" style={{ top: target.top, left: target.left }}>
              <motion.div
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [1.15, 1, 1, 0.95],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: target.delay,
                  ease: "easeInOut",
                  repeatDelay: 2
                }}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Рамка захвата в красном цвете бренда */}
                <div className="w-6 h-6 md:w-8 md:h-8 border border-red-500/20 dark:border-red-500/40 relative flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-600 dark:bg-red-500" />
                  {/* Уголочки рамки */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-500/50 dark:border-red-500" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-500/50 dark:border-red-500" />
                </div>
                {/* Текст статуса */}
                <div className="absolute top-full mt-1 text-[8px] md:text-[9px] font-mono text-red-600/50 dark:text-red-500/60 tracking-wider">
                  {target.code}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

      </motion.div>

      {/* Линия сканирования (Smooth Scanner) */}
      <motion.div
        animate={{ y: ["-10vh", "110vh"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-transparent to-red-500/[0.02] dark:to-red-500/[0.04] border-b border-red-500/[0.06] dark:border-red-500/[0.12] z-20"
      />
    </div>
  )
}
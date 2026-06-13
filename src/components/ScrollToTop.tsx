"use client"

import { useState } from "react"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { ArrowUpToLine } from "lucide-react"

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()

  // Оптимизированный слушатель скролла
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 500)
  })

  const goToTop = () => {
    // ВАЖНО: Используем движок Lenis, чтобы магнит не пытался остановить скролл
    const win = window as unknown as { lenis?: { scrollTo: (target: number, options: { duration: number; easing: (t: number) => number }) => void } }
    if (win.lenis) {
      win.lenis.scrollTo(0, { 
        duration: 1.5, 
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
      })
    } else {
      // Фолбек для безопасности
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[150]"
        >
          <button
            onClick={goToTop}
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-background/60 dark:bg-black/60 backdrop-blur-xl border border-border/50 hover:border-red-500/50 shadow-2xl transition-all duration-500 overflow-hidden rounded-xl sm:rounded-2xl"
            aria-label="Наверх"
          >
            {/* HUD Углы */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/50 rounded-tl-xl sm:rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/50 rounded-tr-xl sm:rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-500/50 rounded-bl-xl sm:rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500/50 rounded-br-xl sm:rounded-br-2xl" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/[0.1] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

            <ArrowUpToLine 
              size={20} 
              className="relative z-10 text-muted-foreground group-hover:text-red-500 transition-all duration-300 group-hover:-translate-y-1" 
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
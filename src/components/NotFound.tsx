"use client"

import { motion } from "framer-motion"
import { CameraOff, Home, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [time, setTime] = useState<string>("--:--:--")

  // Живые часы для интерфейса камеры (чтобы не было ошибок гидратации, запускаем только на клиенте)
  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-red-500/30 font-mono">
      
      {/* Эффект шума / сканлайнов (Scanlines) */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)" }} 
      />
      
      {/* Затемнение по краям (Виньетка) */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />

      {/* CCTV Интерфейс: Верхний левый угол */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <span className="w-3 h-3 rounded-full bg-red-600 animate-[pulse_1s_ease-in-out_infinite]" />
        <span className="text-xl font-bold tracking-widest text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">REC</span>
      </div>

      {/* CCTV Интерфейс: Верхний правый угол */}
      <div className="absolute top-6 right-6 z-20 text-white/50 text-sm font-bold tracking-widest uppercase">
        CAM_04_OFFLINE
      </div>

      {/* CCTV Интерфейс: Нижний левый угол (Живое время) */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col text-white/50 text-xs sm:text-sm font-bold tracking-widest">
        <span>{new Date().toLocaleDateString('ru-RU')}</span>
        <span>{time}</span>
      </div>

      {/* CCTV Интерфейс: Нижний правый угол */}
      <div className="absolute bottom-6 right-6 z-20 text-white/50 text-xs sm:text-sm font-bold tracking-widest">
        SYS_ERR_404
      </div>

      {/* Перекрестие видоискателя (на фоне) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] border border-white/5 rounded-full pointer-events-none z-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-white/5 absolute" />
        <div className="h-full w-[1px] bg-white/5 absolute" />
        {/* Центральный прицел */}
        <div className="w-10 h-10 border-2 border-white/10 rounded-full" />
      </div>

      {/* Основной контент */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex flex-col items-center text-center px-6 w-full max-w-lg"
      >
        <motion.div 
          animate={{ opacity: [1, 0.4, 1, 0.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="mb-6 relative"
        >
          {/* Эффект глитча для иконки */}
          <CameraOff size={80} className="text-red-600 relative z-10" />
          <CameraOff size={80} className="text-red-500/50 absolute top-0 left-1 blur-[8px] z-0" />
        </motion.div>

        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-2">
          404
        </h1>
        
        <div className="flex items-center gap-2 mb-6 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 backdrop-blur-sm shadow-[0_0_20px_rgba(220,38,38,0.1)]">
          <AlertTriangle size={18} />
          <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase mt-0.5">
            Сигнал потерян
          </h2>
        </div>

        <p className="text-muted-foreground/80 text-sm md:text-base font-sans mb-10 leading-relaxed max-w-sm">
          Объект покинул зону видимости. Страница, которую вы ищете, была удалена или перемещена в другой сектор.
        </p>

        <a href="/" className="group relative overflow-hidden bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold font-sans text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <Home size={18} />
          <span className="mt-0.5">Вернуться на базу</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
        </a>
      </motion.div>
    </main>
  )
}
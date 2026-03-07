"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { MessageCircle, X, ArrowRight, ShieldCheck, Zap } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { Button } from "./ui/button" // Оставил твой импорт, если он используется внутри формы

export const Cta = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  // Блокировка скролла страницы при открытой модалке
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isModalOpen])

  // Параллакс для легкого движения контента при скролле
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase, delay }
    })
  }

  return (
    <>
      <section
        id="cta"
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-background"
      >
        {/* ПРЕМИАЛЬНЫЙ BACKGROUND (SaaS Vibe) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Глубокий темный слой */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-background" />
          
          {/* Пульсирующие неоновые орбиты */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1200px] h-[400px] sm:h-[600px] bg-red-600/10 blur-[150px] rounded-[100%]" 
          />
          
          {/* Декоративная сетка по центру */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
        </div>

        {/* ЦЕНТРАЛЬНЫЙ КОНТЕНТ */}
        <div className="relative z-10 w-full max-w-[1000px] px-4 sm:px-6">
          <motion.div 
            ref={ref}
            style={{ y: contentY }}
            className="flex flex-col items-center text-center bg-white/5 dark:bg-[#0a0a0a]/40 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[40px] p-8 sm:p-16 lg:p-24 shadow-2xl relative overflow-hidden"
          >
            {/* Глянцевый блик внутри карточки */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Иконка */}
            <motion.div 
              custom={0.1} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500/20 to-red-900/20 rounded-full flex items-center justify-center mb-8 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]"
            >
              <Zap size={40} className="text-red-500" strokeWidth={1.5} />
            </motion.div>

            {/* Заголовок */}
            <motion.h2 
              custom={0.2} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6"
            >
              Готовы обезопасить свой <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
                бизнес и дом?
              </span>
            </motion.h2>

            {/* Описание (Обобщенное) */}
            <motion.p 
              custom={0.3} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12"
            >
              От умного видеонаблюдения до корпоративных сетей и пожарной сигнализации. Подберём оптимальное решение, спроектируем и установим под ключ с гарантией.
            </motion.p>

            {/* КНОПКИ ДЕЙСТВИЯ */}
            <motion.div 
              custom={0.4} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
            >
              {/* Главная кнопка (открывает модалку) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative w-full sm:w-auto px-8 h-16 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] border border-red-500/50 hover:border-red-400 overflow-hidden flex items-center justify-center gap-3"
              >
                {/* Блик на кнопке */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />
                <span className="relative z-10">Рассчитать проект</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" size={20} />
              </button>

              {/* Второстепенная кнопка (WhatsApp) */}
              <a
                href="https://wa.me/77000000000" // Твоя ссылка
                target="_blank"
                rel="noreferrer"
                className="group relative w-full sm:w-auto px-8 h-16 bg-transparent text-foreground rounded-2xl font-bold text-lg transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-foreground/30 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-foreground/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10">Написать в WhatsApp</span>
                <MessageCircle className="relative z-10 text-green-500" size={20} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ВЫЕЗЖАЮЩАЯ ПАНЕЛЬ (DRAWER MODAL) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Затемнение фона (Backdrop) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Сама панель (выезжает справа) */}
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="relative w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col"
            >
              {/* Шапка панели */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3 text-red-500 font-bold">
                  <ShieldCheck size={24} />
                  <span>Заявка на расчет</span>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Тело формы */}
              <div className="p-6 flex-grow overflow-y-auto">
                <p className="text-muted-foreground mb-8">
                  Оставьте свои контактные данные, и наш инженер свяжется с вами для бесплатной консультации и точного расчета.
                </p>

                <form className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground">Ваше имя</label>
                    <input 
                      type="text" 
                      placeholder="Иван Иванов" 
                      className="h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground">Номер телефона</label>
                    <input 
                      type="tel" 
                      placeholder="+7 (___) ___-__-__" 
                      className="h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground">Что вас интересует?</label>
                    <select className="h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer">
                      <option>Видеонаблюдение</option>
                      <option>Охранно-пожарная сигнализация</option>
                      <option>Локальные сети (СКС/Wi-Fi)</option>
                      <option>IT Услуги / Разработка</option>
                      <option>Комплексная безопасность</option>
                    </select>
                  </div>

                  <button 
                    type="button" // Заглушка, позже поменяешь на submit
                    className="mt-6 w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors duration-300 shadow-lg shadow-red-500/20"
                  >
                    Отправить заявку
                  </button>
                </form>

                <p className="text-xs text-center text-muted-foreground mt-6">
                  Нажимая на кнопку, вы даете согласие на обработку персональных данных.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
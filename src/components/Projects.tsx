"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Instagram, ExternalLink, Play } from "lucide-react"

// Убрали тексты (caption), оставили только картинки и тип (видео/фото)
const localInstaPosts = [
  { id: 1, image: "/instagram/1.jpeg", isVideo: true },
  { id: 2, image: "/instagram/2.jpeg", isVideo: false },
  { id: 3, image: "/instagram/3.jpeg", isVideo: true },
  { id: 4, image: "/instagram/4.jpeg", isVideo: false },
  { id: 5, image: "/instagram/5.jpeg", isVideo: true },
  { id: 6, image: "/instagram/6.jpeg", isVideo: false },
]

export const Projects = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  // Параллакс контента (взят из Features)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  // Анимация карусели
  useEffect(() => {
    if (isInView && !isHovered) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          ease: "linear",
          duration: localInstaPosts.length * 4, // Чуть ускорили
          repeat: Infinity,
        },
      })
    } else {
      controls.stop()
    }
  }, [isInView, isHovered, controls])

  return (
    <section 
      id="projects" 
      ref={containerRef}
      // Жестко ограничиваем высоту одним экраном
      className="magnet-section relative w-full h-[100dvh] min-h-[600px] max-h-[900px] flex flex-col justify-center overflow-hidden bg-transparent border-t border-border/10"
    >
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col items-center justify-center h-full">
        
        {/* === СТИЛЬ ШАПКИ ИЗ FEATURES === */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16 shrink-0">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-4 sm:mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("projects.insta_title1", "Процесс работы")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("projects.insta_title2", "в реальном времени")}
            </span>
          </h2>
          
          <div className="text-[15px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("projects.insta_subtitle", "Следите за нашими текущими объектами и бэкстейджем напрямую в Instagram.")}
          </div>
        </div>

        {/* === НОВЫЙ СКЕЛЕТ: ЕДИНОЕ ОКНО === */}
        <div className="w-full bg-background/40 dark:bg-black/40 backdrop-blur-md rounded-[32px] sm:rounded-[48px] border border-border/50 shadow-[inset_0_4px_24px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden relative shrink-0">
          
          {/* Инста-Хедер внутри окна */}
          <div className="flex items-center justify-between p-4 sm:p-6 lg:px-8 lg:py-6 border-b border-border/50 bg-background/50">
            <div className="flex items-center gap-4">
              {/* Логотип с градиентом */}
              <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14">
                <div className="absolute inset-[-2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 animate-spin-slow" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-[2px] rounded-full border-2 border-background overflow-hidden bg-muted">
                  {/* СЮДА ВСТАВЛЯЕШЬ СВОЙ ЛОГОТИП */}
                  <img src="/instagram/logo.jpeg" alt="SBA Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=SBA&background=000&color=fff' }} />
                </div>
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base text-foreground tracking-tight">
                  toosba7292
                  <svg aria-label="Подтвержденный" className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001.504a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm5.706 9.21-6.5 6.495a1 1 0 0 1-1.414-.001l-3.5-3.503a1 1 0 1 1 1.414-1.414l2.794 2.796 5.793-5.79a1 1 0 0 1 1.414 1.416Z"></path></svg>
                </div>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-medium">СБА • Системы безопасности</span>
              </div>
            </div>

            <a 
              href="https://instagram.com/toosba7292" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-foreground text-background font-bold text-[10px] sm:text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span className="hidden sm:inline">{t("projects.insta_btn", "Перейти в профиль")}</span>
              <span className="sm:hidden">Перейти</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Карусель внутри окна */}
          <div 
            className="w-full relative flex items-center justify-center overflow-hidden py-4 sm:py-6 lg:py-8 bg-muted/10"
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            <motion.div 
              animate={controls}
              className="flex gap-3 sm:gap-4 lg:gap-6 px-4"
              style={{ width: "max-content" }}
            >
              {[...localInstaPosts, ...localInstaPosts, ...localInstaPosts].map((post, idx) => (
                <a 
                  key={`${post.id}-${idx}`}
                  href="https://instagram.com/toosba7292"
                  target="_blank"
                  rel="noopener noreferrer"
                  // Высота карточки адаптивная, чтобы влезть в экран
                  className="relative shrink-0 w-[180px] sm:w-[240px] lg:w-[280px] aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden group cursor-pointer border border-border/50 bg-muted/20"
                >
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground/30 font-bold text-xs absolute inset-0 z-0">
                    Фото {post.id}.jpeg
                  </div>
                  
                  <img 
                    src={post.image} 
                    alt="Instagram Post" 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10"
                    onError={(e) => { e.currentTarget.style.opacity = '0' }}
                  />

                  {post.isVideo && (
                    <div className="absolute top-3 right-3 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                      <Play size={12} className="ml-0.5 sm:ml-1 sm:w-3.5 sm:h-3.5" fill="currentColor" />
                    </div>
                  )}

                  {/* МИНИМАЛИСТИЧНЫЙ ОВЕРЛЕЙ ПРИ НАВЕДЕНИИ */}
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center z-30">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Instagram size={20} className="text-white" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {t("projects.insta_watch", "Смотреть")}
                    </span>
                  </div>
                </a>
              ))}
            </motion.div>
            
            {/* Легкие градиенты по краям для красоты скролла */}
            <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-background/40 to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-background/40 to-transparent pointer-events-none z-20" />
          </div>

        </div>

      </motion.div>
    </section>
  )
}
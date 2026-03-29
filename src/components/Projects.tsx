"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Instagram, ExternalLink, Play } from "lucide-react"

// Убрали лайки/комменты. Добавили ключи переводов для текста (captionKey).
const localInstaPosts = [
  { 
    id: 1, 
    image: "/instagram/1.jpeg", 
    captionKey: "projects.post1_cap", 
    isVideo: true 
  },
  { 
    id: 2, 
    image: "/instagram/2.jpeg", 
    captionKey: "projects.post2_cap", 
    isVideo: false 
  },
  { 
    id: 3, 
    image: "/instagram/3.jpeg", 
    captionKey: "projects.post3_cap", 
    isVideo: true 
  },
  { 
    id: 4, 
    image: "/instagram/4.jpeg", 
    captionKey: "projects.post4_cap", 
    isVideo: false 
  },
  { 
    id: 5, 
    image: "/instagram/5.jpeg", 
    captionKey: "projects.post5_cap", 
    isVideo: true 
  },
  { 
    id: 6, 
    image: "/instagram/6.jpeg", 
    captionKey: "projects.post6_cap", 
    isVideo: false 
  },
]

export const Projects = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Определяем мобилку (как в Features)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  // Параллакс контента (как в Features)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  // Анимация бесконечной бегущей строки
  useEffect(() => {
    if (isInView && !isHovered) {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          ease: "linear",
          duration: localInstaPosts.length * 5, // Скорость прокрутки
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
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 lg:py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      {/* КОНТЕНТ (С параллаксом) */}
      <motion.div style={{ y: contentY }} className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* === ВЕРХНЯЯ ЧАСТЬ: ИДЕНТИЧНА FEATURES === */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("projects.insta_title1", "Процесс работы")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("projects.insta_title2", "в реальном времени")}
            </span>
          </h2>
          
          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("projects.insta_subtitle", "Следите за нашими текущими объектами и бэкстейджем напрямую в Instagram.")}
          </div>
        </div>

        {/* INSTAGRAM ПРОФИЛЬ (ПЛАШКА) */}
        <motion.a 
          href="https://instagram.com/toosba7292" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center gap-6 p-5 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-background/40 dark:bg-black/40 border border-border/50 backdrop-blur-md shadow-lg mb-12 hover:border-red-500/30 hover:bg-background/60 transition-all group w-full max-w-3xl"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 animate-spin-slow opacity-70 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '4s' }} />
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-background overflow-hidden relative z-10 bg-muted flex items-center justify-center">
              <span className="font-black text-2xl text-foreground tracking-tighter">SBA</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-grow">
            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2 mb-1">
              @toosba7292
              <svg aria-label="Подтвержденный" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001.504a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm5.706 9.21-6.5 6.495a1 1 0 0 1-1.414-.001l-3.5-3.503a1 1 0 1 1 1.414-1.414l2.794 2.796 5.793-5.79a1 1 0 0 1 1.414 1.416Z"></path></svg>
            </h3>
            <p className="text-[13px] sm:text-sm text-muted-foreground font-medium mb-4 sm:mb-2">
              {t("projects.insta_desc", "Умные системы безопасности | Актау")} <br className="hidden sm:block"/>
              <span className="hidden sm:inline">{t("projects.insta_subdesc", "Показываем бэкстейдж с объектов 🎥")}</span>
            </p>
          </div>

          <div className="shrink-0 mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-red-600 text-white font-bold text-[11px] sm:text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 group-hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              {t("projects.insta_btn", "Перейти")} <ExternalLink size={14} />
            </div>
          </div>
        </motion.a>

        {/* БЕСКОНЕЧНАЯ КАРУСЕЛЬ */}
        <div 
          className="w-full relative flex items-center justify-center overflow-hidden mask-edges-horizontal py-4"
          onMouseEnter={() => !isMobile && setIsHovered(true)}
          onMouseLeave={() => !isMobile && setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <motion.div 
            animate={controls}
            className="flex gap-4 sm:gap-6 px-4"
            style={{ width: "max-content" }}
          >
            {/* Утраиваем массив для идеальной бесконечной прокрутки */}
            {[...localInstaPosts, ...localInstaPosts, ...localInstaPosts].map((post, idx) => (
              <a 
                key={`${post.id}-${idx}`}
                href="https://instagram.com/toosba7292"
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0 w-[240px] sm:w-[300px] aspect-[4/5] rounded-[24px] sm:rounded-3xl overflow-hidden group cursor-pointer border border-border/50 bg-muted/20 shadow-lg block"
              >
                {/* Картинка-заглушка на случай отсутствия файла */}
                <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground/30 font-bold text-sm absolute inset-0 z-0">
                  Фото {post.id}.jpeg
                </div>
                
                <img 
                  src={post.image} 
                  alt="Instagram Post" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                  onError={(e) => { e.currentTarget.style.opacity = '0' }}
                />

                {post.isVideo && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Play size={14} className="ml-0.5" fill="currentColor" />
                  </div>
                )}

                {/* Чистый оверлей при наведении: Текст + кнопка перехода */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-30">
                  <Instagram size={36} className="text-white/40 mb-4 -translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                  
                  <p className="text-white/90 text-sm sm:text-base font-medium line-clamp-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {t(post.captionKey)}
                  </p>
                  
                  <div className="mt-6 px-4 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest text-white font-bold translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 hover:bg-white/10 hover:border-white/50">
                    {t("projects.insta_watch", "Смотреть в Instagram")}
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

      </motion.div>
    </section>
  )
}
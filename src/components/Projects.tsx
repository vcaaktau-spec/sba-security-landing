"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Instagram, ExternalLink, Play, Heart, MessageCircle } from "lucide-react"

// Здесь лежат данные твоих постов. 
// Тебе нужно будет просто положить фотки 1.jpg, 2.jpg и т.д. в папку public/instagram/
const localInstaPosts = [
  { 
    id: 1, 
    image: "/instagram/1.jpeg", 
    caption: "Монтаж СКУД и видеонаблюдения на новом объекте 🔧", 
    likes: "124", 
    comments: "12", 
    isVideo: true 
  },
  { 
    id: 2, 
    image: "/instagram/2.jpeg", 
    caption: "Проектирование серверной: прокладка СКС ⚡️", 
    likes: "89", 
    comments: "4", 
    isVideo: false 
  },
  { 
    id: 3, 
    image: "/instagram/3.jpeg", 
    caption: "Финальный этап настройки пожарной сигнализации 🔥", 
    likes: "215", 
    comments: "18", 
    isVideo: true 
  },
  { 
    id: 4, 
    image: "/instagram/4.jpeg", 
    caption: "Завершили крупный проект для бизнес-центра 🏢", 
    likes: "342", 
    comments: "25", 
    isVideo: false 
  },
  { 
    id: 5, 
    image: "/instagram/5.jpeg", 
    caption: "Обслуживание камер. Качество картинки до/после 📸", 
    likes: "156", 
    comments: "9", 
    isVideo: true 
  },
  { 
    id: 6, 
    image: "/instagram/6.jpeg", 
    caption: "Сборка телекоммуникационного шкафа 🛠", 
    likes: "198", 
    comments: "14", 
    isVideo: false 
  },
]

export const Projects = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

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
    <section id="projects" className="relative w-full py-20 lg:py-24 overflow-hidden bg-transparent border-t border-border/10">
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* Заголовок */}
        <div className="w-full flex flex-col items-center text-center mb-10 lg:mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-white/5 text-[11px] uppercase tracking-[0.2em] font-bold text-foreground"
          >
            <Instagram size={14} className="text-pink-500" />
            Social Media
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-[36px] sm:text-[48px] lg:text-[64px] font-black uppercase tracking-tighter leading-[1.1] mb-6 flex flex-col items-center w-full"
          >
            <span className="block w-full text-foreground">{t("projects.insta_title1", "Процесс работы")}</span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">{t("projects.insta_title2", "в реальном времени")}</span>
          </motion.h2>
        </div>

        {/* INSTAGRAM ПРОФИЛЬ (ПЛАШКА) */}
        <motion.a 
          href="https://instagram.com/toosba7292" 
          target="_blank" 
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-[32px] bg-background/50 border border-border/50 backdrop-blur-xl shadow-2xl mb-12 hover:border-red-500/30 hover:bg-muted/30 transition-all group w-full max-w-3xl"
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
            <p className="text-sm text-muted-foreground font-medium mb-4">
              {t("projects.insta_desc", "Умные системы безопасности | Актау")} <br/>
              {t("projects.insta_subdesc", "Показываем бэкстейдж с объектов 🎥")}
            </p>
          </div>

          <div className="shrink-0 mt-4 sm:mt-0">
            <div className="px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/20 group-hover:bg-red-700 transition-colors flex items-center gap-2">
              {t("projects.insta_btn", "Перейти")} <ExternalLink size={14} />
            </div>
          </div>
        </motion.a>

        {/* БЕСКОНЕЧНАЯ КАРУСЕЛЬ */}
        <div 
          ref={containerRef}
          className="w-full relative flex items-center justify-center overflow-hidden mask-edges-horizontal py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
                className="relative shrink-0 w-[260px] sm:w-[300px] aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer border border-border/50 bg-muted/20 shadow-lg block"
              >
                {/* Картинка: если файла нет, будет просто серый фон, пока ты не загрузишь фотки */}
                <div className="w-full h-full bg-muted/50 flex items-center justify-center text-muted-foreground/30 font-bold text-sm absolute inset-0 z-0">
                  Фото {post.id}.jpg
                </div>
                
                <img 
                  src={post.image} 
                  alt="Instagram Post" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                  onError={(e) => { e.currentTarget.style.opacity = '0' }} // Скрываем иконку битой картинки, если файла еще нет
                />

                {post.isVideo && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Play size={14} className="ml-0.5" fill="currentColor" />
                  </div>
                )}

                {/* Оверлей при наведении с лайками и текстом */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center z-30">
                  <div className="flex gap-4 mb-4 -translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-1.5 text-white font-bold"><Heart size={18} fill="currentColor"/> {post.likes}</div>
                    <div className="flex items-center gap-1.5 text-white font-bold"><MessageCircle size={18} fill="currentColor"/> {post.comments}</div>
                  </div>
                  <p className="text-white/90 text-sm font-medium line-clamp-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {post.caption}
                  </p>
                  <div className="mt-4 text-[10px] uppercase tracking-widest text-red-400 font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {t("projects.insta_watch", "Смотреть в Instagram")}
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  )
}
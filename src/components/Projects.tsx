"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { useInView } from "react-intersection-observer"
import { Camera, HardDrive, Clock, Flame, Shield, Network, Lock, ChevronRight, ChevronLeft } from "lucide-react"

export type BadgeType = "camera" | "storage" | "time" | "fire" | "network" | "access" | "shield"

export interface ProjectBadge {
  type: BadgeType
  value: string | number
}

interface ProjectProps {
  id: string
  title: string
  categoryKey: string
  descriptionKey: string
  badges: ProjectBadge[]
  price: string
  image: string
}

const getBadgeIcon = (type: BadgeType) => {
  switch (type) {
    case "camera": return <Camera size={14} className="text-red-500" />
    case "storage": return <HardDrive size={14} className="text-red-500" />
    case "time": return <Clock size={14} className="text-red-500" />
    case "fire": return <Flame size={14} className="text-red-500" />
    case "network": return <Network size={14} className="text-red-500" />
    case "access": return <Lock size={14} className="text-red-500" />
    case "shield": return <Shield size={14} className="text-red-500" />
    default: return null
  }
}

export const Projects = () => {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "-10% 0px" })
  const [[page, direction], setPage] = useState([0, 0])
  const [isPaused, setIsPaused] = useState(false)

  const projectsData: ProjectProps[] = [
    {
      id: "01",
      title: "Tetys Blu",
      categoryKey: "projects.p1_cat",
      descriptionKey: "projects.p1_desc",
      badges: [
        { type: "camera", value: "64 камеры" },
        { type: "time", value: "~30 дней" }
      ],
      price: "960 000 ₸",
      image: "/projects/tetys.webp",
    },
    {
      id: "02",
      title: "Entro",
      categoryKey: "projects.p2_cat",
      descriptionKey: "projects.p2_desc",
      badges: [
        { type: "camera", value: "6 камер" },
        { type: "fire", value: "12 датчиков" },
        { type: "time", value: "3 дня" }
      ],
      price: "1 183 350 ₸",
      image: "/projects/entro.webp",
    },
    {
      id: "03",
      title: "Автокраски 285",
      categoryKey: "projects.p3_cat",
      descriptionKey: "projects.p3_desc",
      badges: [
        { type: "fire", value: "24 датчика" },
        { type: "time", value: "7 дней" }
      ],
      price: "860 000 ₸",
      image: "/projects/avtokraski.webp",
    },
  ]

  const activeIndex = Math.abs(page % projectsData.length)
  const activeProject = projectsData[activeIndex]

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  useEffect(() => {
    if (isPaused || isMobile) return; // На мобилках лучше отключить автоскролл, чтобы не мешать читать
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page, isPaused, isMobile]);

  const smoothEase = [0.22, 1, 0.36, 1]

  // === ОПТИМИЗИРОВАННЫЕ ВАРИАНТЫ (УБРАН BLUR) ===
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: smoothEase as any } // Чуть ускорили
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.5, ease: smoothEase as any }
    })
  }

  return (
    <section 
      id="projects" 
      ref={ref}
      className="magnet-section relative w-full min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-slate-50 dark:bg-background border-t border-border"
    >
      {/* ДИНАМИЧЕСКИЙ ФОН (ТОЛЬКО ДЛЯ ПК) */}
      <AnimatePresence mode="popLayout">
        {!isMobile && (
          <motion.img
            key={`bg-${activeProject.id}`}
            src={activeProject.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.03 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover blur-[80px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-[1140px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* === ОТЦЕНТРОВАННАЯ ШАПКА === */}
        <div className="w-full flex flex-col items-center text-center mb-10 sm:mb-14">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: smoothEase as any }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4">
              <span className="block">{t("projects.title1")}</span>
              <span className="text-red-600 block italic mt-1 sm:mt-2">
                {t("projects.title2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mt-4 font-medium">
              {t("projects.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* === ГЛАВНАЯ КАРТОЧКА === */}
        <div 
          className="relative w-full h-[600px] sm:h-[650px] lg:h-[420px] xl:h-[460px] group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Свечение (Скрыто на мобилках) */}
          <div className="hidden lg:block absolute -inset-[2px] bg-gradient-to-r from-red-600/0 via-red-600/10 dark:via-red-600/20 to-red-600/0 rounded-[30px] lg:rounded-[36px] opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />
          <div className="hidden lg:block absolute -inset-[1px] bg-gradient-to-r from-black/5 via-red-500/10 to-black/5 dark:from-white/10 dark:via-red-500/10 dark:to-white/10 rounded-[30px] lg:rounded-[36px] transition-opacity duration-1000" />

          {/* КОНТЕЙНЕР */}
          <div className="relative w-full h-full rounded-[28px] lg:rounded-[32px] bg-white dark:bg-[#0c0c0e] border border-black/5 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x" 
                // Блокируем drag по оси Y, чтобы не конфликтовал с обычным скроллом
                dragDirectionLock
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(_e: any, info: any) => {
                  const swipe = Math.abs(info.offset.x) * info.velocity.x;
                  if (swipe < -8000) { paginate(1); } // Чуть снизили порог свайпа для мобилок
                  else if (swipe > 8000) { paginate(-1); }
                }}
                className="absolute inset-0 w-full h-full flex flex-col lg:flex-row cursor-grab active:cursor-grabbing"
              >
                
                {/* ЛЕВАЯ ЧАСТЬ: ИНФОРМАЦИЯ */}
                <div className="w-full lg:w-[45%] xl:w-[40%] p-6 sm:p-8 flex flex-col justify-between shrink-0 lg:h-full overflow-y-auto lg:overflow-visible">
                  <div>
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <span className="px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">
                        {t(activeProject.categoryKey)}
                      </span>
                      <span className="text-2xl font-black text-black/5 dark:text-white/5 select-none font-mono">
                        {activeProject.id}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-3 transition-colors group-hover:text-red-600 dark:group-hover:text-white duration-500">
                      {activeProject.title}
                    </h3>
                    
                    <p className="text-[13px] sm:text-sm font-medium text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                      {t(activeProject.descriptionKey)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {activeProject.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-white/[0.03] rounded-lg border border-black/5 dark:border-white/5 transition-colors lg:group-hover:border-red-500/20 lg:dark:group-hover:border-red-500/30 lg:group-hover:bg-red-50/50 lg:dark:group-hover:bg-red-500/5">
                          {getBadgeIcon(badge.type)}
                          <span className="text-[11px] sm:text-xs font-semibold text-foreground uppercase tracking-wider">
                            {badge.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/5 dark:border-white/10 mt-auto">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                      {t("projects.price_label", "Стоимость под ключ")}
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-foreground">
                      {activeProject.price}
                    </div>
                  </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ: ИЗОБРАЖЕНИЕ + КНОПКИ */}
                <div className="w-full lg:w-[55%] xl:w-[60%] flex-grow lg:h-full relative overflow-hidden bg-slate-100 dark:bg-neutral-900 min-h-[250px] border-t lg:border-t-0 lg:border-l border-black/5 dark:border-white/5">
                  {/* УБРАЛИ BLUR С КАРТИНКИ */}
                  <img 
                    src={activeProject.image} 
                    alt={activeProject.title} 
                    loading="eager" 
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-[0.22,1,0.36,1] scale-105 lg:group-hover:scale-100"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-b-[28px] lg:rounded-r-[32px] lg:rounded-bl-none pointer-events-none" />
                  
                  {/* === ПРОЗРАЧНЫЕ КНОПКИ НАВИГАЦИИ === */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); paginate(-1); }} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 text-white"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); paginate(1); }} 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 text-white"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                </div>
                
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ТОЧКИ-ИНДИКАТОРЫ */}
        <div className="flex justify-center items-center gap-2 mt-8 shrink-0">
          {projectsData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx ? "w-8 bg-red-600" : "w-2 bg-black/10 dark:bg-white/10"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
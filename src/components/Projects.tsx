"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
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
    if (isPaused || isMobile) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page, isPaused, isMobile]);

  const smoothEase = [0.22, 1, 0.36, 1]

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
      transition: { duration: 0.6, ease: smoothEase as any }
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.6, ease: smoothEase as any }
    })
  }

  return (
    <section 
      id="projects" 
      className="magnet-section relative w-full flex flex-col justify-center py-16 lg:py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* === ОТЦЕНТРОВАННАЯ ШАПКА === */}
        <div className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mb-10 lg:mb-16">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-4 lg:mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("projects.title1", "Реализованные")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("projects.title2", "проекты")}
            </span>
          </h2>
          
          <div className="text-[15px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("projects.subtitle", "Примеры наших работ: от небольших офисов до крупных производственных складов.")}
          </div>
        </div>

        {/* === КАРТОЧКА ПРОЕКТА === */}
        <div 
          className="relative w-full h-[580px] sm:h-[500px] lg:h-[520px] group rounded-[28px] sm:rounded-[40px] overflow-hidden border border-border/50 shadow-2xl dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-background/50 backdrop-blur-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Декоративные углы захвата цели (Скругленные по радиусу карточки) */}
          <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-30">
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-l-2 border-red-500/50 rounded-tl-[28px] sm:rounded-tl-[40px]" />
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-red-500/50 rounded-tr-[28px] sm:rounded-tr-[40px]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-l-2 border-red-500/50 rounded-bl-[28px] sm:rounded-bl-[40px]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-r-2 border-red-500/50 rounded-br-[28px] sm:rounded-br-[40px]" />
          </div>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x" 
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_e, info) => {
                const swipe = Math.abs(info.offset.x) * info.velocity.x;
                if (swipe < -6000) { paginate(1); } 
                else if (swipe > 6000) { paginate(-1); }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              
              {/* ФОНОВОЕ ИЗОБРАЖЕНИЕ */}
              <div className="absolute inset-0 w-full h-full bg-black">
                <img 
                  src={activeProject.image} 
                  alt={activeProject.title} 
                  className="w-full h-full object-cover opacity-70 lg:opacity-90 transition-transform duration-[10s] ease-linear scale-100 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/50 lg:to-transparent" />
              </div>
              
              {/* КОНТЕНТ (HUD ПАНЕЛЬ) */}
              <div className="absolute inset-0 p-5 sm:p-8 lg:p-14 flex flex-col justify-end lg:justify-center items-start z-10 w-full lg:w-[65%]">
                
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 rounded-md border border-red-500/30 backdrop-blur-md">
                    {t(activeProject.categoryKey)}
                  </span>
                  <div className="h-[1px] w-6 sm:w-10 bg-white/20" />
                  <span className="text-xs sm:text-sm font-mono text-white/50 font-bold tracking-widest">
                    DATA.{activeProject.id}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 sm:mb-4 drop-shadow-lg line-clamp-2">
                  {activeProject.title}
                </h3>
                
                <p className="text-[13px] sm:text-base text-neutral-300 font-medium leading-relaxed mb-6 sm:mb-8 max-w-lg drop-shadow-md line-clamp-3 sm:line-clamp-4">
                  {t(activeProject.descriptionKey)}
                </p>

                {/* Беджи и Цена */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 w-full p-4 sm:p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {activeProject.badges.map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white/5 rounded-lg border border-white/10 text-white">
                        {getBadgeIcon(badge.type)}
                        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                          {badge.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block w-px h-10 bg-white/20" />
                  <div className="block sm:hidden w-full h-px bg-white/10" />

                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                      {t("projects.price_label", "Стоимость")}
                    </span>
                    <span className="text-lg sm:text-2xl font-black text-white whitespace-nowrap">
                      {activeProject.price}
                    </span>
                  </div>

                </div>

              </div>
              
            </motion.div>
          </AnimatePresence>

          {/* === НАВИГАЦИОННЫЕ КНОПКИ === */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:bottom-10 lg:top-auto flex items-center gap-2 sm:gap-3 z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); paginate(-1); }} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-black/50 hover:bg-red-600 backdrop-blur-lg border border-white/10 hover:border-red-500 transition-all text-white group/btn"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6 transition-transform group-hover/btn:-translate-x-1" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); paginate(1); }} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-black/50 hover:bg-red-600 backdrop-blur-lg border border-white/10 hover:border-red-500 transition-all text-white group/btn"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ТОЧКИ-ИНДИКАТОРЫ */}
        <div className="flex justify-center items-center gap-2 mt-6 lg:mt-8 shrink-0">
          {projectsData.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-[4px] rounded-full transition-all duration-500 ${activeIndex === idx ? "w-8 sm:w-10 bg-red-600" : "w-3 sm:w-4 bg-muted-foreground/30"}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
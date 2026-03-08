"use client"

import { useState } from "react"
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

// Компактные иконки (размер 14)
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
  
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "-10% 0px" })
  const [[page, direction], setPage] = useState([0, 0])

  // Только твои проекты с правильными ключами для i18n
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

  const smoothEase = [0.22, 1, 0.36, 1]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98
    }),
    center: {
      z: 1,
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 0.5, ease: smoothEase as any }
    },
    exit: (direction: number) => ({
      z: 0,
      x: direction < 0 ? 80 : -80,
      opacity: 0,
      filter: "blur(8px)",
      scale: 0.98,
      transition: { duration: 0.5, ease: smoothEase as any }
    })
  }

  return (
    <section 
      id="projects" 
      ref={ref}
      className="relative w-full min-h-screen snap-start flex flex-col justify-center py-20 lg:py-0 overflow-hidden bg-slate-50 dark:bg-background"
    >
      {/* ДИНАМИЧЕСКИЙ ФОН */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={`bg-${activeProject.id}`}
          src={activeProject.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }} 
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover blur-[100px] pointer-events-none"
        />
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* === ШАПКА СЕКЦИИ === */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 sm:mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: smoothEase as any }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {t("projects.title1")}
              <span className="text-red-600 block sm:inline sm:ml-2">
                {t("projects.title2")}
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("projects.subtitle")}
            </p>
          </motion.div>

          {/* НАВИГАЦИЯ */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: smoothEase as any }}
            className="flex items-center gap-3 shrink-0"
          >
            <button onClick={() => paginate(-1)} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-foreground hover:text-red-600">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => paginate(1)} className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-foreground hover:text-red-600">
              <ChevronRight size={24} />
            </button>
          </motion.div>
        </div>

        {/* === ГЛАВНАЯ КАРТОЧКА (С PREMIUM GLOW) === */}
        <div className="relative w-full h-[650px] sm:h-[700px] lg:h-[500px] xl:h-[550px] group">
          
          {/* НЕОНОВОЕ СВЕЧЕНИЕ (Видно только в Dark Mode) */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600/0 via-red-600/30 to-red-600/0 rounded-[34px] lg:rounded-[42px] opacity-0 dark:opacity-100 blur-lg transition-opacity duration-1000 group-hover:opacity-100" />
          <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 via-red-500/20 to-white/10 rounded-[34px] lg:rounded-[42px] opacity-0 dark:opacity-100 transition-opacity duration-1000" />

          {/* Контейнер карточки */}
          <div className="relative w-full h-full rounded-[32px] lg:rounded-[40px] bg-white dark:bg-[#08080a] border border-black/5 dark:border-white/5 shadow-2xl dark:shadow-[0_0_80px_rgba(220,38,38,0.05)] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex flex-col lg:flex-row"
              >
                {/* ЛЕВАЯ ЧАСТЬ: ИНФОРМАЦИЯ */}
                <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between h-1/2 lg:h-full">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-500/10 rounded-lg border border-red-500/20">
                        {t(activeProject.categoryKey)}
                      </span>
                      <span className="text-3xl font-black text-black/5 dark:text-white/5 select-none">
                        {activeProject.id}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                      {activeProject.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 line-clamp-3 lg:line-clamp-none">
                      {t(activeProject.descriptionKey)}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {activeProject.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/[0.03] rounded-lg border border-black/5 dark:border-white/5 transition-colors group-hover:border-red-500/20">
                          {getBadgeIcon(badge.type)}
                          <span className="text-xs font-semibold text-foreground">
                            {badge.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-black/5 dark:border-white/10 mt-auto">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                      {t("projects.price_label")}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-foreground">
                      {activeProject.price}
                    </div>
                  </div>
                </div>

                {/* ПРАВАЯ ЧАСТЬ: ИЗОБРАЖЕНИЕ */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden bg-neutral-900">
                  <img 
                    src={activeProject.image} 
                    alt={activeProject.title} 
                    loading="eager" 
                    className="w-full h-full object-cover transition-all duration-700 ease-[0.22,1,0.36,1] blur-[3px] scale-105 group-hover:blur-0 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
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
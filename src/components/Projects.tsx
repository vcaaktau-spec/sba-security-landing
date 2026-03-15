"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { MapPin, ArrowUpRight } from "lucide-react"

interface ProjectProps {
  id: string
  title: string
  categoryText?: string 
  categoryKey?: string  
  descriptionText?: string 
  descriptionKey?: string  
  badges: string[] 
  price: string
  image: string
  isDynamic?: boolean
}

const staticProjects: ProjectProps[] = [
  {
    id: "01",
    title: "Tetys Blu",
    categoryKey: "Видеонаблюдение",
    descriptionKey: "Побережье",
    badges: ["64 камеры"],
    price: "960 000 ₸",
    image: "/projects/tetys.webp",
  },
  {
    id: "02",
    title: "Entro",
    categoryKey: "КОМБО",
    descriptionKey: "​ЖК Central Park​40-й микр",
    badges: ["6 камер", "12 датчиков"],
    price: "1 183 350 ₸",
    image: "/projects/entro.webp",
  },
  {
    id: "03",
    title: "Автокраски 285",
    categoryKey: "КОМБО",
    descriptionKey: "Рынок Алем 21 микр",
    badges: ["24 датчика", "58 камер"],
    price: "~2 500 000 ₸",
    image: "/projects/avtokraski.webp",
  },
];

const categoryMap: Record<string, string> = {
  'cctv': 'Видеонаблюдение',
  'network': 'Локальная сеть',
  'access': 'СКУД',
  'fire': 'АПС',
};

export const Projects = () => {
  const { t } = useTranslation()
  const [projectsData, setProjectsData] = useState<ProjectProps[]>(staticProjects);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchDynamicProjects = async () => {
      try {
        const res = await fetch('/api/get-all-projects', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const mappedProjects: ProjectProps[] = data.map((p, index) => {
            const catLabel = categoryMap[p.category] || 'Инженерная система';
            
            const equipmentBadges: string[] = (p.equipment || []).slice(0, 3).map((item: string) => 
              item.length > 25 ? item.slice(0, 25) + '...' : item
            );
            equipmentBadges.push("СБА Защита");

            return {
              id: `DB-${index + 1}`,
              title: p.name,
              categoryText: catLabel,
              descriptionText: `${p.address}`,
              badges: equipmentBadges,
              price: p.price && p.price !== 'По запросу' ? p.price : "Индивидуально",
              image: p.imageUrl || staticProjects[index % staticProjects.length].image,
              isDynamic: true
            };
          });
          setProjectsData([...staticProjects, ...mappedProjects]);
        }
      } catch (e) { console.error(e); }
    };
    fetchDynamicProjects();
  }, []);

  useEffect(() => {
    if (isHovering) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % projectsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovering, projectsData.length]);

  const activeProject = projectsData[activeIndex];

  return (
    <section id="projects" className="magnet-section relative w-full h-auto lg:h-screen min-h-[700px] flex flex-col justify-center py-12 lg:py-16 overflow-hidden bg-transparent border-t border-border/10">
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 flex flex-col items-center h-full">
        
        {/* === ФИРМЕННЫЙ ЗАГОЛОВОК СБА === */}
        <div className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mb-10 lg:mb-12 shrink-0">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[36px] sm:text-[48px] lg:text-[64px] font-black uppercase tracking-tighter leading-[1.1] mb-4 flex flex-col items-center w-full"
          >
            <span className="block w-full text-foreground">{t("projects.title1", "Реализованные")}</span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">{t("projects.title2", "проекты")}</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[15px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center"
          >
            {t("projects.subtitle", "Мы не просто устанавливаем камеры, мы решаем конкретные задачи бизнеса. Ознакомьтесь с примерами наших работ и реальными сметами.")}
          </motion.div>
        </div>

        {/* === ТАБЫ (LINEAR STYLE) === */}
        <div className="w-full max-w-full overflow-x-auto custom-scrollbar pb-2 mb-4 lg:mb-6 shrink-0">
          <div className="flex items-center justify-start lg:justify-center gap-2 min-w-max mx-auto px-4">
            {projectsData.map((project, idx) => (
              <button
                key={project.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeIndex === idx ? 'text-white' : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                {activeIndex === idx && (
                  <motion.div
                    layoutId="activeProjectTab"
                    className="absolute inset-0 bg-red-600/10 border border-red-500/20 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {project.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* === VERCEL STYLE CINEMATIC DISPLAY (ВЫСОТА ПОДОГНАНА ПОД ЭКРАН) === */}
        <div 
          className="w-full relative h-[400px] md:h-[500px] lg:h-[550px] lg:max-h-[60vh] rounded-[28px] md:rounded-[32px] border border-white/10 overflow-hidden bg-black shadow-2xl group flex-grow"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <AnimatePresence mode="wait">
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 w-full h-full flex flex-col"
              >
                {/* Background Image with Gradient Fade */}
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={activeProject.image} 
                    alt={activeProject.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-in-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent lg:bg-gradient-to-r lg:from-black lg:via-black/30 lg:to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 z-10">
                  
                  {/* Left Side: Title & Badges */}
                  <div className="flex flex-col items-start gap-4 max-w-3xl">
                    <div className="flex items-center gap-3 text-neutral-300 text-xs font-mono tracking-widest uppercase mb-1">
                      <span className="px-2.5 py-1.5 border border-white/10 rounded-md bg-white/5 font-bold">
                        {activeProject.isDynamic ? activeProject.categoryText : t(activeProject.categoryKey || "")}
                      </span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-red-500"/> {activeProject.isDynamic ? activeProject.descriptionText : t(activeProject.descriptionKey || "")}</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-2 leading-[0.9] drop-shadow-md">
                      {activeProject.title}
                    </h3>

                    {/* Minimal Terminal Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {activeProject.badges.map((badgeText, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-xl rounded-lg border border-white/5 text-white shadow-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-200">
                            {badgeText}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Price Panel */}
                  <div className="flex flex-col items-start lg:items-end shrink-0 bg-white/5 backdrop-blur-xl border border-white/10 p-5 lg:p-6 rounded-2xl w-full lg:w-auto shadow-inner">
                    <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-black mb-2">
                      {t("projects.price_label", "Стоимость под ключ")}
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-tighter">
                      {activeProject.price}
                      {(activeProject.price !== "Индивидуально" && activeProject.price !== "По запросу") && (
                         <ArrowUpRight size={22} className="text-neutral-500" />
                      )}
                    </span>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
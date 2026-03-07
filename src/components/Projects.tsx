"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Camera, HardDrive, ChevronDown } from "lucide-react"

interface ProjectProps {
  id: string
  title: string
  category: string
  description: string
  cameras: number
  storage: string
  price: string
  image: string
}

const projects: ProjectProps[] = [
  {
    id: "01",
    title: "Частный дом, 250 м²",
    category: "Жилая недвижимость",
    description: "Полный периметральный контроль участка. Установка камер с ColorVu (цветное ночное видение) и настройка детекции пересечения линии.",
    cameras: 8,
    storage: "1 ТБ (14 дней)",
    price: "450 000 ₸",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=800",
  },
  {
    id: "02",
    title: "Продуктовый Маркет",
    category: "Ритейл",
    description: "Контроль кассовой зоны (распознавание лиц и купюр), мониторинг торговых рядов и зоны разгрузки товаров. Удаленный доступ для владельца.",
    cameras: 12,
    storage: "2 ТБ (20 дней)",
    price: "520 000 ₸",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800",
  },
  {
    id: "03",
    title: "Складской Комплекс",
    category: "Логистика",
    description: "Монтаж на высоте 8 метров. Перекрытие слепых зон между стеллажами, контроль ворот и распознавание автомобильных номеров.",
    cameras: 24,
    storage: "4 ТБ (30 дней)",
    price: "1 250 000 ₸",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
  },
  {
    id: "04",
    title: "Офис IT-компании",
    category: "Бизнес",
    description: "Интеграция видеонаблюдения со СКУД (системой контроля доступа). Запись звука в переговорных комнатах, скрытый монтаж проводки.",
    cameras: 10,
    storage: "2 ТБ (30 дней)",
    price: "680 000 ₸",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
  },
  {
    id: "05",
    title: "Ресторан премиум-класса",
    category: "HoReCa",
    description: "Эстетичные купольные камеры, вписанные в интерьер. Строгий контроль кухни, бара и гостевого зала. Микрофоны высокой чувствительности.",
    cameras: 16,
    storage: "4 ТБ (45 дней)",
    price: "890 000 ₸",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800",
  },
  {
    id: "06",
    title: "Автомойка самообслуживания",
    category: "Автобизнес",
    description: "Установка влагозащищенных камер IP67. Круглосуточный мониторинг боксов и технической комнаты. Стойкость к прямому попаданию воды.",
    cameras: 6,
    storage: "1 ТБ (10 дней)",
    price: "340 000 ₸",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800",
  },
  {
    id: "07",
    title: "Подземный паркинг ЖК",
    category: "Жилые комплексы",
    description: "Камеры с высокой светочувствительностью для работы в полумраке. Фиксация номеров въезжающих авто, защита от вандализма.",
    cameras: 18,
    storage: "4 ТБ (25 дней)",
    price: "1 100 000 ₸",
    image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800",
  },
  {
    id: "08",
    title: "Сеть аптек",
    category: "Ритейл",
    description: "Детализированная съемка кассовой зоны (читаемость чеков и номинала купюр). Единый сервер для удаленного мониторинга трех точек.",
    cameras: 9,
    storage: "2 ТБ (20 дней)",
    price: "550 000 ₸",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800",
  },
  {
    id: "09",
    title: "Производственный цех",
    category: "Промышленность",
    description: "Масштабная система для контроля конвейерных линий. Защита кабельных трасс в металлических лотках, интеграция с пожарной тревогой.",
    cameras: 32,
    storage: "8 ТБ (40 дней)",
    price: "2 800 000 ₸",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
  },
]

export const Projects = () => {
  const [showAll, setShowAll] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  // Вычисляем, какие проекты показывать
  const displayedProjects = showAll ? projects : projects.slice(0, 3)

  // Параллакс для заголовка
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: smoothEase as any} 
    }
  }

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen py-24 sm:py-32 bg-background overflow-hidden flex flex-col justify-center"
    >
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[800px] h-[800px] bg-red-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        
        {/* HEADER (Без бейджа) */}
        <motion.div 
          ref={ref}
          style={{ y: titleY }} 
          initial="hidden" 
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Реализованные{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              проекты
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы не просто устанавливаем камеры, мы решаем конкретные задачи бизнеса и частных лиц. Ознакомьтесь с примерами наших работ и сметами.
          </p>
        </motion.div>

        {/* PROJECTS GRID с анимацией изменения компоновки (layout) */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, index) => (
              <motion.div
                layout // Позволяет сетке плавно перестраиваться
                key={project.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                transition={{ duration: 0.6, ease: smoothEase as any, delay: index * 0.1 }}
                whileHover="hover"
                className="group relative h-[480px] rounded-[32px] overflow-hidden"
              >
                {/* ФОНОВОЕ ИЗОБРАЖЕНИЕ */}
                <div className="absolute inset-0 bg-black">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:opacity-70 group-hover:mix-blend-normal transition-all duration-700 ease-[0.22,1,0.36,1]"
                    variants={{
                      hover: { scale: 1.1 }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                </div>

                {/* КОНТЕНТ КАРТОЧКИ */}
                <div className="relative z-10 h-full flex flex-col p-6 sm:p-8">
                  
                  {/* Верх: Категория и ID */}
                  <div className="flex justify-between items-start mb-auto">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                      {project.category}
                    </span>
                    <span className="text-white/20 font-black text-xl">
                      {project.id}
                    </span>
                  </div>

                  {/* Середина: Заголовок и Технические данные */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-3 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Иконки с характеристиками */}
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <Camera size={14} className="text-red-500" />
                        {project.cameras} шт
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <HardDrive size={14} className="text-red-500" />
                        {project.storage}
                      </div>
                    </div>
                  </div>

                  {/* Низ: ЦЕНА (Стрелочка удалена) */}
                  <div className="pt-5 border-t border-white/10">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">
                      Стоимость под ключ
                    </div>
                    <div className="text-2xl font-black text-white group-hover:text-red-500 transition-colors duration-300">
                      {project.price}
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* КНОПКА СПОЙЛЕРА (ПОКАЗАТЬ/СКРЫТЬ) */}
        <motion.div layout className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative px-8 py-4 bg-transparent text-foreground font-semibold rounded-full overflow-hidden border border-border hover:border-red-500/50 transition-colors duration-300 flex items-center gap-3"
          >
            {/* Глянцевый блик при наведении */}
            <div className="absolute inset-0 bg-red-500/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-[0.22,1,0.36,1]" />
            
            <span className="relative z-10 transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-400">
              {showAll ? "Свернуть проекты" : "Смотреть все проекты"}
            </span>
            
            <motion.div
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.5, ease: smoothEase as any}}
              className="relative z-10 text-red-500"
            >
              <ChevronDown size={20} />
            </motion.div>
          </button>
        </motion.div>

      </div>
    </section>
  )
}
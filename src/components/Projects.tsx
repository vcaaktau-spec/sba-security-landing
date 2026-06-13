"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { Instagram, ExternalLink, Camera, Wifi, Flame, Building2, Server } from "lucide-react"
import { motion, useInView } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface ProjectItem {
  Icon: React.ElementType
  category: string
  title: string
  tags: string[]
  area: string
}

const projects: ProjectItem[] = [
  {
    Icon: Camera,
    category: "Видеонаблюдение + СКУД",
    title: "Торговый комплекс",
    tags: ["IP 4K", "СКУД", "Турникет"],
    area: "Актау, мкр. 12",
  },
  {
    Icon: Server,
    category: "Инфраструктура",
    title: "Серверная комната",
    tags: ["СКС", "Оптика", "Патч-панели"],
    area: "Актау, промзона",
  },
  {
    Icon: Flame,
    category: "Пожарная сигнализация",
    title: "Бизнес-центр",
    tags: ["АУПС", "Оповещение", "АПТ"],
    area: "Актау, мкр. 7",
  },
  {
    Icon: Building2,
    category: "Комплексная безопасность",
    title: "Складской комплекс",
    tags: ["64 камеры", "Периметр", "NVR"],
    area: "Актау, мкр. 32",
  },
  {
    Icon: Camera,
    category: "Техническое обслуживание",
    title: "Жилой квартал",
    tags: ["Замена линз", "Калибровка", "ИК-подсветка"],
    area: "Актау, мкр. 11",
  },
  {
    Icon: Wifi,
    category: "Сети и Wi-Fi",
    title: "Офисный центр",
    tags: ["802.11ax", "VLAN", "Ubiquiti"],
    area: "Актау, мкр. 9",
  },
]

function ProjectCard({ item, index }: { item: ProjectItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease, delay: index * 0.07 }}
      className="group relative bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 hover:border-white/[0.16] hover:bg-white/[0.05] transition-all duration-400 overflow-hidden"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/[0.05] to-transparent pointer-events-none" />

      {/* Icon + category */}
      <div className="flex items-start gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 group-hover:bg-red-500/15 transition-colors duration-400">
          <item.Icon size={18} />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold text-muted-foreground/45 uppercase tracking-widest leading-tight">
            {item.category}
          </div>
          <h3 className="text-base font-bold text-foreground mt-0.5">{item.title}</h3>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 z-10">
        {item.tags.map((tag, ti) => (
          <span
            key={ti}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.07] text-foreground/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/40 mt-auto z-10">
        <span className="w-1 h-1 rounded-full bg-emerald-400/70" />
        {item.area}
      </div>
    </motion.div>
  )
}

export const Projects = () => {
  const { t } = useTranslation()
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })
  const igRef = useRef<HTMLDivElement>(null)
  const igInView = useInView(igRef, { once: true, margin: "-10%" })

  return (
    <section id="projects" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-foreground leading-[1.1] mb-5"
          >
            Реальные объекты.{" "}
            <span className="text-red-500">Реальные результаты.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-muted-foreground"
          >
            Из последних завершённых проектов в Актау — разные масштабы и типы объектов.
          </motion.p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((item, i) => (
            <ProjectCard key={i} item={item} index={i} />
          ))}
        </div>

        {/* Instagram CTA block */}
        <motion.div
          ref={igRef}
          initial={{ opacity: 0, y: 32 }}
          animate={igInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white/[0.03] border border-white/[0.08] rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-lg">
              <Instagram size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-foreground">@toosba7292</div>
              <div className="text-sm text-muted-foreground">
                Закулисье каждого объекта — фото процесса и результата
              </div>
            </div>
          </div>

          <a
            href="https://instagram.com/toosba7292"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.12] text-foreground font-semibold text-sm hover:bg-white/[0.10] hover:border-white/[0.20] transition-all duration-300 shrink-0"
          >
            {t("projects.insta_watch", "Смотреть все работы")}
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

      </div>

      <div className="absolute bottom-0 inset-x-0 section-divider" />
    </section>
  )
}

"use client"

import { useRef } from "react"
import { Camera, Server, Flame, Building2, Instagram, ExternalLink } from "lucide-react"
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
    category: "Монтаж + Настройка",
    title: "IP 4K Видеонаблюдение",
    tags: ["IP 4K", "Настройка", "Удаленный доступ"],
    area: "Актау, мкр. 12",
  },
  {
    Icon: Server,
    category: "СКУД / Турникеты",
    title: "Контроль доступа",
    tags: ["СКУД", "Турникеты", "Биометрия"],
    area: "Актау, Промзона",
  },
  {
    Icon: Flame,
    category: "Пожарная система",
    title: "Болид-Орион",
    tags: ["Болид", "Установка", "Пусконаладка"],
    area: "Актау, мкр. 7",
  },
  {
    Icon: Building2,
    category: "Комплексная безопасность",
    title: "Умный офис",
    tags: ["64 камеры", "Интеграция", "NVR"],
    area: "Актау, мкр. 32",
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
      className="group relative bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4 hover:border-slate-300 dark:hover:border-white/[0.16] hover:bg-slate-50/50 dark:hover:bg-white/[0.04] shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-red-500/[0.03] dark:from-red-500/[0.05] to-transparent pointer-events-none" />

      <div className="flex items-start gap-3 z-10">
        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-500/15 transition-colors duration-300">
          <item.Icon size={18} />
        </div>
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-tight">
            {item.category}
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{item.title}</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 z-10">
        {item.tags.map((tag, ti) => (
          <span
            key={ti}
            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/[0.05] border border-slate-100 dark:border-white/[0.07] text-slate-600 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-auto z-10">
        <span className="w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400/70" />
        {item.area}
      </div>
    </motion.div>
  )
}

export const Projects = () => {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: "-10%" })
  const igRef = useRef<HTMLDivElement>(null)
  const igInView = useInView(igRef, { once: true, margin: "-10%" })

  return (
    <section id="projects" className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.06]">
      <div className="absolute top-0 inset-x-0 section-divider" />

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5"
          >
            Реальные проекты.{" "}
            <span className="text-red-600 dark:text-red-500">Без компромиссов.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Мы работаем в Актау и Мангистауской области.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {projects.map((item, i) => (
            <ProjectCard key={i} item={item} index={i} />
          ))}
        </div>

        <motion.div
          ref={igRef}
          initial={{ opacity: 0, y: 32 }}
          animate={igInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.08] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center shadow-lg">
              <Instagram size={22} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">@toosba7292</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Больше работ смотрите в нашем инстаграм профиле
              </div>
            </div>
          </div>

          <a
            href="https://instagram.com/toosba7292"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] text-slate-900 dark:text-white font-semibold text-sm hover:bg-slate-200/70 dark:hover:bg-white/[0.10] hover:border-slate-300 dark:hover:border-white/[0.20] transition-all duration-300 shrink-0"
          >
            Смотреть работы
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

      </div>
    </section>
  )
}

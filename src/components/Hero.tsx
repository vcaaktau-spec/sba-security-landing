"use client"

import { useRef, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ──────────────────────────────────────────────────────────────────
   Security Monitor Panel — выглядит как реальный NVR-интерфейс
   ────────────────────────────────────────────────────────────────── */

const FEEDS = [
  { id: 1, name: "ТЦ Атлас",      zone: "Вход / Выход",    rec: true,  motion: false, alert: false },
  { id: 2, name: "Пр. Нурсултана", zone: "Торговая зона",   rec: true,  motion: true,  alert: true  },
  { id: 3, name: "Мкр. 12",        zone: "Парковка · Сев.", rec: true,  motion: false, alert: false },
  { id: 4, name: "Промзона",        zone: "Склад А · Ворота",rec: false, motion: false, alert: false },
]

function CameraFeed({
  feed, index, inView,
}: {
  feed: typeof FEEDS[number]
  index: number
  inView: boolean
}) {
  const now = new Date()
  const ts = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`

  return (
    <motion.div
      className="relative aspect-video overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #080808 100%)" }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ delay: 0.25 + index * 0.1 }}
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4t5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92ZBaGqTAmBiZms6CIY41cvggXAV2Y8MlnOR+fdlj9GiTde92sUIXznfc5Esgng5V2WxlP8rWFMFXpCyEj/T7cFpSAYiAMhHInlNlS+lBdVrCJ0p3sLMl3k88ABXmk+BjCVXbFT7TMf+o3bE1+sY4dONNkL++wr5KuqntMd4LhSKPlA0LfRKmIkKj8BSPABOBMzEUABC5AACAiUSFAAAAABJRU5ErkJggg==\")",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Scan line (first feed only) */}
      {index === 0 && (
        <motion.div
          className="absolute inset-x-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }}
          animate={{ y: [0, 135, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Motion detection flash border */}
      {feed.alert && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ border: "1px solid rgba(251,191,36,0.5)" }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
        />
      )}

      {/* Motion detected label */}
      {feed.motion && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded"
          style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)" }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
        >
          <span className="text-[7px] font-mono text-amber-400/90 uppercase tracking-widest">▲ Движение</span>
        </motion.div>
      )}

      {/* CAM number */}
      <div className="absolute top-1.5 left-1.5 text-[7px] font-mono text-white/25">
        CAM{String(index + 1).padStart(2, "0")}
      </div>

      {/* REC indicator */}
      {feed.rec && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
          <motion.div
            className="w-1 h-1 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.1, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[6px] font-mono text-red-400/55">REC</span>
        </div>
      )}

      {/* Bottom: location + timestamp */}
      <div className="absolute bottom-1.5 left-2">
        <div className="text-[7.5px] font-mono text-white/55 font-semibold leading-tight">{feed.name}</div>
        <div className="text-[6.5px] font-mono text-white/25 leading-tight">{feed.zone}</div>
      </div>
      <div className="absolute bottom-1.5 right-2 text-[6px] font-mono text-white/18 tabular-nums">
        {ts}
      </div>
    </motion.div>
  )
}

function MonitorPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const now = new Date()
  const dateStr = `${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.95, ease }}
      className="w-full rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.5)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.025)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>
        <span className="text-[9px] font-mono text-white/25 tracking-widest">
          SBA Monitor Pro · {dateStr}
        </span>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          <span className="text-[8px] font-mono text-red-400/60">REC</span>
        </div>
      </div>

      {/* 2×2 camera grid */}
      <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.035)" }}>
        {FEEDS.map((feed, i) => (
          <CameraFeed key={feed.id} feed={feed} index={i} inView={inView} />
        ))}
      </div>

      {/* Footer status bar */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[8px] font-mono text-white/30">4 / 4 камеры · онлайн</span>
        </div>
        <span className="text-[8px] font-mono text-white/18">HDD 2.1 TB · AES-256 · H.265</span>
      </div>
    </motion.div>
  )
}

/* ─────────────────────── Line reveal ─────────────────────── */

function RevealLine({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "112%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.92, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ─────────────────────── Hero ─────────────────────── */

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const panelY       = useTransform(scrollYProgress, [0, 1], ["0%", "14%"])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden border-b border-white/[0.06]"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-[38%] -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-red-600/[0.045] blur-[150px] pointer-events-none" />

      {/* ── Status bar ── */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-3 border-b border-white/[0.06] text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-muted-foreground/50 tracking-widest uppercase">SBA Security · Актау</span>
        </div>
        <span className="text-muted-foreground/20 hidden sm:block tracking-widest uppercase">Мониторинг 24 / 7</span>
        <span className="text-muted-foreground/15 tracking-widest">v 2.4</span>
      </div>

      {/* ── Main split grid ── */}
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_500px]">

        {/* LEFT: Typography */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-14 lg:py-24 border-r border-white/[0.06]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-px bg-red-500/60" />
            <span className="text-[11px] font-mono font-bold text-red-400/75 uppercase tracking-[0.22em]">
              Системы безопасности
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mb-10 flex flex-col">
            <RevealLine delay={0} className="leading-[0.88]">
              <span className="block text-[clamp(4rem,9vw,8rem)] font-black tracking-tighter text-foreground">
                Охрана
              </span>
            </RevealLine>
            <RevealLine delay={0.08} className="leading-[0.88]">
              <span className="block text-[clamp(4rem,9vw,8rem)] font-black tracking-tighter text-foreground">
                каждого
              </span>
            </RevealLine>
            <RevealLine delay={0.16} className="leading-[0.88]">
              <span className="block text-[clamp(4rem,9vw,8rem)] font-black tracking-tighter text-red-500">
                объекта.
              </span>
            </RevealLine>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="text-base sm:text-lg text-muted-foreground/70 max-w-[420px] leading-relaxed mb-10"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.44 }}
            className="flex flex-wrap gap-3 mb-14 lg:mb-16"
          >
            <button
              onClick={onOpenCalc}
              className="group relative h-12 px-7 flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.22)] hover:shadow-[0_0_52px_rgba(239,68,68,0.38)] transition-all duration-300"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">{t("hero.btn")}</span>
              <ArrowRight size={15} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            <a
              href="https://wa.me/77779204988"
              target="_blank" rel="noopener noreferrer"
              className="h-12 px-7 flex items-center gap-2.5 bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] hover:border-white/[0.18] text-foreground font-semibold text-sm rounded-xl transition-all duration-300"
            >
              <MessageCircle size={15} className="text-green-400" />
              <span>WhatsApp</span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-8 pt-8 border-t border-white/[0.07]"
          >
            {[
              { value: "5 000+", label: t("hero.stat1", "Установленных камер") },
              { value: "300+",   label: t("hero.stat2", "Объектов") },
              { value: "10+",    label: t("hero.stat3", "Лет опыта") },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-foreground tabular-nums">{s.value}</div>
                <div className="text-[11px] text-muted-foreground/45 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Monitor panel */}
        <div className="relative hidden lg:flex items-center justify-center px-8 py-10 overflow-hidden">
          {/* Left-edge blend */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <motion.div className="w-full" style={{ y: panelY, opacity: panelOpacity }}>
            <MonitorPanel />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="relative z-10 flex justify-center items-center py-5 border-t border-white/[0.06] shrink-0"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-7 bg-white/[0.08] relative overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-0 bg-white/50"
              style={{ height: "40%" }}
              animate={{ y: ["0%", "200%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground/20 uppercase">Scroll</span>
        </div>
      </motion.div>
    </section>
  )
}

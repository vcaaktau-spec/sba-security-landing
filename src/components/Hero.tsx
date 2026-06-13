"use client"

import { useRef, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { DotMatrix } from "./DotMatrix"

interface HeroProps {
  onOpenCalc: () => void
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─────────────────────── Security sensor grid ─────────────────────── */

const COLS = 7, ROWS = 7, CELL = 57, PAD = 28
const W = PAD * 2 + (COLS - 1) * CELL   // 386
const H = PAD * 2 + (ROWS - 1) * CELL   // 386

const gridPt = (c: number, r: number) => ({ x: PAD + c * CELL, y: PAD + r * CELL })

const CAMERAS: [number, number][] = [
  [1, 1], [4, 0], [6, 2],
  [0, 4], [3, 3], [5, 5],
  [2, 6], [6, 6],
]
const EDGES: [[number, number], [number, number]][] = [
  [[1,1],[4,0]], [[4,0],[6,2]],
  [[1,1],[0,4]], [[1,1],[3,3]],
  [[6,2],[5,5]], [[3,3],[5,5]],
  [[0,4],[2,6]], [[3,3],[2,6]],
  [[5,5],[6,6]], [[2,6],[6,6]],
]

function SecurityGrid() {
  const svgRef = useRef<SVGSVGElement>(null)
  const inView = useInView(svgRef, { once: true })
  const camSet = new Set(CAMERAS.map(([c, r]) => `${c},${r}`))

  const corners = [
    `M 6,28 L 6,6 L 28,6`,
    `M ${W-28},6 L ${W-6},6 L ${W-6},28`,
    `M 6,${H-28} L 6,${H-6} L 28,${H-6}`,
    `M ${W-28},${H-6} L ${W-6},${H-6} L ${W-6},${H-28}`,
  ]

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: W, height: H, maxWidth: "100%", overflow: "visible" }}
    >
      {/* Background grid dots */}
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS, r = Math.floor(i / COLS)
        if (camSet.has(`${c},${r}`)) return null
        const { x, y } = gridPt(c, r)
        return <circle key={`bg${i}`} cx={x} cy={y} r={1.5} fill="rgba(255,255,255,0.06)" />
      })}

      {/* Viewfinder corner brackets */}
      {corners.map((d, i) => (
        <motion.path
          key={`cr${i}`}
          d={d} fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1.5}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.07 }}
        />
      ))}

      {/* Connection edges */}
      {EDGES.map(([[c1,r1],[c2,r2]], i) => {
        const { x: x1, y: y1 } = gridPt(c1, r1)
        const { x: x2, y: y2 } = gridPt(c2, r2)
        return (
          <motion.line
            key={`e${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(239,68,68,0.22)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.28 + i * 0.06 }}
          />
        )
      })}

      {/* Camera nodes */}
      {CAMERAS.map(([c, r], i) => {
        const { x, y } = gridPt(c, r)
        return (
          <g key={`cam${i}`} transform={`translate(${x},${y})`}>
            {/* Pulse ring */}
            <motion.circle
              cx={0} cy={0} r={10}
              fill="none"
              stroke="rgba(239,68,68,0.5)"
              strokeWidth={1}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 1, opacity: 0 }}
              animate={inView ? {
                scale: [1, 1.9, 1],
                opacity: [0.6, 0, 0.6],
              } : {}}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: i * 0.28 + 0.7 }}
            />
            {/* Core dot */}
            <motion.circle
              cx={0} cy={0} r={4}
              fill="rgb(239,68,68)"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 0.88 } : {}}
              transition={{ duration: 0.45, ease, delay: 0.25 + i * 0.06 }}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* ─────────────────────── Clip-path text reveal ─────────────────────── */

function RevealLine({
  children, delay = 0, className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
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
  const gridY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const gridOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden border-b border-white/[0.06]"
    >
      {/* Ambient red glow */}
      <div className="absolute top-1/2 right-[38%] -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-red-600/[0.05] blur-[140px] pointer-events-none" />

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
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_460px]">

        {/* LEFT: Content */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-24 border-r border-white/[0.06]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex items-center gap-3 mb-9"
          >
            <div className="w-10 h-px bg-red-500/60" />
            <span className="text-[11px] font-mono font-bold text-red-400/75 uppercase tracking-[0.22em]">
              Системы безопасности
            </span>
          </motion.div>

          {/* Headline — line-by-line reveal */}
          <h1 className="mb-10 flex flex-col leading-none">
            <RevealLine delay={0} className="pb-1">
              <span className="block text-[clamp(2rem,5vw,4rem)] font-bold text-foreground/40 tracking-tight">
                Полная
              </span>
            </RevealLine>
            <RevealLine delay={0.09} className="py-1">
              <span className="block text-[clamp(4rem,9.5vw,8.5rem)] font-black tracking-tighter text-foreground">
                ЗАЩИТА
              </span>
            </RevealLine>
            <RevealLine delay={0.18} className="pt-1">
              <span className="block text-[clamp(1.6rem,4vw,3.2rem)] font-bold tracking-tight text-red-500">
                объектов Актау.
              </span>
            </RevealLine>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="text-base sm:text-lg text-muted-foreground/70 max-w-[440px] leading-relaxed mb-10"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA buttons */}
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

          {/* Stats strip */}
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

        {/* RIGHT: SecurityGrid art */}
        <div className="relative hidden lg:flex items-center justify-center p-10 overflow-hidden">
          {/* Left-edge blend */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

          <motion.div style={{ y: gridY, opacity: gridOpacity }}>
            <SecurityGrid />
          </motion.div>

          {/* Decorative dot matrix bottom-right */}
          <DotMatrix
            cols={8} rows={5}
            className="absolute bottom-8 right-8 text-white/20"
          />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
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

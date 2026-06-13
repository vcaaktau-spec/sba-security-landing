"use client"

import { useRef, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─────────────────────── Animated Security Scene ─────────────────────── */

function SecurityScene() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const fadeIn = (delay: number, dur = 0.6) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: dur, ease: "easeOut" as const, delay },
  })

  return (
    <div ref={ref} className="relative w-full select-none">
      <div className="relative w-full" style={{ maxWidth: 500 }}>

        <svg viewBox="0 0 460 360" className="w-full" style={{ overflow: "visible" }}>

          {/* Room outline */}
          <motion.path
            d="M 20 40 L 440 40 L 440 320 L 20 320 Z"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.15 }}
          />

          {/* Ceiling tick marks */}
          {[80, 160, 230, 300, 380].map((x, i) => (
            <motion.line key={i} x1={x} y1={40} x2={x} y2={50}
              stroke="rgba(255,255,255,0.04)" strokeWidth={1}
              {...fadeIn(0.8 + i * 0.04)} />
          ))}

          {/* Floor shadow line */}
          <motion.line x1={20} y1={319} x2={440} y2={319}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1}
            {...fadeIn(0.85)} />

          {/* ── CAMERA 1 (left ceiling, pointing right-down) ── */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            style={{ transformBox: "fill-box", transformOrigin: "center top" }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.6 }}
          >
            <line x1={110} y1={40} x2={110} y2={48}
              stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <rect x={88} y={43} width={44} height={18} rx={4}
              fill="rgba(25,25,25,0.95)" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
            <circle cx={128} cy={52} r={8.5}
              fill="rgba(8,8,8,1)" stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
            <circle cx={128} cy={52} r={4.5} fill="rgba(70,70,70,0.8)" />
            <circle cx={126} cy={50} r={1.5} fill="rgba(255,255,255,0.12)" />
            <motion.circle cx={93} cy={48} r={3} fill="rgb(239,68,68)"
              animate={inView ? { opacity: [1, 0.1, 1] } : {}}
              transition={{ duration: 1.3, repeat: Infinity, delay: 1.6, ease: "easeInOut" }} />
          </motion.g>

          {/* FOV cone 1 */}
          <motion.path d="M 126 60 L 42 318 L 298 318 Z"
            fill="rgba(239,68,68,0.055)" stroke="rgba(239,68,68,0.12)" strokeWidth={0.5}
            {...fadeIn(1.0, 0.9)} />

          {/* Angle arc 1 */}
          <motion.g {...fadeIn(1.45, 0.4)}>
            <path d="M 107 67 A 17 17 0 0 1 136 71"
              fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth={0.8} />
            <text x={113} y={86} fontSize={7.5} fill="rgba(239,68,68,0.5)"
              fontFamily="monospace" textAnchor="middle">110°</text>
          </motion.g>

          {/* ── CAMERA 2 (right ceiling, pointing left-down) ── */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            style={{ transformBox: "fill-box", transformOrigin: "center top" }}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 1.05 }}
          >
            <line x1={350} y1={40} x2={350} y2={48}
              stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <rect x={328} y={43} width={44} height={18} rx={4}
              fill="rgba(25,25,25,0.95)" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
            <circle cx={332} cy={52} r={8.5}
              fill="rgba(8,8,8,1)" stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
            <circle cx={332} cy={52} r={4.5} fill="rgba(70,70,70,0.8)" />
            <circle cx={330} cy={50} r={1.5} fill="rgba(255,255,255,0.12)" />
            <motion.circle cx={367} cy={48} r={3} fill="rgb(239,68,68)"
              animate={inView ? { opacity: [1, 0.1, 1] } : {}}
              transition={{ duration: 1.3, repeat: Infinity, delay: 1.9, ease: "easeInOut" }} />
          </motion.g>

          {/* FOV cone 2 */}
          <motion.path d="M 334 60 L 162 318 L 418 318 Z"
            fill="rgba(239,68,68,0.055)" stroke="rgba(239,68,68,0.12)" strokeWidth={0.5}
            {...fadeIn(1.5, 0.9)} />

          {/* Overlap zone highlight */}
          <motion.path d="M 162 318 L 298 318 L 280 210 L 180 210 Z"
            fill="rgba(239,68,68,0.04)"
            {...fadeIn(1.7, 0.7)} />

          {/* ── Guard / Person ── */}
          <motion.g
            initial={{ opacity: 0, x: 38 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease, delay: 1.9 }}
          >
            <circle cx={238} cy={258} r={30} fill="rgba(239,68,68,0.055)" />
            <circle cx={238} cy={222} r={14}
              fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.5} />
            <line x1={238} y1={236} x2={238} y2={272}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={213} y1={252} x2={263} y2={252}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={213} y1={252} x2={208} y2={268}
              stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} />
            <line x1={263} y1={252} x2={266} y2={268}
              stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} />
            <line x1={238} y1={272} x2={226} y2={315}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={238} y1={272} x2={250} y2={315}
              stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
          </motion.g>

          {/* ── NVR Recorder ── */}
          <motion.g
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 2.1 }}
          >
            <rect x={330} y={283} width={90} height={28} rx={3}
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
            {[0, 1, 2].map(i => (
              <rect key={i} x={336 + i * 21} y={289} width={15} height={6} rx={1}
                fill="rgba(255,255,255,0.09)" />
            ))}
            <motion.circle cx={412} cy={297} r={2.5} fill="rgb(52,211,153)"
              animate={inView ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ duration: 2.2, repeat: Infinity, delay: 2.5 }} />
          </motion.g>

          {/* ── Technical labels ── */}

          {/* Label: Camera 1 */}
          <motion.g {...fadeIn(2.3, 0.45)}>
            <line x1={88} y1={52} x2={52} y2={84}
              stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
            <text x={24} y={96} fontSize={8.5} fill="rgba(255,255,255,0.38)"
              fontFamily="monospace" fontWeight="600" letterSpacing="0.5">IP-камера 4K</text>
            <text x={24} y={108} fontSize={7.5} fill="rgba(255,255,255,0.18)"
              fontFamily="monospace">IR 30м · H.265</text>
          </motion.g>

          {/* Label: Camera 2 */}
          <motion.g {...fadeIn(2.5, 0.45)}>
            <line x1={372} y1={52} x2={408} y2={84}
              stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
            <text x={385} y={96} fontSize={8.5} fill="rgba(255,255,255,0.38)"
              fontFamily="monospace" fontWeight="600" letterSpacing="0.5">IP-камера 4K</text>
            <text x={385} y={108} fontSize={7.5} fill="rgba(255,255,255,0.18)"
              fontFamily="monospace">IR 30м · H.265</text>
          </motion.g>

          {/* Label: Guard */}
          <motion.g {...fadeIn(2.4, 0.45)}>
            <line x1={224} y1={232} x2={188} y2={208}
              stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
            <text x={130} y={202} fontSize={8.5} fill="rgba(255,255,255,0.38)"
              fontFamily="monospace" fontWeight="600">Сотрудник</text>
            <text x={130} y={214} fontSize={7.5} fill="rgba(255,255,255,0.18)"
              fontFamily="monospace">Зона контроля</text>
          </motion.g>

          {/* Label: NVR */}
          <motion.g {...fadeIn(2.6, 0.45)}>
            <text x={334} y={325} fontSize={7.5} fill="rgba(255,255,255,0.2)"
              fontFamily="monospace">NVR · 8TB · 24/7</text>
          </motion.g>

          {/* ── SECURED badge ── */}
          <g transform="translate(378,172)">
            <motion.g
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              initial={{ opacity: 0, scale: 1.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 2.9 }}
            >
              <circle cx={0} cy={0} r={36}
                fill="rgba(52,211,153,0.07)" stroke="rgba(52,211,153,0.3)"
                strokeWidth={1} strokeDasharray="5 2.5" />
              <text y={-5} fontSize={8.5} fill="rgba(52,211,153,0.85)"
                fontFamily="monospace" fontWeight="700" textAnchor="middle" letterSpacing="2">
                SECURED
              </text>
              <text y={14} fontSize={18} fill="rgba(52,211,153,0.9)" textAnchor="middle">
                ✓
              </text>
            </motion.g>
          </g>

        </svg>

        {/* Viewfinder corner brackets (CSS) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-[1.5px] border-l-[1.5px] border-white/[0.18]" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-[1.5px] border-r-[1.5px] border-white/[0.18]" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[1.5px] border-l-[1.5px] border-white/[0.18]" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[1.5px] border-r-[1.5px] border-white/[0.18]" />
        </div>

        {/* Online badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.1, duration: 0.4 }}
          className="absolute top-2 left-6 flex items-center gap-1.5 px-2 py-1 rounded bg-black/65 backdrop-blur-sm border border-white/10"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[8px] font-mono text-emerald-400/80 uppercase tracking-wider">2 камеры · онлайн</span>
        </motion.div>

        {/* REC badge */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.2, duration: 0.4 }}
          className="absolute top-2 right-6 flex items-center gap-1.5 px-2 py-1 rounded bg-black/65 backdrop-blur-sm border border-white/10"
        >
          <motion.span className="w-1.5 h-1.5 rounded-full bg-red-500"
            animate={inView ? { opacity: [1, 0.15, 1] } : {}}
            transition={{ duration: 1.0, repeat: Infinity, delay: 3 }} />
          <span className="text-[8px] font-mono text-red-400/70 uppercase tracking-wider">REC</span>
        </motion.div>

      </div>
    </div>
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
  const sceneY       = useTransform(scrollYProgress, [0, 1], ["0%", "16%"])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden border-b border-white/[0.06]"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-[35%] -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-red-600/[0.05] blur-[140px] pointer-events-none" />

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
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_520px]">

        {/* LEFT: Typography — Framer-style massive bold lines */}
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

          {/* Headline — 3 short lines, each massive */}
          <h1 className="mb-10 flex flex-col">
            <RevealLine delay={0} className="leading-[0.9]">
              <span className="block text-[clamp(4rem,9vw,8rem)] font-black tracking-tighter text-foreground">
                Охрана
              </span>
            </RevealLine>
            <RevealLine delay={0.08} className="leading-[0.9]">
              <span className="block text-[clamp(4rem,9vw,8rem)] font-black tracking-tighter text-foreground">
                каждого
              </span>
            </RevealLine>
            <RevealLine delay={0.16} className="leading-[0.9]">
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

        {/* RIGHT: Animated Security Scene */}
        <div className="relative hidden lg:flex items-center justify-center px-8 py-12 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <motion.div className="w-full" style={{ y: sceneY, opacity: sceneOpacity }}>
            <SecurityScene />
          </motion.div>
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

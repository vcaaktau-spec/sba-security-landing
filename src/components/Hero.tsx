"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ─────────────────────────────────────────
   CountUp — slot flash → smooth ease-out
───────────────────────────────────────── */
function CountUp({
  target,
  suffix = "+",
  triggered,
}: {
  target: number
  suffix?: string
  triggered: boolean
}) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!triggered) return
    const DURATION = 1600
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / DURATION, 1)
      let value: number

      if (t < 0.3 && target >= 50) {
        // Slot-machine random flash
        value = Math.floor(Math.random() * target * 0.85)
      } else {
        const t2 = t < 0.3 ? 0 : (t - 0.3) / 0.7
        const eased = 1 - Math.pow(1 - t2, 3)
        value = Math.round(eased * target)
      }

      setDisplay(value)
      if (t < 1) rafId = requestAnimationFrame(tick)
      else setDisplay(target)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [triggered, target])

  const fmt =
    target >= 1000
      ? `${Math.floor(display / 1000)} ${String(display % 1000).padStart(3, "0")}`
      : display

  return <>{fmt}{suffix}</>
}

/* ─────────────────────────────────────────
   LineReveal — clip from below, time-based (не скролл)
───────────────────────────────────────── */
function LineReveal({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode
  delay: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "108%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 0.95, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────
   ScanLine — периодический световой sweep
───────────────────────────────────────── */
function ScanLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "28%",
          height: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.012) 50%, transparent 100%)",
        }}
        animate={{ x: ["-28%", "140%"] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 6,
          ease: [0.4, 0, 0.6, 1],
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()

  /* Скролл-параллакс только для орбов — контент не двигается */
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 100])
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -60])

  /* useInView для статистики (once:true — не реагирует на скролл назад) */
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: "-20%" })
  const [statsTriggered, setStatsTriggered] = useState(false)

  useEffect(() => {
    if (statsInView && !statsTriggered) {
      // небольшая задержка чтобы колонка успела войти
      const t = setTimeout(() => setStatsTriggered(true), 200)
      return () => clearTimeout(t)
    }
  }, [statsInView, statsTriggered])

  const stats = [
    { value: 5000, suffix: "+", label: t("hero.stat1") },
    { value: 300,  suffix: "+", label: t("hero.stat2") },
    { value: 10,   suffix: "+", label: t("hero.stat3") },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#050505", color: "#fff" }}
    >
      <ScanLine />

      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
        {/* Orb left */}
        <motion.div
          style={{ y: orbY1, position: "absolute" }}
          className="inset-0"
        >
          <motion.div
            className="absolute rounded-full"
            animate={{ scale: [1, 1.08, 1], opacity: [1, 0.85, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 820, height: 820,
              top: "-8%", left: "-18%",
              background:
                "radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 68%)",
              filter: "blur(50px)",
            }}
          />
        </motion.div>

        {/* Orb right */}
        <motion.div
          style={{ y: orbY2, position: "absolute" }}
          className="inset-0"
        >
          <motion.div
            className="absolute rounded-full"
            animate={{ scale: [1, 1.06, 1], opacity: [1, 0.75, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            style={{
              width: 560, height: 560,
              bottom: "-6%", right: "-10%",
              background:
                "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.016,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 38%, rgba(5,5,5,0.72) 100%)",
          }}
        />
      </div>

      {/* ── Status bar — появляется первым, без задержки ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0 }}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-3 text-[10px] font-mono"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="tracking-widest uppercase text-white/30">SBA Security · Актау</span>
        </div>
        <span className="hidden sm:block tracking-widest uppercase text-white/[0.11]">
          Мониторинг 24 / 7
        </span>
        <span className="tracking-widest text-white/[0.06]">v 2.4</span>
      </motion.div>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_220px] px-6 sm:px-10 lg:px-16">

        {/* LEFT */}
        <div
          className="flex flex-col justify-center py-12 lg:py-0 lg:pr-14"
          style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.06 }}
            className="flex items-center gap-3 mb-10"
          >
            <div
              className="shrink-0"
              style={{ width: 36, height: 1, background: "rgba(239,68,68,0.65)" }}
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-red-400/60">
              Системы безопасности
            </span>
            {/* Terminal cursor blink */}
            <motion.span
              className="inline-block w-px h-3 bg-red-500/50 shrink-0"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Headline — 3 staggered clip reveals */}
          <h1 className="flex flex-col mb-12">
            <LineReveal delay={0.13} className="mb-[0.05em]">
              <span
                className="block font-black tracking-tighter leading-none text-white"
                style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
              >
                ОХРАНА
              </span>
            </LineReveal>

            <LineReveal delay={0.26} className="mb-[0.05em]">
              <span
                className="block font-black tracking-tighter leading-none text-white/[0.62]"
                style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
              >
                КАЖДОГО
              </span>
            </LineReveal>

            <LineReveal delay={0.39}>
              <span
                className="block font-black tracking-tighter leading-none text-red-500"
                style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
              >
                ОБЪЕКТА
                {/* Blinking period */}
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                >
                  .
                </motion.span>
              </span>
            </LineReveal>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.54 }}
            className="text-base leading-relaxed mb-8 max-w-[340px] text-white/40"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.66 }}
            className="flex flex-col sm:flex-row items-start gap-3"
          >
            <button
              onClick={onOpenCalc}
              className="group relative flex items-center gap-2.5 px-7 h-12 font-bold text-sm rounded-xl overflow-hidden text-white shrink-0"
              style={{
                background: "#dc2626",
                boxShadow: "0 0 36px rgba(220,38,38,0.22)",
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.14] to-transparent group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">{t("hero.btn")}</span>
              <ArrowRight
                size={15}
                className="relative group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>

            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 h-12 text-sm font-medium rounded-xl text-white/[0.42] shrink-0 transition-colors duration-200"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <MessageCircle size={15} className="text-green-400 shrink-0" />
              WhatsApp
            </a>
          </motion.div>
        </div>

        {/* RIGHT — stats с CountUp */}
        <div
          ref={statsRef}
          className="hidden lg:flex flex-col justify-center pl-10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.78 + i * 0.12 }}
              style={{
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : undefined,
              }}
              className="py-7"
            >
              <div
                className="font-black leading-none tracking-tight text-white tabular-nums"
                style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)" }}
              >
                <CountUp target={s.value} suffix={s.suffix} triggered={statsTriggered} />
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest mt-2 text-white/[0.22]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4"
      >
        <div style={{ height: 1, width: 36, background: "rgba(239,68,68,0.42)" }} />

        {/* Animated scroll cue */}
        <div className="flex items-center gap-3 text-white/[0.15]">
          <div
            className="relative overflow-hidden"
            style={{ width: 1, height: 20, background: "rgba(255,255,255,0.07)" }}
          >
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: "40%", background: "rgba(255,255,255,0.5)" }}
              animate={{ y: ["0%", "220%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase">Scroll</span>
        </div>

        <div className="flex items-center gap-2 text-white/[0.18]">
          <span className="text-[9px] font-mono tracking-widest uppercase">Active 24/7</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-55" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
        </div>
      </motion.div>
    </section>
  )
}

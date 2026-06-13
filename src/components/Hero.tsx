"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle, Shield, Flame, Cpu } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

const E = [0.22, 1, 0.36, 1] as const

/* ─────────────────────────────────────────
   usePreciseCounter
   Slow, deliberate ease-out-quart.
   No flashing — feels expensive & precise.
───────────────────────────────────────── */
function usePreciseCounter(end: number, duration = 2600, startDelay = 0) {
  const [value, setValue] = useState(0)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), startDelay)
    return () => clearTimeout(t)
  }, [startDelay])

  useEffect(() => {
    if (!triggered) return
    const origin = performance.now()
    let raf: number

    /** cubic ease-out-quart — steep initial acceleration, very soft landing */
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const step = (now: number) => {
      const t = Math.min((now - origin) / duration, 1)
      setValue(Math.round(easeOutQuart(t) * end))
      if (t < 1) raf = requestAnimationFrame(step)
      else setValue(end)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [triggered, end, duration])

  return value
}

/* ─────────────────────────────────────────
   StatCard
───────────────────────────────────────── */
function StatCard({
  end,
  label,
  suffix = "+",
  delay,
}: {
  end: number
  label: string
  suffix?: string
  delay: number
}) {
  const raw = usePreciseCounter(end, 2600, delay)

  const formatted =
    end >= 1000
      ? `${Math.floor(raw / 1000)} ${String(raw % 1000).padStart(3, "0")}`
      : raw

  return (
    <motion.div
      initial={{ opacity: 0, x: 22, filter: "blur(6px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.85, ease: E, delay: 0.72 + delay / 1000 }}
    >
      <div
        className="font-black tracking-tight leading-none tabular-nums text-white"
        style={{ fontSize: "clamp(2rem, 3.4vw, 3rem)" }}
      >
        {formatted}
        {suffix}
      </div>
      <div
        className="text-[10px] font-mono uppercase tracking-widest mt-2"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        {label}
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Shared Framer variants — blur-up stagger
───────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: E },
  },
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  /* Parallax on background orbs only — text stays fixed */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["0px", "90px"])
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["0px", "-55px"])

  const features = [
    { Icon: Shield, label: "Видеонаблюдение" },
    { Icon: Flame,  label: "Пожарная охрана" },
    { Icon: Cpu,    label: "Умный доступ" },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#030303", color: "#fff" }}
    >

      {/* ───────────── Background ───────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>

        {/* Red atmosphere — top-left */}
        <motion.div style={{ y: orbY1 }} className="absolute inset-0">
          <div
            className="absolute rounded-full"
            style={{
              width: 900, height: 900,
              top: "-22%", left: "-22%",
              background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 65%)",
              filter: "blur(60px)",
            }}
          />
        </motion.div>

        {/* Red atmosphere — bottom-right */}
        <motion.div style={{ y: orbY2 }} className="absolute inset-0">
          <div
            className="absolute rounded-full"
            style={{
              width: 600, height: 600,
              bottom: "-18%", right: "-10%",
              background: "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>

        {/* Fine engineering grid */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.022,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 90% at 50% 50%, transparent 35%, rgba(3,3,3,0.75) 100%)",
          }}
        />

        {/* Ambient scan sweep — repeats every ~8 s */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "26%", height: "100%",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.011) 50%, transparent 100%)",
            }}
            animate={{ x: ["-26%", "130%"] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatDelay: 8,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        </div>
      </div>

      {/* ───────────── Status bar ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: E }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-3.5 text-[10px] font-mono"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-50" />
            <span className="relative rounded-full h-[7px] w-[7px] bg-emerald-500" />
          </span>
          <span className="tracking-widest uppercase text-white/25">SBA Security · Актау</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-white/[0.09] tracking-widest uppercase">
          <span>Мониторинг 24 / 7</span>
          <span>v 2.4</span>
        </div>
      </motion.div>

      {/* ───────────── Main layout ───────────── */}
      <div className="relative z-10 flex-1 grid lg:grid-cols-[1fr_auto] items-center gap-12 lg:gap-24 px-6 sm:px-10 lg:px-16 py-14 lg:py-0">

        {/* ── LEFT: Copy ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col"
        >

          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-3 mb-10">
            <span
              className="shrink-0"
              style={{ display: "block", width: 28, height: 1, background: "rgba(220,38,38,0.7)" }}
            />
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-[0.24em]"
              style={{ color: "rgba(220,38,38,0.62)" }}
            >
              Системы безопасности
            </span>
          </motion.div>

          {/* Headline — clip-reveal per word */}
          <h1 className="mb-12 flex flex-col" style={{ gap: "0.04em" }}>
            {(
              [
                ["ОХРАНА",   "#ffffff",              0.12],
                ["КАЖДОГО",  "rgba(255,255,255,0.58)", 0.26],
                ["ОБЪЕКТА.", "#dc2626",              0.40],
              ] as [string, string, number][]
            ).map(([word, color, d]) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 1.0, ease: E, delay: d }}
                  className="block font-black tracking-tighter leading-[0.88]"
                  style={{
                    fontSize: "clamp(4rem, 11vw, 10rem)",
                    color,
                  }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-[15px] leading-[1.72] mb-8 max-w-[380px]"
            style={{ color: "rgba(255,255,255,0.37)" }}
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Feature chips — Vercel/Linear style */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-2 mb-10">
            {features.map(({ Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono tracking-wide"
                style={{
                  color: "rgba(255,255,255,0.36)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                <Icon size={11} style={{ color: "rgba(220,38,38,0.6)", flexShrink: 0 }} />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-start gap-3">
            <button
              onClick={onOpenCalc}
              className="group relative flex items-center gap-2 px-6 h-11 text-sm font-semibold rounded-xl overflow-hidden text-white shrink-0"
              style={{
                background: "#dc2626",
                boxShadow:
                  "0 0 28px rgba(220,38,38,0.24), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.13] to-transparent group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">{t("hero.btn")}</span>
              <ArrowRight
                size={14}
                className="relative group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>

            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 h-11 text-sm font-medium rounded-xl shrink-0 transition-colors duration-200 hover:text-white/60"
              style={{
                color: "rgba(255,255,255,0.38)",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <MessageCircle size={14} style={{ color: "#4ade80", flexShrink: 0 }} />
              WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Stats column ── */}
        <div
          className="hidden lg:flex flex-col"
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.04)",
            paddingLeft: 52,
            gap: 0,
          }}
        >
          {[
            { end: 5000, label: t("hero.stat1"), delay: 900 },
            { end: 300,  label: t("hero.stat2"), delay: 1050 },
            { end: 10,   label: t("hero.stat3"), delay: 1200 },
          ].map((s, i) => (
            <div
              key={i}
              className="py-8"
              style={{
                borderBottom:
                  i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined,
              }}
            >
              <StatCard {...s} />
            </div>
          ))}
        </div>
      </div>

      {/* ───────────── Bottom bar ───────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.55, ease: E }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        {/* Brand accent dash */}
        <div
          style={{ width: 28, height: 1, background: "rgba(220,38,38,0.45)" }}
        />

        {/* Animated scroll cue */}
        <div
          className="flex items-center gap-2.5"
          style={{ color: "rgba(255,255,255,0.14)" }}
        >
          <div
            className="relative overflow-hidden"
            style={{ width: 1, height: 18, background: "rgba(255,255,255,0.07)" }}
          >
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: "38%", background: "rgba(255,255,255,0.55)" }}
              animate={{ y: ["0%", "220%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[9px] font-mono tracking-[0.24em] uppercase">
            Scroll
          </span>
        </div>

        {/* Live pulse */}
        <div
          className="flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.14)" }}
        >
          <span className="text-[9px] font-mono tracking-widest uppercase">
            Active 24 / 7
          </span>
          <span className="relative flex h-[6px] w-[6px]">
            <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-50" />
            <span className="relative rounded-full h-[6px] w-[6px] bg-red-500" />
          </span>
        </div>
      </motion.div>
    </section>
  )
}

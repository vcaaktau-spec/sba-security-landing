"use client"

import { useRef, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

function Reveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1.0, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const bgY    = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const textY  = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])

  return (
    <section
      ref={ref}
      id="hero"
      /* Force dark — не зависит от темы сайта */
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "#050505", color: "#fff" }}
    >

      {/* ── Фоновые gradient orbs ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        {/* Red orb — left */}
        <div
          className="absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: "10%", left: "-15%",
            background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Red orb — right-bottom */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: "5%", right: "-5%",
            background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </motion.div>

      {/* ── Status bar ── */}
      <div
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-3 text-[10px] font-mono"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span style={{ color: "rgba(255,255,255,0.35)" }} className="tracking-widest uppercase">
            SBA Security · Актау
          </span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.15)" }} className="hidden sm:block tracking-widest uppercase">
          Мониторинг 24 / 7
        </span>
        <span style={{ color: "rgba(255,255,255,0.1)" }} className="tracking-widest">v 2.4</span>
      </div>

      {/* ── Main ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_220px] px-6 sm:px-10 lg:px-16">

        {/* LEFT: Headline + CTA */}
        <div className="flex flex-col justify-center py-12 lg:py-0 lg:pr-12"
          style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div style={{ width: 36, height: 1, background: "rgba(239,68,68,0.7)" }} />
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-[0.28em]"
              style={{ color: "rgba(239,68,68,0.65)" }}
            >
              Системы безопасности
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 className="flex flex-col mb-12" style={{ y: textY }}>
            <Reveal delay={0} className="leading-[0.86]">
              <span
                className="block font-black tracking-tighter"
                style={{ fontSize: "clamp(4.5rem,10.5vw,10rem)", color: "#ffffff" }}
              >
                ОХРАНА
              </span>
            </Reveal>
            <Reveal delay={0.09} className="leading-[0.86]">
              <span
                className="block font-black tracking-tighter"
                style={{ fontSize: "clamp(4.5rem,10.5vw,10rem)", color: "rgba(255,255,255,0.7)" }}
              >
                КАЖДОГО
              </span>
            </Reveal>
            <Reveal delay={0.18} className="leading-[0.86]">
              <span
                className="block font-black tracking-tighter"
                style={{ fontSize: "clamp(4.5rem,10.5vw,10rem)", color: "#ef4444" }}
              >
                ОБЪЕКТА.
              </span>
            </Reveal>
          </motion.h1>

          {/* Bottom row: subtext + buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.38 }}
          >
            {/* Subtext */}
            <p
              className="text-base leading-relaxed max-w-[320px]"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {t("hero.subtitle")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 shrink-0">
              <button
                onClick={onOpenCalc}
                className="group relative flex items-center gap-2.5 px-7 h-12 font-bold text-sm rounded-xl overflow-hidden text-white"
                style={{
                  background: "#dc2626",
                  boxShadow: "0 0 32px rgba(220,38,38,0.25)",
                }}
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{t("hero.btn")}</span>
                <ArrowRight size={15} className="relative group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="https://wa.me/77779204988"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 h-10 text-sm font-medium rounded-xl transition-all"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <MessageCircle size={15} style={{ color: "#4ade80" }} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Stacked stats — vertical, minimal */}
        <div className="hidden lg:flex flex-col justify-center pl-10 gap-0">
          {[
            { value: "5 000+", label: t("hero.stat1", "Установленных камер") },
            { value: "300+",   label: t("hero.stat2", "Объектов под охраной") },
            { value: "10+",    label: t("hero.stat3", "Лет на рынке") },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 + i * 0.12 }}
              className="py-7"
              style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
            >
              <div
                className="text-[3rem] font-black leading-none tabular-nums tracking-tight"
                style={{ color: "#ffffff" }}
              >
                {s.value}
              </div>
              <div
                className="text-[10px] font-mono uppercase tracking-widest mt-2"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Red thin accent line (left) */}
        <div style={{ height: 1, width: 40, background: "rgba(239,68,68,0.5)" }} />

        {/* Scroll cue */}
        <div className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.15)" }}>
          <div className="w-px h-5 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="absolute inset-x-0 top-0"
              style={{ height: "40%", background: "rgba(255,255,255,0.5)" }}
              animate={{ y: ["0%", "200%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] uppercase">Scroll</span>
        </div>

        {/* Right: live indicator */}
        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          <span className="text-[9px] font-mono tracking-widest uppercase">Active 24/7</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
        </div>
      </motion.div>
    </section>
  )
}

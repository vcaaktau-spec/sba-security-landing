"use client"

import { useTranslation } from "react-i18next"
import { ArrowRight, Shield, Zap } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import Magnetic from "./ui/magnetic"

interface HeroProps {
  onOpenCalc: () => void;
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const { scrollY } = useScroll()

  const apertureY      = useTransform(scrollY, [0, 700], [0, -80])
  const apertureRotate = useTransform(scrollY, [0, 1000], [0, 110])
  const apertureScale  = useTransform(scrollY, [0, 600], [1, 1.06])
  const floatY         = useTransform(scrollY, [0, 700], [0, -120])

  const stats = [
    { value: "5 000+", label: t("hero.stat1", "Установленных камер") },
    { value: "300+",   label: t("hero.stat2", "Объектов под защитой") },
    { value: "10+",    label: t("hero.stat3", "Лет опыта") },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-transparent pt-20">

      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-100 pointer-events-none" />

      {/* Radial glow behind headline */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center py-20 lg:py-0">

        {/* ── LEFT CONTENT ── */}
        <div className="flex flex-col items-start text-left">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-foreground/70 text-xs font-mono tracking-wider mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            SBA SECURITY — АКТАУ
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.07, ease }}
            className="text-[42px] leading-[1.04] sm:text-[54px] lg:text-[68px] font-black tracking-tight text-foreground"
          >
            <span className="block">{t("hero.title1", "Система Безопасности")}</span>
            <span className="block mt-1 bg-gradient-to-r from-red-500 to-rose-400 bg-clip-text text-transparent">
              {t("hero.title2", "Актау")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-7 text-[16px] sm:text-[18px] leading-relaxed text-muted-foreground max-w-[480px]"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease }}
            className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto"
          >
            <Magnetic strength={0.25}>
              <Button
                onClick={onOpenCalc}
                size="lg"
                className="btn-shine group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white w-full sm:w-auto h-12 px-7 text-[15px] font-semibold tracking-wide rounded-xl border border-red-500/40 shadow-[0_0_24px_rgba(220,38,38,0.18)] hover:shadow-[0_0_40px_rgba(220,38,38,0.38)] transition-all duration-300"
              >
                {t("hero.btn")}
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Magnetic>

            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 px-7 text-[15px] font-medium rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-foreground/80 hover:text-foreground transition-all duration-300"
            >
              WhatsApp
            </a>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {[
              { icon: Shield, text: t("hero.feature1") },
              { icon: Zap,    text: t("hero.feature2") },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground/70 text-sm font-medium"
              >
                <item.icon size={14} className="text-red-400" />
                {item.text}
              </div>
            ))}
          </motion.div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            className="flex items-center gap-6 mt-12 pt-8 border-t border-white/[0.07] w-full"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-foreground tabular-nums">{s.value}</span>
                <span className="text-[11px] font-medium text-muted-foreground/70 mt-0.5 leading-tight">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: SVG Aperture ── */}
        <div className="relative flex items-center justify-center w-full min-h-[380px] sm:min-h-[480px]">

          {/* Outer HUD ring */}
          <motion.div
            style={{ y: apertureY, scale: apertureScale }}
            className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] opacity-30 dark:opacity-50"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-foreground/20">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.2" />
              <path d="M50 2 L50 8 M50 98 L50 92 M2 50 L8 50 M98 50 L92 50" stroke="currentColor" strokeWidth="0.4" />
            </svg>
          </motion.div>

          {/* Core aperture (scroll-linked rotation) */}
          <motion.div
            style={{ y: apertureY, rotate: apertureRotate, scale: apertureScale }}
            className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] z-10 drop-shadow-[0_12px_40px_rgba(220,38,38,0.12)]"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="hGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor="#ef4444" stopOpacity="0.18" />
                  <stop offset="75%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="32" fill="url(#hGlow)" />

              {/* Aperture blades */}
              <path d="M50 14 L68 31 L55 44 Z" fill="none" stroke="#ef4444" strokeWidth="0.7" strokeOpacity="0.7" />
              <path d="M86 50 L69 68 L56 55 Z" fill="none" stroke="#ef4444" strokeWidth="0.7" strokeOpacity="0.7" />
              <path d="M50 86 L32 69 L45 56 Z" fill="none" stroke="#ef4444" strokeWidth="0.7" strokeOpacity="0.7" />
              <path d="M14 50 L31 32 L44 45 Z" fill="none" stroke="#ef4444" strokeWidth="0.7" strokeOpacity="0.7" />

              {/* Housing rings */}
              <circle cx="50" cy="50" r="36" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeOpacity="0.5" />
              <circle cx="50" cy="50" r="26" fill="none" stroke="#ef4444" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="2.5 1.5" />
              <circle cx="50" cy="50" r="9"  fill="none" stroke="#ef4444" strokeWidth="0.4" strokeOpacity="0.5" />

              {/* Arc decorations */}
              <path d="M20 10 A42 42 0 0 1 80 10" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="8 5" strokeOpacity="0.35" />
              <path d="M80 90 A42 42 0 0 1 20 90" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="8 5" strokeOpacity="0.35" />
            </svg>
          </motion.div>

          {/* Floating info card */}
          <motion.div
            style={{ y: floatY }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="absolute bottom-8 right-2 sm:right-4 z-20 w-[170px] bg-background/80 dark:bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">LIVE</span>
            </div>
            <div className="space-y-1.5 font-mono text-[10px] text-foreground/70">
              <div className="flex justify-between"><span>FPS</span><span className="text-foreground font-semibold">60</span></div>
              <div className="flex justify-between"><span>ENC</span><span className="text-foreground font-semibold">AES-256</span></div>
              <div className="flex justify-between"><span>SIGNAL</span><span className="text-emerald-400 font-semibold">100%</span></div>
            </div>
          </motion.div>

          {/* Top-left floating chip */}
          <motion.div
            style={{ y: useTransform(scrollY, [0, 700], [0, -40]) }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="absolute top-10 left-2 sm:left-4 z-20 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-background/60 dark:bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg"
          >
            <div className="w-6 h-6 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center">
              <Shield size={12} className="text-red-400" />
            </div>
            <div className="font-mono text-[9px] leading-tight">
              <div className="font-bold text-foreground/90">SECURE</div>
              <div className="text-muted-foreground/60">ZONE ACTIVE</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

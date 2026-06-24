"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle, Shield, Flame, Cpu } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Magnetic from "./ui/magnetic"

interface HeroProps {
  onOpenCalc: () => void
}

const E = [0.22, 1, 0.36, 1] as const

/* ─────────────────────────────────────────
   useSbaCounter
   Slow, deliberate ease-out-quint.
   Settle extremely slowly at the end for precision.
 ───────────────────────────────────────── */
function useSbaCounter(end: number, duration = 3600, startDelay = 0) {
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

    // Quintic ease-out - starts fast, with a long, slow deceleration tail
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

    const step = (now: number) => {
      const progress = Math.min((now - origin) / duration, 1)
      setValue(Math.round(easeOutQuint(progress) * end))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setValue(end)
      }
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
  index,
  end,
  label,
  suffix = "+",
  delay,
}: {
  index: number
  end: number
  label: string
  suffix?: string
  delay: number
}) {
  const raw = useSbaCounter(end, 3600, delay)

  const formatted =
    end >= 1000
      ? String(raw).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      : raw

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/40 uppercase">
          METRIC // 0{index}
        </span>
        <span className="text-xs font-mono font-semibold text-muted-foreground/80 tracking-wider uppercase">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-25 dark:opacity-35" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <div
          className="font-mono font-black tracking-tighter leading-none tabular-nums text-foreground flex items-baseline"
          style={{ fontSize: "clamp(2rem, 3.8vw, 3rem)" }}
        >
          {formatted}
          <span className="text-primary dark:text-red-500 ml-0.5 text-2xl lg:text-3xl font-bold">{suffix}</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Staggered entrance Framer Motion variants
 ───────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: E },
  },
}

/* ─────────────────────────────────────────
   Hero Component
 ───────────────────────────────────────── */
export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  
  const orbY1 = useTransform(scrollYProgress, [0, 1], ["0px", "100px"])
  const orbY2 = useTransform(scrollYProgress, [0, 1], ["0px", "-60px"])
  
  // Premium parallax exit animations
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const contentBlur = useTransform(scrollYProgress, [0, 0.6], ["blur(0px)", "blur(12px)"])

  const features = [
    { Icon: Shield, key: "hero.feature1" },
    { Icon: Flame,  key: "hero.feature2" },
    { Icon: Cpu,    key: "hero.feature3" },
  ]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      {/* ───────────── Background Layers ───────────── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Top-left soft red atmosphere orb */}
        <motion.div style={{ y: orbY1 }} className="absolute inset-0">
          <div
            className="absolute rounded-full opacity-15 dark:opacity-30"
            style={{
              width: 800, height: 800,
              top: "-20%", left: "-20%",
              background: "radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>

        {/* Bottom-right soft red atmosphere orb */}
        <motion.div style={{ y: orbY2 }} className="absolute inset-0">
          <div
            className="absolute rounded-full opacity-10 dark:opacity-25"
            style={{
              width: 600, height: 600,
              bottom: "-15%", right: "-10%",
              background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        </motion.div>

        {/* Technical Engineering Grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.015] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:80px_80px]"
        />

        {/* Radial Vignette */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_50%,transparent_35%,rgba(248,250,252,0.85)_100%)] dark:bg-[radial-gradient(ellipse_100%_90%_at_50%_50%,transparent_35%,rgba(8,9,12,0.92)_100%)]"
        />

        {/* Ambient Scan sweep line */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-[30%] h-full bg-gradient-to-r from-transparent via-black/[0.005] dark:via-white/[0.01] to-transparent"
            animate={{ x: ["-30%", "130%"] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatDelay: 8,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        </div>
      </div>

      {/* ───────────── Header Diagnostic Bar ───────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: E }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4 text-[10px] font-mono border-b border-slate-200/50 dark:border-white/[0.06] bg-white/10 dark:bg-white/[0.01]"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-[7px] w-[7px]">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
            <span className="relative rounded-full h-[7px] w-[7px] bg-emerald-500" />
          </span>
          <span className="tracking-widest uppercase text-muted-foreground/60">SBA Security · Актау</span>
        </div>
        <div className="hidden sm:flex items-center gap-8 text-muted-foreground/45 tracking-widest uppercase">
          <span>Мониторинг 24 / 7</span>
          <span>v 2.4</span>
        </div>
      </motion.div>

      {/* ───────────── Main Content Grid ───────────── */}
      <motion.div 
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale, filter: contentBlur }}
        className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center px-6 sm:px-10 lg:px-16 py-16 lg:py-0"
      >
        {/* ── LEFT: Typography & Features (col-span-7) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:col-span-7"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="w-8 h-[1px] bg-primary dark:bg-red-500 opacity-70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-primary dark:text-red-500">
              Системы безопасности
            </span>
          </motion.div>

          {/* Headline (Dynamic lines) */}
          <h1 className="mb-8 flex flex-col gap-1 sm:gap-2 select-none" style={{ letterSpacing: "-0.03em" }}>
            {[
              { text: t("hero.titleLine1"), colorClass: "text-foreground", delay: 0.15 },
              { text: t("hero.titleLine2"), colorClass: "text-foreground/40 dark:text-white/45", delay: 0.35 },
              { text: t("hero.titleLine3"), colorClass: "text-primary dark:text-red-500", delay: 0.55 },
            ].map(({ text, colorClass, delay }) => (
              <div key={text} className="overflow-hidden">
                <motion.span
                  initial={{ y: "115%", opacity: 0, filter: "blur(12px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.6, ease: E, delay }}
                  className={`block font-black leading-[0.9] tracking-tighter ${colorClass}`}
                  style={{
                    fontSize: "clamp(3.2rem, 9.5vw, 8.5rem)",
                  }}
                >
                  {text}
                </motion.span>
              </div>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8 max-w-[500px] text-muted-foreground/80"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* Feature tags */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
            {features.map(({ Icon, key }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-mono tracking-wide border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02] text-muted-foreground/80 hover:text-foreground hover:border-slate-300 dark:hover:border-white/10 transition-colors"
              >
                <Icon size={11} className="text-primary dark:text-red-500/80 shrink-0" />
                {t(key)}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Technical Stats & Calculator Widget (col-span-5) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200/50 dark:border-white/[0.06] pt-10 lg:pt-0 lg:pl-12 w-full max-w-[480px] lg:max-w-none mx-auto lg:mx-0 select-none lg:col-span-5"
        >
          {/* Stats list */}
          {[
            { end: 5000, label: t("hero.stat1"), delay: 850 },
            { end: 300,  label: t("hero.stat2"), delay: 1000 },
            { end: 10,   label: t("hero.stat3"), delay: 1150 },
          ].map((s, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="py-6 border-b border-slate-200/50 dark:border-white/[0.06]"
            >
              <StatCard index={i + 1} {...s} />
            </motion.div>
          ))}

          {/* Fine separator divider */}
          <motion.div
            variants={itemVariants}
            className="my-6"
          />

          {/* Interactive Calculator CTA Control Panel Widget */}
          <motion.div
            variants={itemVariants}
            className="border border-slate-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur-md p-5 rounded-2xl relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-none w-full"
          >
            {/* Panel Diagnostics header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/50 dark:border-white/[0.06] text-[9px] font-mono tracking-widest text-muted-foreground/50 uppercase">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                SYSTEM_CALCULATOR_SCRIPT // v2.4
              </span>
              <span>ALGORITHM_ACTIVE</span>
            </div>

            {/* Explanation Note */}
            <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground/75 font-mono mb-5">
              {t("hero.calcHint")}
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Magnetic strength={0.15}>
                <button
                  onClick={onOpenCalc}
                  className="group relative flex items-center justify-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden text-white bg-red-600 hover:bg-red-700 transition-all duration-300 w-full sm:w-auto shadow-md shadow-red-600/10 hover:shadow-red-600/20"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("hero.btn")}</span>
                  <ArrowRight
                    size={14}
                    className="relative group-hover:translate-x-0.5 transition-transform duration-200"
                  />
                </button>
              </Magnetic>

              <Magnetic strength={0.15}>
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-slate-200 dark:border-white/[0.08] w-full sm:w-auto"
                >
                  <MessageCircle size={14} className="text-emerald-500 shrink-0" />
                  WhatsApp
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ───────────── Bottom Diagnostic Bar ───────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.4, ease: E }}
        className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4 border-t border-slate-200/50 dark:border-white/[0.06] text-muted-foreground/50 font-mono text-[9px] tracking-widest uppercase bg-white/5 dark:bg-background/5"
      >
        <div className="w-8 h-[1px] bg-red-500/50" />

        <div className="flex items-center gap-2.5">
          <div className="relative overflow-hidden w-[1px] h-4.5 bg-black/[0.1] dark:bg-white/[0.1]">
            <motion.div
              className="absolute inset-x-0 top-0 h-[35%] bg-red-500"
              animate={{ y: ["0%", "200%", "0%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span>Scroll</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Active 24/7</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-60" />
            <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
        </div>
      </motion.div>
    </section>
  )
}

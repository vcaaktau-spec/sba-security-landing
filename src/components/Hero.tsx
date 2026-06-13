"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion"

interface HeroProps {
  onOpenCalc: () => void
}

/* ─────────────────────────────────────────
   CountUp — slot-machine flash → smooth ease-out
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
    const DURATION = 1500
    const startTime = performance.now()
    let rafId: number

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / DURATION, 1)
      let value: number

      if (t < 0.28 && target >= 50) {
        // Rapid random flash (slot machine)
        value = Math.floor(Math.random() * target * 0.9)
      } else {
        const t2 = t < 0.28 ? 0 : (t - 0.28) / 0.72
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t2, 3)
        value = Math.round(eased * target)
      }

      setDisplay(value)

      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        setDisplay(target)
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [triggered, target])

  const formatted =
    target >= 1000
      ? `${Math.floor(display / 1000)} ${String(display % 1000).padStart(3, "0")}`
      : display

  return <>{formatted}{suffix}</>
}

/* ─────────────────────────────────────────
   LineReveal — clips text, slides up on scroll
───────────────────────────────────────── */
function LineReveal({
  children,
  y,
  opacity,
  className = "",
}: {
  children: ReactNode
  y: MotionValue<string>
  opacity: MotionValue<number>
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Hero
───────────────────────────────────────── */
export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()

  /* Tall wrapper → sticky hero gives scroll-hijack effect */
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  /* ── Animation timeline (0 → 1 maps over 250vh of scroll) ── */

  // Status bar
  const statusOp = useTransform(scrollYProgress, [0, 0.04], [0, 1])

  // Eyebrow
  const eyebrowOp = useTransform(scrollYProgress, [0.02, 0.13], [0, 1])
  const eyebrowX  = useTransform(scrollYProgress, [0.02, 0.13], [-22, 0])

  // Headline lines — staggered clip-reveal from below
  const l1Y  = useTransform(scrollYProgress, [0.06, 0.24], ["106%", "0%"])
  const l1Op = useTransform(scrollYProgress, [0.06, 0.22], [0, 1])

  const l2Y  = useTransform(scrollYProgress, [0.21, 0.39], ["106%", "0%"])
  const l2Op = useTransform(scrollYProgress, [0.21, 0.37], [0, 1])

  const l3Y  = useTransform(scrollYProgress, [0.36, 0.53], ["106%", "0%"])
  const l3Op = useTransform(scrollYProgress, [0.36, 0.51], [0, 1])

  // Subtitle
  const subOp = useTransform(scrollYProgress, [0.51, 0.64], [0, 1])
  const subY  = useTransform(scrollYProgress, [0.51, 0.64], [22, 0])

  // Buttons
  const btnOp = useTransform(scrollYProgress, [0.61, 0.74], [0, 1])
  const btnY  = useTransform(scrollYProgress, [0.61, 0.74], [22, 0])

  // Stats — staggered from the right
  const s0Op = useTransform(scrollYProgress, [0.67, 0.80], [0, 1])
  const s0X  = useTransform(scrollYProgress, [0.67, 0.80], [30, 0])
  const s1Op = useTransform(scrollYProgress, [0.72, 0.84], [0, 1])
  const s1X  = useTransform(scrollYProgress, [0.72, 0.84], [30, 0])
  const s2Op = useTransform(scrollYProgress, [0.77, 0.88], [0, 1])
  const s2X  = useTransform(scrollYProgress, [0.77, 0.88], [30, 0])

  // Orb parallax while locked
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 90])
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -55])

  // Scroll cue disappears as soon as user starts scrolling
  const cueOp = useTransform(scrollYProgress, [0, 0.05, 0.20], [1, 1, 0])

  /* ── Stat counting triggers (individual per stat) ── */
  const triggeredRef = useRef({ s0: false, s1: false, s2: false })
  const [trig0, setTrig0] = useState(false)
  const [trig1, setTrig1] = useState(false)
  const [trig2, setTrig2] = useState(false)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.67 && !triggeredRef.current.s0) { triggeredRef.current.s0 = true; setTrig0(true) }
    if (v >= 0.72 && !triggeredRef.current.s1) { triggeredRef.current.s1 = true; setTrig1(true) }
    if (v >= 0.77 && !triggeredRef.current.s2) { triggeredRef.current.s2 = true; setTrig2(true) }
  })

  const stats = [
    { value: 5000, suffix: "+", label: t("hero.stat1"), op: s0Op, x: s0X, triggered: trig0 },
    { value: 300,  suffix: "+", label: t("hero.stat2"), op: s1Op, x: s1X, triggered: trig1 },
    { value: 10,   suffix: "+", label: t("hero.stat3"), op: s2Op, x: s2X, triggered: trig2 },
  ]

  return (
    /* 250vh = 1 screen locked + 1.5 screens of scroll-animation space */
    <div ref={wrapperRef} style={{ height: "250vh", position: "relative" }}>
      <section
        id="hero"
        className="sticky top-0 h-screen flex flex-col overflow-hidden"
        style={{ background: "#050505", color: "#fff" }}
      >
        {/* ── Background ── */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {/* Orb left */}
          <motion.div style={{ y: orbY1, position: "absolute", inset: 0 }}>
            <motion.div
              className="absolute"
              animate={{ scale: [1, 1.07, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 820, height: 820,
                top: "-5%", left: "-18%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(239,68,68,0.09) 0%, transparent 68%)",
                filter: "blur(52px)",
              }}
            />
          </motion.div>

          {/* Orb right */}
          <motion.div style={{ y: orbY2, position: "absolute", inset: 0 }}>
            <motion.div
              className="absolute"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
              style={{
                width: 560, height: 560,
                bottom: "-8%", right: "-10%",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 65%)",
                filter: "blur(60px)",
              }}
            />
          </motion.div>

          {/* Subtle dot grid */}
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

          {/* Radial vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 38%, rgba(5,5,5,0.7) 100%)",
            }}
          />
        </div>

        {/* ── Status bar ── */}
        <motion.div
          style={{
            opacity: statusOp,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
          className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-3 text-[10px] font-mono"
        >
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-60" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="tracking-widest uppercase text-white/30">SBA Security · Актау</span>
          </div>
          <span className="hidden sm:block tracking-widest uppercase text-white/[0.12]">
            Мониторинг 24 / 7
          </span>
          <span className="tracking-widest text-white/[0.07]">v 2.4</span>
        </motion.div>

        {/* ── Main layout ── */}
        <div className="relative z-10 flex-1 flex flex-col lg:grid lg:grid-cols-[1fr_220px] px-6 sm:px-10 lg:px-16">

          {/* LEFT — eyebrow + headline + subtitle + buttons */}
          <div
            className="flex flex-col justify-center py-12 lg:py-0 lg:pr-14"
            style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}
          >
            {/* Eyebrow */}
            <motion.div
              style={{ opacity: eyebrowOp, x: eyebrowX }}
              className="flex items-center gap-3 mb-10"
            >
              <div className="shrink-0" style={{ width: 36, height: 1, background: "rgba(239,68,68,0.65)" }} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-red-400/60">
                Системы безопасности
              </span>
            </motion.div>

            {/* Headline — 3 clip-reveal lines */}
            <h1 className="flex flex-col mb-12">
              <LineReveal y={l1Y} opacity={l1Op} className="mb-[0.06em]">
                <span
                  className="block font-black tracking-tighter leading-none text-white"
                  style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
                >
                  ОХРАНА
                </span>
              </LineReveal>

              <LineReveal y={l2Y} opacity={l2Op} className="mb-[0.06em]">
                <span
                  className="block font-black tracking-tighter leading-none text-white/[0.65]"
                  style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
                >
                  КАЖДОГО
                </span>
              </LineReveal>

              <LineReveal y={l3Y} opacity={l3Op}>
                <span
                  className="block font-black tracking-tighter leading-none text-red-500"
                  style={{ fontSize: "clamp(4.5rem, 10.5vw, 10rem)" }}
                >
                  ОБЪЕКТА.
                </span>
              </LineReveal>
            </h1>

            {/* Subtitle */}
            <motion.p
              style={{ opacity: subOp, y: subY }}
              className="text-base leading-relaxed mb-8 max-w-[340px] text-white/40"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              style={{ opacity: btnOp, y: btnY }}
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
                {/* Shine sweep */}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.14] to-transparent group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">{t("hero.btn")}</span>
                <ArrowRight size={15} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>

              <a
                href="https://wa.me/77779204988"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 h-12 text-sm font-medium rounded-xl text-white/[0.45] transition-colors duration-200 shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <MessageCircle size={15} className="text-green-400 shrink-0" />
                WhatsApp
              </a>
            </motion.div>
          </div>

          {/* RIGHT — animated stats */}
          <div className="hidden lg:flex flex-col justify-center pl-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                style={{
                  opacity: s.op,
                  x: s.x,
                  borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : undefined,
                }}
                className="py-7"
              >
                <div
                  className="font-black leading-none tracking-tight text-white tabular-nums"
                  style={{ fontSize: "clamp(2.2rem, 3.2vw, 3rem)" }}
                >
                  <CountUp target={s.value} suffix={s.suffix} triggered={s.triggered} />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest mt-2 text-white/[0.22]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="relative z-10 shrink-0 flex items-center justify-between px-6 lg:px-16 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {/* Red accent dash */}
          <div style={{ height: 1, width: 36, background: "rgba(239,68,68,0.42)" }} />

          {/* Scroll cue */}
          <motion.div
            style={{ opacity: cueOp }}
            className="flex items-center gap-3 text-white/[0.15]"
          >
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
          </motion.div>

          {/* Live pulse */}
          <div className="flex items-center gap-2 text-white/[0.18]">
            <span className="text-[9px] font-mono tracking-widest uppercase">Active 24/7</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inset-0 rounded-full bg-red-500 opacity-55" />
              <span className="relative rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Magnetic from "./ui/magnetic"
import { FloorPlan } from "./FloorPlan"

interface HeroProps {
  onOpenCalc: () => void
}

const E = [0.22, 1, 0.36, 1] as const

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  // Scroll timeline per spec
  const wallsProgress   = useTransform(scrollYProgress, [0, 0.30], [0, 1])
  const cam1Scale       = useTransform(scrollYProgress, [0.30, 0.38], [0, 1])
  const cam2Scale       = useTransform(scrollYProgress, [0.34, 0.42], [0, 1])
  const cam3Scale       = useTransform(scrollYProgress, [0.38, 0.46], [0, 1])
  const cam4Scale       = useTransform(scrollYProgress, [0.42, 0.50], [0, 1])
  const cam5Scale       = useTransform(scrollYProgress, [0.46, 0.55], [0, 1])
  const coverageOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const coverageScale   = useTransform(scrollYProgress, [0.55, 0.75], [0.3, 1])
  const ctaOpacity      = useTransform(scrollYProgress, [0.75, 0.90], [0, 1])

  return (
    // 150vh wrapper — provides scroll room for sticky animation
    <div ref={wrapperRef} style={{ height: "150vh" }}>
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-background text-foreground">
        <section
          id="hero"
          className="relative h-full grid grid-cols-1 lg:grid-cols-12"
        >
          {/* ── LEFT PANEL: col-span-5 ── */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-0 lg:col-span-5 z-10">
            {/* Location label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: E }}
              className="text-xs font-mono tracking-widest uppercase text-foreground/40 mb-6"
            >
              {t("hero.locationLabel")}
            </motion.p>

            {/* H1 */}
            <h1
              className="mb-6 flex flex-col gap-1 select-none"
              style={{ letterSpacing: "-0.03em" }}
            >
              <span className="sr-only">Видеонаблюдение в Актау — Установка систем безопасности под ключ</span>
              {[
                { text: t("hero.titleLine1"), cls: "text-foreground",                delay: 0.8  },
                { text: t("hero.titleLine2"), cls: "text-foreground/35",             delay: 1.0  },
                { text: t("hero.titleLine3"), cls: "text-red-600 dark:text-red-500", delay: 1.2  },
              ].map(({ text, cls, delay }) => (
                <div key={text} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1.0, ease: E, delay }}
                    className={`block font-black leading-[0.92] ${cls}`}
                    style={{ fontSize: "clamp(2.5rem, 7.5vw, 5.5rem)" }}
                  >
                    {text}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4, ease: E }}
              className="text-sm leading-relaxed mb-8 max-w-[380px] text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA — desktop: fades in at scroll 75%+ */}
            <motion.div
              style={{ opacity: ctaOpacity }}
              className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Magnetic strength={0.15}>
                <button
                  onClick={onOpenCalc}
                  className="group relative flex items-center justify-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-600/20"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("hero.btn")}</span>
                  <ArrowRight size={14} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </Magnetic>

              <Magnetic strength={0.15}>
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-slate-200 dark:border-white/[0.08]"
                >
                  <MessageCircle size={14} className="text-emerald-500 shrink-0" />
                  WhatsApp
                </a>
              </Magnetic>
            </motion.div>

            {/* CTA — mobile: immediately visible */}
            <div className="flex lg:hidden flex-col sm:flex-row items-start sm:items-center gap-3">
              <Magnetic strength={0.15}>
                <button
                  onClick={onOpenCalc}
                  className="group relative flex items-center justify-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-600/20"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("hero.btn")}</span>
                  <ArrowRight size={14} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </Magnetic>

              <Magnetic strength={0.15}>
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-slate-200 dark:border-white/[0.08]"
                >
                  <MessageCircle size={14} className="text-emerald-500 shrink-0" />
                  WhatsApp
                </a>
              </Magnetic>
            </div>
          </div>

          {/* ── RIGHT PANEL: col-span-7 — SVG floor plan (desktop) ── */}
          <div
            className="hidden lg:flex items-center justify-center lg:col-span-7 relative"
            aria-hidden="true"
            style={{ marginRight: "-5%" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.7, ease: E }}
              className="w-full h-full max-h-[80vh]"
            >
              <FloorPlan
                wallsProgress={wallsProgress}
                cam1Scale={cam1Scale}
                cam2Scale={cam2Scale}
                cam3Scale={cam3Scale}
                cam4Scale={cam4Scale}
                cam5Scale={cam5Scale}
                coverageOpacity={coverageOpacity}
                coverageScale={coverageScale}
              />
            </motion.div>
          </div>

          {/* ── MOBILE PANEL: floor plan below text ── */}
          <div
            className="flex lg:hidden items-center justify-center px-6 pb-8"
            aria-hidden="true"
            style={{ height: "280px" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: E }}
              className="w-full h-full"
            >
              <FloorPlan
                wallsProgress={wallsProgress}
                cam1Scale={cam1Scale}
                cam2Scale={cam2Scale}
                cam3Scale={cam3Scale}
                cam4Scale={cam4Scale}
                cam5Scale={cam5Scale}
                coverageOpacity={coverageOpacity}
                coverageScale={coverageScale}
              />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

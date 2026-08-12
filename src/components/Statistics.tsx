"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Camera, ShieldCheck, Award, Headset } from "lucide-react"
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from "framer-motion"

const E = [0.22, 1, 0.36, 1] as const
const SERIF = "'Source Serif 4', serif"

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

const formatNumber = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

// Второй заход. Первый — 4 одинаковых карточки с рамкой, иконкой в
// квадрате, градиентной подсветкой на hover и мигающей точкой в углу:
// это и есть тот самый "hero-metric template" (крупное число + мелкий
// лейбл + декоративный градиент), который теперь читается как шаблон, а
// не деталь бренда. Здесь заголовок и цифры разнесены по горизонтали
// (левая колонка — тезис, правая — доказательство), между цифрами тонкие
// линии-разделители вместо рамок карточек, а счётчик больше не играет
// фиксированную по времени анимацию при появлении — он привязан к
// прогрессу скролла (scroll-scrub): число растёт по мере того, как
// секция проезжает мимо, а не крутится сама по себе 2.2 секунды.
function StatNumber({ progress, target }: { progress: MotionValue<number>; target: number }) {
  const value = useTransform(progress, [0.05, 0.7], [0, target])
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(reduced ? target : 0)

  useMotionValueEvent(value, "change", (latest) => {
    if (!reduced) setDisplay(Math.round(latest))
  })

  useEffect(() => {
    if (reduced) setDisplay(target)
  }, [reduced, target])

  return <>{formatNumber(display)}</>
}

export const Statistics = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 0.85", "start 0.3"] })

  const stats = [
    { quantity: 5000, suffix: "+", label: t("stats.stat1"), Icon: Camera },
    { quantity: 300, suffix: "+", label: t("stats.stat2"), Icon: ShieldCheck },
    { quantity: 10, suffix: "+", label: t("stats.stat3"), Icon: Award },
    { quantity: 24, suffix: "/7", label: t("stats.stat4"), Icon: Headset },
  ]

  return (
    <section
      id="statistics"
      ref={sectionRef}
      className="relative py-24 lg:py-36 border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16 items-center">

          {/* Левая колонка — тезис */}
          <div className="mb-14 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: E }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-6 h-px bg-red-600/70 shrink-0" />
              <span className="text-[13px] tracking-wide text-muted-foreground">
                {t("stats.eyebrow", "В цифрах")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08, ease: E }}
              className="font-semibold leading-[1.2] text-foreground mb-5"
              style={{ fontFamily: SERIF, fontSize: "clamp(1.85rem, 2.6vw, 2.5rem)", letterSpacing: "-0.01em" }}
            >
              {t("stats.title1")}{" "}
              <span className="text-red-600 dark:text-red-500">{t("stats.title2")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.14, ease: E }}
              className="text-[15px] leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: t("stats.desc") }}
            />
          </div>

          {/* Правая колонка — доказательство: полоса цифр с тонкими разделителями */}
          <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 divide-slate-200/60 dark:divide-white/[0.06] border-t border-b sm:border-t-0 sm:border-b-0 border-slate-200/60 dark:border-white/[0.06]">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: E, delay: i * 0.08 }}
                className="group py-8 px-5 sm:px-8 first:pl-0"
              >
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className="font-semibold leading-none text-foreground tabular-nums transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-500"
                    style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3.4vw, 2.75rem)" }}
                  >
                    <StatNumber progress={scrollYProgress} target={stat.quantity} />
                  </span>
                  <span className="text-lg text-red-600 dark:text-red-500 font-medium">{stat.suffix}</span>
                </div>

                <div className="flex items-center gap-2">
                  <stat.Icon size={14} className="text-muted-foreground/50 shrink-0" />
                  <span className="relative text-[13px] text-muted-foreground leading-tight">
                    {stat.label}
                    <span className="absolute left-0 -bottom-0.5 h-px w-full bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

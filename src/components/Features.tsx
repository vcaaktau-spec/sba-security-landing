"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, useInView } from "framer-motion"

const E = [0.22, 1, 0.36, 1] as const

// Второй заход. Первый был классический bento-грид: скруглённые карточки,
// цветные иконки-в-кружке (изумрудная/красная), градиентная заливка на
// hover, пилюля-бейдж в шапке — узнаваемый SaaS-шаблон, тот же жанр, что и
// у Hero/PainSection до их редизайна. Здесь вместо грида — «липкий индекс»:
// слева (на десктопе) закреплённый заголовок с степпером из трёх пунктов,
// справа — сами преимущества друг под другом, разделённые тонкой линией.
// Активный пункт степпера синхронизирован с тем, какой блок сейчас в
// центре экрана (useInView с margin, центрирующим зону срабатывания), а
// маркер-индикатор перемещается между пунктами через shared layout
// (layoutId) — это и есть «новая концепция скролла»: не декоративный
// fade-in, а состояние степпера, управляемое прокруткой. Нумерация (01/02)
// сознательно не используется — три достоинства не образуют процесс, а
// цифры здесь были бы ещё одним шаблонным приёмом.
export const Features = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const capabilities = [
    t("features.list.0", "IP Видеонаблюдение"),
    t("features.list.1", "СКУД"),
    t("features.list.2", "Домофония"),
    t("features.list.3", "Умный дом"),
    t("features.list.4", "Охранные системы"),
    t("features.list.5", "Сети"),
    t("features.list.6", "Аналитика ИИ"),
  ]

  const brands = ["Hikvision", "Dahua", "Ezviz", "Uniview"]

  const items = [
    { title: t("features.f1_title"), desc: t("features.f1_desc"), extra: null as string[] | null },
    { title: t("features.f2_title"), desc: t("features.f2_desc"), extra: brands },
    { title: t("features.f3_title"), desc: t("features.f3_desc"), extra: null },
  ]

  return (
    <section
      id="features"
      className="relative py-24 lg:py-36 border-b border-slate-200/60 dark:border-white/[0.06]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10">
        <div className="lg:grid lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-20">

          {/* Левая колонка — липкая на десктопе */}
          <div className="lg:sticky lg:top-32 lg:self-start mb-16 lg:mb-0">
            <motion.div
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: E }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-6 h-px bg-red-600/70 shrink-0" />
              <span className="text-[13px] tracking-wide text-muted-foreground">
                {t("features.eyebrow")}
              </span>
            </motion.div>

            <motion.h2
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: E }}
              className="font-semibold leading-[1.15] text-foreground mb-5"
              style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.85rem, 2.6vw, 2.5rem)", letterSpacing: "-0.01em" }}
            >
              {t("features.title1")}
              <span className="text-red-600 dark:text-red-500">{t("features.title2")}</span>
            </motion.h2>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: E }}
              className="text-[15px] leading-relaxed text-muted-foreground mb-10"
            >
              {t("features.subtitle")}
            </motion.p>

            {/* Степпер — активный пункт следует за прокруткой */}
            <div className="hidden lg:flex flex-col gap-1">
              {items.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    document.getElementById(`feature-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
                  }}
                  className="relative flex items-center gap-3 py-2.5 text-left"
                >
                  <span className="relative w-4 h-px shrink-0">
                    {activeIndex === i && (
                      <motion.span
                        layoutId="feature-active-marker"
                        className="absolute inset-0 bg-red-600"
                        transition={{ duration: 0.4, ease: E }}
                      />
                    )}
                    {activeIndex !== i && <span className="absolute inset-0 bg-slate-300 dark:bg-white/[0.15]" />}
                  </span>
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      activeIndex === i ? "text-foreground font-medium" : "text-muted-foreground/60"
                    }`}
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Правая колонка — преимущества друг под другом */}
          <div className="flex flex-col">
            {items.map((item, i) => (
              <FeatureRow
                key={i}
                index={i}
                title={item.title}
                desc={item.desc}
                extra={item.extra}
                isFirst={i === 0}
                setActiveIndex={setActiveIndex}
              />
            ))}

            {/* Возможности — простой перечень вместо цветных плашек */}
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: E }}
              className="pt-12 border-t border-slate-200/60 dark:border-white/[0.06]"
            >
              <span className="block text-[13px] tracking-wide text-muted-foreground mb-4">
                {t("features.list_label", "Устанавливаем и обслуживаем")}
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5">
                {capabilities.map((cap, i) => (
                  <span key={i} className="text-[15px] text-foreground/80">
                    {cap}
                    {i < capabilities.length - 1 && <span className="ml-5 text-muted-foreground/30">·</span>}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

const FeatureRow = ({
  index,
  title,
  desc,
  extra,
  isFirst,
  setActiveIndex,
}: {
  index: number
  title: string
  desc: string
  extra: string[] | null
  isFirst: boolean
  setActiveIndex: (i: number) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const inCenter = useInView(ref, { margin: "-45% 0px -45% 0px" })

  useEffect(() => {
    if (inCenter) setActiveIndex(index)
  }, [inCenter, index, setActiveIndex])

  return (
    <motion.div
      id={`feature-${index}`}
      ref={ref}
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: E }}
      className={`py-10 lg:py-12 ${isFirst ? "" : "border-t border-slate-200/60 dark:border-white/[0.06]"}`}
    >
      <h3
        className="font-semibold text-foreground mb-3"
        style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(1.4rem, 1.8vw, 1.75rem)" }}
      >
        {title}
      </h3>
      <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">
        {desc}
      </p>

      {extra && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-5">
          {extra.map((brand, i) => (
            <span key={i} className="text-sm text-foreground/70">
              {brand}
              {i < extra.length - 1 && <span className="ml-4 text-muted-foreground/30">·</span>}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

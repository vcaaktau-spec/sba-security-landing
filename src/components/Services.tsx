"use client"

import { useRef, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Shield, Network, Laptop, FileText } from "lucide-react"
import { motion, useInView, useScroll, AnimatePresence } from "framer-motion"

const E = [0.22, 1, 0.36, 1] as const
const SERIF = "'Source Serif 4', serif"

interface Service {
  Icon: React.ElementType
  title: string
  subtitle: string
  description: string
  features: string[]
}

function ServiceBlock({
  service,
  index,
  setActive,
}: {
  service: Service
  index: number
  setActive: (idx: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" })

  useEffect(() => {
    if (inView) setActive(index)
  }, [inView, index, setActive])

  return (
    <div ref={ref} className="py-14 sm:py-20 first:pt-0 last:pb-0">
      {/* Мобильная шапка — на десктопе её роль играет липкая панель слева */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <service.Icon size={15} className="text-red-600/70 dark:text-red-500/70 shrink-0" />
          <span className="text-[12px] tracking-wide text-muted-foreground">{service.subtitle}</span>
        </div>
        <h3
          className="font-semibold text-foreground leading-tight"
          style={{ fontFamily: SERIF, fontSize: "clamp(1.4rem, 1.8vw, 1.75rem)" }}
        >
          {service.title}
        </h3>
      </div>

      <p className="text-[15px] leading-relaxed text-muted-foreground mb-8 max-w-xl">
        {service.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {service.features.map((feat, fi) => (
          <div key={fi} className="group flex items-start gap-2.5">
            <span className="mt-[9px] w-1 h-1 rounded-full bg-red-600/50 dark:bg-red-500/50 shrink-0" />
            <span className="relative text-[14px] text-foreground/80 leading-snug">
              {feat}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-current scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Второй заход. Первый уже был структурно неплохим — липкая деталь-панель
// слева и скроллящийся контент справа, тот же принцип, что мы позже
// повторили в Features. Но исполнение несло весь набор шаблонных
// приёмов: четыре разных цвета-акцента на категорию (красный/синий/
// фиолетовый/жёлтый — ровно то, от чего мы ушли в PainSection), большой
// mono-номер "01" рядом с иконкой в цветном квадрате, аморфное цветное
// пятно-подсветка позади всего блока, и фичи в виде карточек с рамкой и
// галочкой в кружке. Здесь: один акцент (красный) вместо четырёх,
// иконка без рамки и квадрата, номер убран — категория и так узнаётся
// по короткому подзаголовку (kicker), фичи — обычный список с точкой
// вместо карточек. Направляющая линия между колонками стала настоящим
// scroll-прогрессом (заливка растёт вместе со скроллом по всей секции),
// а не декоративным градиентом.
export const Services = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: scrollAreaRef, offset: ["start center", "end center"] })

  const services: Service[] = [
    {
      Icon: Shield,
      title: t("services.s1_title"),
      subtitle: t("services.s1_sub"),
      description: t("services.s1_desc"),
      features: [t("services.s1_f1"), t("services.s1_f2"), t("services.s1_f3"), t("services.s1_f4")],
    },
    {
      Icon: Network,
      title: t("services.s2_title"),
      subtitle: t("services.s2_sub"),
      description: t("services.s2_desc"),
      features: [t("services.s2_f1"), t("services.s2_f2"), t("services.s2_f3"), t("services.s2_f4")],
    },
    {
      Icon: Laptop,
      title: t("services.s3_title"),
      subtitle: t("services.s3_sub"),
      description: t("services.s3_desc"),
      features: [t("services.s3_f1"), t("services.s3_f2"), t("services.s3_f3"), t("services.s3_f4")],
    },
    {
      Icon: FileText,
      title: t("services.s4_title"),
      subtitle: t("services.s4_sub"),
      description: t("services.s4_desc"),
      features: [t("services.s4_f1"), t("services.s4_f2"), t("services.s4_f3"), t("services.s4_f4")],
    },
  ]

  const activeService = services[activeIndex]
  const ActiveIcon = activeService.Icon

  return (
    <section id="services" className="relative py-24 lg:py-36 border-b border-slate-200/60 dark:border-white/[0.06]">
      <div className="mx-auto w-full max-w-[1300px] px-6 sm:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-20">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: E }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-6 h-px bg-red-600/70 shrink-0" />
            <span className="text-[13px] tracking-wide text-muted-foreground">
              {t("services.eyebrow", "Оперативный профиль")}
            </span>
          </motion.div>

          <motion.h2
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: E }}
            className="font-semibold leading-[1.15] text-foreground mb-5"
            style={{ fontFamily: SERIF, fontSize: "clamp(1.85rem, 3.4vw, 2.75rem)", letterSpacing: "-0.01em" }}
          >
            {t("services.title1")}
            <span className="text-red-600 dark:text-red-500">{t("services.title2")}</span>
          </motion.h2>

          <motion.p
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.14, ease: E }}
            className="text-[15px] leading-relaxed text-muted-foreground"
          >
            {t("services.subtitle")}
          </motion.p>
        </div>

        <div className="lg:flex lg:gap-20 relative">

          {/* Липкая панель слева — активная категория, кроссфейд при скролле */}
          <div className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={false}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: E }}
                >
                  <ActiveIcon size={20} className="text-red-600/80 dark:text-red-500/80 mb-5" />
                  <span className="block text-[13px] tracking-wide text-muted-foreground mb-3">
                    {activeService.subtitle}
                  </span>
                  <h3
                    className="font-semibold text-foreground leading-[1.15]"
                    style={{ fontFamily: SERIF, fontSize: "clamp(1.75rem, 2.4vw, 2.25rem)" }}
                  >
                    {activeService.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Правая колонка со scroll-прогрессом на направляющей */}
          <div ref={scrollAreaRef} className="relative flex-1">
            <div className="hidden lg:block absolute -left-10 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/[0.06]">
              <motion.div style={{ scaleY: scrollYProgress }} className="absolute inset-0 bg-red-600 origin-top" />
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-white/[0.06]">
              {services.map((service, i) => (
                <ServiceBlock key={i} service={service} index={i} setActive={setActiveIndex} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

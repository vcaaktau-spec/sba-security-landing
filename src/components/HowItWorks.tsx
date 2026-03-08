"use client"

import { useRef } from "react"
// === ДОБАВИЛИ useScroll и useTransform ===
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings, ArrowRight } from "lucide-react"

export const HowItWorks = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  
  // Оптимизированный триггер видимости
  const isInView = useInView(containerRef, { once: true, margin: "-10%" })

  // === ПАРАЛЛАКС ЛОГИКА ===
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"])

  // Данные с индивидуальными задержками (delay) для эффекта каскадного вылета
  const features = [
    {
      step: "01",
      icon: <PhoneCall size={26} strokeWidth={1.5} />,
      title: t("how.s1_title", "Оставляете заявку"),
      description: t("how.s1_desc", "Свяжитесь с нами по телефону или оставьте заявку на сайте. Мы уточним задачи и предложим оптимальное решение."),
      delay: 0.6
    },
    {
      step: "02",
      icon: <ClipboardList size={26} strokeWidth={1.5} />,
      title: t("how.s2_title", "Проектируем систему"),
      description: t("how.s2_desc", "Подбираем оборудование, рассчитываем точное количество камер и готовим индивидуальный проект."),
      delay: 0.8
    },
    {
      step: "03",
      icon: <Truck size={26} strokeWidth={1.5} />,
      title: t("how.s3_title", "Привозим оборудование"),
      description: t("how.s3_desc", "Мы сами закупаем, проверяем и доставляем камеры, регистраторы и всё необходимое для монтажа."),
      delay: 1.0
    },
    {
      step: "04",
      icon: <Settings size={26} strokeWidth={1.5} />,
      title: t("how.s4_title", "Монтаж и настройка"),
      description: t("how.s4_desc", "Устанавливаем камеры без грязи, прокладываем кабель, настраиваем систему и удалённый доступ на ваш смартфон."),
      delay: 1.2
    },
  ]

  const smoothEase = [0.22, 1, 0.36, 1]

  // Варианты для заголовков (Fade In)
  const fadeVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase as any, delay }
    })
  }

  // GPU-оптимизированный вылет для карточек
  const flyInVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (delay: number) => ({ 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 1, ease: smoothEase as any, delay }
    }),
  }

  return (
    <section
      id="howItWorks"
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden bg-background"
    >
      {/* === ПАРАЛЛАКС ФОН === */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full" />
      </motion.div>

      {/* === ПАРАЛЛАКС КОНТЕНТ === */}
      <motion.div style={{ y: contentY }} className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px]">
        
        {/* === ЗАГОЛОВОК === */}
        <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto flex flex-col items-center justify-center w-full">
          <motion.h2 
            custom={0.1} variants={fadeVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 w-full text-center"
          >
            {t("how.title1", "Как мы ")}
            <span className="text-red-600 drop-shadow-sm">
              {t("how.title2", "работаем")}
            </span>
          </motion.h2>

          <motion.p 
            custom={0.3} variants={fadeVariants} initial="hidden" animate={isInView ? "visible" : "hidden"}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed w-full text-center"
          >
            {t("how.subtitle", "Полный цикл установки видеонаблюдения — от вашей первой заявки до полностью настроенной и работающей системы.")}
          </motion.p>
        </div>

        {/* === СЕТКА КАРТОЧЕК === */}
        <div className="relative">
          {/* Тонкая соединительная линия (прорисовывается после вылета всех карточек) */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: smoothEase as any, delay: 1.4 }} // Ждет, пока появятся все карточки
            className="absolute top-[52px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent hidden lg:block z-0 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.step}
                custom={feature.delay} // Индивидуальный тайминг вылета
                variants={flyInVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: smoothEase as any }}
                className="group relative bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[28px] p-8 flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-shadow duration-500 overflow-hidden"
              >
                {/* Эффект радиального свечения при наведении (Apple Spotlight) */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-red-500/0 to-red-500/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

                {/* Огромная цифра на фоне */}
                <div className="absolute -right-2 -top-4 text-[140px] font-black text-black/[0.02] dark:text-white/[0.02] pointer-events-none select-none group-hover:scale-105 group-hover:text-red-500/[0.04] transition-all duration-700">
                  {feature.step}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Иконка и номер шага */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500">
                      {feature.icon}
                    </div>
                    <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground/60 uppercase">
                      {t("how.step", "Шаг")} {feature.step}
                    </span>
                  </div>

                  {/* Текст */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Мобильная стрелочка */}
                  {index !== features.length - 1 && (
                    <div className="absolute -bottom-4 right-8 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground lg:hidden z-20 shadow-sm opacity-50">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
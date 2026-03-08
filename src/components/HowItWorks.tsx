"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTranslation } from "react-i18next"
import { PhoneCall, ClipboardList, Truck, Settings, ArrowRight } from "lucide-react"

export const HowItWorks = () => {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLElement>(null)
  
  // Оптимизированный триггер видимости
  const isInView = useInView(containerRef, { once: true, margin: "-10%" })

  // Данные перенесены внутрь компонента для работы t()
  const features = [
    {
      step: "01",
      icon: <PhoneCall size={26} strokeWidth={1.5} />,
      title: t("how.s1_title", "Оставляете заявку"),
      description: t("how.s1_desc", "Свяжитесь с нами по телефону или оставьте заявку на сайте. Мы уточним задачи и предложим оптимальное решение."),
    },
    {
      step: "02",
      icon: <ClipboardList size={26} strokeWidth={1.5} />,
      title: t("how.s2_title", "Проектируем систему"),
      description: t("how.s2_desc", "Подбираем оборудование, рассчитываем точное количество камер и готовим индивидуальный проект."),
    },
    {
      step: "03",
      icon: <Truck size={26} strokeWidth={1.5} />,
      title: t("how.s3_title", "Привозим оборудование"),
      description: t("how.s3_desc", "Мы сами закупаем, проверяем и доставляем камеры, регистраторы и всё необходимое для монтажа."),
    },
    {
      step: "04",
      icon: <Settings size={26} strokeWidth={1.5} />,
      title: t("how.s4_title", "Монтаж и настройка"),
      description: t("how.s4_desc", "Устанавливаем камеры без грязи, прокладываем кабель, настраиваем систему и удалённый доступ на ваш смартфон."),
    },
  ]

  // Премиальная кривая Безье для всех движений
  const smoothEase = [0.22, 1, 0.36, 1]

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 1, ease: smoothEase as any }
    },
  }

  return (
    <section
      id="howItWorks"
      ref={containerRef}
      className="relative min-h-screen snap-start flex flex-col items-center justify-center py-20 overflow-hidden bg-background"
    >
      {/* === ФОН И СВЕЧЕНИЕ (GPU Оптимизировано) === */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[1400px]">
        
        {/* === ЗАГОЛОВОК === */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: smoothEase as any }}
          className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            {t("how.title1", "Как мы ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              {t("how.title2", "работаем")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("how.subtitle", "Полный цикл установки видеонаблюдения — от вашей первой заявки до полностью настроенной и работающей системы.")}
          </p>
        </motion.div>

        {/* === СЕТКА КАРТОЧЕК === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="relative"
        >
          {/* Тонкая соединительная линия для десктопа (показывает процесс) */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: smoothEase as any, delay: 0.5 }}
            className="absolute top-[52px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent hidden lg:block z-0 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.step}
                variants={cardVariants}
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
        </motion.div>
      </div>
    </section>
  )
}
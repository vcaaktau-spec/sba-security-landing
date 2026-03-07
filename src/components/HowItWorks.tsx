"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { PhoneCall, ClipboardList, Truck, Settings, ArrowRight } from "lucide-react"

interface FeatureProps {
  icon: JSX.Element
  title: string
  description: string
  step: string
}

const features: FeatureProps[] = [
  {
    step: "01",
    icon: <PhoneCall size={28} strokeWidth={1.5} />,
    title: "Оставляете заявку",
    description: "Свяжитесь с нами по телефону или оставьте заявку на сайте. Мы уточним задачи и предложим оптимальное решение.",
  },
  {
    step: "02",
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    title: "Проектируем систему",
    description: "Подбираем оборудование, рассчитываем точное количество камер и готовим индивидуальный проект.",
  },
  {
    step: "03",
    icon: <Truck size={28} strokeWidth={1.5} />,
    title: "Привозим оборудование",
    description: "Мы сами закупаем, проверяем и доставляем камеры, регистраторы и всё необходимое для монтажа.",
  },
  {
    step: "04",
    icon: <Settings size={28} strokeWidth={1.5} />,
    title: "Монтаж и настройка",
    description: "Устанавливаем камеры без грязи, прокладываем кабель, настраиваем систему и удалённый доступ на ваш смартфон.",
  },
]

export const HowItWorks = () => {
  const containerRef = useRef<HTMLElement>(null)

  // Легкий параллакс для заголовка
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [60, -60])

  // Настройки плавной пружинной анимации для карточек
  const springTransition = { type: "spring", stiffness: 100, damping: 20 }

  // Варианты для контейнера (управляет очередностью)
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25, // Задержка между появлением каждой карточки
        delayChildren: 0.1,
      },
    },
  }

  // Варианты для самих карточек (вылетают снизу с увеличением)
  const cardVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.8, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: "blur(0px)",
      transition: springTransition as any
    },
  }

  // Вариант для объединяющей рамки (появляется в самом конце)
  const masterGlowVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] as any} 
    },
  }

  return (
    <section
      id="howItWorks"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden bg-background"
    >
      {/* Декоративный фон */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-red-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        
        {/* ЗАГОЛОВОК С ПАРАЛЛАКСОМ */}
        <motion.div style={{ y: titleY }} className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Как мы{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              работаем
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Полный цикл установки видеонаблюдения — от вашей первой заявки до полностью настроенной и работающей системы.
          </p>
        </motion.div>

        {/* СЕТКА С КАРТОЧКАМИ И АНИМАЦИЕЙ СБОРКИ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* ОБЪЕДИНЯЮЩИЙ БЛОК (Свечение, которое появляется последним) */}
          <motion.div 
            variants={masterGlowVariants} 
            className="absolute -inset-4 sm:-inset-8 bg-white/5 dark:bg-white-[0.02] border border-black/5 dark:border-white/10 shadow-[0_0_60px_rgba(239,68,68,0.05)] rounded-[40px] pointer-events-none z-0 hidden lg:block" 
          />
          
          {/* Соединительная лазерная линия (позади карточек) */}
          <motion.div 
            variants={masterGlowVariants}
            className="absolute top-[88px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent hidden lg:block z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[28px] p-6 sm:p-8 flex flex-col h-full shadow-lg hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 overflow-hidden"
              >
                {/* Огромная фоновая цифра */}
                <div className="absolute -right-4 -top-6 text-[120px] font-black text-black/[0.03] dark:text-white/[0.02] pointer-events-none select-none group-hover:scale-110 group-hover:text-red-500/[0.05] transition-transform duration-700">
                  {feature.step}
                </div>

                {/* Блик при наведении */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 dark:from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Иконка и номер шага */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="text-sm font-bold tracking-widest text-muted-foreground/50 uppercase">
                      Шаг {feature.step}
                    </span>
                  </div>

                  {/* Текст */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Маленькая стрелочка для мобильных/планшетов (показывает флоу) */}
                  {index !== features.length - 1 && (
                    <div className="absolute -bottom-4 right-8 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground lg:hidden z-20 shadow-sm">
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
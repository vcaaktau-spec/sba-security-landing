"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ShieldCheck, Cctv, Route, CheckCircle2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface FeatureProps {
  title: string
  description: string
  icon: any
  delay: number
}

const features: FeatureProps[] = [
  {
    title: "Бескомпромиссная гарантия",
    description: "Предоставляем официальную гарантию на оборудование и монтаж. Мы уверены в каждом соединении и несем ответственность за стабильность системы.",
    icon: ShieldCheck,
    delay: 0.2,
  },
  {
    title: "Мировые бренды",
    description: "Никаких безымянных аналогов. Работаем исключительно с сертифицированным оборудованием от лидеров рынка: Hikvision, Dahua, Uniview.",
    icon: Cctv,
    delay: 0.4,
  },
  {
    title: "Эстетичный монтаж",
    description: "Устанавливаем камеры без грязи и висящих проводов. Скрытая прокладка кабеля, идеальные стыки и бережное отношение к интерьеру.",
    icon: Route,
    delay: 0.6,
  },
]

// Список для бегущей строки
const featureList: string[] = [
  "IP видеонаблюдение",
  "Удалённый доступ",
  "Монтаж под ключ",
  "Настройка системы",
  "Обслуживание CCTV",
  "Проектирование систем",
  "Качественное оборудование",
  "Поддержка 24/7",
  "Опытные специалисты",
]

export const Features = () => {
  const containerRef = useRef<HTMLElement>(null)
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Параллакс для бегущей строки
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const marqueeXReverse = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: smoothEase, delay }
    })
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: smoothEase, delay }
    })
  }

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center py-24 sm:py-32 overflow-hidden bg-background"
    >
      {/* ФОНОВЫЕ ЭФФЕКТЫ */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Радиальные градиенты */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full" />
        
        {/* Паттерн сетки (еле заметный) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* БЕГУЩИЕ СТРОКИ (MARQUEE) НА ЗАДНЕМ ФОНЕ */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-12 sm:gap-24 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden font-black text-6xl sm:text-8xl lg:text-9xl whitespace-nowrap">
        <motion.div style={{ x: marqueeX }} className="flex gap-8">
          {[...featureList, ...featureList].map((item, i) => (
            <span key={i}>{item} • </span>
          ))}
        </motion.div>
        <motion.div style={{ x: marqueeXReverse }} className="flex gap-8">
          {[...featureList, ...featureList].reverse().map((item, i) => (
            <span key={i}>{item} • </span>
          ))}
        </motion.div>
      </div>

      <div ref={ref} className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        
        {/* ЗАГОЛОВОК */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">

          <motion.h2 
            custom={0.2} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Почему выбирают{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              именно нас
            </span>
          </motion.h2>
        </div>

        {/* СЕТКА ПРЕИМУЩЕСТВ (3 КАРТОЧКИ) */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={feature.delay}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -10 }}
              className="group relative bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[32px] p-8 sm:p-10 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* Эффект свечения при наведении */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Декоративный круговой градиент в углу */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-[40px] group-hover:bg-red-500/20 transition-colors duration-700" />

              <div className="relative z-10">
                {/* Иконка с анимацией */}
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-red-500 mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out">
                  <feature.icon size={32} strokeWidth={1.5} className="relative z-10" />
                  {/* Пульсирующий задник у иконки (Idle анимация) */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-red-500/20 rounded-2xl blur-md"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Абстрактная линия снизу карточки */}
              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[0.22,1,0.36,1]" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
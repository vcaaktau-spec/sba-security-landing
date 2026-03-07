"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Network, Laptop, Check } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface ServiceProps {
  id: string
  title: string
  subtitle: string
  description: string
  features: string[]
  icon: any
  color: string
}

const services: ServiceProps[] = [
  {
    id: "01",
    title: "Комплексная безопасность",
    subtitle: "CCTV, ОПС и СКУД",
    description: "Проектирование и внедрение систем безопасности любого масштаба. От умного видеонаблюдения для частного дома до сложных систем контроля доступа и пожарной сигнализации для предприятий.",
    features: ["IP-видеонаблюдение и аналитика", "Охранно-пожарная сигнализация", "Биометрические системы доступа", "Интеграция систем безопасности"],
    icon: Shield, // Вернули твою иконку
    color: "from-red-600/20 to-red-900/5",
  },
  {
    id: "02",
    title: "Инфраструктура и Сети",
    subtitle: "СКС, Wi-Fi и Телеком",
    description: "Создаем надежный цифровой фундамент. Проектирование и монтаж локально-вычислительных сетей, настройка бесшовного Wi-Fi роуминга и сборка серверных шкафов с гарантией отказоустойчивости.",
    features: ["Монтаж и тестирование СКС", "Оптика и маршрутизация", "Бесшовный корпоративный Wi-Fi", "Обустройство серверных"],
    icon: Network, // Вернули твою иконку
    color: "from-neutral-500/10 to-neutral-900/5",
  },
  {
    id: "03",
    title: "IT-Аутсорсинг & Digital",
    subtitle: "Поддержка ПК и Web-разработка",
    description: "Берем на себя всю техническую рутину. Обеспечиваем бесперебойную работу вашего парка техники, настраиваем ПО, а также разрабатываем современные, быстрые веб-сайты для вашего бренда.",
    features: ["Абонентское IT-обслуживание", "Ремонт и настройка ПК/Серверов", "Разработка сайтов под ключ", "Техническая поддержка 24/7"],
    icon: Laptop, // Вернули твою иконку
    color: "from-red-500/10 to-black/5",
  },
]

export const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Ультра-плавные настройки пружины для эффекта расширения
  const springConfig = { type: "spring", stiffness: 100, damping: 20, mass: 1 }

  return (
    <section 
      id="services" 
      className="relative min-h-screen flex flex-col pt-24 pb-12 overflow-hidden bg-background"
    >
      {/* ЗАГОЛОВОК СЕКЦИИ */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 mb-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Больше, чем{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
                видеонаблюдение
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Мы предоставляем полный спектр услуг: от прокладки кабеля до разработки корпоративных IT-решений. Ваш бизнес под нашей защитой.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ИНТЕРАКТИВНЫЙ АККОРДЕОН */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 flex-grow flex flex-col pb-12">
        <div className="flex flex-col lg:flex-row w-full h-[800px] lg:h-[600px] gap-4">
          
          {services.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const flexValue = hoveredIndex === null ? 1 : isHovered ? 3 : 0.8;
            
            // Безопасный рендер иконки
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(isHovered ? null : index)} // Для мобилок
                animate={{ flex: flexValue }}
                transition={springConfig}
                className={`relative overflow-hidden rounded-[32px] cursor-pointer border border-black/5 dark:border-white/10 flex flex-col bg-neutral-100/50 dark:bg-[#0a0a0a]/50 backdrop-blur-md group`}
              >
                {/* Фоновый градиент карточки */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-50 dark:opacity-20 transition-opacity duration-700`} />
                
                {/* Эффект сканера при наведении */}
                <div className={`absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-1000 ease-[0.22,1,0.36,1] pointer-events-none`} />

                {/* Огромный номер на заднем фоне */}
                <motion.div 
                  animate={{ 
                    scale: isHovered ? 1.1 : 1,
                    opacity: isHovered ? 0.05 : 0.02
                  }}
                  transition={{ duration: 0.8 }}
                  className="absolute -right-10 -bottom-10 text-[200px] font-black text-foreground pointer-events-none select-none"
                >
                  {service.id}
                </motion.div>

                {/* КОНТЕНТ ВНУТРИ БЛОКА */}
                <div className="relative z-10 flex flex-col h-full p-6 sm:p-10">
                  
                  {/* Шапка: Иконка и Заголовок */}
                  <div className="flex flex-col gap-6">
                    <motion.div 
                      animate={{ 
                        backgroundColor: isHovered ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.05)",
                        scale: isHovered ? 1.1 : 1
                      }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-500 border border-red-500/10 origin-left"
                    >
                      <Icon size={32} strokeWidth={1.5} />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold whitespace-nowrap mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm font-semibold tracking-wider text-red-600/80 dark:text-red-400/80 uppercase whitespace-nowrap">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Скрытый контент (Описание и Список), появляется при Hover */}
                  <div className="mt-8 flex-grow relative">
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="absolute inset-0 flex flex-col justify-start"
                        >
                          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg whitespace-normal">
                            {service.description}
                          </p>

                          <div className="flex flex-col gap-4">
                            {service.features.map((feature, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
                                className="flex items-center gap-3"
                              >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                  <Check size={14} strokeWidth={3} />
                                </div>
                                <span className="font-medium text-foreground whitespace-nowrap">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            )
          })}

        </div>
      </div>
    </section>
  )
}
"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue, useSpring } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface TestimonialProps {
  id: string
  image: string
  name: string
  userName: string
  comment: string
  rating: number
}

const testimonials: TestimonialProps[] = [
  {
    id: "1",
    image: "https://i.pravatar.cc/150?img=11",
    name: "Алексей",
    userName: "Владелец магазина",
    comment: "Установили систему видеонаблюдения в магазине. Всё сделали аккуратно, настроили просмотр с телефона и объяснили как пользоваться.",
    rating: 5,
  },
  {
    id: "2",
    image: "https://i.pravatar.cc/150?img=12",
    name: "Дмитрий",
    userName: "Частный дом",
    comment: "Поставили камеры по периметру дома. Качество отличное, запись работает стабильно. Теперь можно смотреть камеры прямо с телефона.",
    rating: 5,
  },
  {
    id: "3",
    image: "https://i.pravatar.cc/150?img=13",
    name: "Сергей",
    userName: "Складской комплекс",
    comment: "Нужно было видеонаблюдение для склада. Помогли подобрать оборудование и всё настроили. Работает без проблем.",
    rating: 5,
  },
  {
    id: "4",
    image: "https://i.pravatar.cc/150?img=14",
    name: "Ирина",
    userName: "Офис",
    comment: "Установили камеры в офисе и на парковке. Монтаж аккуратный, кабель проложен правильно, всё работает стабильно.",
    rating: 5,
  },
  {
    id: "5",
    image: "https://i.pravatar.cc/150?img=15",
    name: "Руслан",
    userName: "Кафе",
    comment: "Сделали систему видеонаблюдения в кафе. Всё подключили, настроили запись и удалённый доступ. Работой доволен.",
    rating: 5,
  },
  {
    id: "6",
    image: "https://i.pravatar.cc/150?img=16",
    name: "Арман",
    userName: "Автосервис",
    comment: "Установили камеры в автосервисе. Теперь можно контролировать рабочую зону и парковку. Всё работает отлично.",
    rating: 5,
  },
]

// Дублируем массив, чтобы лента была достаточно длинной для бесшовного скролла
const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials]

const TestimonialCard = ({ data, isCarouselHovered }: { data: TestimonialProps, isCarouselHovered: boolean }) => (
  <motion.div 
    // Если навели на любую часть карусели, карточка тускнеет. При ховере на саму карточку - она снова яркая.
    animate={{ opacity: isCarouselHovered ? 0.4 : 1 }}
    whileHover={{ opacity: 1, y: -8 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="relative group w-[320px] sm:w-[420px] h-[320px] flex-shrink-0 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 overflow-hidden transition-colors duration-500 hover:border-red-500/30 hover:bg-white/80 dark:hover:bg-[#0a0a0a]/80"
  >
    
    {/* ВНУТРЕННЯЯ АНИМАЦИЯ: Водяной знак */}
    <motion.div 
      variants={{
        idle: { scale: 1, rotate: 12, opacity: 0.02 },
        hover: { scale: 1.15, rotate: 0, opacity: 0.05, color: "#ef4444" }
      }}
      initial="idle"
      whileHover="hover"
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute -top-4 -right-4 pointer-events-none"
    >
      <Quote size={120} className="text-black dark:text-white" />
    </motion.div>

    {/* ВНУТРЕННЯЯ АНИМАЦИЯ: Глянцевый блик */}
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    <div className="relative z-10 flex flex-col h-full">
      {/* Звезды */}
      <div className="flex gap-1.5 mb-4">
        {[...Array(data.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5, scale: 0.9 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.2, delay: i * 0.05 }}
          >
            <Star size={16} className="fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </div>

      {/* Текст отзыва */}
      <p className="text-base sm:text-lg text-foreground/80 leading-relaxed flex-grow">
        "{data.comment}"
      </p>

      {/* Пользователь */}
      <div className="flex items-center gap-4 pt-6 border-t border-black/5 dark:border-white/10 mt-auto">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-transparent group-hover:border-red-500/50 transition-colors duration-500">
          <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-foreground group-hover:text-red-500 transition-colors duration-300">
            {data.name}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            {data.userName}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
)

export const Testimonials = () => {
  const containerRef = useRef<HTMLElement>(null)
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const scrollerRef = useRef<HTMLDivElement>(null)

  // --- ЛОГИКА ПЛАВНОЙ КИНЕМАТИКИ СКРОЛЛА ---
  const baseX = useMotionValue(0)
  
  // Базовая скорость (пикселей за кадр). Отрицательная, чтобы ехать влево.
  const baseVelocity = -1.5 
  
  // Создаем "пружину" для скорости. Когда мы меняем targetVelocity, реальная скорость плавно подтягивается к ней.
  const targetVelocity = useMotionValue(baseVelocity)
  const smoothVelocity = useSpring(targetVelocity, { damping: 50, stiffness: 200 })

  useAnimationFrame((_, delta) => {
  if (!scrollerRef.current) return

  // Вычисляем ширину одного набора (так как ты дублировал массив 4 раза, делим на 4)
  const totalWidth = scrollerRef.current.offsetWidth
  const oneBlockWidth = totalWidth / 4 

  let moveBy = smoothVelocity.get() * (delta / 16)
  let newX = baseX.get() + moveBy

  // Магическая формула: если ушли за пределы одного блока, возвращаем в начало
  if (newX <= -oneBlockWidth) {
    newX = newX + oneBlockWidth
  } else if (newX > 0) {
    newX = newX - oneBlockWidth
  }

  baseX.set(newX)
})

  // Перехватчики мыши управляют целевой скоростью
  const handleMouseEnter = () => {
    setIsCarouselHovered(true)
    targetVelocity.set(0) // Плавно останавливаемся
  }
  const handleMouseLeave = () => {
    setIsCarouselHovered(false)
    targetVelocity.set(baseVelocity) // Плавно разгоняемся обратно
  }
  // ------------------------------------------

  // Параллакс для заголовка
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const smoothEase = [0.22, 1, 0.36, 1]

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1, ease: smoothEase as any } 
    }
  }

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative min-h-screen snap-start py-24 bg-background overflow-hidden flex flex-col justify-center"
    >
      {/* ПЛАВНЫЕ АНИМАЦИИ ФОНА (Idle) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Орбита 1 */}
        <motion.div 
          animate={{ x: [0, 100, 0, -100, 0], y: [0, -50, -100, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full" 
        />
        {/* Орбита 2 */}
        <motion.div 
          animate={{ x: [0, -150, 0, 150, 0], y: [0, 100, 50, -50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-red-900/5 blur-[150px] rounded-full" 
        />
      </div>

      <div className="relative z-10 w-full mb-16 lg:mb-20 px-4 sm:px-6">
        {/* ЗАГОЛОВОК */}
        <motion.div 
          ref={ref}
          style={{ y: titleY }} 
          initial="hidden" 
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Доверие, подкрепленное{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">
              результатом
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Мы гордимся нашей работой. Почитайте, что говорят люди, которые уже доверили нам безопасность своего бизнеса и дома.
          </p>
        </motion.div>
      </div>

      {/* БЕСКОНЕЧНАЯ ЛЕНТА ОТЗЫВОВ */}
      <div 
        className="relative w-full z-10 flex flex-col"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {/* Градиентные маски по краям для растворения */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-48 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-48 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

        {/* Анимированный контейнер ленты */}
        <motion.div
          ref={scrollerRef}
          style={{ x: baseX }} // Подключаем наш кинематический x
          className="flex gap-6 sm:gap-8 w-max px-4 sm:px-8 py-8" // Добавил py-8 чтобы при hover y:-8 карточки не обрезались
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={`${testimonial.id}-${index}`} 
              data={testimonial} 
              isCarouselHovered={isCarouselHovered} // Передаем состояние фокуса
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
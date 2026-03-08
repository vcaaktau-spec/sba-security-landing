"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useAnimationFrame, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { Star, Quote, X, Upload, CheckCircle2, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface TestimonialProps {
  id: string
  image?: string // <--- Добавили знак вопроса (фото теперь необязательно)
  name: string
  userName: string
  comment: string
  rating: number
}

const testimonials: TestimonialProps[] = [
  {
    id: "1",
    image: "/testimonials/viola.webp",
    name: "Виолетта",
    userName: "Квартира",
    comment: "Спасибо большое ребятам, все установили чисто, аккуратно. Обьяснили и показали как пользоваться! Спасибо.",
    rating: 5,
  },
  {
    id: "2",
    image: "/testimonials/artem.webp",// Поле image просто удаляем или комментируем
    name: "Артем",
    userName: "Коммерческое помещение",
    comment: "Профессионалы своего дела — работают быстро, качественно и с полной отдачей. Рекомендую.",
    rating: 5,
  },
]

const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials]

const TestimonialCard = ({ data, isCarouselHovered }: { data: TestimonialProps, isCarouselHovered: boolean }) => (
  <motion.div 
    animate={{ opacity: isCarouselHovered ? 0.4 : 1 }}
    whileHover={{ opacity: 1, y: -5 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="relative group w-[320px] sm:w-[420px] h-[320px] flex-shrink-0 bg-white/60 dark:bg-[#0a0a0a]/60 sm:backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 overflow-hidden transition-colors duration-500 hover:border-red-500/30 hover:bg-white/80 dark:hover:bg-[#0a0a0a]/80"
  >
    <motion.div 
      variants={{ idle: { scale: 1, rotate: 12, opacity: 0.02 }, hover: { scale: 1.15, rotate: 0, opacity: 0.05, color: "#ef4444" } }}
      initial="idle" whileHover="hover" transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute -top-4 -right-4 pointer-events-none"
    >
      <Quote size={120} className="text-black dark:text-white" />
    </motion.div>
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    <div className="relative z-10 flex flex-col h-full">
      <div className="flex gap-1.5 mb-4">
        {[...Array(data.rating)].map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0.5, scale: 0.9 }} whileHover={{ opacity: 1, scale: 1.1 }} transition={{ duration: 0.2, delay: i * 0.05 }}>
            <Star size={16} className="fill-red-500 text-red-500" />
          </motion.div>
        ))}
      </div>
      <p className="text-base sm:text-lg text-foreground/80 leading-relaxed flex-grow">"{data.comment}"</p>
      
      {/* Пользователь */}
      <div className="flex items-center gap-4 pt-6 border-t border-black/5 dark:border-white/10 mt-auto">
        
        {/* АВАТАР ИЛИ ЗАГЛУШКА */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border border-transparent group-hover:border-red-500/50 transition-colors duration-500 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center shadow-inner">
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.name} 
                loading="lazy"      // <--- ДОБАВИТЬ
                decoding="async"    // <--- ДОБАВИТЬ
                className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-white font-bold text-lg drop-shadow-md">
              {data.name.charAt(0).toUpperCase()}
            </span>
          )}
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
  const scrollerRef = useRef<HTMLDivElement>(null)
  
  const [isCarouselHovered, setIsCarouselHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Состояние формы
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState<File | null>(null)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const baseX = useMotionValue(0)
  const baseVelocity = -1.5 
  const targetVelocity = useMotionValue(baseVelocity)
  const smoothVelocity = useSpring(targetVelocity, { damping: 50, stiffness: 200 })

  useAnimationFrame((_, delta) => {
    if (!scrollerRef.current || isSidebarOpen) return

    const totalWidth = scrollerRef.current.offsetWidth
    const oneBlockWidth = totalWidth / 4 

    let moveBy = smoothVelocity.get() * (delta / 16)
    let newX = baseX.get() + moveBy

    if (newX <= -oneBlockWidth) newX += oneBlockWidth
    else if (newX > 0) newX -= oneBlockWidth

    baseX.set(newX)
  })

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Собираем данные в FormData (нужно для отправки файлов)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("company", company)
    formData.append("rating", rating.toString())
    formData.append("text", text)
    if (photo) {
      formData.append("photo", photo)
    }

    try {
      // Отправляем на наш будущий API-роут
      const res = await fetch("/api/telegram", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Ошибка отправки")

      setIsSuccess(true)
      // Плавно закрываем через 3 секунды
      setTimeout(() => {
        setIsSidebarOpen(false)
        setTimeout(() => {
          setIsSuccess(false)
          setName(""); setCompany(""); setText(""); setRating(5); setPhoto(null);
        }, 500)
      }, 3000)
    } catch (error) {
      alert("Произошла ошибка при отправке. Попробуйте позже.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="testimonials" ref={containerRef} className="relative min-h-screen snap-start py-24 bg-background overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 100, 0, -100, 0], y: [0, -50, -100, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full" />
        <motion.div animate={{ x: [0, -150, 0, 150, 0], y: [0, 100, 50, -50, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] right-[5%] w-[800px] h-[800px] bg-red-900/5 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full mb-12 lg:mb-16 px-4 sm:px-6">
        <motion.div ref={ref} style={{ y: titleY }} initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Доверие, подкрепленное <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800 drop-shadow-sm">результатом</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">Мы гордимся нашей работой. Почитайте, что говорят люди, которые уже доверили нам безопасность своего бизнеса и дома.</p>
          <button onClick={() => setIsSidebarOpen(true)} className="px-8 py-3.5 rounded-full bg-foreground text-background font-semibold hover:scale-105 transition-transform duration-300 shadow-xl shadow-red-500/10">
            Оставить свой отзыв
          </button>
        </motion.div>
      </div>

      <div className="relative w-full z-10 flex flex-col" onMouseEnter={() => { setIsCarouselHovered(true); targetVelocity.set(0) }} onMouseLeave={() => { setIsCarouselHovered(false); targetVelocity.set(baseVelocity) }} onTouchStart={() => { setIsCarouselHovered(true); targetVelocity.set(0) }} onTouchEnd={() => { setIsCarouselHovered(false); targetVelocity.set(baseVelocity) }}>
        <div className="absolute inset-y-0 left-0 w-16 sm:w-48 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-48 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
        <motion.div ref={scrollerRef} style={{ x: baseX, willChange: "transform"}} className="flex gap-6 sm:gap-8 w-max px-4 sm:px-8 py-8">
          {duplicatedTestimonials.map((testimonial, index) => <TestimonialCard key={`${testimonial.id}-${index}`} data={testimonial} isCarouselHovered={isCarouselHovered} />)}
        </motion.div>
      </div>

      {/* БОКОВАЯ ПАНЕЛЬ (SIDEBAR) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Затемнение фона */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Сама панель */}
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-[101] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold">Оставить отзыв</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-center">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                    <CheckCircle2 size={80} className="text-red-500 mb-6" />
                    <h4 className="text-2xl font-bold mb-3">Спасибо за доверие!</h4>
                    <p className="text-muted-foreground">Ваш отзыв очень важен для нас. Он отправлен руководству и скоро появится на сайте.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors" placeholder="Иван Иванов" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Объект / Компания</label>
                      <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors" placeholder="Магазин 'У Дома'" />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Оценка работы</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? "fill-red-500 text-red-500" : "text-muted-foreground/30 hover:text-red-400"}`} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Ваш отзыв</label>
                      <textarea required value={text} onChange={e => setText(e.target.value)} rows={5} className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 outline-none focus:border-red-500 transition-colors resize-none" placeholder="Как прошла установка? Довольны ли вы качеством?" />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Фото (для аватарки)</label>
                      <label className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-6 cursor-pointer transition-all ${photo ? "border-red-500 bg-red-500/5" : "border-border hover:border-red-500"}`}>
                        <Upload size={20} className={photo ? "text-red-500" : "text-muted-foreground"} />
                        <span className={`text-sm font-medium ${photo ? "text-red-500" : "text-muted-foreground"}`}>
                          {photo ? photo.name : "Загрузить фото"}
                        </span>
                        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                      {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> Отправка...</> : "Отправить отзыв"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
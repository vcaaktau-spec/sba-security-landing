"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Star, Quote, X, Upload, CheckCircle2, Loader2, MessageSquarePlus } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface TestimonialProps {
  id: string
  image?: string
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
    userName: "Владелец квартиры",
    comment: "Спасибо большое ребятам, все установили чисто, аккуратно. Обьяснили и показали как пользоваться приложением на телефоне! Теперь я спокойна за свой дом. Огромное спасибо за профессионализм.",
    rating: 5,
  },
  {
    id: "2",
    image: "/testimonials/artem.webp",
    name: "Артем",
    userName: "Коммерческое помещение",
    comment: "Профессионалы своего дела — работают быстро, качественно и с полной отдачей. Однозначно рекомендую. Система работает без сбоев уже полгода.",
    rating: 5,
  },
  {
    id: "3",
    name: "Талгат",
    userName: "Частное помещение",
    comment: "Отличный сервис и профессиональный подход. Камеры работают стабильно, изображение качественное. Установку выполнили быстро и аккуратно. Спасибо!",
    rating: 5,
  },
  {
    id: "4",
    name: "Рамазан",
    userName: "Шанхай, Флаур",
    comment: "Не первый год сотрудничаю с этой компанией - всегда на связи и оперативно реагируют. Работу выполняют на 100%, всегда держат слово. Лучше работать с надежной компанией, чем выбирать где дешевле!",
    rating: 5,
  },
  {
    id: "5",
    name: "@remmaster_aktau",
    userName: "Внутренняя отделка помещений",
    comment: "Спасибо за качественную работу и профессиональный подход. Все пожелания были учтены, работа ввыполнена аккуратно и в срок. Видно, что ребята действительно знают свое дело. Рекомендую!",
    rating: 5,
  },
  {
    id: "6",
    name: "Марат",
    userName: "Владедлец магазина",
    comment: "Спасибо! Установили все быстро и качественно. Оборудование работае отлично, полностью доволен результатом!",
    rating: 5,
  },
    {
    id: "7",
    name: "Антон",
    userName: "Kaz Tehno Service",
    comment: "Очень квалифицированные специалисты. Не один раз обращались за помощью в решении разных вопросов - всегда все выполнялось оперативно и качественно. Спасибо вам!",
    rating: 5,
  },
    {
    id: "8",
    name: "Виталий",
    userName: "Частный дом",
    comment: "Если вы ищите качество, надежность и аккуратность, то лучше специалистов не найти. Всегда на связи с клиентом 24/7. Огромное спасибо Владимиру и его компании за профессиональную работу!",
    rating: 5,
  }
]

export const Testimonials = () => {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>(testimonials[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Определяем мобилку для отключения параллакса
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // === ПАРАЛЛАКС И INVIEW ЛОГИКА ===
  const containerRef = useRef<HTMLElement>(null)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.15, rootMargin: "-10% 0px" })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Отключаем параллакс на мобилках
  const backgroundY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["-10%", "10%"])
  const contentY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["5%", "-5%"])

  // Автоматическое переключение
  useEffect(() => {
    if (isSidebarOpen || !inView) return;
    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = testimonials.findIndex(t => t.id === currentId);
        const nextIndex = (currentIndex + 1) % testimonials.length;
        return testimonials[nextIndex].id;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [activeId, isSidebarOpen, inView]);

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const smoothEase = [0.22, 1, 0.36, 1]
  const activeTestimonial = testimonials.find(t => t.id === activeId) || testimonials[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name); formData.append("company", company)
    formData.append("rating", rating.toString()); formData.append("text", text)
    if (photo) formData.append("photo", photo)

    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Ошибка отправки")
      setIsSuccess(true)
      setTimeout(() => {
        setIsSidebarOpen(false)
        setTimeout(() => { setIsSuccess(false); setName(""); setCompany(""); setText(""); setRating(5); setPhoto(null); }, 500)
      }, 3000)
    } catch (error) {
      alert("Произошла ошибка при отправке. Попробуйте позже.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // === ОПТИМИЗИРОВАННЫЕ АНИМАЦИИ (БЕЗ BLUR) ===
  const titleVariants = {
    hidden: { opacity: 0, x: -40, y: -20, scale: 0.95 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 1, ease: smoothEase as any, delay: 0.1 } }
  }
  const btnVariants = {
    hidden: { opacity: 0, x: 40, y: -20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1, ease: smoothEase as any, delay: 0.2 } }
  }
  const listVariants = {
    hidden: { opacity: 0, x: -40, y: 40 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1, ease: smoothEase as any, delay: 0.3 } }
  }
  const cardVariants = {
    hidden: { opacity: 0, x: 40, y: 40, scale: 0.95 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 1, ease: smoothEase as any, delay: 0.4 } }
  }

  return (
    <section 
      id="testimonials" 
      ref={containerRef}
      className="magnet-section relative min-h-screen flex flex-col justify-center py-20 lg:py-24 overflow-hidden bg-slate-50 dark:bg-background"
    >
      {/* === ПАРАЛЛАКС ФОН === */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0 pointer-events-none">
        {/* Скрываем тяжелые пятна на мобилках */}
        <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full" />
      </motion.div>

      {/* === ПАРАЛЛАКС КОНТЕНТ === */}
      <motion.div 
        ref={inViewRef} 
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-[1300px] px-4 sm:px-6 flex flex-col h-full lg:min-h-[600px]"
      >
        
        {/* === ВЕРХНЯЯ ЧАСТЬ: Заголовок и Кнопка === */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12 overflow-hidden px-2">
          
          <motion.div 
            variants={titleVariants} initial="hidden" animate={inView ? "visible" : "hidden"} 
            className="max-w-2xl origin-top-left"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground leading-[1.1]">
              {t("testimonials.title1")}
              <span className="text-red-600 block mt-1">
                {t("testimonials.title2")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6 font-medium">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>

          <motion.div 
            variants={btnVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="origin-right"
          >
            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center justify-center lg:justify-start gap-3 w-full lg:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground font-semibold hover:shadow-[0_15px_30px_-10px_rgba(220,38,38,0.2)] hover:border-red-500/30 transition-all duration-300 group">
              <MessageSquarePlus size={18} className="text-red-600 group-hover:scale-110 transition-transform duration-300" />
              {t("testimonials.btn")}
            </button>
          </motion.div>
        </div>

        {/* === НИЖНЯЯ ЧАСТЬ: Список и Превью === */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-grow lg:h-[450px]">
          
          {/* ЛЕВЫЙ БЛОК */}
          <motion.div 
            variants={listVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="w-full lg:w-[35%] flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 pr-0 lg:pr-4 snap-x lg:snap-none
            [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20
            max-lg:[-ms-overflow-style:none] max-lg:[scrollbar-width:none]"
          >
            {testimonials.map((data) => {
              const isActive = activeId === data.id;
              return (
                <div
                  key={data.id}
                  onClick={() => setActiveId(data.id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-300 shrink-0 w-[280px] lg:w-full border ${
                    isActive 
                      ? "bg-white dark:bg-white/[0.05] border-transparent shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] dark:shadow-none" 
                      : "bg-white/40 dark:bg-white/[0.02] border-transparent hover:bg-white/80 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="activeReviewIndicator" className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-r-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  )}

                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5">
                    {data.image ? (
                      <img src={data.image} alt={data.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-foreground/50 font-bold text-lg">{data.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow overflow-hidden">
                    <span className={`font-bold text-sm truncate transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                      {data.name}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium truncate">
                      {data.userName}
                    </span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1 ml-auto">
                    <Star size={14} className="fill-red-500 text-red-500" />
                    <span className="text-xs font-bold text-foreground">{data.rating}.0</span>
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* ПРАВЫЙ БЛОК (Главная карточка) */}
          <motion.div 
            variants={cardVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="w-full lg:w-[65%] h-full relative bg-white dark:bg-[#0c0c0e] rounded-[32px] border border-black/5 dark:border-white/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden h-auto lg:h-full flex flex-col origin-bottom-right"
          >
            <div className="absolute top-8 right-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <Quote size={120} className="text-foreground" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                // === УБРАЛИ BLUR ПРИ СМЕНЕ ОТЗЫВА ===
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: smoothEase as any }}
                className="relative z-10 p-8 sm:p-12 flex flex-col h-full min-h-[300px] lg:min-h-0"
              >
                <div className="flex gap-1.5 mb-8">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-red-500 text-red-500 drop-shadow-sm" />
                  ))}
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-foreground leading-snug mb-6 lg:mb-10 min-h-0 flex-grow">
                  "{activeTestimonial.comment}"
                </h3>

                <div className="mt-auto flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-foreground">{activeTestimonial.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">{activeTestimonial.userName}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </motion.div>

      {/* === БОКОВАЯ ПАНЕЛЬ ФОРМЫ (ОСТАВЛЕНА БЕЗ ИЗМЕНЕНИЙ) === */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4, ease: smoothEase as any }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-[101] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-background/90 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold">{t("testimonials.form_title")}</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors">
                  <X size={20} className="text-foreground" />
                </button>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-center">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                    <CheckCircle2 size={80} className="text-green-500 mb-6" />
                    <h4 className="text-2xl font-bold mb-3">{t("testimonials.success_title")}</h4>
                    <p className="text-muted-foreground">{t("testimonials.success_desc")}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("testimonials.form_name")}</label>
                      <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0c0c0e] border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("testimonials.form_company")}</label>
                      <input required type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-50 dark:bg-[#0c0c0e] border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("testimonials.form_rating")}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer transition-all ${rating >= star ? "fill-red-500 text-red-500 scale-110 drop-shadow-sm" : "text-muted-foreground/30 hover:text-red-400 hover:scale-110"}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("testimonials.form_text")}</label>
                      <textarea required value={text} onChange={e => setText(e.target.value)} rows={4} className="w-full bg-slate-50 dark:bg-[#0c0c0e] border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("testimonials.form_photo")}</label>
                      <label className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-xl px-4 py-5 cursor-pointer transition-all ${photo ? "border-red-500 bg-red-500/5" : "border-black/10 dark:border-white/10 hover:border-red-500 hover:bg-red-500/5"}`}>
                        <Upload size={20} className={photo ? "text-red-500" : "text-muted-foreground"} />
                        <span className={`text-sm font-semibold line-clamp-1 ${photo ? "text-red-500" : "text-muted-foreground"}`}>
                          {photo ? photo.name : t("testimonials.form_upload")}
                        </span>
                        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="hidden" />
                      </label>
                    </div>

                    <button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 flex justify-center items-center gap-2">
                      {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> {t("testimonials.form_sending")}</> : t("testimonials.form_submit")}
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
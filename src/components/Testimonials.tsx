"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

// Оставили только 2 реальных отзыва
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
    name: "Артем",
    userName: "Коммерческое помещение",
    comment: "Профессионалы своего дела — работают быстро, качественно и с полной отдачей. Однозначно рекомендую. Система работает без сбоев уже полгода.",
    rating: 5,
  }
]

export const Testimonials = () => {
  const { t } = useTranslation()
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1, rootMargin: "-10% 0px" })
  
  const [activeId, setActiveId] = useState<string>(testimonials[0].id)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Состояния формы
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

  return (
    <section 
      id="testimonials" 
      className="relative min-h-screen snap-start flex flex-col justify-center py-20 lg:py-24 overflow-hidden bg-slate-50 dark:bg-background"
    >
      {/* Мягкий фон */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full" />
      </div>

      <div ref={ref} className="relative z-10 mx-auto w-full max-w-[1300px] px-4 sm:px-6 flex flex-col h-full lg:min-h-[600px]">
        
        {/* === ВЕРХНЯЯ ЧАСТЬ: Заголовок и Кнопка === */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: smoothEase as any }} className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground leading-[1.1]">
              {t("testimonials.title1")}
              <span className="text-red-600 block mt-1">
                {t("testimonials.title2")}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6">
              {t("testimonials.subtitle")}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1, ease: smoothEase as any }}>
            <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground font-semibold hover:shadow-lg hover:border-red-500/30 transition-all duration-300">
              <MessageSquarePlus size={18} className="text-red-600" />
              {t("testimonials.btn")}
            </button>
          </motion.div>
        </div>

        {/* === НИЖНЯЯ ЧАСТЬ: Список и Превью === */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 flex-grow h-[450px]">
          
          {/* ЛЕВЫЙ БЛОК: Список (С кастомным скроллбаром) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: smoothEase as any }}
            className="w-full lg:w-[35%] flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 pr-0 lg:pr-4 snap-x lg:snap-none
            /* Кастомный скроллбар для ПК */
            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-black/20 dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20
            /* Скрытие скроллбара на мобилках */
            max-lg:[&::-webkit-scrollbar]:hidden max-lg:[-ms-overflow-style:none] max-lg:[scrollbar-width:none]"
          >
            {testimonials.map((data) => {
              const isActive = activeId === data.id;
              return (
                <div
                  key={data.id}
                  onClick={() => setActiveId(data.id)} // Клик и на ПК и на Мобилках
                  className={`group relative flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-300 snap-start shrink-0 w-[280px] lg:w-full border ${
                    isActive 
                      ? "bg-white dark:bg-white/[0.05] border-transparent shadow-sm" 
                      : "bg-white/40 dark:bg-white/[0.02] border-transparent hover:bg-white/80 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Красная линия (Индикатор активности) */}
                  {isActive && (
                    <motion.div layoutId="activeReviewIndicator" className="absolute left-0 top-3 bottom-3 w-1 bg-red-500 rounded-r-full" />
                  )}

                  {/* Аватарка */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5">
                    {data.image ? (
                      <img src={data.image} alt={data.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-foreground/50 font-bold text-lg">{data.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  
                  {/* Имя и Описание */}
                  <div className="flex flex-col flex-grow overflow-hidden">
                    <span className={`font-bold text-sm truncate transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                      {data.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {data.userName}
                    </span>
                  </div>

                  {/* Оценка */}
                  <div className="hidden lg:flex items-center gap-1 ml-auto">
                    <Star size={14} className="fill-red-500 text-red-500" />
                    <span className="text-xs font-bold text-foreground">{data.rating}.0</span>
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* ПРАВЫЙ БЛОК: Превью отзыва */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.3, ease: smoothEase as any }}
            className="w-full lg:w-[65%] h-full relative bg-white dark:bg-[#0c0c0e] rounded-[32px] border border-black/5 dark:border-white/5 shadow-xl dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden h-auto lg:h-full flex flex-col"
          >
            {/* Водяной знак кавычки */}
            <div className="absolute top-8 right-8 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
              <Quote size={120} className="text-foreground" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: smoothEase as any }}
                className="relative z-10 p-8 sm:p-12 flex flex-col h-full"
              >
                {/* Звезды */}
                <div className="flex gap-1.5 mb-8">
                  {[...Array(activeTestimonial.rating)].map((_, i) => (
                    <Star key={i} size={24} className="fill-red-500 text-red-500" />
                  ))}
                </div>

                {/* Текст отзыва */}
                <h3 className="text-lg sm:text-xl lg:text-3xl font-medium tracking-tight text-foreground leading-snug mb-6 lg:mb-10 min-h-0">
                  "{activeTestimonial.comment}"
                </h3>

                {/* Инфо об авторе (Внизу) */}
                <div className="mt-auto flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-foreground">{activeTestimonial.name}</span>
                    <span className="text-sm text-muted-foreground">{activeTestimonial.userName}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* === БОКОВАЯ ПАНЕЛЬ ФОРМЫ (Осталась без изменений) === */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: smoothEase as any }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-[101] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border p-6 flex items-center justify-between z-10">
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
                          <Star key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer transition-all ${rating >= star ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground/30 hover:text-red-400 hover:scale-110"}`} />
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
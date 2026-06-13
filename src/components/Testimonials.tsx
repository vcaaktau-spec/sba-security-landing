"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface TestimonialProps {
  id: string
  image?: string
  name: string
  userName: string
  comment: string
  rating: number
}

export const Testimonials = () => {
  const { t } = useTranslation()
  
  const testimonialsData: TestimonialProps[] = [
    { id: "1", name: "Виолетта", userName: "Владелец квартиры", comment: "Спасибо большое ребятам, все установили чисто, аккуратно. Обьяснили и показали как пользоваться приложением на телефоне! Теперь я спокойна за свой дом. Огромное спасибо за профессионализм.", rating: 5 },
    { id: "2", name: "Артем", userName: "Коммерческое помещение", comment: "Профессионалы своего дела — работают быстро, качественно и с полной отдачей. Однозначно рекомендую. Система работает без сбоев уже полгода.", rating: 5 },
    { id: "3", name: "Талгат", userName: "Частное помещение", comment: "Отличный сервис и профессиональный подход. Камеры работают стабильно, изображение качественное. Установку выполнили быстро и аккуратно. Спасибо!", rating: 5 },
    { id: "4", name: "Рамазан", userName: "Шанхай, Флаур", comment: "Не первый год сотрудничаю с этой компанией - всегда на связи и оперативно реагируют. Работу выполняют на 100%, всегда держат слово. Лучше работать с надежной компанией, чем выбирать где дешевле!", rating: 5 },
    { id: "5", name: "@remmaster_aktau", userName: "Внутренняя отделка помещений", comment: "Спасибо за качественную работу и профессиональный подход. Все пожелания были учтены, работа ввыполнена аккуратно и в срок. Видно, что ребята действительно знают свое дело. Рекомендую!", rating: 5 },
    { id: "6", name: "Марат", userName: "Владелец магазина", comment: "Спасибо! Установили все быстро и качественно. Оборудование работает отлично, полностью доволен результатом!", rating: 5 },
    { id: "7", name: "Антон", userName: "Kaz Tehno Service", comment: "Очень квалифицированные специалисты. Не один раз обращались за помощью в решении разных вопросов - всегда все выполнялось оперативно и качественно. Спасибо вам!", rating: 5 },
    { id: "8", name: "Виталий", userName: "Частный дом", comment: "Если вы ищете качество, надежность и аккуратность, то лучше специалистов не найти. Всегда на связи с клиентом 24/7. Огромное спасибо Владимиру и его компании за профессиональную работу!", rating: 5 }
  ]

  const [cards, setCards] = useState<TestimonialProps[]>(testimonialsData)

  const handleNext = () => {
    setCards((prevCards) => {
      const updated = [...prevCards]
      const first = updated.shift()
      if (first) updated.push(first)
      return updated
    })
  }

  const handlePrev = () => {
    setCards((prevCards) => {
      const updated = [...prevCards]
      const last = updated.pop()
      if (last) updated.unshift(last)
      return updated
    })
  }

  // Autoplay loop
  useEffect(() => {
    const timer = setInterval(handleNext, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section 
      id="testimonials" 
      className="magnet-section relative min-h-screen flex flex-col justify-center py-24 overflow-hidden bg-transparent border-t border-border/10"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-[34px] sm:text-[46px] lg:text-[56px] font-black tracking-tighter leading-[1.1] mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">{t("testimonials.title1", "Что говорят")}</span>
            <span className="block text-red-600 mt-2">{t("testimonials.title2", "наши клиенты")}</span>
          </h2>
          <div className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("testimonials.subtitle", "Реальные отзывы от владельцев бизнеса и частных лиц, доверивших нам свою безопасность.")}
          </div>
        </div>

        {/* STACKED CARDS WRAPPER */}
        <div className="relative w-full max-w-[680px] h-[340px] flex items-center justify-center">
          
          <div className="absolute top-0 right-4 opacity-[0.03] pointer-events-none text-foreground z-0">
            <Quote size={140} />
          </div>

          {cards.slice(0, 3).map((testimonial, index) => {
            // Calculate 3D card parameters based on index
            const scale = 1 - index * 0.05
            const yOffset = index * 18
            const opacity = 1 - index * 0.3
            const zIndex = 10 - index

            return (
              <motion.div
                key={testimonial.id}
                style={{ zIndex }}
                animate={{
                  scale,
                  y: yOffset,
                  opacity,
                }}
                exit={{ opacity: 0, x: -150, rotate: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute w-full bg-card/60 backdrop-blur-xl border border-border/40 rounded-[28px] p-8 sm:p-10 shadow-2xl flex flex-col justify-between h-[300px]"
              >
                {/* Corner HUD markers on top card only */}
                {index === 0 && (
                  <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/40" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/40" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/40" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/40" />
                  </div>
                )}

                <div>
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-red-500 text-red-500" />
                    ))}
                  </div>

                  <p className="text-sm sm:text-base text-foreground/95 italic leading-relaxed line-clamp-5">
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm sm:text-base text-foreground">{testimonial.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{testimonial.userName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/40">
                    SBA_VERIFIED_CLIENT
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center gap-4 mt-8 relative z-20">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-border/50 bg-background/50 hover:bg-red-500/10 hover:border-red-500/30 text-foreground transition-all duration-300 flex items-center justify-center shadow-sm"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={18} />
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-border/50 bg-background/50 hover:bg-red-500/10 hover:border-red-500/30 text-foreground transition-all duration-300 flex items-center justify-center shadow-sm"
            aria-label="Next testimonial"
          >
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  )
}
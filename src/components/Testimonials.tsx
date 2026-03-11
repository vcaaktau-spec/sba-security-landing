"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Star, Quote } from "lucide-react"

interface TestimonialProps {
  id: string
  image?: string
  name: string
  userName: string
  comment: string
  rating: number
}

const testimonials: TestimonialProps[] = [
  { id: "1", image: "/testimonials/viola.webp", name: "Виолетта", userName: "Владелец квартиры", comment: "Спасибо большое ребятам, все установили чисто, аккуратно. Обьяснили и показали как пользоваться приложением на телефоне! Теперь я спокойна за свой дом. Огромное спасибо за профессионализм.", rating: 5 },
  { id: "2", image: "/testimonials/artem.webp", name: "Артем", userName: "Коммерческое помещение", comment: "Профессионалы своего дела — работают быстро, качественно и с полной отдачей. Однозначно рекомендую. Система работает без сбоев уже полгода.", rating: 5 },
  { id: "3", name: "Талгат", userName: "Частное помещение", comment: "Отличный сервис и профессиональный подход. Камеры работают стабильно, изображение качественное. Установку выполнили быстро и аккуратно. Спасибо!", rating: 5 },
  { id: "4", name: "Рамазан", userName: "Шанхай, Флаур", comment: "Не первый год сотрудничаю с этой компанией - всегда на связи и оперативно реагируют. Работу выполняют на 100%, всегда держат слово. Лучше работать с надежной компанией, чем выбирать где дешевле!", rating: 5 },
  { id: "5", name: "@remmaster_aktau", userName: "Внутренняя отделка помещений", comment: "Спасибо за качественную работу и профессиональный подход. Все пожелания были учтены, работа ввыполнена аккуратно и в срок. Видно, что ребята действительно знают свое дело. Рекомендую!", rating: 5 },
  { id: "6", name: "Марат", userName: "Владедлец магазина", comment: "Спасибо! Установили все быстро и качественно. Оборудование работае отлично, полностью доволен результатом!", rating: 5 },
  { id: "7", name: "Антон", userName: "Kaz Tehno Service", comment: "Очень квалифицированные специалисты. Не один раз обращались за помощью в решении разных вопросов - всегда все выполнялось оперативно и качественно. Спасибо вам!", rating: 5 },
  { id: "8", name: "Виталий", userName: "Частный дом", comment: "Если вы ищите качество, надежность и аккуратность, то лучше специалистов не найти. Всегда на связи с клиентом 24/7. Огромное спасибо Владимиру и его компании за профессиональную работу!", rating: 5 }
]

export const Testimonials = () => {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>(testimonials[0].id)

  // === ЖЕЛЕЗОБЕТОННЫЙ АВТОПЛЕЙ ===
  // Строго раз в 4 секунды, без привязок к видимости экрана
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = testimonials.findIndex(t => t.id === currentId);
        return testimonials[(currentIndex + 1) % testimonials.length].id;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const smoothEase = [0.22, 1, 0.36, 1]
  const activeTestimonial = testimonials.find(t => t.id === activeId) || testimonials[0]

  return (
    <section 
      id="testimonials" 
      // Жесткая фиксация высоты экрана для ПК (lg:h-screen), центрирование по вертикали
      className="magnet-section relative w-full h-auto lg:h-screen flex flex-col justify-center py-16 lg:py-0 overflow-hidden bg-transparent border-t border-border/10"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1300px] px-4 sm:px-6 flex flex-col items-center">
        
        {/* === ЗАГОЛОВОК (ЦЕНТРИРОВАННЫЙ, СТАТИЧНЫЙ) === */}
        <div className="w-full flex flex-col items-center text-center max-w-4xl mx-auto mb-10 lg:mb-16 shrink-0">
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-4 lg:mb-6 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">{t("testimonials.title1", "Что говорят")}</span>
            <span className="block text-red-600 mt-1 sm:mt-2">{t("testimonials.title2", "наши клиенты")}</span>
          </h2>
          <div className="text-[15px] sm:text-[18px] text-muted-foreground font-medium leading-relaxed max-w-2xl text-center">
            {t("testimonials.subtitle", "Реальные отзывы от владельцев бизнеса и частных лиц, доверивших нам свою безопасность.")}
          </div>
        </div>

        {/* === БЛОК КОНТЕНТА === */}
        {/* Жестко заданная высота для ПК (lg:h-[500px]), чтобы заработал скролл списка */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full h-auto lg:h-[500px] xl:h-[550px] shrink-0">
          
          {/* ЛЕВЫЙ БЛОК: Список со скроллом */}
          <div
            data-lenis-prevent="true" 
            className="w-full lg:w-[35%] flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto pb-4 lg:pb-0 lg:pr-4 snap-x lg:snap-none pointer-events-auto
            [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border
            max-lg:[-ms-overflow-style:none] max-lg:[scrollbar-width:none]"
          >
            {testimonials.map((data) => {
              const isActive = activeId === data.id;
              return (
                <button
                  key={data.id}
                  onClick={() => setActiveId(data.id)}
                  className={`group relative flex items-center gap-4 p-4 rounded-[22px] text-left transition-all duration-300 shrink-0 w-[280px] lg:w-full border backdrop-blur-sm pointer-events-auto ${
                    isActive 
                      ? "bg-background/80 dark:bg-white/[0.07] border-red-500/30 shadow-lg" 
                      : "bg-background/40 dark:bg-white/[0.02] border-border/50 hover:bg-background/60"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border/50">
                    {data.image ? <img src={data.image} alt={data.name} className="w-full h-full object-cover" /> : <span className="font-bold opacity-50">{data.name.charAt(0)}</span>}
                  </div>
                  <div className="flex flex-col flex-grow overflow-hidden">
                    <span className="font-bold text-sm truncate text-foreground">{data.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{data.userName}</span>
                  </div>
                  {isActive && <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-600 rounded-r-full" />}
                </button>
              )
            })}
          </div>

          {/* ПРАВЫЙ БЛОК: ГЛАВНАЯ КАРТОЧКА С HUD-УГЛАМИ */}
          <div className="w-full lg:w-[65%] h-full relative bg-background/60 dark:bg-[#0c0c0e]/80 backdrop-blur-xl rounded-[28px] sm:rounded-[40px] border border-border/50 shadow-2xl overflow-hidden min-h-[350px] lg:min-h-0 flex flex-col group">
            
            {/* HUD Corners */}
            <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-500/50 rounded-tl-[28px] sm:rounded-tl-[40px]" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500/50 rounded-tr-[28px] sm:rounded-tr-[40px]" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-500/50 rounded-bl-[28px] sm:rounded-bl-[40px]" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-500/50 rounded-br-[28px] sm:rounded-br-[40px]" />
            </div>

            <div className="absolute top-8 right-10 opacity-[0.03] pointer-events-none">
              <Quote size={120} />
            </div>

            {/* Анимация переключения отзыва (оставлена как просили) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: smoothEase as any}}
                className="relative z-10 p-8 sm:p-14 flex flex-col h-full"
              >
                <div className="flex gap-1 mb-6 sm:mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-red-500 text-red-500" />)}
                </div>
                
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground leading-relaxed italic mb-8 sm:mb-10 flex-grow">
                  "{activeTestimonial.comment}"
                </h3>
                
                <div className="flex items-center gap-4 pt-6 border-t border-border/30 mt-auto">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-foreground">{activeTestimonial.name}</span>
                    <span className="text-sm text-muted-foreground font-medium">{activeTestimonial.userName}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
          </div>
        </div>

      </div>
    </section>
  )
}
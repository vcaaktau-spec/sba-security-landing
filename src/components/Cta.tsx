"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { X, ArrowRight, ShieldCheck, CheckCircle2, Loader2, ChevronDown, MessageCircle } from "lucide-react"

export const Cta = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState(t("cta.opt_1", "Видеонаблюдение"))
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isModalOpen])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "")
    if (input.startsWith("7") || input.startsWith("8")) input = input.substring(1)
    let formatted = "+7"
    if (input.length > 0) formatted += ` (${input.substring(0, 3)}`
    if (input.length > 3) formatted += `) ${input.substring(3, 6)}`
    if (input.length > 6) formatted += `-${input.substring(6, 8)}`
    if (input.length > 8) formatted += `-${input.substring(8, 10)}`
    setPhone(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append("name", name)
    formData.append("company", "ЗАЯВКА С САЙТА") 
    formData.append("text", `📞 Телефон: ${phone}\n🛠 Услуга: ${service}`)

    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Error")
      
      setIsSuccess(true)
      setTimeout(() => {
        setIsModalOpen(false)
        setTimeout(() => {
          setIsSuccess(false)
          setName(""); setPhone(""); setService(t("cta.opt_1", "Видеонаблюдение"));
        }, 500)
      }, 3000)
    } catch (error) {
      alert(t("cta.error_msg", "Ошибка. Пожалуйста, напишите нам в WhatsApp."))
    } finally {
      setIsSubmitting(false)
    }
  }

  const smoothEase = [0.22, 1, 0.36, 1]

  const serviceOptions = [
    t("cta.opt_1", "Видеонаблюдение"),
    t("cta.opt_2", "Охранно-пожарная сигнализация"),
    t("cta.opt_3", "Локальные сети (СКС/Wi-Fi)"),
    t("cta.opt_4", "IT Услуги / Разработка"),
    t("cta.opt_5", "Комплексная безопасность")
  ]

  return (
    <>
      <section
        id="cta"
        // Убрали bg-background, поставили bg-transparent, секция на весь экран
        className="magnet-section relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent border-t border-border/10"
      >
        {/* === КОНТЕНТ === */}
        <div className="relative z-10 w-full max-w-[1000px] px-4 sm:px-6 flex flex-col items-center text-center">
          
          {/* HUD Badge */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/30 text-red-500 backdrop-blur-md">
              <ShieldCheck size={16} strokeWidth={2} />
              <span className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.25em]">
                {t("cta.badge", "Финальный этап")}
              </span>
            </div>
          </div>

          {/* === ЗАГОЛОВОК (СИНХРОНИЗИРОВАН С STATISTICS) === */}
          <h2 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-tighter leading-[1.1] mb-6 sm:mb-8 flex flex-col items-center justify-center w-full">
            <span className="block w-full text-foreground">
              {t("cta.title1", "Готовы обезопасить свой")}
            </span>
            <span className="block w-full text-red-600 mt-1 sm:mt-2">
              {t("cta.title2", "бизнес и дом?")}
            </span>
          </h2>

          <div className="text-[16px] sm:text-[18px] text-muted-foreground font-medium max-w-3xl leading-relaxed mb-12 sm:mb-16">
            {t("cta.subtitle", "От умного видеонаблюдения до корпоративных сетей и пожарной сигнализации. Подберём оптимальное решение, спроектируем и установим под ключ с гарантией.")}
          </div>

          {/* === КНОПКИ ДЕЙСТВИЯ === */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            
            {/* Главная кнопка (Заявка) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative w-full sm:w-auto px-8 sm:px-12 h-14 sm:h-16 bg-foreground hover:bg-red-600 text-background hover:text-white font-bold text-[13px] sm:text-sm uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden group border border-transparent hover:border-red-500"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">{t("cta.btn_main", "Рассчитать проект")}</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" size={18} />
            </button>

            {/* Альтернативная кнопка (WhatsApp) */}
            <a
              href="https://wa.me/77779204988" // ЗАМЕНИ НА СВОЙ НОМЕР
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full sm:w-auto px-8 sm:px-12 h-14 sm:h-16 bg-transparent border border-border hover:border-green-500 text-foreground font-bold text-[13px] sm:text-sm uppercase tracking-[0.15em] transition-all duration-500 flex items-center justify-center gap-3 group backdrop-blur-sm"
            >
              <MessageCircle className="text-muted-foreground group-hover:text-green-500 transition-colors duration-500" size={20} />
              <span className="group-hover:text-green-500 transition-colors duration-500">{t("cta.btn_wa", "Написать в WhatsApp")}</span>
              
              {/* Индикатор онлайна */}
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* === ТЕРМИНАЛЬНАЯ ПАНЕЛЬ ФОРМЫ === */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end text-foreground">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }} animate={{ x: "0%", opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.5, ease: smoothEase as any}}
              className="relative w-full max-w-md h-full bg-background border-l border-border/50 shadow-2xl flex flex-col z-[101]"
            >
              {/* HUD Corners для модалки */}
              <div className="absolute inset-0 opacity-30 pointer-events-none z-20">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50" />
              </div>

              <div className="relative z-30 flex items-center justify-between p-6 sm:p-10 border-b border-border/50 bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ShieldCheck size={18} className="text-red-600" />
                  </div>
                  <h3 className="font-bold text-xl tracking-tight uppercase">{t("cta.form_title", "Заявка на расчет")}</h3>
                </div>
                
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-transparent border border-border hover:border-red-500 transition-colors text-muted-foreground hover:text-red-500">
                  <X size={18} />
                </button>
              </div>

              <div className="relative z-30 px-6 sm:px-10 pb-10 pt-8 flex-grow overflow-y-auto flex flex-col">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-20 h-20 bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/30">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 uppercase">{t("cta.success_title", "Заявка принята!")}</h4>
                    <p className="text-muted-foreground text-[14px]">{t("cta.success_desc", "Наш инженер свяжется с вами в ближайшее время.")}</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-muted-foreground text-[14px] leading-relaxed mb-10 border-l-2 border-red-600 pl-4 py-1">
                      {t("cta.form_desc", "Оставьте контактные данные, и наш инженер свяжется с вами для бесплатной консультации и точного расчета.")}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-grow">
                      
                      {/* ИМЯ */}
                      <div className="relative group">
                        <input 
                          required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder=" "
                          className="peer w-full h-12 bg-transparent border-b border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors rounded-none"
                        />
                        <label className="absolute left-0 -top-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-red-600 cursor-text pointer-events-none">
                          {t("cta.name_label", "Ваше имя")}
                        </label>
                      </div>

                      {/* ТЕЛЕФОН */}
                      <div className="relative group">
                        <input 
                          required type="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder=" "
                          className="peer w-full h-12 bg-transparent border-b border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors font-mono rounded-none"
                        />
                        <label className="absolute left-0 -top-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-red-600 cursor-text pointer-events-none">
                          {t("cta.phone_label", "Ваш телефон")}
                        </label>
                      </div>

                      {/* ВЫБОР УСЛУГИ */}
                      <div className="relative group mt-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 pointer-events-none">
                          {t("cta.service_label", "Что вас интересует?")}
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full h-12 bg-transparent border-b flex items-center justify-between text-sm sm:text-base transition-colors outline-none ${isDropdownOpen ? "border-red-600 text-foreground" : "border-border text-foreground"}`}
                        >
                          <span className="truncate pr-4">{service}</span>
                          <ChevronDown size={16} className={`transition-transform duration-300 shrink-0 ${isDropdownOpen ? "rotate-180 text-red-600" : "text-muted-foreground"}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                        )}

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 w-full mt-1 bg-background border border-border shadow-xl z-50 flex flex-col py-1 overflow-hidden"
                            >
                              {serviceOptions.map((opt, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => { setService(opt); setIsDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-[13px] sm:text-[14px] transition-colors border-l-2 ${
                                    service === opt 
                                      ? "bg-red-600/10 text-red-600 border-red-600 font-medium" 
                                      : "text-foreground hover:bg-muted border-transparent"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button 
                        type="submit" disabled={isSubmitting || phone.length !== 18}
                        className="mt-auto w-full h-14 flex justify-center items-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white border border-red-500/50 font-bold text-[13px] uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
                      >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : t("cta.btn_submit", "Отправить заявку")}
                      </button>
                      
                      <div className="text-center text-[10px] text-muted-foreground/60 uppercase mt-[-10px]">
                        {t("cta.disclaimer", "Нажимая кнопку, вы даете согласие на обработку персональных данных.")}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
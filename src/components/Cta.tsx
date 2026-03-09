"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useTranslation } from "react-i18next"
import { X, ArrowRight, ShieldCheck, CheckCircle2, Loader2, ChevronDown } from "lucide-react"
import { useInView } from "react-intersection-observer"
import Magnetic from "./ui/magnetic"

export const Cta = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState(t("cta.opt_1", "Видеонаблюдение"))
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Легкий параллакс
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])

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

  const textVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: (delay: number) => ({
      opacity: 1, y: 0, filter: "blur(0px)", 
      transition: { duration: 1, ease: smoothEase as any, delay }
    })
  }

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
        ref={containerRef}
        // ВОТ ОН, НАШ РОДНОЙ МАГНИТ БЕЗ ЛИШНЕГО CSS SNAP
        className="magnet-section relative min-h-screen flex items-center justify-center overflow-hidden bg-background border-t border-border"
      >
        {/* === ЧИСТЫЙ ФОН В СТИЛЕ LINEAR === */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        {/* === КОНТЕНТ === */}
        <motion.div 
          ref={inViewRef}
          style={{ y: yText }}
          className="relative z-10 w-full max-w-[800px] px-4 sm:px-6 flex flex-col items-center text-center"
        >
          {/* Бейдж */}
          <motion.div custom={0} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/5 border border-red-500/20 text-red-600">
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                {t("cta.badge", "Доверьтесь профессионалам")}
              </span>
            </div>
          </motion.div>

          {/* Заголовок */}
          <motion.h2 
            custom={0.1} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-5xl sm:text-7xl lg:text-[80px] font-black tracking-tighter leading-[1.05] mb-6 text-foreground"
          >
            {t("cta.title1", "Готовы обезопасить свой")} <br className="hidden sm:block" />
            <span className="text-red-600 italic pr-2">
              {t("cta.title2", "бизнес и дом?")}
            </span>
          </motion.h2>

          {/* Подзаголовок */}
          <motion.p 
            custom={0.2} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed mb-10 sm:mb-14"
          >
            {t("cta.subtitle", "От умного видеонаблюдения до корпоративных сетей и пожарной сигнализации. Подберём оптимальное решение, спроектируем и установим под ключ с гарантией.")}
          </motion.p>

          {/* КНОПКА */}
          <motion.div custom={0.3} variants={textVariants} initial="hidden" animate={inView ? "visible" : "hidden"} className="w-full flex justify-center">
            <Magnetic strength={0.3}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative px-8 sm:px-12 h-14 sm:h-16 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-[13px] sm:text-sm uppercase tracking-[0.15em] transition-all duration-500 shadow-[0_0_30px_-5px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_-5px_rgba(220,38,38,0.6)] flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">{t("cta.btn_main", "Рассчитать проект")}</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" size={18} />
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>
      </section>

      {/* === ВЫЕЗЖАЮЩАЯ ПАНЕЛЬ ФОРМЫ === */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end text-foreground">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }} animate={{ x: "0%", opacity: 1 }} exit={{ x: "100%", opacity: 0 }} transition={{ duration: 0.5, ease: smoothEase as any}}
              className="relative w-full max-w-md h-full bg-background border-l border-border shadow-2xl flex flex-col z-[101]"
            >
              <div className="flex items-center justify-between p-6 sm:p-10 border-b border-border bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-red-600" />
                  </div>
                  <h3 className="font-semibold text-xl tracking-tight">{t("cta.form_title", "Оставить заявку")}</h3>
                </div>
                
                <Magnetic strength={0.4}>
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </Magnetic>
              </div>

              <div className="px-6 sm:px-10 pb-10 pt-8 flex-grow overflow-y-auto flex flex-col">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">{t("cta.success_title", "Заявка отправлена")}</h4>
                    <p className="text-muted-foreground text-[15px]">{t("cta.success_desc", "Мы свяжемся с вами в ближайшее время.")}</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-muted-foreground text-[14px] leading-relaxed mb-10">
                      {t("cta.form_desc", "Заполните форму ниже, и наш инженер свяжется с вами для уточнения деталей.")}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-grow">
                      <div className="relative group">
                        <input 
                          required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder=" "
                          className="peer w-full h-12 bg-transparent border-b-2 border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors rounded-none"
                        />
                        <label className="absolute left-0 -top-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:text-red-600 cursor-text pointer-events-none">
                          {t("cta.name_label", "Ваше имя")}
                        </label>
                      </div>

                      <div className="relative group">
                        <input 
                          required type="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder=" "
                          className="peer w-full h-12 bg-transparent border-b-2 border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors font-mono rounded-none"
                        />
                        <label className="absolute left-0 -top-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[15px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:text-red-600 cursor-text pointer-events-none">
                          {t("cta.phone_label", "Ваш телефон")}
                        </label>
                      </div>

                      <div className="relative group mt-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest block mb-2 pointer-events-none">
                          {t("cta.service_label", "ЧТО ВАС ИНТЕРЕСУЕТ?")}
                        </label>
                        
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full h-12 bg-transparent border-b-2 flex items-center justify-between text-base transition-colors outline-none ${isDropdownOpen ? "border-red-600 text-foreground" : "border-border text-foreground"}`}
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
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 w-full mt-1 bg-background border border-border shadow-xl z-50 flex flex-col py-1 overflow-hidden"
                            >
                              {serviceOptions.map((opt, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => { setService(opt); setIsDropdownOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-[14px] transition-colors ${
                                    service === opt 
                                      ? "bg-red-600/10 text-red-600 font-medium" 
                                      : "text-foreground hover:bg-muted"
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
                        className="mt-auto w-full h-14 flex justify-center items-center gap-3 bg-foreground hover:bg-red-600 disabled:opacity-50 text-background hover:text-white rounded-none font-bold text-[13px] uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
                      >
                        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : t("cta.btn_submit", "Отправить заявку")}
                      </button>
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
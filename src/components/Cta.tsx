"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { MessageCircle, X, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

export const Cta = () => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState(t("cta.opt_1"))
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isModalOpen])

  // Маска для телефона "на лету"
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
    formData.append("rating", "0") 
    
    const messageText = `📞 Телефон: ${phone}\n🛠 Услуга: ${service}`
    formData.append("text", messageText)

    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Network response was not ok")
      
      setIsSuccess(true)
      setTimeout(() => {
        setIsModalOpen(false)
        setTimeout(() => {
          setIsSuccess(false)
          setName(""); setPhone(""); setService(t("cta.opt_1"));
        }, 500)
      }, 3000)
    } catch (error) {
      alert(t("cta.error_msg"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const smoothEase = [0.22, 1, 0.36, 1]

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: smoothEase as any } }
  }

  return (
    <>
      <section
        id="cta"
        className="magnet-section relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-background"
      >
        {/* === AURORA BACKGROUND (Гипнотический фон) === */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Темная основа */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background z-10" />
          
          {/* Анимированные сферы (Аврора) */}
          <motion.div 
            animate={{ 
              x: ["0%", "20%", "-20%", "0%"], 
              y: ["0%", "-20%", "20%", "0%"],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1000px] h-[600px] sm:h-[1000px] bg-red-600/20 blur-[150px] sm:blur-[200px] rounded-full z-0" 
          />
          <motion.div 
            animate={{ 
              x: ["0%", "-30%", "10%", "0%"], 
              y: ["0%", "20%", "-30%", "0%"],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-red-900/20 blur-[150px] sm:blur-[200px] rounded-full z-0" 
          />
          
          {/* Сетка поверх авроры для техно-стиля */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)] z-20" />
        </div>

        {/* === ЦЕНТРАЛЬНЫЙ ОСТРОВ (Main Card) === */}
        <div ref={ref} className="relative z-30 w-full max-w-[1200px] px-4 sm:px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col items-center text-center bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[40px] sm:rounded-[60px] p-8 sm:p-16 lg:p-24 shadow-2xl relative overflow-hidden"
          >
            {/* Внутренний блик */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 dark:from-white/5 to-transparent pointer-events-none" />

            {/* Иконка */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-black rounded-full mb-10 shadow-lg border border-black/5 dark:border-white/10 z-10">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
              <ShieldCheck size={40} className="text-red-600 relative z-10" strokeWidth={1.5} />
            </motion.div>

            {/* Заголовок */}
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter mb-6 text-foreground z-10 leading-[1.05]">
              {t("cta.title1")} <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                {t("cta.title2")}
              </span>
            </motion.h2>

            {/* Описание */}
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12 z-10 font-medium">
              {t("cta.subtitle")}
            </motion.p>

            {/* Кнопки */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto z-10">
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative w-full sm:w-auto px-10 h-16 sm:h-18 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg sm:text-xl transition-all duration-300 shadow-[0_15px_40px_-10px_rgba(220,38,38,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(220,38,38,0.8)] overflow-hidden flex items-center justify-center gap-3 hover:-translate-y-1"
              >
                <span className="relative z-10">{t("cta.btn_main")}</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" size={24} />
              </button>

              <a
                href="https://wa.me/77779204988"
                target="_blank"
                rel="noreferrer"
                className="group relative w-full sm:w-auto px-10 h-16 sm:h-18 bg-white dark:bg-white/5 text-foreground rounded-full font-bold text-lg sm:text-xl transition-all duration-300 border border-black/10 dark:border-white/10 hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-500/10 flex items-center justify-center gap-3 hover:-translate-y-1 shadow-sm"
              >
                <span>{t("cta.btn_wa")}</span>
                <MessageCircle className="text-green-500 group-hover:scale-110 transition-transform duration-300" size={24} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === ВЫЕЗЖАЮЩАЯ ПАНЕЛЬ ФОРМЫ (Drawer) === */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%" }} animate={{ x: "0%" }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: smoothEase as any}}
              className="relative w-full max-w-lg h-full bg-white dark:bg-[#0a0a0c] border-l border-black/5 dark:border-white/5 shadow-2xl flex flex-col z-[101]"
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-500 font-bold text-xl">
                  <ShieldCheck size={28} />
                  <span>{t("cta.form_title")}</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 flex-grow overflow-y-auto flex flex-col justify-center">
                {isSuccess ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                    <CheckCircle2 size={80} className="text-green-500 mb-6" />
                    <h4 className="text-3xl font-bold mb-4">{t("cta.success_title")}</h4>
                    <p className="text-muted-foreground text-lg">{t("cta.success_desc")}</p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                      {t("cta.form_desc")}
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wide opacity-80">{t("cta.name_label")}</label>
                        <input 
                          required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("cta.name_ph")}
                          className="h-14 px-5 rounded-2xl bg-slate-100 dark:bg-[#111] border border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all text-base font-medium"
                        />
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wide opacity-80">{t("cta.phone_label")}</label>
                        <input 
                          required type="tel" value={phone} onChange={handlePhoneChange} maxLength={18} placeholder="+7 (___) ___-__-__" 
                          className="h-14 px-5 rounded-2xl bg-slate-100 dark:bg-[#111] border border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all text-base font-medium font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <label className="text-sm font-bold text-foreground uppercase tracking-wide opacity-80">{t("cta.service_label")}</label>
                        <select 
                          value={service} onChange={(e) => setService(e.target.value)}
                          className="h-14 px-5 rounded-2xl bg-slate-100 dark:bg-[#111] border border-transparent focus:border-red-500 focus:bg-white dark:focus:bg-[#1a1a1a] outline-none transition-all text-base font-medium appearance-none cursor-pointer"
                        >
                          <option>{t("cta.opt_1")}</option>
                          <option>{t("cta.opt_2")}</option>
                          <option>{t("cta.opt_3")}</option>
                          <option>{t("cta.opt_4")}</option>
                          <option>{t("cta.opt_5")}</option>
                        </select>
                      </div>

                      <button 
                        type="submit" disabled={isSubmitting || phone.length !== 18}
                        className="mt-4 w-full h-16 flex justify-center items-center gap-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:hover:translate-y-0 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] hover:-translate-y-1"
                      >
                        {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> {t("cta.btn_sending")}</> : t("cta.btn_submit")}
                      </button>
                    </form>

                    <p className="text-xs text-center text-muted-foreground mt-8 opacity-70">
                      {t("cta.disclaimer")}
                    </p>
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
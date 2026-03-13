"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next" 
import { Phone, MessageCircle, FileText, X, Shield, ChevronUp, Star, Upload, CheckCircle2, Loader2, HelpCircle, MessageSquarePlus } from "lucide-react"
import Magnetic from "./ui/magnetic"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const sponsors = [
  { name: "Hikvision" }, { name: "Dahua" }, { name: "Hiwatch" }, 
  { name: "Imou" }, { name: "Tiandy" }, { name: "Ezviz" },
  { name: "Mikrotik" }, { name: "Ruijie" }, { name: "TP Link" },
  { name: "Intel" }, { name: "Microsoft" }, { name: "Linux" },
  { name: "WD" }, { name: "Seagate" }, { name: "Kingston" },
]

const languages = [
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "KZ", label: "Қазақша", flag: "🇰🇿" },
  { code: "EN", label: "English", flag: "🇺🇸" },
]

type ModalType = "privacy" | "terms" | "dpa" | "faq" | "review" | null;

interface FooterProps {
  onOpenCalc: () => void;
}

export const Footer = ({ onOpenCalc }: FooterProps) => {
  const { t, i18n } = useTranslation() 
  const [modalContent, setModalContent] = useState<ModalType>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isFabOpen, setIsFabOpen] = useState(false)

  // Монтирование для портала
  useEffect(() => {
    setMounted(true)
  }, [])

  // Блокировка скролла при открытии ЛЮБОЙ модалки футера
  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [modalContent])

  const currentLang = i18n?.language || 'ru'
  const activeLang = languages.find(l => l.code.toLowerCase() === currentLang.toLowerCase()) || languages[0]

  const closeDrawer = () => setModalContent(null)

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const FAQList = [
    { question: t("faq.q1"), answer: t("faq.a1"), value: "item-1" },
    { question: t("faq.q2"), answer: t("faq.a2"), value: "item-2" },
    { question: t("faq.q3"), answer: t("faq.a3"), value: "item-3" },
    { question: t("faq.q4"), answer: t("faq.a4"), value: "item-4" },
    { question: t("faq.q5"), answer: t("faq.a5"), value: "item-5" },
    { question: t("faq.q6"), answer: t("faq.a6"), value: "item-6" },
    { question: t("faq.q7"), answer: t("faq.a7"), value: "item-7" },
    { question: t("faq.q8"), answer: t("faq.a8"), value: "item-8" },
    { question: t("faq.q9"), answer: t("faq.a9"), value: "item-9" },
    { question: t("faq.q10"), answer: t("faq.a10"), value: "item-10" },
  ]

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [text, setText] = useState("")
  const [rating, setRating] = useState(5)
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("name", name); formData.append("company", company)
    formData.append("rating", rating.toString()); formData.append("text", text)
    if (photo) formData.append("photo", photo)
    try {
      const res = await fetch("/api/telegram", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Error")
      setIsSuccess(true)
      setTimeout(() => {
        closeDrawer()
        setTimeout(() => { setIsSuccess(false); setName(""); setCompany(""); setText(""); setRating(5); setPhoto(null); }, 500)
      }, 3000)
    } catch (error) { alert("Ошибка отправки") } finally { setIsSubmitting(false) }
  }

  const smoothEase = [0.22, 1, 0.36, 1]

  return (
    <footer id="footer" className="relative w-full bg-transparent flex flex-col z-20">
      
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 mt-10">
        <div className="w-full border-y border-border/30 bg-muted/5 py-1.5 overflow-hidden rounded-full">
          <div className="relative flex items-center w-full mask-edges">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none rounded-l-full" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none rounded-r-full" />
            
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="flex gap-16 items-center whitespace-nowrap px-4"
            >
              {[...sponsors, ...sponsors].map((brand, i) => (
                <span key={i} className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/50 uppercase hover:text-foreground transition-colors cursor-default">
                  {brand.name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 lg:mt-12">
        <div className="w-full max-w-[1300px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8">
            
            <div className="col-span-1 md:col-span-2 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center border border-border shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <Shield size={20} className="text-background" />
                </div>
                <span className="text-lg font-black tracking-tight uppercase">
                  SBA <span className="text-muted-foreground font-medium">{t("footer.aktau", "Актау")}</span>
                </span>
              </div>
              <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[300px]">
                {t("footer.desc")}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{t("footer.nav_title")}</h4>
              <ul className="space-y-4 text-[14px] font-medium text-foreground/80">
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-foreground transition-colors">{t("nav.services")}</a></li>
                <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="hover:text-foreground transition-colors">{t("nav.projects")}</a></li>
                <li><button onClick={onOpenCalc} className="hover:text-foreground transition-colors">{t("calc.badge")}</button></li>
                <li><button onClick={() => setModalContent("faq")} className="hover:text-foreground transition-colors">FAQ</button></li>
                <li><button onClick={() => setModalContent("review")} className="hover:text-red-500 transition-colors text-foreground">{t("review_form.title")}</button></li>
              </ul>
            </div>
              
            <div className="flex flex-col gap-5">
              <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">{t("footer.settings_title")}</h4>
              <ul className="space-y-4 text-[14px] font-medium text-foreground/80">
                <li><button onClick={() => setModalContent("privacy")} className="hover:text-foreground transition-colors">{t("docs.privacy")}</button></li>
                <li><button onClick={() => setModalContent("terms")} className="hover:text-foreground transition-colors">{t("docs.terms")}</button></li>
                <li><button onClick={() => setModalContent("dpa")} className="hover:text-foreground transition-colors">{t("docs.dpa")}</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-5 lg:items-end">
              <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest lg:text-right w-full">{t("footer.contacts_title")}</h4>
              
              <ul className="space-y-4 text-[14px] font-medium text-foreground/80 lg:text-right w-full mb-4">
                <li>
                  <Magnetic strength={0.1}>
                    <a href="tel:+77779204988" className="hover:text-foreground transition-colors inline-flex items-center gap-2 justify-start lg:justify-end w-full">
                      <Phone size={14} /> +7 777 920 49 88
                    </a>
                  </Magnetic>
                </li>
                <li>
                  <Magnetic strength={0.1}>
                    <a href="https://wa.me/77064230090" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-2 justify-start lg:justify-end w-full">
                      <MessageCircle size={14} /> +7 706 423 00 90
                    </a>
                  </Magnetic>
                </li>
              </ul>

              <div className="relative w-full lg:w-auto flex lg:justify-end mt-auto">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50"
                >
                  <span className="text-base">{activeLang.flag}</span>
                  <span>{activeLang.code}</span>
                  <ChevronUp size={14} className={`transition-transform duration-200 ${langOpen ? "" : "rotate-180"}`} />
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-0 lg:left-auto lg:right-0 mb-2 w-36 bg-background border border-border/50 shadow-2xl z-50 p-1.5 rounded-xl backdrop-blur-xl"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { i18n.changeLanguage(l.code.toLowerCase()); setLangOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium hover:bg-muted transition-colors rounded-lg text-foreground"
                        >
                          <span className="text-lg">{l.flag}</span> {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full border-t border-border/10 bg-background/80 backdrop-blur-md">
        <div className="w-full max-w-[1300px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] sm:text-[12px] text-muted-foreground/60 font-semibold tracking-wider uppercase">
          <p>{t("footer.copyright")}</p>
          <a href="https://wa.me/77064230090" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            {t("footer.love")} <span className="text-foreground">RS STUDIO</span>
          </a>
        </div>
      </div>

      {/* ПОРТАЛ ДЛЯ МОДАЛОК - ТЕПЕРЬ ОНИ БУДУТ ПОВЕРХ ВСЕГО САЙТА */}
      {mounted && createPortal(
        <AnimatePresence>
          {modalContent && (
            <div className="fixed inset-0 z-[9999] flex justify-center lg:justify-end text-foreground">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
              />
              
              <motion.div 
                initial={{ x: "100%" }} 
                animate={{ x: 0 }} 
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: smoothEase as any}}
                className="relative w-full max-w-lg h-full border-l bg-background border-border/50 shadow-2xl flex flex-col z-[10000] overflow-hidden"
              >
                  <div className="sticky top-0 bg-background/90 backdrop-blur-xl border-b border-border/50 p-6 sm:p-8 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3 font-bold text-xl">
                      {modalContent === "faq" && <HelpCircle size={22} className="text-red-500" />}
                      {modalContent === "review" && <MessageSquarePlus size={22} className="text-red-500" />}
                      {(modalContent === "privacy" || modalContent === "terms" || modalContent === "dpa") && <FileText size={22} className="text-muted-foreground" />}
                      
                      <span>
                        {modalContent === "faq" && "FAQ"}
                        {modalContent === "review" && t("review_form.title")}
                        {modalContent === "privacy" && t("docs.privacy")}
                        {modalContent === "terms" && t("docs.terms")}
                        {modalContent === "dpa" && t("docs.dpa")}
                      </span>
                    </div>
                    <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-transparent border border-border flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 overflow-y-auto flex-grow text-[15px] leading-relaxed text-muted-foreground space-y-8 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                    
                    {(modalContent === "privacy" || modalContent === "terms" || modalContent === "dpa") && (
                      <>
                        <p className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-4">{t("docs.updated")}</p>
                        
                        {modalContent === "privacy" && (
                          <div className="space-y-6">
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.privacy_1_title")}</h4><p>{t("docs.privacy_1_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.privacy_2_title")}</h4><p>{t("docs.privacy_2_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.privacy_3_title")}</h4><p>{t("docs.privacy_3_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.privacy_4_title")}</h4><p>{t("docs.privacy_4_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.privacy_5_title")}</h4><p>{t("docs.privacy_5_desc")}</p></section>
                          </div>
                        )}
                        {modalContent === "terms" && (
                          <div className="space-y-6">
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.terms_1_title")}</h4><p>{t("docs.terms_1_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.terms_2_title")}</h4><p>{t("docs.terms_2_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.terms_3_title")}</h4><p>{t("docs.terms_3_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.terms_4_title")}</h4><p>{t("docs.terms_4_desc")}</p></section>
                          </div>
                        )}
                        {modalContent === "dpa" && (
                          <div className="space-y-6">
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.dpa_1_title")}</h4><p>{t("docs.dpa_1_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.dpa_2_title")}</h4><p>{t("docs.dpa_2_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.dpa_3_title")}</h4><p>{t("docs.dpa_3_desc")}</p></section>
                            <section><h4 className="text-foreground font-bold mb-2">{t("docs.dpa_4_title")}</h4><p>{t("docs.dpa_4_desc")}</p></section>
                          </div>
                        )}
                      </>
                    )}

                    {modalContent === "faq" && (
                      <Accordion type="single" collapsible className="w-full flex flex-col">
                        {FAQList.map(({ question, answer, value }) => (
                          <AccordionItem key={value} value={value} className="border-border/50">
                            <AccordionTrigger className="text-left font-bold text-[15px] sm:text-[16px] py-4 hover:no-underline hover:text-red-500 text-foreground transition-colors">
                              {question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-[14px] sm:text-[15px] pb-6">
                              {answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}

                    {modalContent === "review" && (
                      isSuccess ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full py-20">
                          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/30">
                            <CheckCircle2 size={40} className="text-green-500" />
                          </div>
                          <h4 className="text-2xl font-bold mb-3 uppercase text-foreground">{t("review_form.success_title")}</h4>
                          <p className="text-muted-foreground">{t("review_form.success_desc")}</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                          <p className="text-sm mb-2">{t("review_form.desc")}</p>
                          
                          <div className="relative group">
                            <input required type="text" value={name} inputMode="text" enterKeyHint="next" onChange={e => setName(e.target.value)} placeholder=" " className="peer w-full h-12 bg-transparent border-b border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors rounded-none" />
                            <label className="absolute left-0 -top-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-red-600 pointer-events-none">{t("review_form.name")}</label>
                          </div>
                          
                          <div className="relative group">
                            <input required type="text" value={company} inputMode="text" enterKeyHint="next" onChange={e => setCompany(e.target.value)} placeholder=" " className="peer w-full h-12 bg-transparent border-b border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors rounded-none" />
                            <label className="absolute left-0 -top-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-red-600 pointer-events-none">{t("review_form.company")}</label>
                          </div>
                          
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">{t("review_form.rating")}</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} onClick={() => setRating(star)} className={`w-8 h-8 cursor-pointer transition-all ${rating >= star ? "fill-red-500 text-red-500 drop-shadow-sm" : "text-muted-foreground/30 hover:text-red-400 hover:scale-110"}`} />
                              ))}
                            </div>
                          </div>
                          
                          <div className="relative group mt-2">
                            <textarea required value={text} onChange={e => setText(e.target.value)} rows={4} placeholder=" " className="peer w-full bg-transparent border-b border-border text-foreground text-base placeholder-transparent focus:border-red-600 outline-none transition-colors resize-none rounded-none pt-2" />
                            <label className="absolute left-0 -top-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest transition-all peer-placeholder-shown:text-[14px] peer-placeholder-shown:text-muted-foreground/60 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-red-600 pointer-events-none">{t("review_form.text")}</label>
                          </div>
                          
                          <label className={`flex items-center justify-center gap-3 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all ${photo ? "border-red-500 bg-red-500/5" : "border-border hover:border-red-500 hover:bg-red-500/5"}`}>
                            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="hidden" />
                            <Upload size={20} className={photo ? "text-red-500" : "text-muted-foreground"} />
                            <span className={`text-sm font-bold ${photo ? "text-red-500" : "text-muted-foreground"}`}>{photo ? photo.name : t("review_form.upload")}</span>
                          </label>
                          
                          <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 uppercase tracking-widest text-[12px]">
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : t("review_form.submit")}
                          </button>
                        </form>
                      )
                    )}

                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ПЛАВАЮЩАЯ КНОПКА СВЯЗИ (Mobile FAB) */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-4 pointer-events-none">
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.5 }}
              transition={{ duration: 0.4, ease: smoothEase as any }}
              className="flex flex-col gap-3 pointer-events-auto"
            >
              <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/20 hover:scale-110 transition-transform">
                <MessageCircle size={22} />
              </a>
              <a href="tel:+77779204988" className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg shadow-white/10 hover:scale-110 transition-transform">
                <Phone size={22} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-500 pointer-events-auto ${isFabOpen ? "bg-zinc-800 rotate-[-45deg] shadow-none" : "bg-red-600 hover:bg-red-700 hover:scale-105"}`}
        >
          {isFabOpen ? <X size={24} /> : <MessageSquarePlus size={24} />}
        </button>
      </div>
    </footer>
  )
}
"use client"

import React, { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { useTranslation } from "react-i18next" 
import { Phone, MessageCircle, FileText, X, Shield, ChevronUp, HelpCircle, MessageSquarePlus, MapPin, Star, Instagram } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion, AnimatePresence } from "framer-motion"
import Magnetic from "./ui/magnetic"

const sponsors = [
  { name: "Hikvision" }, { name: "Dahua" }, { name: "Hiwatch" }, 
  { name: "Uniview" }, { name: "Tiandy" }, { name: "Ezviz" },
  { name: "Mikrotik" }, { name: "Ruijie" }, { name: "Ubiquiti" },
  { name: "WD Purple" }, { name: "Seagate Skyhawk" }, { name: "CommScope" },
]

const languages = [
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "KZ", label: "Қазақша", flag: "🇰🇿" },
  { code: "EN", label: "English", flag: "🇺🇸" },
]

type ModalType = "privacy" | "terms" | "dpa" | "faq" | null;

interface FooterProps {
  onOpenCalc: () => void;
}

export const Footer = ({ onOpenCalc }: FooterProps) => {
  const { t, i18n } = useTranslation() 
  const [modalContent, setModalContent] = useState<ModalType>(null)
  const [langOpen, setLangOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isFabOpen, setIsFabOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => { 
      document.body.style.overflow = ""
      document.body.style.touchAction = "" 
    }
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

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]

  return (
    <footer id="footer" className="relative w-full bg-transparent flex flex-col z-20">

      {/* Top divider */}
      <div className="section-divider" />

      {/* Brands marquee */}
      <div className="w-full overflow-hidden py-4 border-b border-white/[0.06]">
        <div className="relative marquee-mask">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="flex gap-14 items-center whitespace-nowrap px-8"
          >
            {[...sponsors, ...sponsors].map((brand, i) => (
              <span
                key={i}
                className="text-[10px] font-mono font-bold tracking-[0.25em] text-muted-foreground/30 uppercase hover:text-muted-foreground/60 transition-colors duration-200 cursor-default"
              >
                {brand.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="w-full mt-10">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
            
            <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center">
                  <Shield size={18} className="text-white" />
                </div>
                <span className="text-base font-black tracking-tight uppercase">
                  SBA <span className="text-muted-foreground font-medium">{t("footer.aktau", "Актау")}</span>
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[280px]">
                {t("footer.desc", "Профессиональные решения в области безопасности и IT-инфраструктуры с 2016 года.")}
              </p>
              <address className="not-italic flex items-start gap-1.5 text-[12px] text-muted-foreground/60">
                <MapPin size={11} className="mt-0.5 text-red-500/60 shrink-0" />
                <span>Микрорайон 12, Актау,<br />Мангистауская область, Казахстан</span>
              </address>

              {/* Trust row — реальные, проверяемые ссылки, а не витринные карточки */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-1">
                <a
                  href="https://share.google/6itbS8mcK09IjZrbJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Star size={13} className="fill-red-500 text-red-500 shrink-0" />
                  <span className="font-semibold text-foreground/90">{t("footer.google_rating", "5.0")}</span>
                  {t("footer.google_reviews", "19 отзывов")}
                </a>
                <a
                  href="https://www.instagram.com/toosba7292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Instagram size={13} className="text-red-500/70 shrink-0" />
                  @toosba7292
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[13px] tracking-wide text-muted-foreground">{t("footer.nav_title", "Навигация")}</h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground">
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-red-500 transition-colors">{t("nav.services", "Услуги")}</a></li>
                <li><button onClick={onOpenCalc} className="hover:text-red-500 transition-colors">{t("calc.badge", "Онлайн расчет")}</button></li>
                <li><button onClick={() => setModalContent("faq")} className="hover:text-red-500 transition-colors">FAQ</button></li>
                <li>
                  <a href="https://g.page/r/Ce2IQ5cacC8sEAE/review" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                    {t("footer.google_review", "Оставить отзыв на Google")}
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-[13px] tracking-wide text-muted-foreground">{t("footer.settings_title", "Документация")}</h4>
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground">
                <li><button onClick={() => setModalContent("privacy")} className="hover:text-red-500 transition-colors">{t("docs.privacy", "Политика конфиденциальности")}</button></li>
                <li><button onClick={() => setModalContent("terms")} className="hover:text-red-500 transition-colors">{t("docs.terms", "Пользовательское соглашение")}</button></li>
                <li><button onClick={() => setModalContent("dpa")} className="hover:text-red-500 transition-colors">{t("docs.dpa", "Обработка данных")}</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <h4 className="text-[13px] tracking-wide text-muted-foreground lg:text-right w-full">{t("footer.contacts_title", "Контакты")}</h4>
              
              <ul className="space-y-3.5 text-[13px] font-medium text-muted-foreground lg:text-right w-full mb-4">
                <li>
                  <Magnetic strength={0.1}>
                    <a href="tel:+77779204988" className="hover:text-red-500 transition-colors inline-flex items-center gap-2 justify-start lg:justify-end w-full">
                      <Phone size={12} /> +7 777 920 49 88
                    </a>
                  </Magnetic>
                </li>
                <li>
                  <Magnetic strength={0.1}>
                    <a href="https://wa.me/77064230090" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors inline-flex items-center gap-2 justify-start lg:justify-end w-full">
                      <MessageCircle size={12} /> +7 706 423 00 90
                    </a>
                  </Magnetic>
                </li>
              </ul>

              {/* Language Selector */}
              <div className="relative w-full lg:w-auto flex lg:justify-end mt-auto">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors bg-card/40 px-3 py-1.5 rounded-lg border border-border/50"
                >
                  <span className="text-sm">{activeLang.flag}</span>
                  <span>{activeLang.code}</span>
                  <ChevronUp size={12} className={`transition-transform duration-200 ${langOpen ? "" : "rotate-180"}`} />
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-0 lg:left-auto lg:right-0 mb-2 w-32 bg-background border border-border shadow-2xl z-50 p-1 rounded-xl backdrop-blur-xl"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { i18n.changeLanguage(l.code.toLowerCase()); setLangOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold hover:bg-muted transition-colors rounded-lg text-foreground uppercase tracking-wider"
                        >
                          <span className="text-base">{l.flag}</span> {l.label}
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

      {/* Copyright segment */}
      <div className="w-full border-t border-white/[0.05]">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground/40 font-medium tracking-wide">
          <p>{t("footer.copyright")}</p>
          <a href="https://wa.me/77064230090" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-muted-foreground/70 transition-colors duration-200">
            {t("footer.love")} <span className="text-muted-foreground/60">RS STUDIO</span>
          </a>
        </div>
      </div>

      {/* Modals & side drawers via Portals */}
      {mounted && createPortal(
        <AnimatePresence>
          {modalContent && (
            <div className="fixed inset-0 z-[9999] flex justify-end text-foreground overflow-hidden">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={closeDrawer}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
              />
              
              <motion.div 
                initial={{ x: "100%" }} 
                animate={{ x: 0 }} 
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: smoothEase}}
                className="relative w-full max-w-lg h-full bg-background border-l border-border/50 shadow-2xl flex flex-col z-[10000]"
              >
                  <div className="flex-shrink-0 bg-background/90 backdrop-blur-xl border-b border-border/50 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      {modalContent === "faq" && <HelpCircle size={20} className="text-red-500" />}
                      {(modalContent === "privacy" || modalContent === "terms" || modalContent === "dpa") && <FileText size={20} className="text-muted-foreground" />}

                      <span className="font-semibold text-lg" style={{ fontFamily: "'Source Serif 4', serif" }}>
                        {modalContent === "faq" && "FAQ"}
                        {modalContent === "privacy" && t("docs.privacy")}
                        {modalContent === "terms" && t("docs.terms")}
                        {modalContent === "dpa" && t("docs.dpa")}
                      </span>
                    </div>
                    <button onClick={closeDrawer} className="w-9 h-9 rounded-full bg-transparent border border-border flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-6 text-[14px] leading-relaxed text-muted-foreground space-y-8 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent pb-24">
                    
                    {(modalContent === "privacy" || modalContent === "terms" || modalContent === "dpa") && (
                      <>
                        <p className="text-[10px] text-muted-foreground/60 tracking-widest uppercase mb-4">{t("docs.updated")}</p>
                        
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
                            <AccordionTrigger className="text-left font-bold text-[14px] py-4 hover:no-underline hover:text-red-500 text-foreground transition-colors">
                              {question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed text-[13px] pb-6">
                              {answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}

                  </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Floating Action Button (FAB) for mobile viewports */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {isFabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              transition={{ duration: 0.3, ease: smoothEase }}
              className="flex flex-col gap-2.5 pointer-events-auto"
            >
              <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg">
                <MessageCircle size={20} />
              </a>
              <a href="tel:+77779204988" className="w-11 h-11 bg-foreground rounded-full flex items-center justify-center text-background shadow-lg">
                <Phone size={20} />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.25)] transition-all duration-300 pointer-events-auto bg-red-600`}
        >
          {isFabOpen ? <X size={20} /> : <MessageSquarePlus size={20} />}
        </button>
      </div>
    </footer>
  )
}
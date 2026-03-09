"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next" 
import { Phone, MessageCircle, FileText, X, Shield, ChevronUp } from "lucide-react"
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

export const Footer = () => {
  const { t, i18n } = useTranslation() 
  const [modalContent, setModalContent] = useState<string | null>(null)
  const [langOpen, setLangOpen] = useState(false)

  const currentLang = i18n?.language || 'ru'
  const activeLang = languages.find(l => l.code.toLowerCase() === currentLang.toLowerCase()) || languages[0]

  const closeDrawer = () => setModalContent(null)

  // === ПРИНУДИТЕЛЬНЫЙ СКРОЛЛ ДЛЯ ЯКОРЕЙ (ЧТОБЫ КНОПКИ ТОЧНО РАБОТАЛИ) ===
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Полный список FAQ
  const FAQList = [
    { question: t("faq.q1", "Сколько стоит установка видеонаблюдения?"), answer: t("faq.a1", "Стоимость проекта всегда индивидуальна. Она складывается из цены выбранного оборудования (разрешение камер, глубина архива) и сложности монтажных работ. Мы подготовим для вас 3 варианта сметы под разный бюджет в течение дня."), value: "item-1" },
    { question: t("faq.q2", "Можно ли смотреть камеры с телефона?"), answer: t("faq.a2", "Безусловно. Мы устанавливаем и настраиваем защищенное мобильное приложение, которое позволяет смотреть онлайн-трансляцию и архив записей из любой точки мира, где есть интернет."), value: "item-2" },
    { question: t("faq.q3", "Предоставляете ли вы гарантию?"), answer: t("faq.a3", "Да, мы работаем официально. Гарантия на оборудование составляет от 1 до 3 лет (в зависимости от бренда), а гарантия на наши монтажные работы — 12 месяцев."), value: "item-3" },
    { question: t("faq.q4", "Как быстро вы приступаете к работе?"), answer: t("faq.a4", "Обычно монтаж начинается в течение 2-3 рабочих дней после согласования сметы и внесения предоплаты. Небольшие объекты (до 4 камер) закрываем за один рабочий день."), value: "item-4" },
    { question: t("faq.q5", "Можно ли установить скрытое видеонаблюдение?"), answer: t("faq.a5", "Нет, установка скрытого видеонаблюдения частными лицами и организациями в РК запрещена законом. Согласно ст. 147 УК РК, использование специальных технических средств для негласного получения информации преследуется по закону. Мы устанавливаем только открытые системы с обязательным размещением предупреждающих табличек."), value: "item-5" },
    { question: t("faq.q6", "Работает ли система при отключении электричества?"), answer: t("faq.a6", "Стандартные системы зависят от сети, но мы рекомендуем установку блоков бесперебойного питания (ИБП). С ними система продолжит запись от 2 до 8 часов (в зависимости от емкости АКБ) после отключения света, что критично для безопасности в ночное время."), value: "item-6" },
    { question: t("faq.q7", "Нужно ли мне самому покупать кабели и жесткие диски?"), answer: t("faq.a7", "Нет, мы берем на себя полную комплектацию объекта «под ключ». Мы используем только специализированные жесткие диски для систем видеонаблюдения (серии WD Purple или Seagate SkyHawk), которые рассчитаны на круглосуточную перезапись 24/7, в отличие от обычных компьютерных дисков."), value: "item-7" },
    { question: t("faq.q8", "Записывает ли камера звук?"), answer: t("faq.a8", "Зависит от выбранной модели. Мы можем установить камеры со встроенными микрофонами или подключить внешние активные микрофоны. Это часто требуется на кассах или в зонах приема клиентов для контроля качества обслуживания и решения спорных ситуаций."), value: "item-8" },
    { question: t("faq.q9", "Что делать, если пропадет интернет?"), answer: t("faq.a9", "Запись не прервется. Видео будет продолжать сохраняться на локальный регистратор (NVR/DVR) или SD-карту внутри камеры. Как только интернет-соединение восстановится, вы снова сможете просматривать архив удаленно через приложение."), value: "item-9" },
    { question: t("faq.q10", "Обучаете ли вы пользоваться системой?"), answer: t("faq.a10", "Да, это обязательная часть нашей работы. После монтажа мы устанавливаем приложение на все ваши устройства, настраиваем уведомления о движении и проводим краткий инструктаж: как смотреть онлайн, как найти нужный фрагмент в архиве и как скачать его на телефон."), value: "item-10" },
  ]

  const midPoint = Math.ceil(FAQList.length / 2)
  const leftFaq = FAQList.slice(0, midPoint)
  const rightFaq = FAQList.slice(midPoint)

  return (
    <footer id="footer" className="w-full bg-background border-t border-border flex flex-col">
      
      {/* 1. УЛЬТРАТОНКАЯ БЕГУЩАЯ СТРОКА */}
      <div className="w-full border-b border-border bg-muted/10 py-2.5 overflow-hidden">
        <div className="relative flex items-center w-full mask-edges">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center whitespace-nowrap px-4"
          >
            {[...sponsors, ...sponsors].map((brand, i) => (
              <span key={i} className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground/60 uppercase hover:text-foreground transition-colors cursor-default">
                {brand.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 2. КОМПАКТНЫЙ LINEAR-STYLE FAQ */}
      <div className="w-full border-b border-border">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-16 lg:py-20">
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
              {t("faq.title1", "Частые ")} <span className="text-muted-foreground">{t("faq.title2", "вопросы")}</span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-0">
            <Accordion type="single" collapsible className="flex flex-col">
              {leftFaq.map(({ question, answer, value }) => (
                <AccordionItem key={value} value={value} className="border-border">
                  <AccordionTrigger className="text-left font-medium text-[14px] sm:text-[15px] py-4 hover:no-underline hover:text-foreground text-muted-foreground transition-colors">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground/80 leading-relaxed text-[14px] pb-5">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Accordion type="single" collapsible className="flex flex-col">
              {rightFaq.map(({ question, answer, value }) => (
                <AccordionItem key={value} value={value} className="border-border">
                  <AccordionTrigger className="text-left font-medium text-[14px] sm:text-[15px] py-4 hover:no-underline hover:text-foreground text-muted-foreground transition-colors">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground/80 leading-relaxed text-[14px] pb-5">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* 3. СТРОГАЯ СЕТКА ССЫЛОК (ВЕСЬ ЭКРАН, ОГРАНИЧЕНИЕ ПО ЦЕНТРУ) */}
      <div className="w-full border-b border-border bg-muted/5">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
            
            {/* Бренд */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center">
                  <Shield size={16} className="text-background" />
                </div>
                <span className="text-base font-bold tracking-tight uppercase">
                  SBA <span className="text-muted-foreground font-medium">Актау</span>
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[260px]">
                {t("footer.desc", "Проектирование и монтаж систем видеонаблюдения премиум-класса с 2016 года.")}
              </p>
            </div>

            {/* Меню */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{t("footer.nav_title", "Меню")}</h4>
              <ul className="space-y-3 text-[13px] font-medium text-muted-foreground">
                <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-foreground transition-colors">{t("nav.services", "Услуги")}</a></li>
                <li><a href="#projects" onClick={(e) => scrollToSection(e, 'projects')} className="hover:text-foreground transition-colors">{t("nav.projects", "Проекты")}</a></li>
                {/* ИСПРАВЛЕННАЯ КНОПКА КАЛЬКУЛЯТОРА */}
                <li><a href="#calculator" onClick={(e) => scrollToSection(e, 'calculator')} className="hover:text-foreground transition-colors">{t("calc.badge", "Калькулятор")}</a></li>
              </ul>
            </div>
              
            {/* Документы */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">{t("footer.settings_title", "Документы")}</h4>
              <ul className="space-y-3 text-[13px] font-medium text-muted-foreground">
                <li><button onClick={() => setModalContent("privacy")} className="hover:text-foreground transition-colors">{t("docs.privacy", "Конфиденциальность")}</button></li>
                <li><button onClick={() => setModalContent("terms")} className="hover:text-foreground transition-colors">{t("docs.terms", "Правила сервиса")}</button></li>
                <li><button onClick={() => setModalContent("dpa")} className="hover:text-foreground transition-colors">{t("docs.dpa", "Обработка данных")}</button></li>
              </ul>
            </div>

            {/* Контакты & Язык */}
            <div className="flex flex-col gap-4 lg:items-end col-span-2 lg:col-span-1">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider lg:text-right w-full">{t("footer.contacts_title", "Связь")}</h4>
              
              <ul className="space-y-3 text-[13px] font-medium text-muted-foreground lg:text-right w-full mb-2">
                <li>
                  <Magnetic strength={0.1}>
                    <a href="tel:+77779204988" className="hover:text-foreground transition-colors inline-flex items-center gap-2 justify-end">
                      <Phone size={12} /> +7 777 920 49 88
                    </a>
                  </Magnetic>
                </li>
                <li>
                  <Magnetic strength={0.1}>
                    <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-2 justify-end">
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </Magnetic>
                </li>
              </ul>

              {/* Язык (Минималистичный выпадающий список) */}
              <div className="relative w-full lg:w-auto flex lg:justify-end mt-auto">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="text-base">{activeLang.flag}</span>
                  <span>{activeLang.code}</span>
                  <ChevronUp size={12} className={`transition-transform duration-200 ${langOpen ? "" : "rotate-180"}`} />
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-0 lg:left-auto lg:right-0 mb-2 w-32 bg-background border border-border shadow-lg z-50 p-1 rounded-lg"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { i18n.changeLanguage(l.code.toLowerCase()); setLangOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium hover:bg-muted transition-colors rounded-md text-foreground"
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

      {/* 4. КОПИРАЙТ */}
      <div className="w-full bg-background">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-muted-foreground font-medium">
          <p>{t("footer.copyright", `© ${new Date().getFullYear()} SBA. Все права защищены.`)}</p>
          <a href="https://t.me/pashad3v" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            {t("footer.love", "Design by")} <span className="text-foreground">RS STUDIO</span>
          </a>
        </div>
      </div>

      {/* 5. МОДАЛЬНОЕ ОКНО ДЛЯ ДОКУМЕНТОВ (Оставлено чистым и минималистичным) */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-[100] flex justify-end text-foreground">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="absolute inset-0 bg-background/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg bg-background border-l border-border h-full shadow-2xl flex flex-col z-[101]"
            >
              <div className="p-6 sm:p-8 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3 font-semibold text-lg">
                  <FileText size={20} className="text-muted-foreground" />
                  <span>
                    {modalContent === "privacy" && t("docs.privacy_title", "Политика конфиденциальности")}
                    {modalContent === "terms" && t("docs.terms_title", "Условия обслуживания")}
                    {modalContent === "dpa" && t("docs.dpa_title", "Обработка данных")}
                  </span>
                </div>
                <button onClick={closeDrawer} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto flex-grow text-[14px] leading-relaxed text-muted-foreground space-y-8">
                <p className="text-xs text-muted-foreground/60">{t("docs.updated", "Обновлено: 8 марта 2026 г.")}</p>

                {modalContent === "privacy" && (
                  <div className="space-y-6">
                    <section><h4 className="text-foreground font-semibold mb-1">1. Сбор данных</h4><p>{t("docs.privacy_1_desc", "Мы собираем ФИО, номер телефона и адрес объекта исключительно для обработки заявок и оказания услуг.")}</p></section>
                    <section><h4 className="text-foreground font-semibold mb-1">2. Использование</h4><p>{t("docs.privacy_2_desc", "Данные используются для связи с клиентом, подготовки коммерческих предложений и технической поддержки.")}</p></section>
                    <section><h4 className="text-foreground font-semibold mb-1">3. Защита</h4><p>{t("docs.privacy_3_desc", "Ваши данные хранятся на защищенных серверах. Мы не передаем информацию третьим лицам без вашего согласия.")}</p></section>
                  </div>
                )}
                {modalContent === "terms" && (
                  <div className="space-y-6">
                    <section><h4 className="text-foreground font-semibold mb-1">1. Общие положения</h4><p>{t("docs.terms_1_desc", "Использование данного сайта означает ваше согласие с условиями оказания услуг компании SBA.")}</p></section>
                    <section><h4 className="text-foreground font-semibold mb-1">2. Оказание услуг</h4><p>{t("docs.terms_2_desc", "Все работы по монтажу производятся на основании отдельного договора подряда. Сайт носит ознакомительный характер.")}</p></section>
                  </div>
                )}
                {modalContent === "dpa" && (
                  <div className="space-y-6">
                    <section><h4 className="text-foreground font-semibold mb-1">1. Предмет DPA</h4><p>{t("docs.dpa_1_desc", "Соглашение регулирует обработку персональных данных (видеопотоков) в рамках систем видеонаблюдения.")}</p></section>
                    <section><h4 className="text-foreground font-semibold mb-1">2. Обязанности</h4><p>{t("docs.dpa_2_desc", "SBA обязуется обеспечить конфиденциальность доступа к серверам и ограничивать доступ сотрудников к архивам.")}</p></section>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  )
}
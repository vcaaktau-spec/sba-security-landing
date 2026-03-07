"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Phone, MessageCircle, Mail, Globe, 
  FileText, ExternalLink, X, ChevronUp,
  ShieldCheck, Scale, Lock
} from "lucide-react"
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

const FAQList = [
  {
    question: "Сколько стоит установка видеонаблюдения?",
    answer: "Стоимость проекта всегда индивидуальна. Она складывается из цены выбранного оборудования (разрешение камер, глубина архива) и сложности монтажных работ. Мы подготовим для вас 3 варианта сметы под разный бюджет в течение дня.",
    value: "item-1",
  },
  {
    question: "Можно ли смотреть камеры с телефона?",
    answer: "Безусловно. Мы устанавливаем и настраиваем защищенное мобильное приложение, которое позволяет смотреть онлайн-трансляцию и архив записей из любой точки мира, где есть интернет.",
    value: "item-2",
  },
  {
    question: "Предоставляете ли вы гарантию?",
    answer: "Да, мы работаем официально. Гарантия на оборудование составляет от 1 до 3 лет (в зависимости от бренда), а гарантия на наши монтажные работы — 12 месяцев.",
    value: "item-3",
  },
  {
    question: "Как быстро вы приступаете к работе?",
    answer: "Обычно монтаж начинается в течение 2-3 рабочих дней после согласования сметы и внесения предоплаты. Небольшие объекты (до 4 камер) закрываем за один рабочий день.",
    value: "item-4",
  },
    {
    question: "Можно ли установить скрытое видеонаблюдение?",
    answer: "Нет, установка скрытого видеонаблюдения частными лицами и организациями в РК запрещена законом. Согласно ст. 147 УК РК, использование специальных технических средств для негласного получения информации преследуется по закону. Мы устанавливаем только открытые системы с обязательным размещением предупреждающих табличек.",
    value: "item-5",
  },
    {
    question: "Работает ли система при отключении электричества?",
    answer: "Стандартные системы зависят от сети, но мы рекомендуем установку блоков бесперебойного питания (ИБП). С ними система продолжит запись от 2 до 8 часов (в зависимости от емкости АКБ) после отключения света, что критично для безопасности в ночное время.",
    value: "item-6",
  },
  {
    question: "Нужно ли мне самому покупать кабели и жесткие диски?",
    answer: "Нет, мы берем на себя полную комплектацию объекта «под ключ». Мы используем только специализированные жесткие диски для систем видеонаблюдения (серии WD Purple или Seagate SkyHawk), которые рассчитаны на круглосуточную перезапись 24/7, в отличие от обычных компьютерных дисков.",
    value: "item-7",
  },
  {
    question: "Записывает ли камера звук?",
    answer: "Зависит от выбранной модели. Мы можем установить камеры со встроенными микрофонами или подключить внешние активные микрофоны. Это часто требуется на кассах или в зонах приема клиентов для контроля качества обслуживания и решения спорных ситуаций.",
    value: "item-8",
  },
  {
    question: "Что делать, если пропадет интернет?",
    answer: "Запись не прервется. Видео будет продолжать сохраняться на локальный регистратор (NVR/DVR) или SD-карту внутри камеры. Как только интернет-соединение восстановится, вы снова сможете просматривать архив удаленно через приложение.",
    value: "item-9",
  },
  {
    question: "Обучаете ли вы пользоваться системой?",
    answer: "Да, это обязательная часть нашей работы. После монтажа мы устанавливаем приложение на все ваши устройства, настраиваем уведомления о движении и проводим краткий инструктаж: как смотреть онлайн, как найти нужный фрагмент в архиве и как скачать его на телефон.",
    value: "item-10",
  },
]

const languages = [
  { code: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "KZ", label: "Қазақша", flag: "🇰🇿" },
  { code: "EN", label: "English", flag: "🇺🇸" },
]

export const Footer = () => {
  const [langOpen, setLangOpen] = useState(false)
  const [activeLang, setActiveLang] = useState(languages[0])
  const [modalContent, setModalContent] = useState<string | null>(null)

  const closeDrawer = () => setModalContent(null)

  return (
    <footer id="footer" className="relative bg-background border-t border-border">
      
      {/* 1. ULTRA-THIN BRANDS MARQUEE */}
      <div className="py-1 border-b border-border/40 bg-muted/10">
        <div className="relative overflow-hidden flex h-8 items-center">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 items-center whitespace-nowrap px-10"
          >
            {[...sponsors, ...sponsors].map((brand, i) => (
              <span key={i} className="text-xs font-bold tracking-widest text-muted-foreground/40 uppercase">
                {brand.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 2. FAQ SECTION (COMPACT) */}
      <div className="container px-4 py-20 border-b border-border/40">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Вопрос<span className="text-red-600 ml-2">Ответ</span>
            </h2>
            <p className="text-muted-foreground font-medium">Кратко о самом важном</p>
          </div>
          
          <Accordion type="single" collapsible className="grid md:grid-cols-2 gap-x-12 gap-y-2">
            {FAQList.map(({ question, answer, value }) => (
              <AccordionItem key={value} value={value} className="border-none">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline py-4 px-4 rounded-xl hover:bg-muted/50 transition-all">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground px-4 pt-2 pb-4 leading-relaxed border-l-2 border-red-600/20 ml-4 mt-1">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* 3. MAIN FOOTER CONTENT */}
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-black tracking-tighter uppercase leading-none">
                Система безопасности
              </span>
              <span className="text-red-600 font-black tracking-tighter uppercase text-2xl leading-none">
                Актау
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              Профессиональные решения в области безопасности и IT-инфраструктуры с 2016 года.
            </p>
          </div>

          {/* Navigation Col */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Навигация</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><a href="#services" className="hover:text-red-600 transition-colors">Услуги</a></li>
              <li><a href="#projects" className="hover:text-red-600 transition-colors">Проекты</a></li>
              <li><a href="#statistics" className="hover:text-red-600 transition-colors">О компании</a></li>
              <li><a href="#cta" className="hover:text-red-600 transition-colors">Связаться</a></li>
            </ul>
          </div>

          {/* Contacts Col */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Контакты</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+77779204988" className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Phone size={14} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">+7 777 920 49 88</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/77779204988" className="flex items-center gap-3 group text-green-600 dark:text-green-500">
                  <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center transition-all group-hover:bg-green-600 group-hover:text-white">
                    <MessageCircle size={14} />
                  </div>
                  <span className="text-sm font-bold tracking-tight uppercase">WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Settings & Links Col */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Настройки</h4>
            <div className="flex flex-col gap-4">
              {/* Language Switcher */}
              <div className="relative">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border hover:border-red-500/30 transition-all text-sm font-bold"
                >
                  <span>{activeLang.flag}</span>
                  <span>{activeLang.code}</span>
                  <ChevronUp size={14} className={`transition-transform duration-300 ${langOpen ? "" : "rotate-180"}`} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 w-32 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => { setActiveLang(l); setLangOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold hover:bg-muted transition-colors border-b border-border last:border-0"
                        >
                          <span>{l.flag}</span> {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">
                <button onClick={() => setModalContent("privacy")} className="text-left hover:text-red-600 transition-colors flex items-center gap-2">
                  <Lock size={12}/> Privacy Policy
                </button>
                <button onClick={() => setModalContent("terms")} className="text-left hover:text-red-600 transition-colors flex items-center gap-2">
                  <Scale size={12}/> Terms of Service
                </button>
                <button onClick={() => setModalContent("dpa")} className="text-left hover:text-red-600 transition-colors flex items-center gap-2">
                  <FileText size={12}/> DPA Agreement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FINAL FOOTNOTE */}
      <div className="border-t border-border/40 py-8 bg-muted/5">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground/50">
          <p>© {new Date().getFullYear()} ТОО "СИСТЕМА БЕЗОПАСНОСТИ АКТАУ". ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          
          <a 
            href="/" 
            target="_blank" 
            className="flex items-center gap-2 group hover:text-foreground transition-all duration-500"
          >
            С любовью от 
            <span className="text-foreground group-hover:text-red-600 transition-colors relative">
              RS STUDIO
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-500" />
            </span>
          </a>
        </div>
      </div>

      {/* 5. DRAWER MODAL FOR DOCUMENTS */}
      <AnimatePresence>
  {modalContent && (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={closeDrawer}
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-xl bg-background border-l border-border h-full shadow-2xl flex flex-col"
      >
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3 font-black uppercase tracking-tighter text-xl">
            <FileText className="text-red-600" />
            {modalContent === "privacy" && "Privacy Policy"}
            {modalContent === "terms" && "Terms of Service"}
            {modalContent === "dpa" && "DPA Agreement"}
          </div>
          <button onClick={closeDrawer} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:scale-110 transition-transform">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-grow text-sm leading-relaxed text-muted-foreground space-y-6 scrollbar-thin scrollbar-thumb-red-600">
          <p className="font-bold text-foreground italic">Последнее обновление: 8 марта 2026 г.</p>

          {/* PRIVACY POLICY */}
          {modalContent === "privacy" && (
            <div className="space-y-4">
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">1. Сбор данных</h4>
                <p>Мы собираем ФИО, номер телефона и адрес объекта исключительно для обработки заявок и оказания услуг по установке систем безопасности.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">2. Использование данных</h4>
                <p>Данные используются для связи с клиентом, подготовки коммерческих предложений и технической поддержки установленного оборудования.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">3. Защита информации</h4>
                <p>Ваши данные хранятся на защищенных серверах. Мы не передаем информацию третьим лицам, за исключением случаев, предусмотренных законодательством РК.</p>
              </section>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {modalContent === "terms" && (
            <div className="space-y-4">
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">1. Общие положения</h4>
                <p>Использование данного сайта означает ваше согласие с условиями оказания услуг компании SBA.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">2. Оказание услуг</h4>
                <p>Все работы по монтажу и настройке систем производятся на основании отдельного договора подряда. Информация на сайте носит ознакомительный характер.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">3. Ответственность</h4>
                <p>SBA не несет ответственности за перебои в работе систем, вызванные отсутствием интернета на стороне клиента или неисправностью стороннего оборудования.</p>
              </section>
            </div>
          )}

          {/* DPA AGREEMENT */}
          {modalContent === "dpa" && (
            <div className="space-y-4">
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">1. Предмет DPA</h4>
                <p>Настоящее соглашение регулирует обработку персональных данных (включая видеопотоки) в рамках эксплуатации систем видеонаблюдения.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">2. Обязанности обработчика</h4>
                <p>SBA обязуется обеспечить конфиденциальность доступа к облачным сервисам видеомониторинга и ограничивать доступ сотрудников к архивам клиента.</p>
              </section>
              <section>
                <h4 className="text-foreground font-bold uppercase text-xs mb-2">3. Биометрические данные</h4>
                <p>Клиент подтверждает, что получил согласие субъектов (сотрудников/посетителей) на ведение видеосъемки на объекте согласно Закону РК «О персональных данных».</p>
              </section>
            </div>
          )}

          <div className="pt-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-widest opacity-50">
              Документация подготовлена для проекта «Система Безопасности Актау» группой разработки RS STUDIO.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
    </footer>
  )
}
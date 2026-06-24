"use client"

import { Link } from "react-router-dom"
import { Shield, ChevronRight, MessageCircle, Phone, Camera, Wifi, Flame, Bell, Zap, Building2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { ServiceLayout } from "@/components/ServiceLayout"
import { usePageSeo } from "@/hooks/usePageSeo"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const included = [
  { icon: Flame, text: "Датчики дыма, тепла и пламени сертифицированных производителей" },
  { icon: Bell, text: "Приёмно-контрольные приборы (ППК) с выводом на пульт охраны" },
  { icon: AlertTriangle, text: "Световые и звуковые оповещатели для эвакуации персонала" },
  { icon: Zap, text: "Модули GSM/GPRS — уведомление на телефон при срабатывании" },
  { icon: Building2, text: "Системы оповещения и управления эвакуацией (СОУЭ) любого уровня" },
  { icon: CheckCircle2, text: "Техническое обслуживание и плановые проверки по договору" },
]

const objectTypes = [
  { label: "Торговые помещения и рестораны", desc: "скрытая установка, интеграция с противопожарными шторами" },
  { label: "Офисные здания", desc: "зонирование эвакуации, оповещение по этажам" },
  { label: "Склады и производства", desc: "пожарный извещатель каждые 25 м², ввод в ПОЖО" },
  { label: "Жилые комплексы", desc: "системы СОУЭ 1–3 уровней, дымоудаление" },
]

const steps = [
  { n: "01", title: "Обследование", desc: "Определяем категорию объекта и класс пожарной опасности." },
  { n: "02", title: "Проект", desc: "Разрабатываем схему размещения датчиков согласно СП 5.13130." },
  { n: "03", title: "Монтаж", desc: "Скрытая прокладка кабеля, установка датчиков и ППК." },
  { n: "04", title: "Сдача", desc: "Проверка всех зон, акт о вводе в эксплуатацию, инструктаж." },
]

const related = [
  { to: "/uslugi/videonahljudenie", label: "Видеонаблюдение", icon: Camera },
  { to: "/uslugi/skud", label: "СКУД", icon: Shield },
  { to: "/uslugi/seti", label: "Корпоративные сети", icon: Wifi },
]

export const Signalizaciya = () => {
  usePageSeo({
    title: "Монтаж охранно-пожарной сигнализации в Актау | SBA Security",
    description: "Установка охранно-пожарной сигнализации и систем оповещения в Актау. Датчики дыма, ППК, GSM-уведомления. Гарантия и техобслуживание.",
    canonical: "https://toosba.kz/uslugi/signalizaciya",
  })

  return (
    <ServiceLayout>

      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-xs text-muted-foreground/60" aria-label="Навигация">
        <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
        <ChevronRight size={11} />
        <span>Услуги</span>
        <ChevronRight size={11} />
        <span className="text-foreground">Сигнализация</span>
      </nav>

      <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-[1px] bg-red-500/70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-500">Пожарная защита</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-foreground">
            Охранно-пожарная<br />
            <span className="text-red-600 dark:text-red-500">сигнализация</span><br />
            в Актау
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            Проектирование и монтаж охранно-пожарной сигнализации и систем оповещения (СОУЭ) для объектов
            любого класса пожарной опасности. Работаем в соответствии со строительными нормами Казахстана.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md shadow-red-600/15">
              <MessageCircle size={14} />Написать в WhatsApp
            </a>
            <a href="tel:+77779204988" className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-border hover:border-red-500/40 text-muted-foreground hover:text-foreground transition-all">
              <Phone size={13} />+7 777 920 49 88
            </a>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">Что входит в услугу</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {included.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20 hover:border-red-500/20 hover:bg-card/40 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <Icon size={15} />
                </div>
                <p className="text-sm text-muted-foreground leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">Объекты</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {objectTypes.map((o) => (
              <div key={o.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border/40 bg-card/20">
                <Flame size={15} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-foreground">{o.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">Как мы работаем</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-3">
                <span className="text-4xl font-black font-mono text-red-600/30 dark:text-red-500/25 leading-none">{s.n}</span>
                <div>
                  <div className="font-bold text-foreground mb-1">{s.title}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-red-600 p-10 sm:p-14 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Получить консультацию</h2>
                <p className="text-red-100/80 text-sm">Подберём систему под ваш объект и класс пожарной опасности.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-white text-red-600 hover:bg-red-50 transition-colors">
                  <MessageCircle size={14} />WhatsApp
                </a>
                <a href="tel:+77779204988" className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
                  <Phone size={13} />Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/30 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">Другие услуги SBA</p>
          <div className="flex flex-wrap gap-3">
            {related.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card/30 hover:border-red-500/30 hover:bg-card/60 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                <Icon size={13} className="text-red-500" />{label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}

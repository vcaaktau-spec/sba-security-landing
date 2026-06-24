"use client"

import { Link } from "react-router-dom"
import { Shield, ChevronRight, MessageCircle, Phone, Camera, Wifi, Server, Network, Router, Cable, MonitorCheck, Layers } from "lucide-react"
import { motion } from "framer-motion"
import { ServiceLayout } from "@/components/ServiceLayout"
import { usePageSeo } from "@/hooks/usePageSeo"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const included = [
  { icon: Wifi, text: "Проектирование и монтаж корпоративных Wi-Fi сетей (MikroTik, Ubiquiti, Ruijie)" },
  { icon: Cable, text: "Прокладка структурированной кабельной системы (СКС) — витая пара, оптика" },
  { icon: Router, text: "Настройка маршрутизаторов, коммутаторов, VLAN и межсетевых экранов" },
  { icon: Server, text: "Монтаж серверных стоек и серверных помещений (ЦОД-lite)" },
  { icon: MonitorCheck, text: "Мониторинг сети и удалённое администрирование по договору" },
  { icon: Layers, text: "Интеграция с системами видеонаблюдения и СКУД по IP" },
]

const objectTypes = [
  { label: "Офисы и бизнес-центры", desc: "бесшовный Wi-Fi роуминг, гостевые сети, VLAN по отделам" },
  { label: "Торговые центры и рестораны", desc: "зоны для клиентов, POS-терминалы, видеоаналитика" },
  { label: "Склады и производства", desc: "промышленный Wi-Fi для сканеров, терминалов сбора данных" },
  { label: "Жилые комплексы", desc: "домовые сети, IPTV, управление доступом через IP" },
]

const steps = [
  { n: "01", title: "Аудит и проект", desc: "Изучаем планировку, радиопомехи, количество устройств и нагрузку." },
  { n: "02", title: "Смета", desc: "Подбираем оборудование под бюджет: MikroTik, Ubiquiti, Ruijie или Cisco." },
  { n: "03", title: "Монтаж", desc: "Прокладываем кабель, устанавливаем точки доступа и настраиваем оборудование." },
  { n: "04", title: "Сдача", desc: "Тест покрытия, замер скоростей, документация и обучение IT-специалиста." },
]

const brands = ["MikroTik", "Ubiquiti", "Ruijie", "Huawei", "CommScope", "Panduit"]

const related = [
  { to: "/uslugi/videonahljudenie", label: "Видеонаблюдение", icon: Camera },
  { to: "/uslugi/skud", label: "СКУД", icon: Shield },
  { to: "/uslugi/signalizaciya", label: "Пожарная сигнализация", icon: Network },
]

export const Seti = () => {
  usePageSeo({
    title: "Монтаж корпоративных сетей Wi-Fi в Актау | SBA Security",
    description: "Проектирование и монтаж корпоративных Wi-Fi сетей и СКС в Актау. MikroTik, Ubiquiti, Ruijie. Настройка маршрутизаторов, серверных, VLAN.",
    canonical: "https://toosba.kz/uslugi/seti",
  })

  return (
    <ServiceLayout>

      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-xs text-muted-foreground/60" aria-label="Навигация">
        <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
        <ChevronRight size={11} />
        <span>Услуги</span>
        <ChevronRight size={11} />
        <span className="text-foreground">Корпоративные сети</span>
      </nav>

      <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-[1px] bg-red-500/70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-500">IT-инфраструктура</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-foreground">
            Корпоративные<br />
            <span className="text-red-600 dark:text-red-500">сети и Wi-Fi</span><br />
            в Актау
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            Проектируем и строим надёжную IT-инфраструктуру для бизнеса: структурированные кабельные системы
            (СКС), корпоративный Wi-Fi, серверные комнаты и интеграция с системами безопасности.
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

      <section className="border-t border-border/20 py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">Работаем с оборудованием</p>
          <div className="flex flex-wrap gap-3">
            {brands.map((b) => (
              <span key={b} className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border/50 bg-card/30 text-muted-foreground">{b}</span>
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
                <Wifi size={15} className="text-red-500 mt-0.5 shrink-0" />
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
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Обсудить проект сети</h2>
                <p className="text-red-100/80 text-sm">Расскажите о задаче — подберём оборудование под ваш бюджет.</p>
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

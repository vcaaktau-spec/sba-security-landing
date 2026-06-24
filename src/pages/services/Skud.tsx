"use client"

import { Link } from "react-router-dom"
import { Shield, ChevronRight, MessageCircle, Phone, Camera, Wifi, Key, Users, Clock, Building2, Lock, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { ServiceLayout } from "@/components/ServiceLayout"
import { usePageSeo } from "@/hooks/usePageSeo"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const included = [
  { icon: Key, text: "Магнитные замки и электромеханические защёлки для всех типов дверей" },
  { icon: Lock, text: "Считыватели карт, брелоков, отпечатков пальцев и QR-кодов" },
  { icon: Users, text: "Учёт рабочего времени — отчёты о приходах/уходах сотрудников" },
  { icon: BarChart3, text: "Турникеты и шлагбаумы для въезда на территорию" },
  { icon: Building2, text: "Интеграция СКУД с системой видеонаблюдения" },
  { icon: Clock, text: "Программное обеспечение для управления доступом и отчётности" },
]

const objectTypes = [
  { label: "Офисы и бизнес-центры", desc: "контроль доступа по этажам и отделам" },
  { label: "Склады и логистика", desc: "зональный доступ, шлагбаумы, учёт времени" },
  { label: "Производственные предприятия", desc: "турникеты, биометрия, противоразрывная защита" },
  { label: "Жилые комплексы", desc: "домофоны IP, запись звонков, управление с телефона" },
]

const steps = [
  { n: "01", title: "Анализ объекта", desc: "Изучаем планировку, количество точек доступа и требования к зонированию." },
  { n: "02", title: "Проект и смета", desc: "Подбираем оборудование под задачи: карты, биометрия или мобильный доступ." },
  { n: "03", title: "Монтаж", desc: "Устанавливаем замки, считыватели, прокладываем кабель скрытым способом." },
  { n: "04", title: "Настройка ПО", desc: "Создаём базу сотрудников, уровни доступа и первые отчёты." },
]

const related = [
  { to: "/uslugi/videonahljudenie", label: "Видеонаблюдение", icon: Camera },
  { to: "/uslugi/signalizaciya", label: "Пожарная сигнализация", icon: Shield },
  { to: "/uslugi/seti", label: "Корпоративные сети", icon: Wifi },
]

export const Skud = () => {
  usePageSeo({
    title: "Монтаж СКУД в Актау — системы контроля доступа | SBA Security",
    description: "Установка систем контроля и управления доступом (СКУД) в Актау. Магнитные замки, считыватели, турникеты, учёт рабочего времени. Гарантия 12 месяцев.",
    canonical: "https://toosba.kz/uslugi/skud",
  })

  return (
    <ServiceLayout>

      {/* Breadcrumb */}
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-xs text-muted-foreground/60" aria-label="Навигация">
        <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
        <ChevronRight size={11} />
        <span>Услуги</span>
        <ChevronRight size={11} />
        <span className="text-foreground">СКУД</span>
      </nav>

      {/* Hero */}
      <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-[1px] bg-red-500/70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-500">Безопасный доступ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-foreground">
            Монтаж СКУД<br />
            <span className="text-red-600 dark:text-red-500">в Актау</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            Системы контроля и управления доступом (СКУД) для офисов, складов и производственных предприятий.
            Ограничиваем доступ в зоны, ведём учёт рабочего времени и интегрируем с видеонаблюдением.
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

      {/* What's included */}
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

      {/* Object types */}
      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">Объекты</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {objectTypes.map((o) => (
              <div key={o.label} className="flex items-start gap-3 p-5 rounded-2xl border border-border/40 bg-card/20">
                <Shield size={15} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-foreground">{o.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
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

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-red-600 p-10 sm:p-14 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Рассчитать стоимость СКУД</h2>
                <p className="text-red-100/80 text-sm">Бесплатный выезд инженера и смета за 10 минут.</p>
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

      {/* Related */}
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

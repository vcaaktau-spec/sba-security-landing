"use client"

import { Link } from "react-router-dom"
import { Camera, CheckCircle2, ChevronRight, MessageCircle, Phone, Shield, Wifi, Server, Eye, Wrench, Star } from "lucide-react"
import { motion } from "framer-motion"
import { ServiceLayout } from "@/components/ServiceLayout"
import { usePageSeo } from "@/hooks/usePageSeo"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const included = [
  { icon: Camera, text: "Монтаж IP и аналоговых камер (CCTV) любой сложности" },
  { icon: Server, text: "Установка DVR/NVR-регистраторов с жёсткими дисками WD Purple / Seagate SkyHawk" },
  { icon: Wifi, text: "Настройка удалённого доступа через смартфон (iVMS-4500, DMSS, SmartPSS)" },
  { icon: Eye, text: "Скрытая прокладка кабеля — без торчащих проводов и строительного мусора" },
  { icon: Shield, text: "Настройка детекции движения и push-уведомлений на телефон" },
  { icon: Wrench, text: "Обучение и гарантия 12 месяцев на монтажные работы" },
]

const brands = ["Hikvision", "Dahua", "HiWatch", "Tiandy", "Ezviz", "Uniview"]

const objectTypes = [
  { label: "Частный дом / квартира", desc: "от 2 до 8 камер, удалённый просмотр" },
  { label: "Магазин / торговая точка", desc: "охват кассы, входа, склада" },
  { label: "Офис / бизнес-центр", desc: "СКУД + видеонаблюдение, интеграция" },
  { label: "Склад / производство", desc: "широкоугольные и PTZ-камеры, архив 30+ дней" },
]

const steps = [
  { n: "01", title: "Бесплатный выезд", desc: "Инженер осматривает объект и предлагает оптимальные точки установки." },
  { n: "02", title: "Смета за 10 минут", desc: "Три варианта по бюджету: эконом, оптимальный, премиум." },
  { n: "03", title: "Монтаж за 1–3 дня", desc: "Небольшие объекты — один рабочий день. Большие — до трёх." },
  { n: "04", title: "Сдача и обучение", desc: "Ставим приложение на все ваши устройства, объясняем работу системы." },
]

const related = [
  { to: "/uslugi/skud", label: "СКУД в Актау", icon: Shield },
  { to: "/uslugi/signalizaciya", label: "Пожарная сигнализация", icon: Star },
  { to: "/uslugi/seti", label: "Корпоративные сети", icon: Wifi },
]

export const Videonahljudenie = () => {
  usePageSeo({
    title: "Установка видеонаблюдения в Актау — под ключ | SBA Security",
    description: "Монтаж IP и CCTV видеонаблюдения в Актау. Hikvision, Dahua, Tiandy. Бесплатный выезд инженера, смета за 10 минут, гарантия 12 месяцев.",
    canonical: "https://toosba.kz/uslugi/videonahljudenie",
  })

  return (
    <ServiceLayout>

      {/* Breadcrumb */}
      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-xs text-muted-foreground/60" aria-label="Навигация">
        <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
        <ChevronRight size={11} />
        <span>Услуги</span>
        <ChevronRight size={11} />
        <span className="text-foreground">Видеонаблюдение</span>
      </nav>

      {/* Hero */}
      <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-[1px] bg-red-500/70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-500">
              Установка под ключ
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-foreground">
            Установка<br />
            <span className="text-red-600 dark:text-red-500">видеонаблюдения</span><br />
            в Актау
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            Профессиональный монтаж IP‑камер и аналоговых систем CCTV любой сложности — от одной камеры в квартире
            до распределённых корпоративных комплексов. Работаем с 2016 года, выполнено 300+ объектов в Актау и
            Мангистауской области.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md shadow-red-600/15"
            >
              <MessageCircle size={14} />
              Написать в WhatsApp
            </a>
            <a
              href="tel:+77779204988"
              className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-border hover:border-red-500/40 text-muted-foreground hover:text-foreground transition-all"
            >
              <Phone size={13} />
              +7 777 920 49 88
            </a>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="grid grid-cols-3 gap-4 mt-14 max-w-lg"
        >
          {[
            { value: "300+", label: "Объектов" },
            { value: "5 000+", label: "Камер" },
            { value: "12 мес", label: "Гарантия" },
          ].map((s) => (
            <div key={s.label} className="border border-border/50 rounded-xl p-4 bg-card/30 backdrop-blur-sm">
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-[11px] font-mono text-muted-foreground/70 mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* What's included */}
      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">
            Что входит в услугу
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {included.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20 hover:border-red-500/20 hover:bg-card/40 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <Icon size={15} />
                </div>
                <p className="text-sm text-muted-foreground leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-10 border-t border-border/20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">
            Работаем с оборудованием
          </p>
          <div className="flex flex-wrap gap-3">
            {brands.map((b) => (
              <span
                key={b}
                className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border/50 bg-card/30 text-muted-foreground"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Object types */}
      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">
            Типы объектов
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {objectTypes.map((o) => (
              <div
                key={o.label}
                className="flex items-start gap-3 p-5 rounded-2xl border border-border/40 bg-card/20"
              >
                <CheckCircle2 size={16} className="text-red-500 mt-0.5 shrink-0" />
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
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">
            Как мы работаем
          </h2>
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
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  Бесплатный выезд инженера
                </h2>
                <p className="text-red-100/80 text-sm">
                  Подберём оптимальное решение под ваш объект и бюджет — без давления и скрытых платежей.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-white text-red-600 hover:bg-red-50 transition-colors"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a
                  href="tel:+77779204988"
                  className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors"
                >
                  <Phone size={13} />
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="border-t border-border/30 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">
            Другие услуги SBA
          </p>
          <div className="flex flex-wrap gap-3">
            {related.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card/30 hover:border-red-500/30 hover:bg-card/60 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <Icon size={13} className="text-red-500" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}

"use client"

import { AlertTriangle, ShieldCheck, ExternalLink, Flame, Eye, Lock, Zap } from "lucide-react"
import { motion } from "framer-motion"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Category = "fire" | "cctv" | "theft" | "electrical"

interface IncidentCard {
  category: Category
  Icon: React.ElementType
  categoryLabel: string
  date: string
  location: string
  impactStat: string
  impactUnit: string
  headline: string
  problemPoints: string[]
  sbaPoints: string[]
  newsSource: string
  newsLink: string
}

const categoryStyle: Record<Category, { badge: string; statColor: string; iconBg: string }> = {
  fire:       { badge: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400",        statColor: "text-red-600 dark:text-red-400",    iconBg: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" },
  cctv:       { badge: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-400", statColor: "text-orange-600 dark:text-orange-400", iconBg: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  theft:      { badge: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400", statColor: "text-amber-700 dark:text-amber-400", iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  electrical: { badge: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400",   statColor: "text-amber-700 dark:text-amber-400",  iconBg: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
}

const incidents: IncidentCard[] = [
  {
    category: "fire",
    Icon: Flame,
    categoryLabel: "ПОЖАРНАЯ СИГНАЛИЗАЦИЯ",
    date: "25 марта 2018",
    location: "Кемерово, Россия",
    impactStat: "64",
    impactUnit: "погибших",
    headline: "«Зимняя Вишня»: пожар в ТЦ унёс 64 жизни из-за отключённой сигнализации",
    problemPoints: [
      "Арендаторы отключили пожарную сигнализацию, чтобы она не мешала работе.",
      "Оповещение не активировалось — люди узнали о пожаре слишком поздно.",
      "Камеры вели запись, но никто не следил за мониторами в реальном времени.",
      "Двери эвакуационных выходов были заблокированы.",
    ],
    sbaPoints: [
      "АУПС с защитой от отключения: сигнализацию нельзя выключить без авторизованного персонала.",
      "Автоматический звонок в МЧС при первом срабатывании датчика дыма.",
      "24/7 видеомониторинг с тревожными уведомлениями на телефон владельца.",
      "Интеграция с системой контроля доступа: аварийное разблокирование всех выходов.",
    ],
    newsSource: "BBC Русская служба",
    newsLink: "https://www.bbc.com/russian/news-43506603",
  },
  {
    category: "cctv",
    Icon: Eye,
    categoryLabel: "ВИДЕОНАБЛЮДЕНИЕ",
    date: "2021–2023",
    location: "Казахстан",
    impactStat: "6 000+",
    impactUnit: "камер взломано",
    headline: "Массовый взлом IP-камер: частная жизнь тысяч казахстанцев оказалась в открытом доступе",
    problemPoints: [
      "Дешёвые камеры с заводскими паролями admin/admin взломаны ботнетами.",
      "Трансляции из жилых комнат, офисов и детских садов попали в интернет.",
      "Отсутствие шифрования: видеопоток перехватывался без авторизации.",
      "Производители прекратили поддержку — прошивки не обновлялись годами.",
    ],
    sbaPoints: [
      "Обязательная смена паролей и настройка изолированной подсети VLAN при установке.",
      "Только сертифицированное оборудование Hikvision, Dahua, Uniview — с актуальными прошивками.",
      "Шифрование видеопотока AES-256; доступ только через VPN.",
      "Регулярный аудит безопасности и обновление прошивок в рамках договора обслуживания.",
    ],
    newsSource: "Zakon.kz",
    newsLink: "https://www.zakon.kz/sobytiya/6008892-bolee-6-tysyach-kamer-vzlomali-khakery-v-kazakhstane-kak-obezopasit-sebya.html",
  },
  {
    category: "theft",
    Icon: Lock,
    categoryLabel: "ОХРАНА ПЕРИМЕТРА",
    date: "2023",
    location: "Алматы, Казахстан",
    impactStat: "200 млн ₸",
    impactUnit: "ущерб",
    headline: "Кража со склада в Алматы: злоумышленники заранее изучили мёртвые зоны камер",
    problemPoints: [
      "Дешёвые камеры установлены без проектирования — образовались слепые зоны до 30%.",
      "Низкое разрешение 720p: изображение не позволяет идентифицировать лица ночью.",
      "Отсутствовали датчики движения по периметру и тревожная сигнализация.",
      "Видеорегистратор находился в незащищённом месте — злоумышленники уничтожили записи.",
    ],
    sbaPoints: [
      "3D-моделирование расстановки камер: нулевые слепые зоны, покрытие 100% периметра.",
      "Камеры 4К с ИК-подсветкой до 50 м — чёткая идентификация лиц даже ночью.",
      "Датчики движения + тревожная сирена + мгновенное уведомление владельцу на телефон.",
      "NVR в антивандальном корпусе + резервная копия в защищённом облаке.",
    ],
    newsSource: "Tengrinews.kz",
    newsLink: "https://tengrinews.kz/crime/krupnuyu-kraju-so-sklada-raskryili-v-almatyi-508544/",
  },
  {
    category: "electrical",
    Icon: Zap,
    categoryLabel: "ПОЖАРНАЯ БЕЗОПАСНОСТЬ",
    date: "Актуально",
    location: "СНГ — ежегодно",
    impactStat: "70%",
    impactUnit: "пожаров от КЗ проводки",
    headline: "Дешёвый кабель CCA — причина 70% пожаров от короткого замыкания по данным МЧС РК",
    problemPoints: [
      "Алюминиевый кабель CCA (омедненный) перегревается под нагрузкой и окисляется.",
      "Установщики-любители прокладывают кабель без гофры и защитных каналов.",
      "Блоки питания без предохранителей: при КЗ оплавляются и воспламеняются.",
      "Нет ни одного датчика дыма — возгорание обнаруживается слишком поздно.",
    ],
    sbaPoints: [
      "Только медный кабель высокой очистки по ГОСТ — без алюминиевых аналогов.",
      "Прокладка строго в негорючей гофре или кабель-канале с защитой от механических повреждений.",
      "Блоки питания с защитой от КЗ, перегрева и грозовых разрядов.",
      "Установка дымовых датчиков и АУПС даже при монтаже видеонаблюдения.",
    ],
    newsSource: "МЧС РК / Zakon.kz",
    newsLink: "https://www.zakon.kz/obshestvo/6011400-korotkoe-zamykanie-v-provodke-kak-izbezhat-pozhara-rekomendatsii-mchs.html",
  },
]

export const PainSection = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200/60 dark:border-white/[0.06]">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-red-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">

        {/* ── SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in"
          >
            <AlertTriangle size={12} className="animate-pulse" />
            Реальные случаи из СНГ
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5"
          >
            Какова реальная цена{" "}
            <span className="text-red-600 dark:text-red-500">экономии на безопасности?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Четыре реальных инцидента, каждый из которых можно было предотвратить с профессиональной системой безопасности. Ссылки на источники прилагаются.
          </motion.p>
        </div>

        {/* ── NEWS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {incidents.map((item, idx) => {
            const style = categoryStyle[item.category]
            const Icon = item.Icon

            return (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 44 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.75, delay: idx * 0.1, ease }}
                className="news-card-hover group relative flex flex-col bg-white dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.015)] dark:shadow-none transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:hover:border-white/[0.12]"
              >
                {/* Top gradient accent line */}
                <div className={`h-px w-full ${
                  item.category === "fire" ? "bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
                  : item.category === "cctv" ? "bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
                  : item.category === "theft" ? "bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"
                  : "bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"
                }`} />

                <div className="flex flex-col gap-5 p-6 sm:p-7 flex-1">

                  {/* Card header: category + date/location */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider border ${style.badge}`}>
                      <Icon size={11} />
                      {item.categoryLabel}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-tight">{item.date}</div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-tight">{item.location}</div>
                    </div>
                  </div>

                  {/* Impact metric */}
                  <div className="flex items-baseline gap-2.5">
                    <span className={`text-[52px] sm:text-[60px] font-black tracking-tight leading-none tabular-nums ${style.statColor}`}>
                      {item.impactStat}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                      {item.impactUnit}
                    </span>
                  </div>

                  {/* Incident headline */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {item.headline}
                  </h3>

                  {/* Problem vs SBA comparison */}
                  <div className="space-y-3 mt-auto">

                    {/* What went wrong */}
                    <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/20 border border-red-100 dark:border-red-950/30">
                      <div className="flex items-center gap-2 mb-2.5">
                        <AlertTriangle size={13} className="text-red-600 dark:text-red-400 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Что пошло не так</span>
                      </div>
                      <ul className="space-y-1.5">
                        {item.problemPoints.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/30 dark:bg-red-400/30 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* SBA solution */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950/30">
                      <div className="flex items-center gap-2 mb-2.5">
                        <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Как SBA предотвращает это</span>
                      </div>
                      <ul className="space-y-1.5">
                        {item.sbaPoints.map((point, pi) => (
                          <li key={pi} className="flex items-start gap-2 text-[12px] sm:text-[13px] text-slate-700 dark:text-slate-300 leading-snug">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/30 dark:bg-emerald-400/30 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* News source link */}
                  <a
                    href={item.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex items-center gap-2.5 pt-4 border-t border-slate-150 dark:border-white/[0.06] text-[11px] font-mono text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <ExternalLink size={11} className="shrink-0 group-hover/link:text-red-500 dark:group-hover/link:text-red-400 transition-colors" />
                    <span className="font-bold uppercase tracking-wider">Источник:</span>
                    <span>{item.newsSource}</span>
                    <span className="ml-auto text-slate-300 dark:text-slate-650">→ читать новость</span>
                  </a>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* ── BOTTOM HOOK ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-slate-200 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.02] text-sm text-slate-600 dark:text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
            Профессиональная система безопасности — это инвестиция, которая окупается в первый же инцидент.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

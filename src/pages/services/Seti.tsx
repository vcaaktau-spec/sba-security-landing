"use client"

import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Shield, ChevronRight, MessageCircle, Phone, Camera, Wifi, Server, Network, Router, Cable, MonitorCheck, Layers } from "lucide-react"
import { motion } from "framer-motion"
import { ServiceLayout } from "@/components/ServiceLayout"
import { usePageSeo } from "@/hooks/usePageSeo"

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const includedIcons = [Wifi, Cable, Router, Server, MonitorCheck, Layers]
const relatedLinks = [
  { to: "/uslugi/videonahljudenie", icon: Camera },
  { to: "/uslugi/skud", icon: Shield },
  { to: "/uslugi/signalizaciya", icon: Network },
]
const brands = ["MikroTik", "Ubiquiti", "Ruijie", "Huawei", "CommScope", "Panduit"]

type Step = { title: string; desc: string }
type ObjectType = { label: string; desc: string }

export const Seti = () => {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === "en"
  const path = isEn ? "/en/uslugi/seti" : "/uslugi/seti"
  const homePath = isEn ? "/en" : "/"

  usePageSeo({
    title: t("service_pages.seti.seo_title"),
    description: t("service_pages.seti.seo_desc"),
    canonical: `https://toosba.kz${path}`,
  })

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("service_pages.common.breadcrumb_home"), item: `https://toosba.kz${homePath}` },
      { "@type": "ListItem", position: 2, name: t("service_pages.seti.breadcrumb_current") },
    ],
  }
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: t("service_pages.seti.breadcrumb_current"),
    name: t("service_pages.seti.seo_title"),
    description: t("service_pages.seti.seo_desc"),
    provider: { "@type": "Organization", "@id": "https://toosba.kz/#organization" },
    areaServed: { "@type": "City", name: "Актау" },
    url: `https://toosba.kz${path}`,
  }

  const included = includedIcons.map((icon, i) => ({
    icon,
    text: (t("service_pages.seti.included", { returnObjects: true }) as string[])[i],
  }))
  const steps = t("service_pages.seti.steps", { returnObjects: true }) as Step[]
  const objectTypes = t("service_pages.seti.object_types", { returnObjects: true }) as ObjectType[]
  const relatedLabels = t("service_pages.seti.related", { returnObjects: true }) as string[]
  const related = relatedLinks.map((r, i) => ({ ...r, label: relatedLabels[i] }))

  return (
    <ServiceLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <nav className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 flex items-center gap-1.5 text-xs text-muted-foreground/60" aria-label={t("service_pages.common.breadcrumb_nav")}>
        <Link to={homePath} className="hover:text-foreground transition-colors">{t("service_pages.common.breadcrumb_home")}</Link>
        <ChevronRight size={11} />
        <span>{t("service_pages.common.breadcrumb_services")}</span>
        <ChevronRight size={11} />
        <span className="text-foreground">{t("service_pages.seti.breadcrumb_current")}</span>
      </nav>

      <section className="relative max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 pb-16">
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-3xl">
          <div className="flex items-center gap-2.5 mb-5">
            <span className="w-7 h-[1px] bg-red-500/70" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-red-600 dark:text-red-500">{t("service_pages.seti.eyebrow")}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.08] mb-6 text-foreground">
            {t("service_pages.seti.h1_line1")}<br />
            <span className="text-red-600 dark:text-red-500">{t("service_pages.seti.h1_accent")}</span><br />
            {t("service_pages.seti.h1_line3")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-8">
            {t("service_pages.seti.intro")}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md shadow-red-600/15">
              <MessageCircle size={14} />{t("service_pages.common.whatsapp_long")}
            </a>
            <a href="tel:+77779204988" className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-border hover:border-red-500/40 text-muted-foreground hover:text-foreground transition-all">
              <Phone size={13} />+7 777 920 49 88
            </a>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">{t("service_pages.common.included_title")}</h2>
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
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">{t("service_pages.common.equipment_title")}</p>
          <div className="flex flex-wrap gap-3">
            {brands.map((b) => (
              <span key={b} className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg border border-border/50 bg-card/30 text-muted-foreground">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/30 py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">{t("service_pages.seti.object_types_title")}</h2>
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
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-10 text-foreground">{t("service_pages.common.process_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col gap-3">
                <span className="text-4xl font-black font-mono text-red-600/30 dark:text-red-500/25 leading-none">{String(i + 1).padStart(2, "0")}</span>
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
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">{t("service_pages.seti.cta_title")}</h2>
                <p className="text-red-100/80 text-sm">{t("service_pages.seti.cta_desc")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href="https://wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl bg-white text-red-600 hover:bg-red-50 transition-colors">
                  <MessageCircle size={14} />{t("service_pages.common.whatsapp_short")}
                </a>
                <a href="tel:+77779204988" className="inline-flex items-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
                  <Phone size={13} />{t("service_pages.common.call")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/30 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground/50 mb-5">{t("service_pages.common.related_title")}</p>
          <div className="flex flex-wrap gap-3">
            {related.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={isEn ? `/en${to}` : to} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/50 bg-card/30 hover:border-red-500/30 hover:bg-card/60 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                <Icon size={13} className="text-red-500" />{label}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </ServiceLayout>
  )
}

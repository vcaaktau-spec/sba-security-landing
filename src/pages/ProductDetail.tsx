"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronRight, Loader2, MessageCircle, Minus, PackageSearch, Phone, Plus, ShoppingCart } from "lucide-react"
import { ServiceLayout } from "@/components/ServiceLayout"
import { CATEGORY_LABELS, type Product } from "@/lib/catalog"
import { useCart } from "@/contexts/CartContext"
import { usePageSeo } from "@/hooks/usePageSeo"

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === "en"
  const homePath = isEn ? "/en" : "/"
  const catalogPath = isEn ? "/en/katalog" : "/katalog"
  const { getQty, addItem, setQty } = useCart()
  // undefined = ещё грузится, null = не найден/неактивен
  const [product, setProduct] = useState<Product | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return
        const items: Product[] = Array.isArray(data?.items) ? data.items : []
        setProduct(items.find((p) => p.id === id && p.active) ?? null)
      })
      .catch(() => {
        if (!cancelled) setProduct(null)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const priceLabel = product ? `${product.basePrice.toLocaleString("ru-RU")} ₸` : ""
  const path = isEn ? `/en/katalog/${id}` : `/katalog/${id}`

  usePageSeo({
    title: product
      ? t("service_pages.common.product_seo_title", { name: product.name })
      : t("service_pages.common.product_seo_title_missing"),
    description: product
      ? t("service_pages.common.product_seo_desc", { name: `${product.name}${product.brand ? ` (${product.brand})` : ""}`, price: priceLabel })
      : t("service_pages.common.product_seo_desc_missing"),
    canonical: `https://toosba.kz${path}`,
  })

  if (product === undefined) {
    return (
      <ServiceLayout>
        <div className="flex items-center justify-center gap-2 py-32 text-muted-foreground text-sm">
          <Loader2 className="animate-spin" size={18} /> {t("service_pages.common.product_loading")}
        </div>
      </ServiceLayout>
    )
  }

  if (product === null) {
    return (
      <ServiceLayout>
        <div className="flex flex-col items-center justify-center gap-3 py-32 text-muted-foreground text-sm text-center">
          <PackageSearch size={28} />
          {t("service_pages.common.product_not_found")}
          <Link to={catalogPath} className="text-red-600 dark:text-red-400 font-semibold hover:underline">
            {t("service_pages.common.product_back_to_catalog")}
          </Link>
        </div>
      </ServiceLayout>
    )
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    category: CATEGORY_LABELS[product.category],
    offers: {
      "@type": "Offer",
      url: `https://toosba.kz/katalog/${product.id}`,
      priceCurrency: "KZT",
      price: product.basePrice,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "SBA Security" },
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("service_pages.common.breadcrumb_home"), item: `https://toosba.kz${homePath}` },
      { "@type": "ListItem", position: 2, name: t("service_pages.common.breadcrumb_catalog"), item: `https://toosba.kz${catalogPath}` },
      { "@type": "ListItem", position: 3, name: CATEGORY_LABELS[product.category] },
      { "@type": "ListItem", position: 4, name: product.name },
    ],
  }

  return (
    <ServiceLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-8 flex-wrap" aria-label={t("service_pages.common.breadcrumb_nav")}>
          <Link to={homePath} className="hover:text-foreground transition-colors">{t("service_pages.common.breadcrumb_home")}</Link>
          <ChevronRight size={11} />
          <Link to={catalogPath} className="hover:text-foreground transition-colors">{t("service_pages.common.breadcrumb_catalog")}</Link>
          <ChevronRight size={11} />
          <span>{CATEGORY_LABELS[product.category]}</span>
          <ChevronRight size={11} />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
          <div>
            {product.imageUrl && (
              <div className="w-full max-w-sm aspect-square mb-6 rounded-2xl overflow-hidden bg-slate-50 dark:bg-white/[0.03] border border-border/50">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
              </div>
            )}
            {product.brand && (
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">
                {product.brand}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
              {product.name}
            </h1>

            {Object.keys(product.specs).length > 0 && (
              <div className="border border-border/50 rounded-2xl overflow-hidden">
                {Object.entries(product.specs).map(([label, value], i) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${i % 2 === 1 ? "bg-card/30" : ""}`}
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-6 max-w-md">
              {t("service_pages.common.product_note")}
            </p>
          </div>

          <div className="md:sticky md:top-24 h-fit border border-border/50 rounded-2xl p-5 bg-card/20">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{t("service_pages.common.price_label")}</span>
              <span className="text-2xl font-extrabold text-foreground">{priceLabel}</span>
            </div>

            {getQty(product.id) === 0 ? (
              <button
                onClick={() => addItem(product.id)}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold uppercase tracking-wide text-foreground hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors mb-3"
              >
                <ShoppingCart size={14} /> {t("service_pages.common.add_to_cart")}
              </button>
            ) : (
              <div className="flex items-center justify-between h-11 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06] px-1.5 mb-3">
                <button
                  onClick={() => setQty(product.id, getQty(product.id) - 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                  aria-label={t("service_pages.common.qty_decrease")}
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold tabular-nums text-red-600 dark:text-red-400">{getQty(product.id)} {t("service_pages.common.in_cart_suffix")}</span>
                <button
                  onClick={() => addItem(product.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-white/[0.06] transition-colors"
                  aria-label={t("service_pages.common.qty_increase")}
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            <a
              href="https://wa.me/77779204988"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold uppercase tracking-wide transition-colors mb-2"
            >
              <MessageCircle size={14} /> {t("service_pages.common.check_availability")}
            </a>
            <a
              href="tel:+77779204988"
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-border text-xs font-mono font-bold uppercase tracking-wide text-muted-foreground hover:text-foreground hover:border-red-500/40 transition-all"
            >
              <Phone size={13} /> +7 777 920 49 88
            </a>
          </div>
        </div>
      </div>
    </ServiceLayout>
  )
}

import { load } from "cheerio"

export type BarlauCategory = "cctv" | "network" | "access" | "fire"

export interface BarlauScrapeResult {
  id: string
  category: BarlauCategory
  _reviewCategory: boolean
  environment: "indoor" | "outdoor" | "universal"
  name: string
  brand: string | null
  imageUrl: null
  specs: Record<string, string>
  basePrice: number
  active: true
  sortOrder: number
  _sourceUrl: string
  _description: string
}

const CATEGORY_KEYWORDS: Array<[RegExp, BarlauCategory]> = [
  [/скуд|контрол[а-я]*\s*доступ|турникет|шлагбаум/i, "access"],
  [/пожар/i, "fire"],
  [/сет(ь|евое)|коммутатор|роутер/i, "network"],
  [/видеонаблюд|камер|регистратор|nvr|dvr/i, "cctv"],
]

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function slugFromUrl(sourceUrl: string): string {
  const path = new URL(sourceUrl).pathname.replace(/\/$/, "")
  const last = path.split("/").pop()
  return last && last.length > 0 ? last : "unknown"
}

function parsePriceText(text: string): number {
  // Drop a trailing ,XX or .XX kopeck/cent group before stripping non-digits — tenge
  // doesn't use fractional units in practice, so discarding (not preserving) is correct.
  const withoutFraction = text.replace(/[.,]\d{2}(?!\d)/, "")
  const digits = withoutFraction.replace(/[^\d]/g, "")
  const value = digits.length > 0 ? parseInt(digits, 10) : NaN
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Could not parse a valid price from text: "${text}"`)
  }
  return value
}

function guessCategory(breadcrumbs: string[]): { category: BarlauCategory; reviewNeeded: boolean } {
  // Most specific crumb first: a product's own leaf category should win over a generic
  // ancestor category (e.g. "Оборудование" as root vs. "Видеонаблюдение" as leaf).
  for (const crumb of [...breadcrumbs].reverse()) {
    for (const [pattern, category] of CATEGORY_KEYWORDS) {
      if (pattern.test(crumb)) {
        return { category, reviewNeeded: false }
      }
    }
  }
  return { category: "cctv", reviewNeeded: true }
}

export function parseBarlauProduct(html: string, sourceUrl: string): BarlauScrapeResult {
  const $ = load(html)

  const name = normalizeWhitespace($("#pagetitle").first().text())
  if (!name) {
    throw new Error(
      "Could not find product name (#pagetitle) — page structure may have changed or this isn't a product page",
    )
  }

  const nameParts = name.split(",")
  const brand = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() || null : null

  const articul = normalizeWhitespace($('[data-role="article.value"]').first().text())

  const discountPriceText = $('[data-role="price.discount"]').first().text()
  const basePriceText = $('[data-role="price.base"]').first().text()
  const priceText = discountPriceText.trim().length > 0 ? discountPriceText : basePriceText
  if (priceText.trim().length === 0) {
    throw new Error("Could not find a price element on this page")
  }
  const basePrice = parsePriceText(priceText)

  const propNames = $(".catalog-element-property-name")
    .map((_, el) => normalizeWhitespace($(el).text()))
    .get()
  const propValues = $(".catalog-element-property-value")
    .map((_, el) => normalizeWhitespace($(el).text()))
    .get()
  if (propNames.length !== propValues.length) {
    throw new Error(
      `Property name/value count mismatch: ${propNames.length} names vs ${propValues.length} values — page structure may have changed`,
    )
  }
  const specs: Record<string, string> = {}
  propNames.forEach((propName, i) => {
    if (propName) specs[propName] = propValues[i]
  })

  const description = normalizeWhitespace($(".catalog-element-section-description").first().text())

  const breadcrumbs = $('.breadcrumb-item [itemprop="name"]')
    .map((_, el) => normalizeWhitespace($(el).text()))
    .get()
  const { category, reviewNeeded } = guessCategory(breadcrumbs)

  const id = `barlau-${articul.length > 0 ? articul : slugFromUrl(sourceUrl)}`

  return {
    id,
    category,
    _reviewCategory: reviewNeeded,
    environment: "universal",
    name,
    brand,
    imageUrl: null,
    specs,
    basePrice,
    active: true,
    sortOrder: 0,
    _sourceUrl: sourceUrl,
    _description: description,
  }
}

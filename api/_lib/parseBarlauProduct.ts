import { load } from "cheerio"

// Разбор карточки товара и страниц-листингов категорий barlau.kz — общая
// логика для регулярного фонового наполнения каталога (api/cron/sync-catalog.ts).
// Сознательно НЕ переиспользует scripts/lib/parseBarlauProduct.ts — тот файл
// заточен под ручной review-инструмент (вывод JSON с `_`-полями для
// человека), этот — под прямую запись в таблицу `products`.

export interface ParsedBarlauProduct {
  name: string
  brand: string | null
  specs: Record<string, string>
  basePrice: number
  sourceUrl: string
  articul: string | null
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

// Изредка на самом barlau.kz в поле характеристики попадает внутренний GUID
// элемента Bitrix вместо значения (наблюдалось на "Вес единицы кг." одной
// карточки) — не наша ошибка парсинга, а мусор в источнике. Отбрасываем
// значение целиком, а не показываем его как реальную характеристику.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isLikelyGarbageValue(value: string): boolean {
  return UUID_PATTERN.test(value)
}

function parsePriceText(text: string): number {
  const digits = text.replace(/[^\d]/g, "")
  const value = digits.length > 0 ? parseInt(digits, 10) : NaN
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Could not parse a valid price from text: "${text}"`)
  }
  return value
}

export function parseBarlauProductPage(html: string, sourceUrl: string): ParsedBarlauProduct {
  const $ = load(html)

  const name = normalizeWhitespace($("#pagetitle").first().text())
  if (!name) {
    throw new Error("Could not find product name (#pagetitle) — page structure may have changed")
  }

  const nameParts = name.split(",")
  const brand = nameParts.length > 1 ? nameParts[nameParts.length - 1].trim() || null : null

  const articulText = normalizeWhitespace($('[data-role="article.value"]').first().text())
  const articul = articulText.length > 0 ? articulText : null

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
  const specs: Record<string, string> = {}
  if (propNames.length === propValues.length) {
    propNames.forEach((propName, i) => {
      if (propName && !isLikelyGarbageValue(propValues[i])) specs[propName] = propValues[i]
    })
  }

  return { name, brand, specs, basePrice, sourceUrl, articul }
}

// Ссылки на карточки товара с одной страницы листинга категории
// (`.catalog-section-item-name-wrapper` — подтверждено на реальных страницах
// barlau.kz, см. docs/superpowers/plans/2026-08-11-barlau-catalog-sync.md).
export function extractCategoryProductLinks(html: string, origin: string): string[] {
  const $ = load(html)
  const hrefs = $(".catalog-section-item-name-wrapper")
    .map((_, el) => $(el).attr("href"))
    .get()
    .filter((href): href is string => Boolean(href))
  return [...new Set(hrefs.map((href) => new URL(href, origin).toString()))]
}

// Последний номер страницы пагинации (?PAGEN_1=N) на странице листинга,
// 1 если пагинации нет.
export function extractMaxPageNumber(html: string): number {
  const matches = [...html.matchAll(/PAGEN_1=(\d+)/g)].map((m) => parseInt(m[1], 10))
  return matches.length > 0 ? Math.max(...matches) : 1
}

# Barlau.kz Product Scrape Helper — Design

## Context

The catalog work in `.wednesday/plans/PLAN.md` (Phase 0) assumes the new `products` catalog is seeded manually — 10-15 items to start, 30-60 for promo launch (`.wednesday/plans/PLAN.md` §5, §10 assumption 1). `BRIEF.md` and `.wednesday/plans/security.md` §1.5 explicitly flagged scraping barlau.kz to *auto-populate a public catalog (with photos)* as out of scope and a distinct, more reputation-sensitive risk than the existing (disabled) `equipment_prices` price-cache overlay used by the old calculator.

This spec is **not** that. It's a narrow developer tool to remove the tedious part of manual entry — retyping specs/price/description off a barlau.kz product page — while keeping a human in the loop for everything that carries risk (final wording, category assignment, and product photography).

## Goal

Given one barlau.kz product URL, produce a reviewable JSON object shaped like the existing `Product` type (`src/lib/catalog.ts`), so a person can eyeball it and paste it into `catalogSeed.ts` (or later, Neon via Drizzle Studio).

## Non-goals

- No crawling of category/listing pages or the whole site.
- No image downloading or hotlinking of barlau.kz photos — `imageUrl` is always emitted as `null`; the operator sources HiWatch/Hikvision's own official product photo separately.
- No automatic writes to the database or to `catalogSeed.ts`.
- No scheduling/cron/auto-refresh. This is a manually-invoked, one-URL-at-a-time tool.

## Approach

New standalone script: `scripts/scrape-barlau.ts`, run via `pnpm scrape:barlau <product-url>`.

1. Validate the URL host is `barlau.kz`.
2. `fetch()` the page (confirmed server-rendered — Bitrix/Intec template, price/specs/description present in the raw HTML, no JS execution needed).
3. Parse with `cheerio` (new dependency) using the site's existing class names:
   - Name: `#pagetitle`
   - Price: first `[data-role="price.base"]`, strip `&nbsp;`/`₸`, parse to integer
   - Specs: merge `.catalog-element-property-name`/`-value` (quick panel) and `.catalog-element-section-property-name`/`-value` (full characteristics tab) into `Record<string, string>`
   - Description: `.catalog-element-section-description` text, whitespace-normalized
   - Articul/SKU: text near "Артикул"
   - Category guess: match breadcrumb text against keywords (видеонаблюдение→cctv, скуд/доступ→access, пожар→fire, сет­ь→network); if no match, still emit the item with `category: "cctv"` as a placeholder and set `_reviewCategory: true` so it's obviously not final
4. Print the resulting object as formatted JSON to stdout. No file writes.
5. Errors (non-200, host mismatch, missing required fields) exit non-zero with a clear message — no silent partial output.

## Output shape

```json
{
  "id": "barlau-<articul-or-slug>",
  "category": "cctv",
  "_reviewCategory": false,
  "environment": "universal",
  "name": "DS-I203(E) (2.8mm), IP Камера, купольная, HiWatch",
  "brand": "HiWatch",
  "imageUrl": null,
  "specs": { "Тип устройства": "IP Камера, купольная", "Количество шт в коробке": "27", "Вес единицы кг.": "0.54", "Срок гарантии": "3 года", "Размер единицы мм": "150x150x140" },
  "basePrice": 16900,
  "active": true,
  "sortOrder": 0,
  "_sourceUrl": "https://barlau.kz/catalog/ip_kupolnye_videokamery/ds_i203_e_2_8mm/",
  "_description": "Разрешение: 2.0MP ... (full free-text description block, contains the real technical specs — resolution, lens, IR range, etc.)"
}
```

Fields prefixed `_` are review metadata, not part of the `Product` type — the operator strips them when copying the entry into `catalogSeed.ts`.

**Note on `specs` vs `_description` (corrected after implementation):** on barlau.kz's Bitrix template, the "characteristics" tab (`.catalog-element-section-property-*`) duplicates the same handful of logistics fields already shown in the quick panel (`.catalog-element-property-*`) — verified byte-identical on the reference product page. The real technical specs (resolution, lens, IR range, protocol, etc.) exist ONLY as a pipe-delimited free-text block, captured in `_description`. An earlier draft of this doc's example showed `"Разрешение"` inside `specs`, implying it was structurally extractable — it isn't, on this template. The operator is expected to read `_description` and hand-copy the relevant technical specs into `catalogSeed.ts`'s `specs` object themselves; parsing the pipe-delimited text automatically was considered and deferred as out of scope (format isn't guaranteed consistent across categories, and this is meant to stay a thin, low-maintenance tool).

## Risk boundary (why this stays out of the flagged risk zone)

- Output never touches the live site automatically — it's a CLI artifact a person reviews.
- No images are sourced from barlau.kz, addressing the exact concern raised in `security.md` §1.5 (photos of someone else's product cards ending up in a public catalog).
- Specs/price are factual data (resolution, dimensions, IP rating, current price) — not creative content; the free-text description is captured for reference only, expected to be rewritten in the operator's own words before going into `catalogSeed.ts`, not copy-pasted verbatim.
- Single on-demand request per invocation — no bulk crawling, no load concerns, respects `robots.txt` (product pages under `/catalog/` are not disallowed).

## Testing

Manual: run against the DS-I203(E) URL from this conversation, confirm output matches the values visible in the browser screenshot (name, price 16 900 ₸, specs table, description block). No automated test suite needed for a one-off dev script.

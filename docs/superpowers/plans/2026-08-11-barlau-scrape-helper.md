# Barlau.kz Scrape Helper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CLI dev script that fetches one barlau.kz product page and prints a reviewable JSON object (shaped like `src/lib/catalog.ts`'s `Product` type) so a person can hand-copy it into `catalogSeed.ts` instead of retyping specs/price off the page.

**Architecture:** Two new files under `scripts/`. A pure parser (`scripts/lib/parseBarlauProduct.ts`) takes raw HTML + source URL and returns a plain object — no I/O, easy to reason about in isolation. A thin CLI (`scripts/scrape-barlau.ts`) handles argv, host validation, the actual `fetch()`, and error reporting, then calls the parser and prints its result. Run via `pnpm scrape:barlau <url>`.

**Tech Stack:** Node 22 (global `fetch`), `tsx` (run `.ts` directly, no build step), `cheerio` (HTML parsing — the barlau.kz product page is fully server-rendered Bitrix markup, confirmed no JS execution needed).

## Global Constraints

- One product URL per invocation. No crawling of listing/category pages, no bulk mode. (spec: Non-goals)
- `imageUrl` is always emitted as `null`. Never read or output an image URL from barlau.kz. (spec: Non-goals, Risk boundary)
- No writes to the database or to `catalogSeed.ts` — stdout only. (spec: Non-goals)
- No scheduling/cron — manually invoked only. (spec: Non-goals)
- Reject any URL whose host isn't `barlau.kz` or `www.barlau.kz` before making a network request. (spec: Approach step 1)
- On any failure (bad host, non-200 response, missing required fields), exit non-zero with a clear message — never print partial/guessed output. (spec: Approach step 5)

---

### Task 1: Add scraping dependencies and the npm script entry

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `cheerio` and `tsx` available as devDependencies; `pnpm scrape:barlau <url>` runnable from repo root.

- [ ] **Step 1: Add `cheerio` and `tsx` to devDependencies**

In `package.json`, the `devDependencies` block currently reads (alphabetical order kept):

```json
  "devDependencies": {
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.12.0",
    "@typescript-eslint/parser": "^7.12.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "dotenv": "^17.3.1",
    "drizzle-kit": "^0.31.9",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.38",
    "react-snap": "^1.23.0",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.2.13"
  }
```

Change it to (inserting `cheerio` after `autoprefixer` and `tsx` after `typescript`, keeping alphabetical order):

```json
  "devDependencies": {
    "@types/cheerio": "^0.22.35",
    "@types/node": "^20.14.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.12.0",
    "@typescript-eslint/parser": "^7.12.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "cheerio": "^1.0.0",
    "dotenv": "^17.3.1",
    "drizzle-kit": "^0.31.9",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.38",
    "react-snap": "^1.23.0",
    "tailwindcss": "^3.4.4",
    "tsx": "^4.19.2",
    "typescript": "^5.4.5",
    "vite": "^5.2.13"
  }
```

(`cheerio` 1.x ships its own TypeScript types, so `@types/cheerio` is a no-op stub some lockfiles still pull in transitively — if `pnpm add` doesn't add it on its own, that's fine, skip it. The install step below is the source of truth, not this hand-written snippet.)

- [ ] **Step 2: Add the `scrape:barlau` script**

In the same file, the `scripts` block currently reads:

```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "postbuild": "node -e \"if(!process.env.VERCEL && !process.env.CI){require('child_process').execSync('react-snap',{stdio:'inherit'})}else{console.log('react-snap: skipped in CI')}\"",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
```

Add one line:

```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "postbuild": "node -e \"if(!process.env.VERCEL && !process.env.CI){require('child_process').execSync('react-snap',{stdio:'inherit'})}else{console.log('react-snap: skipped in CI')}\"",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "scrape:barlau": "tsx scripts/scrape-barlau.ts"
  },
```

- [ ] **Step 3: Install**

Run: `pnpm install`
Expected: lockfile updates (`pnpm-lock.yaml` diff shows `cheerio` and `tsx` added), exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add cheerio/tsx for barlau.kz scrape helper script"
```

---

### Task 2: Parser + CLI

**Files:**
- Create: `scripts/lib/parseBarlauProduct.ts`
- Create: `scripts/scrape-barlau.ts`
- Modify: `.eslintrc.cjs`

**Interfaces:**
- Consumes: `cheerio` (`load` export), Node global `fetch`/`URL`.
- Produces: `parseBarlauProduct(html: string, sourceUrl: string): BarlauScrapeResult` and the `BarlauScrapeResult`/`BarlauCategory` types, both exported from `scripts/lib/parseBarlauProduct.ts`, consumed only by `scripts/scrape-barlau.ts`.

- [ ] **Step 1: Write the parser module**

Create `scripts/lib/parseBarlauProduct.ts`:

```typescript
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
  const digits = text.replace(/[^\d]/g, "")
  const value = digits.length > 0 ? parseInt(digits, 10) : NaN
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Could not parse a valid price from text: "${text}"`)
  }
  return value
}

function guessCategory(breadcrumbs: string[]): { category: BarlauCategory; reviewNeeded: boolean } {
  for (const crumb of breadcrumbs) {
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
```

- [ ] **Step 2: Write the CLI wrapper**

Create `scripts/scrape-barlau.ts`:

```typescript
import { parseBarlauProduct } from "./lib/parseBarlauProduct"

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"

async function main(): Promise<void> {
  const url = process.argv[2]
  if (!url) {
    console.error("Usage: pnpm scrape:barlau <barlau.kz product URL>")
    process.exit(1)
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    console.error(`Not a valid URL: ${url}`)
    process.exit(1)
    return
  }

  if (parsedUrl.hostname !== "barlau.kz" && parsedUrl.hostname !== "www.barlau.kz") {
    console.error(`Expected a barlau.kz URL, got host "${parsedUrl.hostname}"`)
    process.exit(1)
    return
  }

  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } })
  if (!response.ok) {
    console.error(`Fetch failed: HTTP ${response.status} ${response.statusText}`)
    process.exit(1)
    return
  }

  const html = await response.text()

  try {
    const result = parseBarlauProduct(html, url)
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    console.error(`Failed to parse product page: ${(err as Error).message}`)
    process.exit(1)
  }
}

main()
```

- [ ] **Step 3: Verify against the real product page (positive case)**

Run: `pnpm scrape:barlau https://barlau.kz/catalog/ip_kupolnye_videokamery/ds_i203_e_2_8mm/`

Expected: prints a JSON object to stdout, exit code 0, with (values confirmed by hand against the live page on 2026-08-11 — re-check against the live page if barlau.kz has since changed its listing):
- `"id": "barlau-311322930"`
- `"category": "cctv"`
- `"_reviewCategory": false`
- `"name": "DS-I203(E) (2.8mm), IP Камера, купольная , HiWatch"`
- `"brand": "HiWatch"`
- `"imageUrl": null`
- `"basePrice": 16900`
- `"specs"` includes `"Тип устройства": "IP Камера, купольная"`, `"Количество шт в коробке": "27"`, `"Вес единицы кг.": "0.54"`, `"Срок гарантии": "3 года"`, `"Размер единицы мм": "150x150x140"`
- `"_description"` starts with `"Разрешение:"` and contains `"Битрейт"` and `"Кодек"`
- `"_sourceUrl"` equals the URL passed on the command line

If the price or specs differ from the above, that reflects barlau.kz's current listing (price/stock genuinely change) — treat a total *absence* of a field (empty specs, missing price) as the real failure signal, not a numeric mismatch.

- [ ] **Step 4: Verify the negative path (wrong host)**

Run: `pnpm scrape:barlau https://example.com/some-page`
Expected: stderr prints `Expected a barlau.kz URL, got host "example.com"`, exit code 1, no stdout JSON.

- [ ] **Step 5: Verify the negative path (missing argument)**

Run: `pnpm scrape:barlau`
Expected: stderr prints `Usage: pnpm scrape:barlau <barlau.kz product URL>`, exit code 1.

- [ ] **Step 6: Add a Node environment override for `scripts/` in ESLint config**

The project's `.eslintrc.cjs` sets `env: { browser: true, es2020: true }` for the whole repo (correct for `src/`, which runs in the browser). `scripts/scrape-barlau.ts` and `scripts/lib/parseBarlauProduct.ts` use Node globals (`process`, `URL`, `fetch` as a Node global rather than a DOM one) that `browser: true` doesn't declare, which would otherwise fail ESLint's `no-undef` rule (from `eslint:recommended`). `.eslintrc.cjs` currently reads:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

Change it to add an `overrides` entry scoped to `scripts/**/*.ts`:

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      files: ['scripts/**/*.ts'],
      env: { node: true, browser: false },
    },
  ],
}
```

- [ ] **Step 7: Lint**

Run: `pnpm lint`
Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add scripts/lib/parseBarlauProduct.ts scripts/scrape-barlau.ts .eslintrc.cjs
git commit -m "feat: add barlau.kz single-product scrape helper script"
```

---

## Self-Review Notes

- **Spec coverage:** URL validation (Task 2 Step 2), fetch without headless browser (Task 2 Step 2), cheerio selectors for name/price/specs/description/breadcrumbs (Task 2 Step 1, all verified live against the actual page), category guess with `_reviewCategory` flag (Task 2 Step 1), `imageUrl` always `null` (Task 2 Step 1), JSON-to-stdout only / no DB or file writes (Task 2 Step 2), error handling exits non-zero with clear messages (Task 2 Steps 2, 4, 5) — all covered.
- **Placeholder scan:** none — every step has complete, runnable code and concrete expected output.
- **Type consistency:** `BarlauScrapeResult`/`BarlauCategory` defined once in `parseBarlauProduct.ts` and only imported (not redefined) in `scrape-barlau.ts`.

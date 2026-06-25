# Hero Blueprint Reveal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Hero section with a scroll-driven "Blueprint Reveal" — an SVG floor plan that draws itself as the user scrolls, with the copy and CTA on the left.

**Architecture:** A 150vh wrapper div gives the sticky inner container room to run `useScroll`. A new `FloorPlan` component owns all SVG logic and accepts Framer Motion `MotionValue` props so the parent `Hero` controls the timeline. Hero.tsx becomes a layout file; FloorPlan.tsx is a pure rendering component.

**Tech Stack:** React 18, TypeScript, Framer Motion 11 (`useScroll`, `useTransform`, `motion.path`, `motion.g`), Tailwind CSS, react-i18next.

## Global Constraints

- Light theme is default; dark is user-toggled via `next-themes` — use `dark:` Tailwind variants everywhere.
- Translations live in `src/i18n.ts` as an inline object — **no separate JSON files**.
- Keep existing `Hero` prop interface: `onOpenCalc: () => void`.
- Framer Motion is already installed — do NOT add new dependencies.
- The `Magnetic` component is at `./ui/magnetic` — keep it on the CTA button.
- `letter-spacing` on H1 must be `≥ -0.04em` per design rules (spec says `-0.03em`, use that).
- No comments explaining WHAT the code does — one-line comments only for non-obvious WHY.
- File paths: `src/components/FloorPlan.tsx`, `src/components/Hero.tsx`.

---

### Task 1: Static FloorPlan SVG component

**Files:**
- Create: `src/components/FloorPlan.tsx`

**Interfaces:**
- Produces:
  ```ts
  interface FloorPlanProps {
    wallsProgress: MotionValue<number>   // 0→1 drives pathLength on wall paths
    cam1Scale: MotionValue<number>       // 0→1
    cam2Scale: MotionValue<number>
    cam3Scale: MotionValue<number>
    cam4Scale: MotionValue<number>
    cam5Scale: MotionValue<number>
    coverageOpacity: MotionValue<number> // 0→1
    coverageScale: MotionValue<number>   // 0.3→1
  }
  export function FloorPlan(props: FloorPlanProps): JSX.Element
  ```

- [ ] **Step 1: Create the static FloorPlan component (no animation yet)**

Create `src/components/FloorPlan.tsx`:

```tsx
import { motion, MotionValue } from "framer-motion"

interface FloorPlanProps {
  wallsProgress: MotionValue<number>
  cam1Scale: MotionValue<number>
  cam2Scale: MotionValue<number>
  cam3Scale: MotionValue<number>
  cam4Scale: MotionValue<number>
  cam5Scale: MotionValue<number>
  coverageOpacity: MotionValue<number>
  coverageScale: MotionValue<number>
}

// Camera positions: [cx, cy, labelX, labelY, rotation]
const CAMERAS = [
  { id: "CAM-01", cx: 170, cy: 130, lx: 178, ly: 123, rot: 135 },
  { id: "CAM-02", cx: 500, cy: 130, lx: 508, ly: 123, rot: 225 },
  { id: "CAM-03", cx: 630, cy: 300, lx: 638, ly: 293, rot: 180 },
  { id: "CAM-04", cx: 170, cy: 450, lx: 178, ly: 443, rot:  45 },
  { id: "CAM-05", cx: 400, cy: 490, lx: 408, ly: 483, rot:  90 },
]

export function FloorPlan({
  wallsProgress,
  cam1Scale, cam2Scale, cam3Scale, cam4Scale, cam5Scale,
  coverageOpacity, coverageScale,
}: FloorPlanProps) {
  const camScales = [cam1Scale, cam2Scale, cam3Scale, cam4Scale, cam5Scale]

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ transform: "rotate(-2deg)" }}
      aria-hidden="true"
    >
      {/* ── Walls ── */}
      <g id="walls" fill="none">
        {/* Outer perimeter */}
        <motion.path
          d="M 120 100 L 680 100 L 680 520 L 120 520 Z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-[#1a1a2e]/45 dark:text-white/50"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Interior walls */}
        <motion.path
          d="M 120 280 L 380 280 M 420 280 L 680 280
             M 380 100 L 380 240 M 380 320 L 380 520
             M 540 280 L 540 520"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-[#1a1a2e]/35 dark:text-white/40"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
      </g>

      {/* ── Doors (arcs) ── */}
      <g id="doors" fill="none">
        <motion.path
          d="M 380 240 A 40 40 0 0 1 420 280"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#1a1a2e]/20 dark:text-white/25"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
        <motion.path
          d="M 540 340 A 30 30 0 0 0 570 310"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#1a1a2e]/20 dark:text-white/25"
          style={{ pathLength: wallsProgress }}
          strokeLinecap="round"
        />
      </g>

      {/* ── Coverage cones ── */}
      <motion.g
        id="coverage"
        style={{ opacity: coverageOpacity, scale: coverageScale }}
        transformOrigin="center"
      >
        {CAMERAS.map((cam) => (
          <path
            key={`cov-${cam.id}`}
            d={`M ${cam.cx} ${cam.cy}
                L ${cam.cx + Math.cos((cam.rot - 25) * Math.PI / 180) * 110}
                  ${cam.cy + Math.sin((cam.rot - 25) * Math.PI / 180) * 110}
                A 110 110 0 0 1
                  ${cam.cx + Math.cos((cam.rot + 25) * Math.PI / 180) * 110}
                  ${cam.cy + Math.sin((cam.rot + 25) * Math.PI / 180) * 110}
                Z`}
            className="fill-red-600/6 dark:fill-red-500/8"
          />
        ))}
      </motion.g>

      {/* ── Camera dots + labels ── */}
      <g id="cameras">
        {CAMERAS.map((cam, i) => (
          <motion.g
            key={cam.id}
            style={{ scale: camScales[i] }}
            transformOrigin={`${cam.cx}px ${cam.cy}px`}
          >
            {/* Pulse ring */}
            <motion.circle
              cx={cam.cx} cy={cam.cy} r={10}
              className="fill-none stroke-red-600/30 dark:stroke-red-500/30"
              strokeWidth="1"
              animate={{ r: [10, 16, 10], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            />
            {/* Dot */}
            <circle
              cx={cam.cx} cy={cam.cy} r={5}
              className="fill-red-600 dark:fill-red-500"
            />
            {/* Label */}
            <text
              x={cam.lx} y={cam.ly}
              className="fill-[#1a1a2e]/40 dark:fill-white/40 font-mono"
              fontSize="8"
              letterSpacing="0.05em"
            >
              {cam.id}
            </text>
          </motion.g>
        ))}
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Verify the file was created**

```bash
ls src/components/FloorPlan.tsx
```

Expected: file exists, no TypeScript errors visible.

- [ ] **Step 3: Commit**

```bash
git add src/components/FloorPlan.tsx
git commit -m "feat: add static FloorPlan SVG component"
```

---

### Task 2: Wire scroll-driven animation into Hero and connect to FloorPlan

**Files:**
- Create: `src/components/Hero.tsx` (full replacement)

**Interfaces:**
- Consumes: `FloorPlan` from `./FloorPlan` with the exact props from Task 1.
- Consumes: `onOpenCalc: () => void` (existing Hero prop — unchanged).
- Produces: `export const Hero: React.FC<{ onOpenCalc: () => void }>`

- [ ] **Step 4: Write the new Hero.tsx**

Replace the entire content of `src/components/Hero.tsx`:

```tsx
"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, MessageCircle } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Magnetic from "./ui/magnetic"
import { FloorPlan } from "./FloorPlan"

interface HeroProps {
  onOpenCalc: () => void
}

const E = [0.22, 1, 0.36, 1] as const

export const Hero = ({ onOpenCalc }: HeroProps) => {
  const { t } = useTranslation()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  })

  // Scroll timeline per spec
  const wallsProgress   = useTransform(scrollYProgress, [0, 0.30], [0, 1])
  const cam1Scale       = useTransform(scrollYProgress, [0.30, 0.38], [0, 1])
  const cam2Scale       = useTransform(scrollYProgress, [0.34, 0.42], [0, 1])
  const cam3Scale       = useTransform(scrollYProgress, [0.38, 0.46], [0, 1])
  const cam4Scale       = useTransform(scrollYProgress, [0.42, 0.50], [0, 1])
  const cam5Scale       = useTransform(scrollYProgress, [0.46, 0.55], [0, 1])
  const coverageOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])
  const coverageScale   = useTransform(scrollYProgress, [0.55, 0.75], [0.3, 1])
  const ctaOpacity      = useTransform(scrollYProgress, [0.75, 0.90], [0, 1])

  return (
    // 150vh wrapper — provides scroll room for sticky animation
    <div ref={wrapperRef} style={{ height: "150vh" }}>
      {/* Sticky viewport container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-background text-foreground">
        <section
          id="hero"
          className="relative h-full grid grid-cols-1 lg:grid-cols-12"
        >
          {/* ── LEFT PANEL: col-span-5 ── */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 lg:py-0 lg:col-span-5 z-10">
            {/* Location label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: E }}
              className="text-xs font-mono tracking-widest uppercase text-foreground/40 mb-6"
            >
              Актау · с 2016 года
            </motion.p>

            {/* H1 */}
            <h1
              className="mb-6 flex flex-col gap-1 select-none"
              style={{ letterSpacing: "-0.03em" }}
            >
              <span className="sr-only">Видеонаблюдение в Актау — Установка систем безопасности под ключ</span>
              {[
                { text: t("hero.titleLine1"), cls: "text-foreground",                delay: 0.8  },
                { text: t("hero.titleLine2"), cls: "text-foreground/35",             delay: 1.0  },
                { text: t("hero.titleLine3"), cls: "text-red-600 dark:text-red-500", delay: 1.2  },
              ].map(({ text, cls, delay }) => (
                <div key={text} className="overflow-hidden">
                  <motion.span
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: 1.0, ease: E, delay }}
                    className={`block font-black leading-[0.92] ${cls}`}
                    style={{ fontSize: "clamp(2.5rem, 7.5vw, 5.5rem)" }}
                  >
                    {text}
                  </motion.span>
                </div>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4, ease: E }}
              className="text-sm leading-relaxed mb-8 max-w-[380px] text-muted-foreground"
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA — fades in at scroll 75%+ */}
            <motion.div
              style={{ opacity: ctaOpacity }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Magnetic strength={0.15}>
                <button
                  onClick={onOpenCalc}
                  className="group relative flex items-center justify-center gap-2 px-6 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl overflow-hidden text-white bg-red-600 hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-600/10 hover:shadow-red-600/20"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">{t("hero.btn")}</span>
                  <ArrowRight size={14} className="relative group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </Magnetic>

              <Magnetic strength={0.15}>
                <a
                  href="https://wa.me/77779204988"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 h-11 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all duration-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-muted-foreground hover:text-foreground border border-slate-200 dark:border-white/[0.08]"
                >
                  <MessageCircle size={14} className="text-emerald-500 shrink-0" />
                  WhatsApp
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* ── RIGHT PANEL: col-span-7 — SVG floor plan ── */}
          <div
            className="hidden lg:flex items-center justify-center lg:col-span-7 relative"
            style={{ marginRight: "-5%" }}
          >
            {/* Initial walls hint at load (10% drawn) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 1.7, ease: E }}
              className="w-full h-full max-h-[80vh]"
            >
              <FloorPlan
                wallsProgress={wallsProgress}
                cam1Scale={cam1Scale}
                cam2Scale={cam2Scale}
                cam3Scale={cam3Scale}
                cam4Scale={cam4Scale}
                cam5Scale={cam5Scale}
                coverageOpacity={coverageOpacity}
                coverageScale={coverageScale}
              />
            </motion.div>
          </div>

          {/* Mobile: floor plan below text */}
          <div className="flex lg:hidden items-center justify-center px-6 pb-8" style={{ height: "280px" }}>
            <motion.div
              initial={{ opacity: 0, pathLength: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: E }}
              className="w-full h-full"
            >
              <FloorPlan
                wallsProgress={wallsProgress}
                cam1Scale={cam1Scale}
                cam2Scale={cam2Scale}
                cam3Scale={cam3Scale}
                cam4Scale={cam4Scale}
                cam5Scale={cam5Scale}
                coverageOpacity={coverageOpacity}
                coverageScale={coverageScale}
              />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Start dev server and verify no TypeScript errors**

```bash
npm run dev
```

Expected: compiles without errors. Open `http://localhost:5173` — hero section is visible with the 3-line H1, subtitle, and WhatsApp link.

- [ ] **Step 6: Verify scroll animation in browser**

Scroll down slowly on the hero. By ~30% scroll: walls should be drawing. By ~55%: camera dots should appear. By ~75%: coverage cones. By ~90%: CTA button visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: replace Hero with Blueprint Reveal scroll-driven layout"
```

---

### Task 3: Clean up i18n.ts — remove obsolete hero keys

**Files:**
- Modify: `src/i18n.ts` (remove keys for all three languages: `ru`, `kz`, `en`)

Keys to remove from all three language blocks:
- `hero.stat1`, `hero.stat2`, `hero.stat3`
- `hero.calcHint`
- `hero.feature1`, `hero.feature2`, `hero.feature3`
- `hero.title1`, `hero.title2` (old keys, replaced by `titleLine1/2/3`)

Keys to keep:
- `hero.titleLine1`, `hero.titleLine2`, `hero.titleLine3`
- `hero.subtitle`
- `hero.btn`

- [ ] **Step 8: Remove obsolete Russian hero keys (`ru` block)**

Find the `ru.hero` block (around line 81) and replace:

```ts
// BEFORE (ru)
hero: {
  title1: "Система Безопасности",
  title2: "Актау",
  subtitle: "Проектируем и устанавливаем премиальные системы видеонаблюдения для домов, бизнеса и складов.",
  btn: "Рассчитать систему",
  feature1: "Удалённый доступ",
  feature2: "Полный контроль",
  feature3: "Умный доступ",
  stat1: "Установленных камер",
  stat2: "Объектов под защитой",
  stat3: "Лет опыта",
  titleLine1: "ОХРАНА",
  titleLine2: "КАЖДОГО",
  titleLine3: "ОБЪЕКТА.",
  calcHint: "Используйте наш калькулятор для моментального расчета сметы. Это профессиональный алгоритм, учитывающий тип кабеля, разрешение камер, глубину архива и сложность монтажа."
},
```

```ts
// AFTER (ru)
hero: {
  subtitle: "Проектируем и устанавливаем премиальные системы видеонаблюдения для домов, бизнеса и складов.",
  btn: "Рассчитать систему",
  titleLine1: "ОХРАНА",
  titleLine2: "КАЖДОГО",
  titleLine3: "ОБЪЕКТА.",
},
```

- [ ] **Step 9: Remove obsolete Kazakh hero keys (`kz` block)**

Find the `kz.hero` block (around line 487) and apply the same pattern. Keep only:
```ts
hero: {
  subtitle: "Үйлерге, бизнеске және қоймаларға арналған премиум бейнебақылау жүйелерін жобалаймыз және орнатамыз.",
  btn: "Жүйені есептеу",
  titleLine1: "ӘРБІР",
  titleLine2: "НЫСАНДЫ",
  titleLine3: "ҚОРҒАУ.",
},
```

(Check the actual `kz` values in `src/i18n.ts` before editing — use the exact existing strings for the kept keys.)

- [ ] **Step 10: Remove obsolete English hero keys (`en` block)**

Find the `en.hero` block (around line 893) and keep only:
```ts
hero: {
  subtitle: "We design and install premium video surveillance systems for homes, businesses, and warehouses.",
  btn: "Calculate System",
  titleLine1: "GUARDING",
  titleLine2: "EVERY",
  titleLine3: "FACILITY.",
},
```

(Check the actual `en` values before editing.)

- [ ] **Step 11: Verify TypeScript still compiles (no unused-key errors)**

```bash
npm run build
```

Expected: 0 TypeScript errors related to hero keys. If the i18n types are checked by TypeScript, the removed keys will surface if referenced anywhere else — fix those references before proceeding.

- [ ] **Step 12: Commit**

```bash
git add src/i18n.ts
git commit -m "chore: remove obsolete hero stat/calcHint/feature i18n keys"
```

---

### Task 4: Final QA pass

- [ ] **Step 13: Check desktop layout at 1440px**

Open `http://localhost:5173`, set browser width to 1440px. Verify:
- Left col text is visible on initial load
- CTA button is hidden until ~75% scroll
- SVG floor plan is visible in right column, slightly rotated

- [ ] **Step 14: Check mobile layout at 375px**

Set browser width to 375px. Verify:
- Single column layout, text on top
- SVG floor plan appears below text at `height: 280px`
- CTA button is immediately visible (no scroll gate on mobile)

- [ ] **Step 15: Check dark mode**

Toggle dark mode via the site's theme toggle. Verify:
- Background becomes `#0c0c0f`
- SVG lines switch to white/50 opacity
- Camera dots remain red (`#ef4444`)
- Text adapts correctly via `dark:` variants

- [ ] **Step 16: Final commit and push**

```bash
git add -A
git status  # verify only expected files changed
git push origin main
```

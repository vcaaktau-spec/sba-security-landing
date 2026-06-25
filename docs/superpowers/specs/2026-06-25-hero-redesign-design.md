# Hero Redesign — Blueprint Reveal

**Date:** 2026-06-25  
**Status:** Approved for implementation

---

## Summary

Полный редизайн Hero секции лендинга toosba.kz. Уходим от технократичного "diagnostic panel" стиля к строгому профессиональному B2B дизайну с уникальным scroll-driven SVG floor plan ("Blueprint Reveal"). Схема объекта рисуется в реальном времени по мере скролла пользователя.

---

## Goals

- Убрать всё лишнее: diagnostic bars, scan sweep, eyebrow теги, статистику
- Добавить уникальный визуальный якорь — схема объекта с камерами
- Анимации стартуют не раньше 0.5с, плавные, без blur-тяжести
- Работает корректно в light (default) и dark (переключаемая) темах
- Мобиль: упрощённая версия без sticky scroll

---

## Layout

**Высота секции:** `150vh` (sticky-контейнер для scroll-driven анимации)

**Структура:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Актау · с 2016 года          [SVG Floor Plan       │
│                                рисуется при         │
│  ОХРАНА                        скролле]             │
│  КАЖДОГО                                            │
│  ОБЪЕКТА.                   CAM-01●  CAM-02●        │
│                              ╱coverage╲             │
│  Проектируем и               CAM-03●                │
│  устанавливаем системы                              │
│  безопасности под ключ.                             │
│                                                     │
│  [РАССЧИТАТЬ СИСТЕМУ →]                             │
│  или напишите в WhatsApp                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Левая колонка: `col-span-5`, sticky, центрирована вертикально
- Правая колонка: `col-span-7`, SVG занимает всю высоту, выходит за правый край

---

## Color Palette

| Элемент | Light | Dark |
|---|---|---|
| Фон | `#ffffff` / `#fafafa` | `#0c0c0f` |
| Линии плана (старт) | `#1a1a2e` opacity 8% | `#ffffff` opacity 8% |
| Линии плана (финал) | `#1a1a2e` opacity 45% | `#ffffff` opacity 50% |
| Точки камер | `#dc2626` | `#ef4444` |
| Coverage зоны | `#dc2626` opacity 6% | `#ef4444` opacity 8% |
| Основной текст | `#0f0f13` | `#f8fafc` |
| Мuted текст | `#71717a` | `#71717a` |
| CTA кнопка | `#dc2626` | `#dc2626` |

---

## Typography

- **Метка:** "Актау · с 2016 года" — `text-xs`, `opacity-40`, без декора
- **H1:** 3 строки
  - "ОХРАНА" — `font-black`, `~6rem` clamp, тёмный
  - "КАЖДОГО" — `font-black`, `opacity-35`
  - "ОБЪЕКТА." — `font-black`, `text-red-600 dark:text-red-500`
  - `letter-spacing: -0.03em`
- **Subtitle:** одна строка, max 12 слов, `text-base`, `text-muted-foreground`
- **CTA primary:** "РАССЧИТАТЬ СИСТЕМУ →", `font-mono font-bold tracking-widest uppercase`
- **CTA secondary:** "или напишите в WhatsApp" — plain link, `text-sm`, `text-muted-foreground`

Убраны: eyebrow с dash-линией, feature tags (Shield/Flame/Cpu), diagnostic bars.

---

## SVG Floor Plan

### Структура схемы

Типовой объект — офис/торговая точка:
- 4–5 помещений (кабинет, склад, зал, коридор, вход)
- Дверные проёмы — дуги
- 5–6 точек камер: `CAM-01` … `CAM-05`
- Coverage конусы от каждой камеры

### SVG элементы

```
<g id="walls">        — все стены и перегородки
<g id="doors">        — дверные дуги  
<g id="cameras">      — точки камер (circle + label)
<g id="coverage">     — coverage конусы (path с заливкой)
```

### Размер и позиция

- SVG `viewBox="0 0 800 600"`, `preserveAspectRatio="xMidYMid meet"`
- Правая колонка, выходит на 10% за правый край экрана
- Слегка повёрнута: `rotate(-2deg)` для живости

---

## Scroll Animation

**Контейнер:** `position: sticky`, `top: 0`, высота `100vh` внутри `150vh` wrapper.

**Управление:** `useScroll({ target: wrapperRef, offset: ["start start", "end end"] })` → `scrollYProgress: 0 → 1`

### Таймлайн скролла

| scrollYProgress | Что происходит |
|---|---|
| `0 → 0.30` | Стены рисуются — `pathLength: 0 → 1` на `<g id="walls">` |
| `0.30 → 0.55` | Камеры появляются по одной — `scale: 0 → 1`, stagger 0.05 между каждой |
| `0.55 → 0.75` | Coverage конусы разворачиваются — `opacity: 0 → 1` + `scale: 0.3 → 1` |
| `0.75 → 1.00` | CTA кнопка на левой панели fade-in (`opacity: 0 → 1`) |

### Техническая реализация

```ts
const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] })

// Стены
const wallsPathLength = useTransform(scrollYProgress, [0, 0.3], [0, 1])

// Камеры (5 штук, stagger через individual transforms)
const cam1Scale = useTransform(scrollYProgress, [0.30, 0.38], [0, 1])
const cam2Scale = useTransform(scrollYProgress, [0.34, 0.42], [0, 1])
// ... и т.д.

// Coverage
const coverageOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1])

// CTA
const ctaOpacity = useTransform(scrollYProgress, [0.75, 0.90], [0, 1])
```

---

## Page Load Animation (без скролла)

| Время | Элемент | Анимация |
|---|---|---|
| `0.0s` | Фон | instant |
| `0.5s` | "Актау · с 2016 года" | `opacity: 0 → 1`, `duration: 0.6s` |
| `0.8s` | H1 (все 3 строки) | `clipPath` reveal сверху вниз, `duration: 1s` |
| `1.4s` | Subtitle | `opacity: 0 → 1`, `y: 8 → 0`, `duration: 0.7s` |
| `1.7s` | Начало SVG стен (10%) | намёк что схема там есть |

CTA кнопка появляется только при скролле (`scrollYProgress >= 0.75`), не при загрузке — это мотивирует скроллить.

---

## Looping Effects

Только один: **pulse на точках камер** после их появления.
- `opacity: 0.5 → 1 → 0.5`, `duration: 2s`, `repeat: Infinity`, `ease: easeInOut`
- Не все одновременно — stagger 0.4s между камерами

Убраны все остальные loops: scan sweep, animate-ping на статистике, bottom bar анимация.

---

## Mobile (< 768px)

- Высота: `min-h-screen` (без sticky scroll, `height: auto`)
- Layout: колонки стакаются вертикально
- Сверху: текст (H1, subtitle, CTA)
- Снизу: SVG схема, фиксированная высота `280px`
- Анимация схемы: простой `whileInView` fade-in + `pathLength: 0 → 1` за `1.5s` при попадании в viewport
- CTA кнопка видна сразу (не ждёт скролла)

---

## What's Removed vs Current Hero

| Убрано | Причина |
|---|---|
| Diagnostic bar сверху (SBA Security · Актау / v2.4) | Псевдотехнический декор |
| Diagnostic bar снизу (Scroll / Active 24/7) | Лишний слой |
| Scan sweep анимация | Отвлекает, не несёт смысла |
| Grid overlay background | Убирает чистоту |
| Feature tags (Shield/Flame/Cpu) | Дублирует контент ниже |
| Статистика (5000+ камер и т.д.) | Уже есть в 2 других секциях |
| Eyebrow "Системы безопасности" | Встречается на всех AI-лендингах |
| blur(12px) на входе элементов | Тяжело визуально |
| StatCard компонент | Не нужен в hero |

---

## Files to Change

| Файл | Изменение |
|---|---|
| `src/components/Hero.tsx` | Полная замена |
| `src/components/FloorPlan.tsx` | Новый компонент (SVG схема) |
| Переводы `hero.*` в i18n | Убрать ключи stat1/stat2/stat3, calcHint |

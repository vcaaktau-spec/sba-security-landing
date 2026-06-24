# Design

Visual system specification for the SBA Security landing page.

## Theme & Mood
A premium, technical command briefing aesthetic styled as an engineering blueprint. It features a light steel-tinted canvas, thin grid dividers, and sharp monospace parameters.

## Color Palette

All colors map to Tailwind classes with strict WCAG contrast compliance:

- **Background (off-white steel)**: `oklch(0.98 0.003 240)` / `bg-slate-50` — Clean slate/steel off-white.
- **Foreground (ink black)**: `oklch(0.12 0.01 240)` / `text-slate-950` — Deep, commanding black.
- **Accent (alarm crimson)**: `oklch(0.55 0.22 25)` / `text-red-600` or `bg-red-600` — Tactical alert red for primary actions.
- **Dividers / Borders**: `oklch(0.92 0.01 240)` / `border-slate-200` (light) / `border-slate-800` (dark) — Thin tactical grid lines.
- **Operational Green**: `oklch(0.62 0.17 145)` / `text-emerald-600` / `bg-emerald-500` — Safe status indicators.

## Typography

We use two distinct families with full Cyrillic (Russian/Kazakh) support:

- **Headlines / Display**: **Unbounded** (Bold / Black weights, letter-spacing: `-0.02em`, `text-wrap: balance`). An ultra-wide, blocky geometric font that feels defensive and heavy.
- **Body / Interface**: **Manrope** (Light / Regular / Semi-Bold, `text-wrap: pretty`). Highly legible and modern neo-grotesque.
- **Labels / Technical Parameter Codes**: Monospace (`font-mono tracking-widest uppercase`).

### Sizing Scale
- **Hero H1**: `clamp(2.5rem, 6vw, 5.5rem)` (heavy, wide block layout).
- **H2 (Section titles)**: `clamp(1.75rem, 4vw, 2.75rem)`.
- **H3 (Card headings)**: `1.25rem` to `1.5rem`.
- **Body Standard**: `1rem` (16px).
- **Monospace Labels**: `0.75rem` (12px).

## Spacing & Grid System
- Section margins: `py-24 lg:py-32` with solid grid border lines.
- Corner crosshairs: Grid intersection points decorated with subtle `+` character indicators.
- Grid: Flexbox/asymmetric grid configurations simulating blueprint specifications.

## Interactive Details
- **Active Scanning sweeps**: Hero features real-time CSS/framer-motion video scanning and ping animation.
- **Tactical Outline Hovers**: Hovering over cards lights up a thin crimson border or active status log.

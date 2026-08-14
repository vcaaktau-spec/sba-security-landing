# SBA Planner — Text, Pricing, Persistence, Document Export — Design

## Context

`src/components/SbaPlanner.tsx` (805 lines) is a Konva-based floor-plan editor
inside the admin dashboard (`/dashboard`, `SignedIn` only): drop rooms and
category-colored device icons (CCTV/LAN/Fire/ACS), draw cable runs by hand or
let it auto-route the nearest run per category and total the meters, zoom/pan/
undo/transform. It works well as a technical drawing tool. Three concrete gaps
were identified against what it's actually used for (producing a document for
a client):

1. No freeform text annotation — `Text` nodes only exist for auto-generated
   labels (room dimensions, device model, radius, watermark, footer credit).
2. No price field anywhere — `PlannerDevice.label` is a free-text "model"
   string, nothing else. Pricing lives entirely in unrelated features
   (`Calculator.tsx`, `CartDrawer.tsx`/`renderQuotePdf.ts`) that don't touch
   the planner.
3. Export is a raw PNG snapshot (`stage.toDataURL()`) — no PDF, no itemized
   equipment/price table, no branded document.

Plus two things found while scoping, not originally asked for but load-bearing
for the design below:

- **The plan has no persistence at all.** State lives only in the component's
  `useState` — a refresh loses everything.
- **`/admin` is an empty stub** (`<SignedIn></SignedIn>`, no content) and
  `Dashboard.tsx` never fetches from the existing `projects` table/API
  (`api/projects.ts`, `api/get-projects.ts`) — that subsystem is scaffolded
  in the DB but has no UI anywhere yet. Tying planner-save to "pick an
  existing client project" would mean also building that missing picker UI
  first, which is its own separate feature. **This spec does not do that** —
  see Persistence below for the scoped-down approach.

## Goals

- Freeform text annotations, adjustable size, placed/edited the same way
  devices already are (select → floating edit panel bottom-right).
- A `price` (KZT, number) field per device, hand-entered, not shown on the
  canvas itself, rolled into the exported document's total.
- One-click export to a branded PDF: plan snapshot + itemized equipment/price
  table + grand total, reusing the existing `renderQuotePdf`/`QuoteTemplate`
  pipeline rather than a second PDF implementation.
- Save/load a plan by name, backed by Neon (not localStorage) so it survives
  across devices/admins.
- UX pass: lighter watermark (single pattern instead of 121 `Text` nodes), an
  object list/layers panel, redo.

## Non-goals

- Not touching the dormant `projects` table/API or building a client-project
  picker — out of scope, flagged above, revisit separately if wanted.
- Not adding price-from-catalog lookup (device prices are freehand entry per
  the user's explicit call — no `/api/products` integration in the planner).
- Not building multi-user real-time collaboration on a plan — save/load is
  single-editor-at-a-time, last write wins.
- Not reworking the auto-cable-routing algorithm or existing device palette —
  those already work and aren't part of what was asked.

## Data model

New table, intentionally standalone (see Non-goals):

```ts
export const sbaPlans = pgTable("sba_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),        // Clerk user id of the creator
  name: text("name").notNull(),              // "ЖК Атамекен, блок 3"
  data: jsonb("data").$type<PlannerSaveData>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

`PlannerSaveData` is `{ rooms, devices, drawnLines, texts }` — the same
shape already held in component state, plus the new `texts` array. `device`
gains an optional `price?: number`. Nothing here needs a DB migration tool
beyond the existing `drizzle-kit` flow already used for `projects`/`products`.

Three new API routes, following the existing pattern in `api/*.ts`
(`VercelRequest`/`VercelResponse`, Neon via `src/db/index.ts`):

- `GET /api/sba-plans?userId=` — list saved plans (id, name, updatedAt) for
  the picker dropdown.
- `GET /api/sba-plans/:id` — full plan data for loading.
- `POST /api/sba-plans` — create or update (upsert by id if provided).

## Component changes (`SbaPlanner.tsx`)

**Text tool** — new `'text'` entry alongside the existing `trunk`/`corrugation`
draw-mode buttons in the Architecture tab. Click-to-place like devices (reuses
`addDevice`'s centering logic, not draw-mode's click-drag-click). A `PlannerText`
type: `{ id, x, y, rotation, content, fontSize, bold }`. Rendered as a Konva
`Text` with `draggable` + `Transformer` support matching how devices already
work — no new interaction pattern, just a new item kind. The existing
selection-driven floating panel (bottom-right, currently shows model/radius
inputs) grows a text-specific branch: a `<textarea>` for content and a
size selector (three preset sizes is enough — "S / M / L" buttons rather than
a raw number input, matching the tool's existing preset-driven UI language
rather than introducing a new free-numeric-input pattern for this one field).

**Price field** — same floating panel, same pattern as the existing "Модель"
input: a "Цена (₸)" number input, shown only when a device is selected.
Stored on `PlannerDevice.price`. Not rendered on the canvas.

**Persistence** — toolbar gains: a plan-name field, Save button (POST),
and a "Мои планы" dropdown (GET list → GET one on select, replaces current
`rooms`/`devices`/`drawnLines`/`texts` state). Follows the same
`saveToHistory`-before-mutation convention already used everywhere else in
the file. No autosave — explicit Save button only, to keep the mental model
simple (matches how the rest of the dashboard already works: explicit save
actions, not silent background writes).

**Export** — `handleExportPng` is renamed/extended to `handleExportDocument`:
still calls `stage.toDataURL()` for the plan image (unchanged), then hands
that image plus a computed equipment table (`devices.filter(d => d.price)`,
grouped, summed) to a new `PlannerQuoteTemplate` component (sibling to the
existing `QuoteTemplate.tsx`, same visual language: header, itemized table,
total) and through the existing `renderQuotePdf(element, filename)` — the
same html2canvas+jsPDF call already used for cart quotes, just pointed at a
different template element. No new PDF library, no new rendering pipeline.

**UX pass:**
- Watermark: swap the 121 `Text` nodes (11×11 grid, "RS STUDIO", opacity 0.03)
  for a single `Konva.Image` built once from an offscreen `<canvas>` pattern
  tile, drawn as one `Layer` background fill — same visual effect, a small
  fraction of the render cost, one node instead of 121.
- Object list panel: collapsible left-side panel listing rooms/devices/texts
  by label with click-to-select and a delete icon — addresses "hard to find
  one device among fifty" on a dense plan. Read-only list, no drag-reorder.
- Redo: extend the existing single-stack undo (`history: string[]`) to a
  two-stack undo/redo (`past`/`future`), same JSON-snapshot approach, no
  change to how `saveToHistory()` is called at existing call sites.

## Risks / things worth flagging before implementation

- `renderQuotePdf`/`QuoteTemplate` currently assume a single, cart-shaped
  document. Confirm during implementation that generalizing it (or adding a
  sibling template) doesn't regress the existing cart-quote flow — no shared
  state, but shared code, so this needs a quick manual check of both export
  paths before calling it done.
- `sba_plans.data` as one JSON blob means no server-side validation of plan
  contents beyond "is it valid JSON matching the TS type" at write time —
  acceptable for a single-admin-editor tool, called out here so it's a
  conscious choice, not an oversight.

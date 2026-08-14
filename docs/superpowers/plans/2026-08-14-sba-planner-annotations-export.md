# SBA Planner Text/Pricing/Export/Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add freeform text annotations and per-device pricing to the SBA Planner canvas tool, a branded PDF export that combines the plan with an itemized price table, Neon-backed save/load by name, and a UX pass (lighter watermark, object list panel, redo).

**Architecture:** All changes are additive to the existing Konva-based `SbaPlanner.tsx` component — new item kinds (`PlannerText`) and fields (`PlannerDevice.price`) follow the exact same state-array + floating-panel-on-select pattern already used for rooms and devices, no new interaction model. Persistence is a new standalone `sba_plans` table (deliberately not tied to the dormant `projects` table — see spec) with three new `api/*.ts` serverless routes matching the existing `VercelRequest`/`VercelResponse` pattern. Export reuses the existing `renderQuotePdf` (html2canvas+jsPDF) pipeline with a new sibling template component instead of a second PDF implementation.

**Tech Stack:** React 18, TypeScript, react-konva/Konva, Drizzle ORM + Neon Postgres, Vercel serverless functions, html2canvas + jsPDF (existing `src/lib/pdf/renderQuotePdf.ts`).

**Spec:** `docs/superpowers/specs/2026-08-14-sba-planner-annotations-export-design.md`

## Global Constraints

- No new test framework — this project has no unit-test runner configured (no vitest/jest in `package.json`). Verification per task is: `npx tsc` (typecheck), `npx eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`, and a targeted manual/scripted check (a one-off Node script for API routes, a Playwright script driving the actual dashboard UI for canvas behavior) — matching how everything else in this codebase has been verified this session. Steps below say exactly what to run and what to look for instead of "run the tests."
- All new UI copy is Russian, matching the rest of `SbaPlanner.tsx` (see the `t` object at the top of the file) — extend that object, don't hardcode new strings inline.
- Follow the existing `api/*.ts` handler pattern exactly: `import type { VercelRequest, VercelResponse } from '@vercel/node'`, `catch (error) { ... error instanceof Error ? error.message : String(error) ... }` — no `any`.
- Prices are freehand-entered numbers (KZT), not looked up from `/api/products` — no catalog integration in the planner (spec Non-goals).
- Price is never rendered on the canvas itself, only in the exported document.

---

### Task 1: `sba_plans` table + Drizzle schema

**Files:**
- Modify: `src/db/schema.ts` (append after `products`, end of file)

**Interfaces:**
- Produces: `sbaPlans` table (Drizzle `pgTable`), consumed by Task 2's API routes via `db.insert(sbaPlans)` / `db.select().from(sbaPlans)` / `db.update(sbaPlans)`.
- Produces: `PlannerSaveData` TypeScript type (rooms/devices/drawnLines/texts shape), consumed by Task 2 (API route body typing) and Task 5 (SbaPlanner save/load).

- [ ] **Step 1: Add the table and shared type to `src/db/schema.ts`**

Append at the end of the file:

```ts
// План из конструктора SbaPlanner (см. src/components/SbaPlanner.tsx).
// Намеренно отдельная таблица, не привязана к projects — projects сейчас
// нигде в UI не используется (нет страницы выбора проекта), см. design doc
// 2026-08-14-sba-planner-annotations-export-design.md "Non-goals".
export const sbaPlans = pgTable("sba_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

This reuses `pgTable`, `text`, `jsonb`, `timestamp` — all already imported at
the top of the file for the existing tables. No new imports needed.

- [ ] **Step 2: Typecheck**

Run: `npx tsc`
Expected: no errors (this is a pure additive schema change, nothing consumes
it yet).

- [ ] **Step 3: Push the schema to Neon**

Run: `npx drizzle-kit push`
Expected: prompts to confirm creating the new `sba_plans` table (no existing
migrations folder in this project — matches how `projects`/`products` were
originally created). Confirm yes. Verify success output mentions `sba_plans`.

- [ ] **Step 4: Commit**

```bash
git add src/db/schema.ts
git commit -m "feat: add sba_plans table for planner save/load"
```

---

### Task 2: Planner persistence API routes

**Files:**
- Create: `api/sba-plans.ts` (POST — create or update)
- Create: `api/get-sba-plans.ts` (GET — list by userId, id+name+updatedAt only)
- Create: `api/get-sba-plan.ts` (GET — single plan by id, full data)

**Interfaces:**
- Consumes: `sbaPlans` table from Task 1.
- Produces: `POST /api/sba-plans` body `{ id?: string, userId: string, name: string, data: unknown }` → `201 { id, name, updatedAt }`. `id` omitted = create (generates `crypto.randomUUID()`); `id` present = update that row (only if `userId` matches, so one admin can't overwrite another's plan by guessing an id).
- Produces: `GET /api/get-sba-plans?userId=X` → `200 [{ id, name, updatedAt }]`.
- Produces: `GET /api/get-sba-plan?id=X` → `200 { id, userId, name, data, updatedAt }` or `404 { error }`.

- [ ] **Step 1: Write `api/sba-plans.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body as { id?: string; userId?: string; name?: string; data?: unknown };
    if (!body.userId || !body.name || body.data === undefined) {
      return res.status(400).json({ error: 'userId, name и data обязательны' });
    }

    if (body.id) {
      const updated = await db
        .update(sbaPlans)
        .set({ name: body.name, data: body.data, updatedAt: new Date() })
        .where(and(eq(sbaPlans.id, body.id), eq(sbaPlans.userId, body.userId)))
        .returning();
      if (updated.length === 0) return res.status(404).json({ error: 'План не найден' });
      return res.status(200).json({ id: updated[0].id, name: updated[0].name, updatedAt: updated[0].updatedAt });
    }

    const inserted = await db
      .insert(sbaPlans)
      .values({ id: crypto.randomUUID(), userId: body.userId, name: body.name, data: body.data })
      .returning();
    return res.status(201).json({ id: inserted[0].id, name: inserted[0].name, updatedAt: inserted[0].updatedAt });
  } catch (error) {
    console.error('Ошибка сохранения плана:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
```

- [ ] **Step 2: Write `api/get-sba-plans.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'userId обязателен' });
  }

  try {
    const rows = await db
      .select({ id: sbaPlans.id, name: sbaPlans.name, updatedAt: sbaPlans.updatedAt })
      .from(sbaPlans)
      .where(eq(sbaPlans.userId, userId))
      .orderBy(desc(sbaPlans.updatedAt));
    res.status(200).json(rows);
  } catch (error) {
    console.error('Ошибка получения списка планов:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
```

- [ ] **Step 3: Write `api/get-sba-plan.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../src/db/index.js';
import { sbaPlans } from '../src/db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'id обязателен' });
  }

  try {
    const rows = await db.select().from(sbaPlans).where(eq(sbaPlans.id, id));
    if (rows.length === 0) return res.status(404).json({ error: 'План не найден' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Ошибка получения плана:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 5: Manual verification against the real DB**

These are Vercel serverless functions — they don't run under `vite dev`. Write
a throwaway script to exercise them directly against Drizzle (bypassing HTTP,
since spinning up `vercel dev` is unnecessary for this check):

```js
// scratch verification, not committed — run with: node --experimental-vm-modules -e "..."
// or save to a temp .mjs and run with node, then delete it.
import { db } from './src/db/index.js';
import { sbaPlans } from './src/db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const id = crypto.randomUUID();
await db.insert(sbaPlans).values({ id, userId: 'test-user', name: 'Test Plan', data: { rooms: [], devices: [], drawnLines: [], texts: [] } });
const rows = await db.select().from(sbaPlans).where(eq(sbaPlans.userId, 'test-user'));
console.log('inserted + listed:', rows.length === 1 && rows[0].name === 'Test Plan');
await db.delete(sbaPlans).where(eq(sbaPlans.id, id));
const afterDelete = await db.select().from(sbaPlans).where(eq(sbaPlans.id, id));
console.log('cleanup ok:', afterDelete.length === 0);
```

Expected output: `inserted + listed: true` and `cleanup ok: true`. This
confirms the schema/table work end-to-end before wiring up the HTTP layer.

- [ ] **Step 6: Commit**

```bash
git add api/sba-plans.ts api/get-sba-plans.ts api/get-sba-plan.ts
git commit -m "feat: add SBA planner save/list/load API routes"
```

---

### Task 3: Text annotation tool

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: existing `saveToHistory`, `getSnapPos`, `selectedId`/`setSelectedId`, `t` (translation object), `M_PER_PX` constant — all already defined in the file.
- Produces: `PlannerText` type `{ id: string; x: number; y: number; rotation: number; content: string; fontSize: 12 | 18 | 28; bold: boolean }`, `texts` state array, `addText()` function — consumed by Task 5 (save/load must include `texts`) and Task 9 (export must skip/include text in the plan snapshot, which it does automatically since it's just another Konva node).

- [ ] **Step 1: Add the type and translation strings**

In the type block near the top of the file (after `type AutoCableLine = ...`
at line 18), add:

```ts
type PlannerText = { id: string; x: number; y: number; rotation: number; content: string; fontSize: 12 | 18 | 28; bold: boolean };
```

In the `t` object (starts at line 24), add after the `door: 'Дверь',` line:

```ts
  text: 'Текст', textContent: 'Текст:', textSize: 'Размер:', textSizeS: 'S', textSizeM: 'M', textSizeL: 'L',
```

- [ ] **Step 2: Add `texts` state**

Near line 71 (`const [drawnLines, setDrawnLines] = useState<DrawnLine[]>([]);`),
add directly after it:

```ts
  const [texts, setTexts] = useState<PlannerText[]>([]);
```

- [ ] **Step 3: Add `addText` function**

Directly after the existing `addDevice` function (ends around line 210, right
before `const startDrawMode = ...`), add:

```ts
  const addText = () => {
    saveToHistory();
    const centerX = (stageSize.width / 2 - position.x) / scale;
    const centerY = (stageSize.height / 2 - position.y) / scale;
    const newText: PlannerText = { id: `text-${Date.now()}`, x: centerX, y: centerY, rotation: 0, content: t.text, fontSize: 18, bold: false };
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
  };
```

- [ ] **Step 4: Add the toolbar button**

In the Architecture tab's button row (starts at line 372 `{activeTab === 'arch' && (`),
add a new button after the door button (after line 378's closing `</button>`
and before the divider at line 379):

```tsx
             <button onClick={addText} className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border hover:bg-muted rounded-md transition-all text-[10px] sm:text-xs font-medium whitespace-nowrap"><SquareTerminal size={14} /> {t.text}</button>
```

`SquareTerminal` is already imported (used elsewhere for the fire `tableau`
icon) — reusing it here for the text tool is fine, no new icon import needed.

- [ ] **Step 5: Render text items on the canvas**

In the main `<Layer>` (starts at line 527), add a new block after the rooms
`.map()` (ends at line 614) and before the devices `.map()` (starts at line 617):

```tsx
            {/* ТЕКСТОВЫЕ АННОТАЦИИ */}
            {texts.map((txt) => (
              <Text
                key={txt.id}
                id={txt.id}
                text={txt.content}
                x={txt.x}
                y={txt.y}
                rotation={txt.rotation}
                fontSize={txt.fontSize}
                fontStyle={txt.bold ? 'bold' : 'normal'}
                fill={selectedId === txt.id ? '#2563eb' : '#374151'}
                draggable={!drawMode.active}
                onPointerDown={(e) => { if (!drawMode.active) { e.cancelBubble = true; setSelectedId(txt.id); } }}
                onDragStart={() => saveToHistory()}
                onDragMove={(e) => {
                  const node = e.target;
                  const { x, y } = getSnapPos(node.x(), node.y());
                  node.position({ x, y });
                }}
                onDragEnd={(e) => { e.cancelBubble = true; setTexts((prev) => prev.map((t2) => (t2.id === txt.id ? { ...t2, x: e.target.x(), y: e.target.y() } : t2))); }}
                onTransformStart={() => saveToHistory()}
                onTransform={(e) => {
                  const node = e.target;
                  setTexts((prev) => prev.map((t2) => (t2.id === txt.id ? { ...t2, rotation: node.rotation() } : t2)));
                  node.scaleX(1);
                  node.scaleY(1);
                }}
              />
            ))}
```

- [ ] **Step 6: Wire text selection into the Transformer effect**

The `useEffect` that attaches the Transformer to the selected node (lines
141-170) currently branches on `selectedId.startsWith('line')` /
`selectedId.startsWith('dev-')` / room. Text ids start with `text-`, and
`stageRef.current?.findOne('#' + selectedId)` already works for any node with
a matching Konva `id` — since the `<Text>` above has `id={txt.id}`, no change
is needed to the lookup itself. But the anchor/rotate config branch (line
159-166) needs a text case so users get rotate-only handles, not resize
handles (resizing text via corner-drag would look wrong — font size is
controlled by the S/M/L panel in Step 8, not free transform). Change:

```ts
        const isRoom = selectedId.startsWith('room');
        const isDoor = selectedId.startsWith('dev-door');
        
        if (isRoom || isDoor) {
            trRef.current.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center']);
            trRef.current.rotateEnabled(true);
            if (isRoom) trRef.current.rotateEnabled(false);
        } else {
            trRef.current.enabledAnchors([]); 
            trRef.current.rotateEnabled(true);
        }
```

to (only the final `else` branch changes, by adding a text-specific case
before it — everything else stays byte-identical):

```ts
        const isRoom = selectedId.startsWith('room');
        const isDoor = selectedId.startsWith('dev-door');
        const isText = selectedId.startsWith('text-');
        
        if (isRoom || isDoor) {
            trRef.current.enabledAnchors(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center', 'left-center', 'right-center']);
            trRef.current.rotateEnabled(true);
            if (isRoom) trRef.current.rotateEnabled(false);
        } else if (isText) {
            trRef.current.enabledAnchors([]);
            trRef.current.rotateEnabled(true);
        } else {
            trRef.current.enabledAnchors([]); 
            trRef.current.rotateEnabled(true);
        }
```

(The `isText` branch is currently identical to the final `else` — it's split
out because Task 4/9 reviewers should be able to find "text transform config"
in one place if it needs to diverge later, e.g. disabling rotation for text.
Not a behavior change today.)

- [ ] **Step 7: Add text controls to the floating edit panel**

The floating panel (starts at line 745 `{selectedId && !drawMode.active && (`)
currently has two conditional blocks: the model-name input (line 748, gated
on `devices.find(...)`) and the radius input (line 766, gated on wifi/smoke/heat
device types). Add a third block, gated on the text lookup, directly after
the radius block (after line 779's closing `)}`, before the delete button at
line 781):

```tsx
                {/* Редактирование текста */}
                {texts.find(t2 => t2.id === selectedId) && (
                    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 border-r border-border shrink-0">
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase">{t.textContent}</span>
                        <input
                            type="text"
                            value={texts.find(t2 => t2.id === selectedId)?.content || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                setTexts(prev => prev.map(t2 => t2.id === selectedId ? { ...t2, content: val } : t2));
                            }}
                            onFocus={() => saveToHistory()}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-24 sm:w-40 text-foreground focus:border-blue-500 py-0.5"
                        />
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase ml-1">{t.textSize}</span>
                        {([12, 18, 28] as const).map((size, i) => (
                            <button
                                key={size}
                                onClick={() => { saveToHistory(); setTexts(prev => prev.map(t2 => t2.id === selectedId ? { ...t2, fontSize: size } : t2)); }}
                                className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${texts.find(t2 => t2.id === selectedId)?.fontSize === size ? 'bg-blue-600 text-white border-blue-700' : 'bg-transparent border-border text-muted-foreground hover:bg-muted'}`}
                            >
                                {[t.textSizeS, t.textSizeM, t.textSizeL][i]}
                            </button>
                        ))}
                    </div>
                )}
```

- [ ] **Step 8: Include `texts` in the delete-selected handler**

The delete button (line 781-790) currently filters `rooms`/`devices`/`drawnLines`.
Add `texts` to it:

```tsx
                <button onClick={() => { 
                    saveToHistory();
                    setRooms(rooms.filter(r => r.id !== selectedId)); 
                    setDevices(devices.filter(d => d.id !== selectedId)); 
                    setDrawnLines(drawnLines.filter(l => l.id !== selectedId)); 
                    setTexts(texts.filter(t2 => t2.id !== selectedId));
                    setSelectedId(null); 
                  }}
```

- [ ] **Step 9: Include `texts` in the empty-canvas hint condition**

Line 795's condition (`rooms.length === 0 && devices.length === 0 && drawnLines.length === 0`)
should also check `texts.length === 0`:

```tsx
        {position.x === 0 && scale === 1 && rooms.length === 0 && devices.length === 0 && drawnLines.length === 0 && texts.length === 0 && !drawMode.active && (
```

- [ ] **Step 10: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 11: Manual verification**

Run `npm run dev`, navigate to `/dashboard` as a signed-in admin, open the
planner, click "Текст" — a text box labeled "Текст" should appear centered
on the canvas, already selected. Confirm: dragging it moves it (snaps to
grid if magnet is on), the floating panel shows an editable text field and
S/M/L size buttons, typing updates the canvas text live, clicking S/M/L
changes the rendered font size, the Transformer shows a rotate handle only
(no resize corners), and the delete (trash) button removes it.

- [ ] **Step 12: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "feat: add text annotation tool to SBA planner"
```

---

### Task 4: Price field on devices

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `PlannerDevice` type (line 16), floating edit panel (same location as Task 3 Step 7).
- Produces: `PlannerDevice.price?: number` — consumed by Task 9 (export document's itemized table).

- [ ] **Step 1: Add `price` to the `PlannerDevice` type**

Line 16 currently:

```ts
type PlannerDevice = { id: string; x: number; y: number; rotation: number; scaleX?: number; scaleY?: number; type: DeviceType; category: DeviceCategory; label: string; radius?: number };
```

Change to:

```ts
type PlannerDevice = { id: string; x: number; y: number; rotation: number; scaleX?: number; scaleY?: number; type: DeviceType; category: DeviceCategory; label: string; radius?: number; price?: number };
```

- [ ] **Step 2: Add the translation string**

In the `t` object, add:

```ts
  priceLabel: 'Цена (₸):',
```

- [ ] **Step 3: Add the price input to the floating edit panel**

In the model-name block (line 748-763), add the price input directly after
the existing model `<input>` (after line 761's closing `/>`, inside the same
`<div>`, before its closing `</div>` at line 762):

```tsx
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase ml-2">{t.priceLabel}</span>
                        <input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={devices.find(d => d.id === selectedId)?.price ?? ''}
                            onChange={(e) => {
                                const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                                setDevices(prev => prev.map(d => d.id === selectedId ? { ...d, price: val } : d));
                            }}
                            onFocus={() => saveToHistory()}
                            className="text-xs sm:text-sm font-medium bg-transparent border-b border-dashed border-muted-foreground/50 outline-none w-16 sm:w-20 text-foreground focus:border-blue-500 py-0.5"
                        />
```

This lives inside the same conditional block as the model input (both keyed
off `devices.find(d => d.id === selectedId)`), so it only shows when a
device (not a room, line, or text) is selected — no new gating needed.

- [ ] **Step 4: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 5: Manual verification**

In the running dev server, select any placed device, confirm a "Цена (₸)"
number input appears next to the model field, type a number, confirm it
persists (deselect and reselect the same device — value should still be
there, since it's stored in `devices` state, not local component state).

- [ ] **Step 6: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "feat: add price field to planner devices"
```

---

### Task 5: Save/load persistence UI

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `POST /api/sba-plans`, `GET /api/get-sba-plans`, `GET /api/get-sba-plan` from Task 2. Consumes `rooms`/`devices`/`drawnLines`/`texts` state (Task 3 adds `texts`). Consumes Clerk's `useUser()` for `userId` — same pattern already used in `Dashboard.tsx` (`import { useUser } from "@clerk/clerk-react"`).
- Produces: `handleSave`, `handleLoad`, `savedPlans` state, `planName` state — no other task depends on these directly, this is the terminal UI for Task 1/2/3's data.

- [ ] **Step 1: Add Clerk import and plan-related state**

At the top imports, add:

```ts
import { useUser } from '@clerk/clerk-react';
```

Near the other `useState` declarations (after the `texts` state added in
Task 3 Step 2), add:

```ts
  const { user } = useUser();
  const [planId, setPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState('');
  const [savedPlans, setSavedPlans] = useState<{ id: string; name: string; updatedAt: string }[]>([]);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
```

- [ ] **Step 2: Add translation strings**

```ts
  savePlan: 'Сохранить', myPlans: 'Мои планы', planNamePlaceholder: 'Название плана', noSavedPlans: 'Нет сохранённых планов', loadPlan: 'Загрузить',
```

- [ ] **Step 3: Add save/load handlers**

After `addText` (added in Task 3 Step 3), add:

```ts
  const handleSave = async () => {
    if (!user || !planName.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/sba-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planId ?? undefined,
          userId: user.id,
          name: planName.trim(),
          data: { rooms, devices, drawnLines, texts },
        }),
      });
      if (!res.ok) throw new Error('save failed');
      const saved = await res.json();
      setPlanId(saved.id);
    } catch (err) {
      console.error('Не удалось сохранить план:', err);
      alert('Не удалось сохранить план. Попробуйте ещё раз.');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchSavedPlans = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/get-sba-plans?userId=${encodeURIComponent(user.id)}`);
      if (!res.ok) throw new Error('list failed');
      setSavedPlans(await res.json());
    } catch (err) {
      console.error('Не удалось получить список планов:', err);
    }
  };

  const handleLoad = async (id: string) => {
    try {
      const res = await fetch(`/api/get-sba-plan?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error('load failed');
      const plan = await res.json();
      saveToHistory();
      setRooms(plan.data.rooms ?? []);
      setDevices(plan.data.devices ?? []);
      setDrawnLines(plan.data.drawnLines ?? []);
      setTexts(plan.data.texts ?? []);
      setPlanId(plan.id);
      setPlanName(plan.name);
      setSelectedId(null);
      setIsPlansOpen(false);
    } catch (err) {
      console.error('Не удалось загрузить план:', err);
      alert('Не удалось загрузить план.');
    }
  };
```

- [ ] **Step 4: Add the toolbar UI**

In the settings/controls row (starts at line 435), add a new group after the
undo button (after line 440's closing `</button>`, before the existing
magnet/auto-route/large-icons toggle group at line 442):

```tsx
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 border border-border rounded-md bg-secondary/50">
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder={t.planNamePlaceholder}
              className="text-xs sm:text-sm bg-transparent outline-none w-24 sm:w-36 text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSave}
              disabled={!planName.trim() || isSaving}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium ${!planName.trim() || isSaving ? 'opacity-50 cursor-not-allowed text-muted-foreground' : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30'}`}
            >
              {t.savePlan}
            </button>
            <div className="relative">
              <button
                onClick={() => { setIsPlansOpen(!isPlansOpen); if (!isPlansOpen) fetchSavedPlans(); }}
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                {t.myPlans}
              </button>
              {isPlansOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-background border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {savedPlans.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground">{t.noSavedPlans}</p>
                  ) : (
                    savedPlans.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleLoad(p.id)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-muted border-b border-border last:border-0"
                      >
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 6: Manual verification**

In the running dev server (signed in as an admin so `useUser()` returns a
real user): type a plan name, place a room/device, click Save — no error
alert should appear. Click "Мои планы" — the just-saved plan should appear
in the dropdown. Make a change (move the room), click "Мои планы" again,
click the saved plan name — canvas should revert to the saved state (the
room back at its saved position). Refresh the whole page, click "Мои планы"
— the plan should still be listed (confirms it round-tripped through Neon,
not just component state).

- [ ] **Step 7: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "feat: wire save/load UI to SBA planner persistence API"
```

---

### Task 6: Watermark performance fix

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `watermarkGrid` useMemo (lines 346-354), the watermark `<Layer>` (lines 507-524).
- Produces: nothing consumed by later tasks — fully self-contained visual change.

- [ ] **Step 1: Replace the 121-node text grid with a single tiled pattern image**

Remove the `watermarkGrid` useMemo (lines 346-354) entirely — it's no longer
needed once the grid is drawn as one image instead of 121 positioned `Text`
nodes.

Add a new state + effect to build the pattern once on mount, near the other
`useEffect` calls (after the fullscreen-resize effect, around line 128):

```ts
  const [watermarkPattern, setWatermarkPattern] = useState<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const tile = document.createElement('canvas');
    tile.width = 400;
    tile.height = 400;
    const ctx = tile.getContext('2d');
    if (ctx) {
      ctx.translate(200, 200);
      ctx.rotate((-30 * Math.PI) / 180);
      ctx.font = 'bold 60px monospace';
      ctx.fillStyle = 'rgba(136, 136, 136, 0.06)';
      ctx.textAlign = 'center';
      ctx.fillText('RS STUDIO', 0, 0);
    }
    setWatermarkPattern(tile);
  }, []);
```

(Opacity is baked into the fill color here — `rgba(...,0.06)` — roughly
double the old per-node `0.03` since there's now one visible tile per 400px
instead of dense 800px-spaced repeats layered by eye; verify visually in
Step 3 and adjust the alpha value if it reads too strong or too faint.)

Replace the watermark `<Layer>` (lines 507-524) with:

```tsx
          <Layer listening={false}>
             {watermarkPattern && (
                <Rect
                   x={-4000} y={-4000} width={8000} height={8000}
                   fillPatternImage={watermarkPattern}
                   fillPatternRepeat="repeat"
                   listening={false}
                />
             )}
          </Layer>
```

`Rect` and `Text` are both already imported from `react-konva` at the top of
the file (`Text` stays imported — still used for device labels, room
dimensions, etc. elsewhere in the file).

- [ ] **Step 2: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 3: Manual verification**

In the running dev server, open the planner, pan and zoom around the empty
canvas. Confirm the "RS STUDIO" watermark still tiles visibly across the
background at roughly the same faintness as before (compare against a
screenshot from before this task if unsure), and that panning/zooming feels
at least as smooth as before (this is the actual point of the change — one
`Rect` instead of 121 `Text` nodes should noticeably reduce redraw cost on
every pan/zoom frame, though "smoother" is a qualitative check here since
there's no perf test harness in this project).

- [ ] **Step 4: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "perf: replace 121-node watermark grid with single tiled pattern"
```

---

### Task 7: Object list panel

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `rooms`, `devices`, `texts` state, `selectedId`/`setSelectedId`, `t` translations.
- Produces: nothing consumed by later tasks — self-contained UI addition.

- [ ] **Step 1: Add translation strings**

```ts
  objectList: 'Объекты', objectListEmpty: 'Пока пусто', showList: 'Список', hideList: 'Скрыть список',
```

- [ ] **Step 2: Add panel-visibility state**

Near the other UI-toggle state (`isFullscreen`, etc., around line 83), add:

```ts
  const [isListOpen, setIsListOpen] = useState(false);
```

- [ ] **Step 3: Add a toggle button in the controls row**

In the export/zoom button cluster (lines 473-486), add a new button before
the existing PNG-export button (before line 474):

```tsx
            <button onClick={() => setIsListOpen(!isListOpen)} className={`flex items-center justify-center p-1 sm:p-1.5 rounded transition-colors ${isListOpen ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`} title={isListOpen ? t.hideList : t.showList}>
              <SquareTerminal size={14} />
            </button>
```

(Reusing the `SquareTerminal` icon again is a little repetitive visually
with the text-tool button — if that reads confusingly once both are on
screen together during manual verification, swap this one for `Box`, which
is also already imported and unused for a toggle-list purpose.)

- [ ] **Step 4: Render the panel**

Inside the canvas container `<div>` (starts at line 496), add the panel as a
sibling to the `<Stage>`, right after the `<Stage>...</Stage>` block closes
(after line 727, before the bottom-right stats/edit panel `<div>` at line 729):

```tsx
        {isListOpen && (
          <div className="absolute top-3 left-3 w-56 max-h-[calc(100%-24px)] overflow-y-auto bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-sm z-20">
            <div className="px-3 py-2 border-b border-border text-[10px] sm:text-xs font-semibold uppercase text-muted-foreground sticky top-0 bg-background/95">
              {t.objectList}
            </div>
            {rooms.length === 0 && devices.length === 0 && texts.length === 0 ? (
              <p className="p-3 text-xs text-muted-foreground">{t.objectListEmpty}</p>
            ) : (
              <div className="p-1">
                {rooms.map((r) => (
                  <button key={r.id} onClick={() => setSelectedId(r.id)} className={`w-full text-left px-2 py-1.5 text-xs rounded truncate ${selectedId === r.id ? 'bg-blue-600 text-white' : 'hover:bg-muted text-foreground'}`}>
                    {t.block} {(r.width * M_PER_PX).toFixed(1)}×{(r.height * M_PER_PX).toFixed(1)}
                  </button>
                ))}
                {devices.map((d) => (
                  <button key={d.id} onClick={() => setSelectedId(d.id)} className={`w-full text-left px-2 py-1.5 text-xs rounded truncate ${selectedId === d.id ? 'bg-blue-600 text-white' : 'hover:bg-muted text-foreground'}`}>
                    {t[d.type] || d.type} — {d.label}
                  </button>
                ))}
                {texts.map((tx) => (
                  <button key={tx.id} onClick={() => setSelectedId(tx.id)} className={`w-full text-left px-2 py-1.5 text-xs rounded truncate ${selectedId === tx.id ? 'bg-blue-600 text-white' : 'hover:bg-muted text-foreground'}`}>
                    {t.text}: {tx.content}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
```

`t[d.type]` relies on the `t` object already having an entry per `DeviceType`
— checked against the type union at line 15 and the `t` object at line 24:
every device type used by `addDevice(...)` call sites already has a matching
`t` key (`camera`, `switch`, `nvr`, `monitor`, `rack`, `router`, `lan_switch`,
`wifi`, `pc`, `printer`, `socket`, `smoke`, `heat`, `linear`, `siren`,
`tableau`, `call_point`, `panel`, `lock`, `reader`, `acs_switch`, `exit_btn`,
`controller`, `door`) — no gaps, `t[d.type] || d.type` fallback is defensive
but shouldn't ever hit the fallback in practice.

- [ ] **Step 5: Typecheck**

Run: `npx tsc`
Expected: no errors. If `t[d.type]` produces a TS index-signature error
(the `t` object's inferred type may not have a string index signature),
type the lookup as `t[d.type as keyof typeof t]` instead.

- [ ] **Step 6: Manual verification**

In the running dev server, place a couple of rooms, devices, and a text
annotation. Click the list-toggle button — panel should appear top-left
listing all placed items with readable labels. Click an item in the list —
it should become selected on the canvas (blue highlight, floating edit panel
appears). Click the toggle again — panel should close.

- [ ] **Step 7: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "feat: add object list panel to SBA planner"
```

---

### Task 8: Redo

**Files:**
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `history` state, `saveToHistory`, `handleUndo` (lines 75, 94-105).
- Produces: `handleRedo` — no other task depends on it.

- [ ] **Step 1: Add a redo stack and rewrite undo to push onto it**

Line 75 currently:

```ts
  const [history, setHistory] = useState<string[]>([]);
```

Add a sibling state directly after it:

```ts
  const [redoStack, setRedoStack] = useState<string[]>([]);
```

`saveToHistory` (lines 94-97) currently only pushes onto `history`. It's
called before every mutation, which is also the correct moment to clear
`redoStack` (a fresh action invalidates any previously-undone future):

```ts
  const saveToHistory = () => {
    const stateStr = JSON.stringify({ rooms, devices, drawnLines, texts });
    setHistory(prev => [...prev.slice(-20), stateStr]);
    setRedoStack([]);
  };
```

(Note: `texts` is included here because Task 3 added it to component state —
if Task 3 hasn't run yet in a partial-implementation scenario, drop `texts`
from this line; the working tree should never have this task applied without
Task 3, since `texts` wouldn't exist yet and this would be a compile error.)

`handleUndo` (lines 99-105) currently:

```ts
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastStateStr = history[history.length - 1];
    const lastState = JSON.parse(lastStateStr);
    setRooms(lastState.rooms); setDevices(lastState.devices); setDrawnLines(lastState.drawnLines);
    setHistory(prev => prev.slice(0, -1)); setSelectedId(null);
  };
```

Change to push the pre-undo state onto `redoStack` before restoring:

```ts
  const handleUndo = () => {
    if (history.length === 0) return;
    const currentStateStr = JSON.stringify({ rooms, devices, drawnLines, texts });
    const lastStateStr = history[history.length - 1];
    const lastState = JSON.parse(lastStateStr);
    setRooms(lastState.rooms); setDevices(lastState.devices); setDrawnLines(lastState.drawnLines); setTexts(lastState.texts ?? []);
    setHistory(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, currentStateStr]);
    setSelectedId(null);
  };
```

- [ ] **Step 2: Add `handleRedo`**

Directly after `handleUndo`:

```ts
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const currentStateStr = JSON.stringify({ rooms, devices, drawnLines, texts });
    const nextStateStr = redoStack[redoStack.length - 1];
    const nextState = JSON.parse(nextStateStr);
    setRooms(nextState.rooms); setDevices(nextState.devices); setDrawnLines(nextState.drawnLines); setTexts(nextState.texts ?? []);
    setRedoStack(prev => prev.slice(0, -1));
    setHistory(prev => [...prev, currentStateStr]);
    setSelectedId(null);
  };
```

- [ ] **Step 3: Add the redo translation string and toolbar button**

Add to `t`:

```ts
  redo: 'Вперёд',
```

Next to the existing undo button (lines 438-440), add a redo button
immediately after it:

```tsx
          <button onClick={handleRedo} disabled={redoStack.length === 0} className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-secondary text-secondary-foreground border border-border rounded-md transition-all text-[10px] sm:text-xs font-medium ${redoStack.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`} title={t.redo}>
              <RotateCcw size={14} className="scale-x-[-1]" /> <span className="hidden sm:inline">{t.redo}</span>
          </button>
```

(`RotateCcw` mirrored horizontally via `scale-x-[-1]` reads as a "forward"
icon without importing a new icon from `lucide-react` — cheap and consistent
with how the file already treats iconography.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 5: Manual verification**

In the running dev server: place a room, move it, place a device. Click
Undo twice (device disappears, then room reverts to original position).
Click Redo twice (room moves back, device reappears). Now place a NEW
device instead of clicking Redo after only one Undo — confirm the Redo
button becomes disabled again (the new action correctly invalidated the
stale redo branch).

- [ ] **Step 6: Commit**

```bash
git add src/components/SbaPlanner.tsx
git commit -m "feat: add redo to SBA planner undo history"
```

---

### Task 9: Branded PDF export (plan + price table)

**Files:**
- Create: `src/components/pdf/PlannerQuoteTemplate.tsx`
- Modify: `src/components/SbaPlanner.tsx`

**Interfaces:**
- Consumes: `renderQuotePdf` from `src/lib/pdf/renderQuotePdf.ts` (existing, unchanged signature: `(element: HTMLElement, filename: string) => Promise<void>`). Consumes `devices` (with `price` from Task 4), `stageRef` (existing). Consumes the visual pattern of `src/components/pdf/QuoteTemplate.tsx` (read it first — don't guess its structure).
- Produces: nothing consumed by later tasks — this is the last task in the plan.

- [ ] **Step 1: Match the existing quote template's conventions exactly**

`src/components/pdf/QuoteTemplate.tsx` (already read while writing this plan)
sets three hard conventions this task must follow, not just take inspiration
from:

1. It's a `forwardRef<HTMLDivElement, Props>` component — the ref is
   attached to the template's own root `<div>`, not to an external wrapper.
2. Every style is inline (`style={{...}}`) with explicit hex/rgb colors —
   deliberately not Tailwind classes or theme CSS variables, so the
   `html2canvas` capture is always light-background/dark-text regardless of
   whether the site is currently in dark mode. This is called out explicitly
   in that file's comment (lines 20-24) — the same reasoning applies here
   unchanged.
3. Fonts are `Manrope, system-ui, sans-serif` for body text and
   `Unbounded, sans-serif` for the brand/display heading, brand red is
   `#dc2626`, page width is `794` (px, ~210mm at 96dpi).

`CartDrawer.tsx:334-341` shows the exact off-screen wrapper pattern:

```tsx
<div style={{ position: "fixed", left: -9999, top: 0, pointerEvents: "none" }} aria-hidden="true">
  <QuoteTemplate ref={quoteRef} estimate={estimate} name={name} phone={phone} docNumber={quoteMeta.docNumber} date={quoteMeta.date} />
</div>
```

Task 9 Step 3 below reproduces this exact wrapper for `PlannerQuoteTemplate`.

- [ ] **Step 2: Write `src/components/pdf/PlannerQuoteTemplate.tsx`**

```tsx
import { forwardRef } from "react"

interface PlannerQuoteItem {
  label: string
  qty: number
  price: number
}

interface PlannerQuoteTemplateProps {
  planImageDataUrl: string
  planName: string
  items: PlannerQuoteItem[]
  total: number
  docNumber: string
  date: string
}

// Тот же паттерн, что и QuoteTemplate.tsx — inline-стили с явными hex,
// не Tailwind/CSS-переменные темы, чтобы html2canvas всегда снимал
// светлый документ независимо от текущей темы сайта. См. комментарий в
// QuoteTemplate.tsx для полного обоснования.
export const PlannerQuoteTemplate = forwardRef<HTMLDivElement, PlannerQuoteTemplateProps>(
  ({ planImageDataUrl, planName, items, total, docNumber, date }, ref) => {
    const cell: React.CSSProperties = { padding: "10px 12px", fontSize: 12 }

    return (
      <div
        ref={ref}
        style={{
          width: 794,
          background: "#ffffff",
          color: "#0f172a",
          fontFamily: "Manrope, system-ui, sans-serif",
          padding: 48,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#dc2626", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 900, fontSize: 18, letterSpacing: "-0.02em" }}>
                SBA <span style={{ color: "#64748b", fontWeight: 500 }}>Актау</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.05em" }}>Система безопасности Актау</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>План № {docNumber}</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{date}</div>
          </div>
        </div>

        <div style={{ height: 2, background: "#dc2626", marginBottom: 24 }} />

        <h1 style={{ fontFamily: "Unbounded, sans-serif", fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>
          {planName}
        </h1>
        <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 20px" }}>План объекта и смета оборудования</p>

        <img
          src={planImageDataUrl}
          alt={planName}
          style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 4, marginBottom: 24, display: "block" }}
        />

        {items.length > 0 && (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ ...cell, textAlign: "left", color: "#64748b", fontWeight: 700 }}>Оборудование</th>
                  <th style={{ ...cell, textAlign: "right", width: 70, color: "#64748b", fontWeight: 700 }}>Кол-во</th>
                  <th style={{ ...cell, textAlign: "right", width: 100, color: "#64748b", fontWeight: 700 }}>Цена</th>
                  <th style={{ ...cell, textAlign: "right", width: 110, color: "#64748b", fontWeight: 700 }}>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ ...cell, fontWeight: 600 }}>{item.label}</td>
                    <td style={{ ...cell, textAlign: "right" }}>{item.qty}</td>
                    <td style={{ ...cell, textAlign: "right" }}>{item.price.toLocaleString("ru-RU")} ₸</td>
                    <td style={{ ...cell, textAlign: "right", fontWeight: 700 }}>{(item.price * item.qty).toLocaleString("ru-RU")} ₸</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
              <div style={{ width: 280 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderTop: "2px solid #0f172a",
                    fontSize: 15,
                  }}
                >
                  <span style={{ fontWeight: 900, textTransform: "uppercase" }}>Итого (оборудование)</span>
                  <span style={{ fontWeight: 900 }}>{total.toLocaleString("ru-RU")} ₸</span>
                </div>
              </div>
            </div>
          </>
        )}

        <p style={{ fontSize: 10.5, color: "#64748b", lineHeight: 1.5, marginBottom: 32 }}>
          Указанная сумма — стоимость оборудования по данным плана. Монтажные работы рассчитываются отдельно. Данный документ не является публичной офертой.
        </p>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
          <span>ТОО «Система безопасности Актау» · Актау, Мангистауская область</span>
          <span>+7 777 920 49 88 · toosba.kz</span>
        </div>
      </div>
    )
  },
)

PlannerQuoteTemplate.displayName = "PlannerQuoteTemplate"
```

- [ ] **Step 3: Add export-document state and handler to `SbaPlanner.tsx`**

Add near the other refs/state (after `containerRef`, around line 92):

```ts
  const [exportData, setExportData] = useState<{ planImageDataUrl: string; items: { label: string; qty: number; price: number }[]; total: number } | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
```

Add the translation string:

```ts
  savePdf: 'Экспорт КП',
```

Replace `handleExportPng` (lines 107-121) — rename it and change what it does
at the end: instead of downloading a PNG directly, it now computes the
equipment table and stages `exportData`, which triggers rendering the
(off-screen) `PlannerQuoteTemplate`, which a `useEffect` then hands to
`renderQuotePdf`:

```ts
  const handleExportDocument = () => {
    setSelectedId(null);
    setDrawMode({ active: false, type: 'cable', category: 'arch' });
    setTimeout(() => {
      if (!stageRef.current) return;
      const planImageDataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });

      const priced = devices.filter(d => d.price && d.price > 0);
      const grouped = new Map<string, { label: string; qty: number; price: number }>();
      priced.forEach(d => {
        const key = `${d.label}__${d.price}`;
        const existing = grouped.get(key);
        if (existing) existing.qty += 1;
        else grouped.set(key, { label: d.label, qty: 1, price: d.price! });
      });
      const items = Array.from(grouped.values());
      const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

      setExportData({ planImageDataUrl, items, total });
    }, 50);
  };

  useEffect(() => {
    if (!exportData || !exportRef.current) return;
    (async () => {
      const { renderQuotePdf } = await import('@/lib/pdf/renderQuotePdf');
      await renderQuotePdf(exportRef.current!, `sba-plan-${Date.now()}.pdf`);
      setExportData(null);
    })();
  }, [exportData]);
```

(Dynamic `import('@/lib/pdf/renderQuotePdf')` matches the existing pattern
already used in `CartDrawer.tsx` — keeps html2canvas+jsPDF out of the main
bundle until an export is actually requested.)

Update the export button (line 474, currently calling `handleExportPng`) to
call `handleExportDocument` and use the new `t.savePdf` label instead of
`t.savePng` (which can stay in the `t` object even if unused now — trivial
either way, but removing it isn't required by anything else).

Add the off-screen render target near the end of the component's JSX, as a
sibling to the top-level container `<div>` returned from the component (i.e.
just before the final closing `</div>` at line 803). This must match
`CartDrawer.tsx:334-341`'s wrapper exactly — `ref` goes on
`PlannerQuoteTemplate` itself (it's a `forwardRef` component from Task 9
Step 2), not on an extra wrapping `<div>`:

```tsx
        {exportData && (
          <div style={{ position: 'fixed', left: -9999, top: 0, pointerEvents: 'none' }} aria-hidden="true">
            <PlannerQuoteTemplate
              ref={exportRef}
              planImageDataUrl={exportData.planImageDataUrl}
              planName={planName || 'План объекта'}
              items={exportData.items}
              total={exportData.total}
              docNumber={String(Date.now()).slice(-6)}
              date={new Date().toLocaleDateString('ru-RU')}
            />
          </div>
        )}
```

Add the import at the top of the file:

```ts
import { PlannerQuoteTemplate } from '@/components/pdf/PlannerQuoteTemplate';
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc`
Expected: no errors.

- [ ] **Step 5: Lint**

Run: `npx eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0`
Expected: no new errors (the existing 3 pre-existing `react-refresh` warnings
in unrelated files are fine, don't try to fix those as part of this task).

- [ ] **Step 6: Manual verification**

In the running dev server: place 2-3 devices, give at least two of them the
same label+price (to verify grouping/qty works) and one a different price,
add a room and some text for visual completeness, click "Экспорт КП" —
after a brief pause a PDF should download. Open it and confirm: the plan
image is visible and matches the canvas, the equipment table shows the
grouped items with correct qty/price/line-total, the total at the bottom
matches `sum(price * qty)` by hand-checking the numbers, and devices with no
price set are correctly excluded from the table.

- [ ] **Step 7: Regression-check the existing cart quote export**

Since `renderQuotePdf` is now called from two places, confirm the original
flow still works: on any service page or the homepage, add an item to the
cart, open the cart drawer, submit the contact form (which triggers the
existing `renderQuotePdf(quoteRef.current, ...)` call in `CartDrawer.tsx`).
Confirm a PDF still downloads with the cart's own template, unaffected by
this task's changes (nothing in this task modified `renderQuotePdf.ts`
itself or `CartDrawer.tsx`, so this should be a no-op check, but confirm it
directly rather than assuming).

- [ ] **Step 8: Commit**

```bash
git add src/components/SbaPlanner.tsx src/components/pdf/PlannerQuoteTemplate.tsx
git commit -m "feat: branded PDF export combining plan snapshot and priced equipment table"
```

---

## Post-plan cleanup

After all 9 tasks: run `npx tsc && npx eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` one final time against the fully merged result (not just per-task), then do one full manual pass through the planner in the running dev server exercising every feature added across all 9 tasks together (text + price + save + load + export + list panel + redo + watermark) in a single session, since tasks were verified individually but not yet as a whole.

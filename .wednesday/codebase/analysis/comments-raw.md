# Comment Collection — Raw Preprocessing

> Generated: 2026-06-13T07:22:25.539Z
> Files with comments: 60 | Modules: 31 | Tagged: 9 | Substantive untagged: 343
> LLM enrichment: **not run yet** — this file is the pre-LLM view

## Global tag breakdown

| Tag | Count |
|-----|-------|
| `TEMP` | 8 |
| `NOTE` | 1 |

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts/` — 9 files, 0 tagged, 62 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\embed-tokens.cjs`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\generate-slide.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\generate-tokens.cjs`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\html-token-validator.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\search-slides.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\slide-token-validator.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\slide_search_core.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\validate-tokens.cjs`

**Substantive untagged (62):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\embed-tokens.cjs`:5 — Use when generating standalone HTML files (infographics, slides, etc.)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\embed-tokens.cjs`:9 — node embed-tokens.cjs --minimal # Output only commonly used tokens
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\embed-tokens.cjs`:10 — node embed-tokens.cjs --style   # Wrap in <style> tags
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:51 — Try semantic tokens first (preferred) - resolve references
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:71 — Fallback: find first color palette with 500 value (primary)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:141 — Curated high-quality images from Pexels (free to use, pre-selected for brand aesthetic)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:3 — Fetches real images from Pexels for slide backgrounds.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:4 — Uses web scraping (no API key required) or WebFetch tool integration.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:21 — Resolve token reference like {primitive.color.ocean-blue.500} to hex value.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design-system\scripts\fetch-background.py`:42 — Resolves semantic token references to actual hex values.
- *...and 52 more*

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip/` — 4 files, 0 tagged, 46 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\core.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\render-html.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\search.py`

**Substantive untagged (46):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\core.py`:190 — Search style (use industry style if not specified)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\core.py`:3 — CIP Design Core - BM25 search engine for Corporate Identity Program design guidelines
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\core.py`:185 — Generate a comprehensive CIP brief for a brand
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:52 — Convert to RGB if necessary (Gemini works best with RGB)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:135 — Construct the prompt - different for image editing vs pure generation
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:137 — Image editing prompt: instructs to USE the provided logo image
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:236 — Build contents: either just prompt or [prompt, image] for image editing
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:238 — Image editing mode: pass both prompt and logo image
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:385 — Generate with Pro model (higher quality, 4K text)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\cip\generate.py`:418 — Check if logo is provided, prompt user if not
- *...and 36 more*

---

## `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts/` — 3 files, 0 tagged, 39 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\core.py`, `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`, `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\search.py`

**Substantive untagged (39):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\core.py`:203 — ", "rgb", "token", "semantic", "accent", "destructive", "muted", "foreground"],
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\core.py`:3 — UI/UX Pro Max Core - BM25 search engine for UI/UX style guides
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:138 — Second: score by keyword match in all fields
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:165 — Step 1: First search product to get category
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:172 — Step 2: Get reasoning rules for this category
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:176 — Step 3: Multi-domain search with style priority hints
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:180 — Step 4: Select best matches from each domain using priority
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:192 — Combine effects from both reasoning and style search
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:230 — Keep legacy keys for backward compat in MASTER.md
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\design_system.py`:597 — If page is specified, create page override file with intelligent content
- *...and 29 more*

---

## `src\skills\ui-ux-pro-max-skill\cli\assets\scripts/` — 3 files, 0 tagged, 38 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\core.py`, `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`, `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\search.py`

**Substantive untagged (38):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\core.py`:188 — ", "rgb", "token", "semantic", "accent", "destructive", "muted", "foreground"],
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\core.py`:3 — UI/UX Pro Max Core - BM25 search engine for UI/UX style guides
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:138 — Second: score by keyword match in all fields
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:165 — Step 1: First search product to get category
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:172 — Step 2: Get reasoning rules for this category
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:176 — Step 3: Multi-domain search with style priority hints
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:180 — Step 4: Select best matches from each domain using priority
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:192 — Combine effects from both reasoning and style search
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:230 — Keep legacy keys for backward compat in MASTER.md
- `src\skills\ui-ux-pro-max-skill\cli\assets\scripts\design_system.py`:597 — If page is specified, create page override file with intelligent content
- *...and 28 more*

---

## `src\components/` — 20 files, 0 tagged, 27 substantive

**Files:** `src\components\Calculator.tsx`, `src\components\Cta.tsx`, `src\components\Features.tsx`, `src\components\Footer.tsx`, `src\components\GlobalBackground.tsx`, `src\components\Hero.tsx`, `src\components\HowItWorks.tsx`, `src\components\mode-toggle.tsx`, `src\components\Navbar.tsx`, `src\components\NotFound.tsx`, `src\components\Preloader.tsx`, `src\components\Projects.tsx`, `src\components\SbaPlanner.tsx`, `src\components\ScrollToTop.tsx`, `src\components\SeoBlock.tsx`, `src\components\Services.tsx`, `src\components\smooth-scroll.tsx`, `src\components\Statistics.tsx`, `src\components\Testimonials.tsx`, `src\components\theme-provider.tsx`

**Substantive untagged (27):** developer explanations, architecture notes, etc.

- `src\components\Calculator.tsx`:31 — Исправлена опечатка (170 000 вместо 1 700 000)
- `src\components\Calculator.tsx`:44 — Динамическая стоимость монтажа в зависимости от типа объекта
- `src\components\Calculator.tsx`:119 — --- ЛОГИКА ПОШАГОВОГО КВИЗА (ТЕПЕРЬ 5 ШАГОВ) ---
- `src\components\Cta.tsx`:147 — ИСПРАВЛЕНИЕ: ВЫНОСИМ МОДАЛКУ В ПОРТАЛ НА УРОВЕНЬ BODY
- `src\components\Footer.tsx`:279 — ИСПРАВЛЕНИЕ ТУТ: flex-grow и overflow-y-auto, чтобы скроллился только этот блок, а не вся страница
- `src\components\Footer.tsx`:47 — Жесткая блокировка скролла для всех устройств, включая iOS
- `src\components\Footer.tsx`:191 — wa.me/77064230090" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-2 justify
- `src\components\Footer.tsx`:236 — wa.me/77064230090" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
- `src\components\Footer.tsx`:245 — ИСПРАВЛЕНИЕ ТУТ: fixed inset-0 и overflow-hidden чтобы сама обертка не скроллилась
- `src\components\Footer.tsx`:397 — wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center text-whit
- *...and 17 more*

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo/` — 3 files, 0 tagged, 24 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\core.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\search.py`

**Substantive untagged (24):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\core.py`:137 — ", "rgb", "blue", "red", "green", "gold", "warm", "cool", "vibrant", "pastel"],
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\core.py`:3 — Logo Design Core - BM25 search engine for logo design guidelines
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:61 — Gemini "Nano Banana" model configurations for image generation
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:160 — Set aspect ratio (default to 1:1 for logos)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:169 — Generate image using Gemini with image generation capability
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:3 — Logo Generation Script using Gemini Nano Banana API
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:4 — Uses Gemini 2.5 Flash Image and Gemini 3 Pro Image Preview models
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:7 — - Nano Banana (default): gemini-2.5-flash-image - fast, high-volume, low-latency
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:8 — - Nano Banana Pro (--pro): gemini-3-pro-image-preview - professional quality, advanced reasoning
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\logo\generate.py`:11 — python generate.py --prompt "tech startup logo minimalist blue"
- *...and 14 more*

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon/` — 1 file, 0 tagged, 20 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`

**Substantive untagged (20):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:155 — Try to find <svg> within the extracted text
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:171 — If no currentColor was present, add fill/stroke color
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:3 — Icon Generation Script using Gemini 3.1 Pro Preview API
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:4 — Generates SVG icons via text generation (SVG is XML text format)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:6 — Model: gemini-3.1-pro-preview - best thinking, token efficiency, factual consistency
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:9 — python generate.py --prompt "settings gear icon" --style outlined
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:10 — python generate.py --prompt "shopping cart" --style filled --color "#6366F1"
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:11 — python generate.py --name "dashboard" --category navigation --style duotone
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:12 — python generate.py --prompt "cloud upload" --batch 4 --output-dir ./icons
- `src\skills\ui-ux-pro-max-skill\.claude\skills\design\scripts\icon\generate.py`:97 — - Output ONLY valid SVG code, nothing else
- *...and 10 more*

---

## `src\skills\ui-ux-pro-max-skill\cli\src\utils/` — 5 files, 4 tagged, 16 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\cli\src\utils\detect.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\utils\github.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\utils\logger.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\utils\template.ts`

**Tagged (4):** 4× TEMP

| Severity | Tag | File | Line | Comment |
|----------|-----|------|------|---------|
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts` | 99 | Create a directory for extracting ZIP files |
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts` | 106 | Find the extracted folder inside directory |
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts` | 130 | Create directory |
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts` | 134 | Extract ZIP to directory |

**Substantive untagged (16):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`:107 — GitHub release ZIPs often contain a single root folder
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`:123 — Install from a downloaded and extracted ZIP file
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`:46 — Deduplicate folders (e.g., .shared might be listed multiple times)
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`:113 — If there's exactly one directory, it's likely the extracted root
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\extract.ts`:137 — Find the actual root of the extracted content
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\github.ts`:91 — First try to find an uploaded ZIP asset
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\template.ts`:121 — When isGlobal=true, rewrites script paths to use ~/{root}/ prefix
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\template.ts`:183 — Generate platform files for a specific AI type
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\template.ts`:184 — All platforms use self-contained installation with data and scripts
- `src\skills\ui-ux-pro-max-skill\cli\src\utils\template.ts`:185 — When isGlobal=true, installs to ~/home directory with absolute script paths
- *...and 6 more*

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts/` — 4 files, 0 tagged, 14 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`, `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\inject-brand-context.cjs`, `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\sync-brand-to-tokens.cjs`, `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\validate-asset.cjs`

**Substantive untagged (14):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:5 — Extract dominant colors from an image and compare against brand palette.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:6 — Uses pure Node.js without external image processing dependencies.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:8 — For full color extraction from images, integrate with ai-multimodal skill
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:14 — node extract-colors.cjs --palette  # Show brand palette from guidelines
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:17 — For image color analysis, use: ai-multimodal skill or ImageMagick
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:18 — magick <image> -colors 10 -depth 8 -format "%c" histogram:info:
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\extract-colors.cjs`:146 — Distance threshold: 50 (out of max ~441 for RGB)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\inject-brand-context.cjs`:193 — Extract base prompt template (content between ``` blocks after "Base Prompt Template")
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\inject-brand-context.cjs`:245 — Extract example prompts (content between ``` blocks after specific headers)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\brand\scripts\sync-brand-to-tokens.cjs`:94 — Generate color scale from base color (simple approach)
- *...and 4 more*

---

## `ios\App\App/` — 1 file, 1 tagged, 11 substantive

**Files:** `ios\App\App\AppDelegate.swift`

**Tagged (1):** 1× TEMP

| Severity | Tag | File | Line | Comment |
|----------|-----|------|------|---------|
| 🟡 | `TEMP` | `ios\App\App\AppDelegate.swift` | 15 | Sent when the application is about to move from active to inactive state. This can occur for certain |

**Substantive untagged (11):** developer explanations, architecture notes, etc.

- `ios\App\App\AppDelegate.swift`:16 — Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
- `ios\App\App\AppDelegate.swift`:20 — Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your applica
- `ios\App\App\AppDelegate.swift`:21 — If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
- `ios\App\App\AppDelegate.swift`:25 — Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
- `ios\App\App\AppDelegate.swift`:29 — Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optio
- `ios\App\App\AppDelegate.swift`:33 — Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
- `ios\App\App\AppDelegate.swift`:37 — Called when the app was launched with a url. Feel free to add additional processing here,
- `ios\App\App\AppDelegate.swift`:38 — but if you want the App API to support tracking app url opens, make sure to keep this call
- `ios\App\App\AppDelegate.swift`:43 — Called when the app was launched with an activity, including Universal Links.
- `ios\App\App\AppDelegate.swift`:44 — Feel free to add additional processing here, but if you want the App API to support
- *...and 1 more*

---

## `src\skills\ui-ux-pro-max-skill\cli\src\commands/` — 4 files, 2 tagged, 7 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\commands\uninstall.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\commands\update.ts`, `src\skills\ui-ux-pro-max-skill\cli\src\commands\versions.ts`

**Tagged (2):** 2× TEMP

| Severity | Tag | File | Line | Comment |
|----------|-----|------|------|---------|
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts` | 65 | Cleanup directory |
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts` | 70 | Cleanup directory on error |

**Substantive untagged (7):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`:33 — Try to install from GitHub release (legacy method)
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`:34 — Returns the copied folders if successful, null if failed
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`:21 — From dist/index.js -> ../assets (one level up to cli/, then assets/)
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`:159 — Use legacy ZIP-based install if --legacy flag is set
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\init.ts`:173 — Fall back to bundled assets if GitHub failed or offline mode
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\uninstall.ts`:18 — Remove skill directory for a given AI type
- `src\skills\ui-ux-pro-max-skill\cli\src\commands\uninstall.ts`:31 — Skip non-existent dirs; re-throw permission or other errors

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts/` — 2 files, 0 tagged, 8 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\shadcn_add.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`

**Substantive untagged (8):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\shadcn_add.py`:4 — Add shadcn/ui components to project with automatic dependency handling.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\shadcn_add.py`:212 — # Dry run (show what would be done)
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:202 — Remove plugin array from JSON (we'll add it with require())
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:5 — Supports colors, fonts, spacing, breakpoints, and plugin recommendations.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:28 — typescript: If True, generate .ts config, else .js
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:82 — Value can be hex (#3b82f6) or variable (hsl(var(--primary)))
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:91 — Add full color palette (50-950 shades) for a base color.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tailwind_config_gen.py`:95 — base_color: Base color in oklch format or hex

---

## `src\skills\ui-ux-pro-max-skill\cli\assets\data/` — 1 file, 0 tagged, 8 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`

**Substantive untagged (8):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:100 — ─── New color definitions: (primary, secondary, accent, bg, notes) ──────────
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:101 — Grouped by category for clarity. Each tuple generates a full 16-token row.
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:103 — ── Old #97-#116 that never got colors ──
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:147 — EC4899","#F59E0B","#2563EB","#FFFFFF","Viral pink + comedy yellow + share blue"),
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:173 — 2563EB","#F59E0B","#EC4899","#EFF6FF","Learning blue + play yellow + fun pink"),
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:2 — Sync colors.csv and ui-reasoning.csv with the updated products.csv (161 entries).
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:5 — - Add new entries for missing product types
- `src\skills\ui-ux-pro-max-skill\cli\assets\data\_sync_all.py`:43 — Generate full 16-token color row from 4 base colors.

---

## `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data/` — 1 file, 0 tagged, 8 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`

**Substantive untagged (8):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:100 — ─── New color definitions: (primary, secondary, accent, bg, notes) ──────────
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:101 — Grouped by category for clarity. Each tuple generates a full 16-token row.
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:103 — ── Old #97-#116 that never got colors ──
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:147 — EC4899","#F59E0B","#2563EB","#FFFFFF","Viral pink + comedy yellow + share blue"),
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:173 — 2563EB","#F59E0B","#EC4899","#EFF6FF","Learning blue + play yellow + fun pink"),
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:2 — Sync colors.csv and ui-reasoning.csv with the updated products.csv (161 entries).
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:5 — - Add new entries for missing product types
- `src\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\data\_sync_all.py`:43 — Generate full 16-token color row from 4 base colors.

---

## `api/` — 7 files, 0 tagged, 4 substantive

**Files:** `api\delete-project.ts`, `api\get-all-projects.ts`, `api\get-projects.ts`, `api\projects.ts`, `api\telegram.ts`, `api\upload.ts`, `api\users.ts`

**Substantive untagged (4):** developer explanations, architecture notes, etc.

- `api\get-all-projects.ts`:5 — Функция-броня: повторяет запрос, если Neon отвалился из-за fetch failed
- `api\get-all-projects.ts`:11 — Если последняя попытка тоже провалилась — выдаем ошибку
- `api\get-all-projects.ts`:25 — Оборачиваем запрос к БД в нашу функцию withRetry
- `api\users.ts`:16 — Делаем прямой запрос к Clerk API (работает на 100% надежно в любых средах)

---

## `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests/` — 2 files, 1 tagged, 3 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_shadcn_add.py`, `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_tailwind_config_gen.py`

**Tagged (1):** 1× TEMP

| Severity | Tag | File | Line | Comment |
|----------|-----|------|------|---------|
| 🟡 | `TEMP` | `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_shadcn_add.py` | 22 | Create project structure. |

**Substantive untagged (3):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_shadcn_add.py`:195 — Test component addition when npx is not found.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_shadcn_add.py`:213 — Test adding all components in dry run mode.
- `src\skills\ui-ux-pro-max-skill\.claude\skills\ui-styling\scripts\tests\test_tailwind_config_gen.py`:171 — Test that adding same plugin twice doesn't duplicate.

---

## `src\skills\ui-ux-pro-max-skill\cli\src\types/` — 1 file, 1 tagged, 2 substantive

**Files:** `src\skills\ui-ux-pro-max-skill\cli\src\types\index.ts`

**Tagged (1):** 1× NOTE

| Severity | Tag | File | Line | Comment |
|----------|-----|------|------|---------|
| ⚪ | `NOTE` | `src\skills\ui-ux-pro-max-skill\cli\src\types\index.ts` | 47 | .shared is included for platforms that used ZIP installs. Post-ZIP platforms |

**Substantive untagged (2):** developer explanations, architecture notes, etc.

- `src\skills\ui-ux-pro-max-skill\cli\src\types\index.ts`:46 — Legacy folder mapping for backward compatibility with ZIP-based installs.
- `src\skills\ui-ux-pro-max-skill\cli\src\types\index.ts`:48 — (kilocode, warp, augment) include .shared as a no-op for consistent uninstall behavior.

---

## `src/` — 4 files, 0 tagged, 2 substantive

**Files:** `src\App.tsx`, `src\i18n.ts`, `src\main.tsx`, `src\vite-env.d.ts`

**Substantive untagged (2):** developer explanations, architecture notes, etc.

- `src\main.tsx`:18 — Создаем обертку, чтобы Clerk мог реагировать на смену темы и языка
- `src\main.tsx`:23 — Clerk пока не имеет официального 'kz', поэтому для казахского используем английский или русский (по умолчанию ru)

---

## `android\app\src\androidTest\java\com\getcapacitor\myapp/` — 1 file, 0 tagged, 1 substantive

**Files:** `android\app\src\androidTest\java\com\getcapacitor\myapp\ExampleInstrumentedTest.java`

**Substantive untagged (1):** developer explanations, architecture notes, etc.

- `android\app\src\androidTest\java\com\getcapacitor\myapp\ExampleInstrumentedTest.java`:12 — Instrumented test, which will execute on an Android device.

---

## `android\app\src\test\java\com\getcapacitor\myapp/` — 1 file, 0 tagged, 1 substantive

**Files:** `android\app\src\test\java\com\getcapacitor\myapp\ExampleUnitTest.java`

**Substantive untagged (1):** developer explanations, architecture notes, etc.

- `android\app\src\test\java\com\getcapacitor\myapp\ExampleUnitTest.java`:8 — Example local unit test, which will execute on the development machine (host).

---

## `ios\App\CapApp-SPM/` — 1 file, 0 tagged, 1 substantive

**Files:** `ios\App\CapApp-SPM\Package.swift`

**Substantive untagged (1):** developer explanations, architecture notes, etc.

- `ios\App\CapApp-SPM\Package.swift`:4 — DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands

---

## `src\pages/` — 2 files, 0 tagged, 1 substantive

**Files:** `src\pages\Dashboard.tsx`, `src\pages\Home.tsx`

**Substantive untagged (1):** developer explanations, architecture notes, etc.

- `src\pages\Dashboard.tsx`:274 — wa.me/77779204988" target="_blank" rel="noopener noreferrer" className="inline-flex w-full justify-center items-center px-6 py-4 bg-red-600/10 text-re

---

*Raw collection — no LLM involved. Run `wednesday-skills map` with an API key to enrich with purpose, tech debt, and ideas.*
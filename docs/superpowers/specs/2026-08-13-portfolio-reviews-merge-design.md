# Portfolio + Reviews merge — design

## Problem

`Projects.tsx` ("Портфолио") and `Testimonials.tsx` ("Отзывы клиентов") are two
adjacent sections. Testimonials is entirely fabricated — 8 hardcoded reviews
("Виолетта", "@remmaster_aktau", "Марат", etc.) that were never sourced from
real customers. Separately, `Footer.tsx` has a "Leave a review" modal/form
that posts to the site owner's Telegram via `/api/telegram` — real delivery,
but a local collection channel disconnected from Google, which is where the
business's actual reviews live (Google Business Profile: **5.0★, 19
reviews**, confirmed directly from the owner's dashboard on 2026-08-13).

Goal: remove all fabricated/local review content and mechanisms, and replace
the trust signal with the real Google data, merged into one section with the
portfolio.

## Non-goals

- No live-scraping of Google Maps/Search (violates Google's ToS, fragile,
  risks IP blocking — ruled out explicitly).
- No Google Places API integration this pass (would need the owner to
  provision a GCP project + billing + API key — deferred; static numbers
  chosen instead, see decision log).
- No fetching/displaying individual real review text — Google's listing
  isn't programmatically reachable from this environment, and there's no
  API key. Only the aggregate rating + count are shown.

## Decision log (confirmed with the user)

1. **Data source**: static, manually set. Hardcode `5.0` / `19` into the
   component and into `index.html`'s existing `AggregateRating` schema
   (currently stale at `reviewCount: 17` — legitimate historical value, just
   needs bumping to 19, not fabricated).
2. **Footer review form**: removed entirely, along with its Telegram
   submission handler and the `review_form.*` i18n keys. Replaced by a
   direct link to the Google review page.
3. **"Google" icon**: Lucide has no Google brand mark (confirmed via package
   introspection). Using a filled `Star` icon paired with the rating number
   instead of faking a logo.

## Section structure

Single section, keeps `id="projects"` (Footer's one existing nav link is
`href="#projects"` — reusing the id avoids a dead anchor).

1. **Header** — eyebrow (rule + label, established site pattern), Source
   Serif 4 headline, subtitle. Copy reframed to cover both "real work" and
   "verified trust" in one pitch instead of two separate framings.
2. **Trust row**, directly under the subtitle (not buried at the bottom of
   the section — it's part of the pitch, not an afterthought):
   - Google badge: filled `Star` + "5.0" + "19 отзывов" (localized), links to
     `https://g.page/r/Ce2IQ5cacC8sEAE/review`.
   - Instagram badge: `Instagram` icon + "@toosba7292", links to
     `https://www.instagram.com/toosba7292`.
   - Both rendered as plain inline links, unboxed icon in the single red
     accent — matching Pain/Statistics/Services, not the current
     gradient-box Instagram treatment.
3. **Portfolio grid** — 4 project cards, kept as cards (a grid of distinct
   case studies is a legitimate card use, unlike the feature/testimonial
   lists elsewhere on the page that got de-carded this pass), but
   de-templated: drop the colored icon-in-box, the bordered tag pills, and
   the gradient hover wash. Category as a small tracked label, title in
   Source Serif 4, tags as plain text, location as a plain caption — same
   restraint as PainSection's incident cards.

## Removals

- `src/components/Testimonials.tsx` — deleted.
- `Home.tsx` — drops the `Testimonials` import and render.
- `Footer.tsx` — removes the `"review"` modal type/branch, the review form
  JSX, `handleReviewSubmit`, the associated `useState`s (`name`, `company`,
  `text`, `rating`, `photo`, `isSubmitting`, `isSuccess` — verify none are
  reused by other modal branches before deleting), and the "Оставить отзыв"
  nav `<li>`. Replaced with a plain external link to the Google review page.
- `i18n.ts` — removes `testimonials.*` and `review_form.*` blocks from all
  three languages (ru/kz/en). Nothing else references either namespace
  (confirmed via grep).

## New i18n keys

Added under `projects.*` (ru/kz/en): a label for the Google trust badge
(e.g. "отзывов" pluralization-safe phrasing) and updated `title`/`subtitle`
copy to cover the merged framing. Exact strings decided during
implementation to fit natural phrasing per language, not fixed here.

## Out of scope / follow-up

- Live Google Places API integration, if the owner later wants the badge to
  self-update instead of being manually bumped.
- Individual real review text/photos, if the owner wants to manually curate
  a small number of real quotes later (would need their explicit copy, not
  invented).

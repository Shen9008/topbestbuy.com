# Feature visuals (premium SVG)

Decorative moments on the home page and category hubs use **custom SVG illustrations** loaded from `public/icons/premium/`. Navigation, chips in the chrome, scorecards, and product UI still use **Lucide** via `Icon.astro` / `Icon.tsx` (see [ICONS.md](./ICONS.md)).

## 21st.dev references

We aligned wells and cards with dark, layered surfaces from the 21st community (hairline borders, soft inset depth, accent at low opacity — not heavy drop shadows):

| Reference | URL | What we borrowed |
|-----------|-----|------------------|
| Oyna Card (dark glass panel) | https://21st.dev/@azabroflovski/components/oyna-card | Hairline border, raised surface on `#141414` canvas |
| Card with Noise Pattern (Indie UI) | https://21st.dev/@Ali-Hussein-dev/components/card-with-noise-patter | Subtle inner luminance, premium tactile wells |
| Card with Ellipsis Pattern (Indie UI) | https://21st.dev/@Ali-Hussein-dev/components/card-with-ellipsis-pattern | Feature-highlight emphasis without loud gradients |

Brand tokens: canvas `#141414`, accent `#FF7900` at **15–25%** opacity in SVG fills, ink via `currentColor`, card/well radius **`--radius-lg` (32px)**.

## Components

| Component | Path | Props |
|-----------|------|--------|
| `VisualWell` | `src/components/illustrations/VisualWell.astro` | `asset`, `size` (`sm` \| `md` \| `lg`), `tone`, `class` |
| `ListVisual` | `src/components/ui/ListVisual.astro` | `slug`, `size`, `class` |
| `ValueVisual` | `src/components/illustrations/ValueVisual.astro` | `id`: `pick` \| `tradeoffs` \| `malaysia` |
| `TrustVisual` | `src/components/illustrations/TrustVisual.astro` | `id`: `no-paid` \| `dated` \| `scorecard` \| `log` |
| `ToolVisual` | `src/components/illustrations/ToolVisual.astro` | `id`: tool tab id (see `src/lib/feature-visuals.ts`) |

CSS: `.tb-visual-well` in `src/styles/components.css` (inset glow, 32px radius, hover accent on parent tiles).

## Slot → asset mapping

### List tiles (×11)

Mapping: `src/lib/list-visuals.ts` → `public/icons/premium/<basename>.svg`.

Used in `HomeBrowseSection`, `ListVisual` on category list grids, mega-menu list links.

### Value strip (×3)

| `ValueVisual` id | File | Section |
|------------------|------|---------|
| `pick` | `value-pick.svg` | `HomeValueProps` |
| `tradeoffs` | `value-tradeoffs.svg` | `HomeValueProps` |
| `malaysia` | `value-malaysia.svg` | `HomeValueProps` |

### Trust pills (×4)

| `TrustVisual` id | File | Section |
|------------------|------|---------|
| `no-paid` | `trust-no-paid.svg` | `HomeTrustStrip` |
| `dated` | `trust-dated.svg` | `HomeTrustStrip` |
| `scorecard` | `trust-scorecard.svg` | `HomeTrustStrip` |
| `log` | `trust-log.svg` | `HomeTrustStrip` |

### Tools row (home)

| `ToolVisual` id | File | Section |
|-----------------|------|---------|
| `finder` | `tool-finder.svg` | `HomeToolsStrip` |
| `vacuum` | `tool-vacuum.svg` | `HomeToolsStrip` |
| `cleanser` | `tool-cleanser.svg` | `HomeToolsStrip` |
| `purifier` | `tool-purifier.svg` | `HomeToolsStrip` |

Additional tool assets (`tool-airfryer`, `tool-cost`, `tool-mattress`) are reserved for `/tools` hubs.

## SVG spec

- **ViewBox:** `0 0 48 48`
- **Stroke:** `1.5px`, `stroke="currentColor"`, round caps/joins
- **Accent:** `#FF7900` fills/strokes at **0.15–0.25** apparent opacity
- **Depth:** optional isometric base ellipse on list glyphs; no emoji; not Lucide trace
- **A11y:** decorative — parent sets `aria-hidden="true"`

## Tests

- `tests/list-visuals.test.ts` — all live list slugs + list SVG contract
- `tests/feature-visuals.test.ts` — value/trust/tool assets + home section wiring
- `tests/icon-policy.test.ts` — no raw `<svg>` in `src/` (assets load via `set:html` in `VisualWell`)
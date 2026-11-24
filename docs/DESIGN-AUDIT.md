# Phase A: Design audit (mockup vs production)

**Skills:** impeccable (UX inventory), ui-ux-pro-max (checklist alignment)  
**Mockup:** `Mockup/TopBestBuy Website Mockup (Malaysia).html`  
**Production:** Astro site under `src/`

## Page templates

| Template | Mockup | Production | Status |
|----------|--------|------------|--------|
| Home | Centered hero, search, category chips, list tiles, tools, guides | `src/pages/index.astro` | Restructured hero to search-first |
| List (Top 10) | Hero, meta line, disclosure, quick-pick, jumpbar, 10 cards, compare table, FAQ | `src/pages/[listSlug].astro` | Parity; styling pass |
| Review | Product detail, scores, affiliate CTA | `src/pages/reviews/[id].astro` | Parity |
| Compare | Pick up to 3, table / stacked | `src/pages/compare.astro` + islands | Parity |
| Tools hub | Finder, calculators, sliders | `src/pages/tools/index.astro` + `ToolsHub.tsx` | Parity |
| Categories | Grid of hubs | `src/pages/categories.astro` | Parity |
| Trust / about | How we rank, affiliate, team | `src/pages/how-we-rank.astro`, etc. | Parity |

## UI blocks

| Block | Keep | Replace / polish | UX job |
|-------|------|------------------|--------|
| Header + mega menu | IA, Lucide map | Hairline borders, dark canvas | Find any list in 2 taps |
| Desktop rail | 5 destinations | Token skin, hover glow | Persistent wayfinding |
| Mobile tab bar | ≤5 tabs with labels | Active pill styling | Thumb-zone nav |
| Hero | Headline + trust line | Centered grid background, Cmd+K search row | Decide where to start in &lt;10s |
| Category chips | Scrollable pills | Accent border on hover | Filter intent |
| List tiles | Image-less cards with #1 pick | Larger radius, hover lift | Pick a list fast |
| Product card | Rank, score, details, CTAs | 32px cards, collapsed details mobile | Compare picks in-place |
| Compare table | Sortable desktop | Stacked ≤600px (existing) | Side-by-side specs |
| Jumpbar | Sticky section chips | Active invert chip | In-page scan |
| Finder / tools | Multi-step | Preact islands (kept) | Engagement without clutter |
| FAQ | `<details>` | Accordion styling (CSS) | Schema + scan |
| Footer E-E-A-T | Multi-column | Minimal columns (kept) | Trust + crawl |
| Search drawer | `/` shortcut | Added **⌘/Ctrl+K** | Power-user jumps |
| Toast | Shortlist feedback | Sonner-style fixed toast (kept) | Confirm save |

## Known UX constraints (must not regress)

- No horizontal scroll at 360px
- Sticky jumpbar below top bar only (no overlap)
- 44px minimum tap targets on icon controls
- Product `details` collapsed by default on mobile (`ProductCard`)
- Compare table becomes stacked cards at ≤600px

## Gaps vs mockup

- Mockup is a single-file SPA with hash routes; production uses clean URLs (intentional).
- Mockup uses inline SVG icons; production uses Lucide via `Icon` + `icon-map.ts` (PR #8).
- Visual: production now defaults to **dark `#141414`** fora canvas with **white pill** primary CTAs and **orange** accent for rank/score emphasis.
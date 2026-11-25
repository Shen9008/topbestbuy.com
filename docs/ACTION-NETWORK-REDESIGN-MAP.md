# Action Network–inspired redesign map

Layout and information rhythm borrow from [Action Network](https://www.actionnetwork.com/) (dense editorial hub, section bands, card grids, sticky wayfinding, horizontal category discoverability). **Colour and type stay TopBestBuy** (navy `#061D32`, orange `#FF7900`, dark canvas `#141414` default) per `docs/brand-guidelines.md`.

## Skill choices

| Skill | P0 | P2 (this phase) |
|-------|-----|------------------|
| **frontend-design** | Editorial hub hero, banded home | Hub heroes on guides/tools/compare/search/saved; type-grouped guide index |
| **impeccable** | 44px hits on pills/jump links | 44px on tool tabs, compare selects, overlay inputs; reduced-motion preserved |
| **ui-craft** | See-all headers, scroll strips | Feed-density shortlist + search results; `tb-card--editorial` on tool panels |
| **ui-ux-pro-max** | Bottom tab bar + category rail | Footer **Explore** strip mirrors CategoryRail; sticky guide subnav |

## IA comparison

| Action Network hub | TopBestBuy |
|--------------------|------------|
| Sport/league horizontal rail | **Category rail** (`CategoryRail.astro`) — Kitchen, Air, Sleep, … |
| Section headers + “See all” | **`SectionHeader`** `seeAllHref` / `seeAllLabel` |
| Score / game cards in dense feed | **`tb-feed-row`** on home, search, saved |
| Sticky subnav under main header | **`tb-sticky-subnav`** on lists + guide articles |
| Two-column article + rail (desktop) | **`tb-editorial-layout`** on lists, categories, guide articles |
| Light section bands | **`tb-band`** / **`tb-band--alt`** via `EditorialSection` |

### Shared invariants (P0–P2)

- All SEO URLs, `getStaticPaths`, list slugs, `RANKED` data, scorecard v1.0 logic, `ProductCard` inner structure and `VisualWell` usage.
- Astro 5, Tailwind v4, Lucide in chrome, Preact islands (`AppChrome`, tools, save).
- Desktop **icon rail** + mobile **5-tab bar**.

## Breakpoints

| Token | px | Use |
|-------|-----|-----|
| `--bp-sm` | 360 | Minimum phone width (QA target) |
| `--bp-md` | 768 | Category rail scroll; 2-col tiles |
| `--bp-lg` | 1280 | Editorial sidebar, hub hero 2-col, rail offset |

## Component inventory

### Shell (P0)

- `CategoryRail.astro`, `EditorialSection.astro`, `SectionHeader.astro`
- Tokens + `components.css` bands, feed rows, editorial layout, sticky stack

### Phase 2 surfaces (done)

| Surface | Files | Pattern |
|---------|-------|---------|
| **Guides hub** | `guides/index.astro` | Hub hero, featured scroll strip, type bands |
| **Guide article** | `guides/[slug].astro` | Sticky subnav, editorial sidebar, TLDR card |
| **Tools hub** | `tools/index.astro`, `ToolsHub.tsx` | Quick-tool strip + banded hub; scroll tab list |
| **Compare** | `compare.astro`, `ComparePicker.tsx` | Hub hero, editorial wrapper, 44px selects |
| **Search** | `search.astro`, `SearchPage.tsx`, `AppChrome.tsx` | Hub + feed results; overlay feed density |
| **Saved** | `saved.astro`, `SavedPage.tsx`, `AppChrome.tsx` | Hub + feed rows; richer empty state |
| **Footer** | `SiteFooter.astro` | Explore strip (CategoryRail-style pills) |

## Mobile nav decision

**Bottom tab bar** retained (5 tabs). Category discoverability on mobile: **category rail** under header + footer Explore strip — no hamburger.

## P3 (next)

| Phase | Surfaces | Notes |
|-------|----------|--------|
| **P3** | `/reviews/[id]` | Editorial hero + sticky spec jump |
| **P3** | Mega menu | Optional collapse into rail-only on xl |
| **P3** | `/categories` index | Band + sidebar parity with category hub |

## QA screenshot checklist

- [ ] Guides hub 360px: featured scroll strip
- [ ] Guide article 1280px: sticky subnav + sidebar
- [ ] Tools hub: horizontal tabs on mobile
- [ ] Compare: table scroll + picker in editorial card
- [ ] Search/Saved: feed row density
- [ ] Footer Explore strip scroll on mobile
- [ ] `prefers-reduced-motion`: no reliance on reveal for content visibility

## Before / after (P2 summary)

| Area | Before | After (P2) |
|------|--------|------------|
| Guides | Plain grid | Hub hero, featured strip, type bands, article sticky nav |
| Tools | Title + tabs | Tool quick strip, banded hub, editorial tool panel |
| Compare | Plain form | Hub + section header + editorial card |
| Search/Saved | Basic cards | Feed rows, empty states, hub copy |
| Footer | Grid only | CategoryRail-style Explore strip |
| Overlays | Card list | Feed-density search + shortlist in `AppChrome` |

## Verification commands

```bash
npm test
npm run build
```
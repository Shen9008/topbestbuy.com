# Action Network–inspired redesign map (P0)

Phase 0 shell + home + list/category hub templates for **topbestbuy.online**. Layout and information rhythm borrow from [Action Network](https://www.actionnetwork.com/) (dense editorial hub, section bands, card grids, sticky wayfinding, horizontal category discoverability). **Colour and type stay TopBestBuy** (navy `#061D32`, orange `#FF7900`, dark canvas `#141414` default) per `docs/brand-guidelines.md`.

## Skill choices (applied in this PR)

| Skill | How it shaped P0 |
|-------|------------------|
| **frontend-design** | Editorial/magazine direction: left-aligned hub hero, banded sections, orange accent budget on rails and CTAs only. |
| **impeccable** | 44px hit targets on pills, chips, jump links; flat heading tokens; no gradient type; reduced-motion already in `tokens.css`. |
| **ui-craft** | Sentence-case section titles; one accent colour; layered card shadows; horizontal scroll strips on mobile (not nested cards). |
| **ui-ux-pro-max** | Mobile-first nav kept as **bottom tab bar** (existing pattern); desktop **category rail** + sticky stack for wayfinding. |

## IA comparison

| Action Network hub | TopBestBuy (current → P0) |
|--------------------|---------------------------|
| Sport/league horizontal rail | **Category rail** (`CategoryRail.astro`) — Kitchen, Air, Sleep, … |
| Section headers + “See all” | **`SectionHeader`** `seeAllHref` / `seeAllLabel` |
| Score / game cards in dense feed | **`tb-feed-row`** #1 picks on home |
| Sticky subnav under main header | **`tb-sticky-subnav`** + list jump bar |
| Two-column article + rail (desktop) | **`tb-editorial-layout`** on list + category hubs |
| Light section bands | **`tb-band`** / **`tb-band--alt`** on trust, browse, tools |

### What stays unchanged (P0)

- All SEO URLs, `getStaticPaths`, list slugs, `RANKED` data, scorecard v1.0 logic, `ProductCard` inner structure and `VisualWell` usage.
- Astro 5, Tailwind v4, Lucide in chrome, Preact islands (`AppChrome`, tools, save).
- Desktop **icon rail** (home, search, categories, saved, tools) + mobile **5-tab bar** (no hamburger added in P0).

## Breakpoints

| Token | px | Use in P0 |
|-------|-----|-----------|
| `--bp-sm` | 360 | Minimum phone width (QA target) |
| `--bp-md` | 768 | Category rail scroll; mega menu; 2-col tiles |
| `--bp-lg` | 1280 | Editorial sidebar, hub hero 2-col, rail offset |

Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280 — layout primitives tested at **360 / 768 / 1280**.

## Component inventory

### New

- `src/components/layout/CategoryRail.astro` — sticky stack under top bar
- `src/components/sections/EditorialSection.astro` — band wrapper + inner max-width

### Updated (P0)

| File | Change |
|------|--------|
| `tokens.css` | Band bg, sticky stack, density tiers, breakpoints, hit target |
| `components.css` | `.tb-band`, `.tb-feed-row`, `.tb-editorial-*`, `.tb-h1`–`.tb-h4`, scroll strip |
| `SectionHeader.astro` | See-all row pattern |
| `SiteTopBar.astro` | Logo always visible; sticky moved to layout wrapper |
| `BaseLayout.astro` | Sticky header stack = top bar + category rail |
| `index.astro` | Hub hero, picks feed, scroll chips, banded sections |
| `[listSlug].astro` | Sticky jump nav + editorial two-column body |
| `category/[cat].astro` | Sidebar category index + section bands |
| `ProductCard.astro` | `tb-card--editorial` container only |
| Home sections | See-all links, bands, scroll strips |

### Unchanged shell islands

- `AppChrome.tsx` — search + shortlist (keyboard `/` and ⌘K)

## Mobile nav decision

**Bottom tab bar** retained (5 tabs). Category discoverability on mobile comes from the **category rail** (horizontal scroll under header), not a hamburger. Rationale: thumb reach, matches existing saved/search habits, aligns with ui-ux-pro-max mobile primary-nav guidance.

## P1 / P2 (out of scope for this PR)

| Phase | Surfaces | Notes |
|-------|----------|--------|
| **P1** | `/guides/*`, `/tools/*`, `/compare` | Same band + section header pattern; tool hub density tier |
| **P1** | `/reviews/[id]` | Editorial hero + sticky spec jump |
| **P2** | `/search`, `/saved` | Feed density for results; empty states |
| **P2** | Mega menu | Optional collapse into rail-only on xl |

## QA screenshot checklist

- [ ] Home 360px: category rail scroll, picks strip, tab bar clear of content
- [ ] Home 1280px: hub hero 2-col, browse grid, rail + sidebar offset
- [ ] List 768px: sticky jump bar below header stack
- [ ] List 1280px: left “On this page” sticky sidebar
- [ ] Category hub: sidebar category list + live list cards
- [ ] Focus visible on category pills, jump links, See all
- [ ] `prefers-reduced-motion`: no reliance on reveal for content visibility

## Before / after (summary)

| Area | Before | After (P0) |
|------|--------|------------|
| Header | Logo mobile-only; categories in mega menu only | Logo + **category rail** on every page |
| Home | Centered hero, static picks grid | **Left hub hero**, banded sections, **See all** headers, horizontal strips |
| List | Mobile-only jump bar; narrow sidebar | **Sticky subnav** + editorial sidebar on desktop |
| Category | Single column stack | **Two-column** hub with category index |
| Tokens | Section padding only | **Bands**, density tiers, sticky stack math |

## Verification commands

```bash
npm test
npm run build
```
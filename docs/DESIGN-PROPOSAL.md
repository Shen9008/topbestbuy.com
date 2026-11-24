# Phase B: 21st.dev shortlist (approved for implementation)

**Route:** 21st MCP unavailable (auth required). Components were **manually ported** to match shadcn patterns and our tokens.  
**Skills:** design-taste-frontend (fora minimal), frontend-design (single accent, editorial trust).

## Visual direction (one page)

| Dimension | Choice |
|-----------|--------|
| Canvas | `#141414` dark default, elevated `oklch(0.22)` cards, hairline borders |
| Accent | `#FF7900` — rank badges, score emphasis, focus, links only |
| Primary CTA | White pill (`--tb-cta-bg`) on dark; navy pill on light theme |
| Type | Inter 400–800, tight display tracking, max 3 weights per view |
| Radius | Cards 32px, controls 12px, chips full pill |
| Motion | 150–220ms, `cubic-bezier(0.22,1,0.36,1)`, scale 0.97 on press, one reveal per home hero |

## Block decisions

| Block | Primary pattern | 21st.dev reference (manual) | Runner-ups | Why |
|-------|-----------------|------------------------------|------------|-----|
| Home hero | Centered headline + command search row | Hero with search input (category: heroes) | Shader hero, split hero | Search-first matches mockup |
| Category chips | `tb-chip` + horizontal scroll | Animated tabs / pill tabs | Segmented control | Low JS, scrollable on mobile |
| List tiles | `tb-tile` hover lift | Spotlight card | Bento grid | Directory feel without heavy JS |
| Rail / tab bar | Existing Astro chrome | Dock navigation | Sidebar collapse | Already matches IA |
| Mega menu | `MegaMenu.astro` | Navigation menu panel | Simple dropdown | Grouped lists + icons |
| Product card | `ProductCard.astro` + details | Data card + accordion | Pricing card | Real MYR + score bars |
| Compare | Table + `ListPageClient` | Sortable data table | Card comparator | Mobile stack preserved |
| Tools | `ToolsHub.tsx` | Multi-step form | Wizard with shader | Preact island only |
| Search / palette | `AppChrome.tsx` | Command palette | Modal search | Cmd+K + `/` |
| FAQ | Native `<details>` | Smooth accordion | Tabs | Zero JS, FAQ schema OK |
| Toast | Fixed status bar | Sonner toast | Alert dialog | Lightweight |
| Footer | `SiteFooter.astro` | Minimal footer | Mega footer | Disclosure line required |

## JS budget

- No new heavy dependencies.
- Command palette reuses existing search island (+keyboard handler only).
- Home reveal: CSS only.

**Approval:** Coordinator/user assignment proceeds to Phase C without separate gate.
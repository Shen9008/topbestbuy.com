# Feature blocks map (shadcnblocks → TopBestBuy)

**Reference only.** Layouts below are inspired by [shadcnblocks.com/blocks/feature](https://www.shadcnblocks.com/blocks/feature). This repo ships **original Astro markup and Tailwind** using `--tb-*` tokens (32px card radius, hairline borders). Pixel parity with shadcnblocks source may require a [shadcnblocks license](https://www.shadcnblocks.com/) — we do not copy their React components.

**Skills applied for P0:** `frontend-design`, `impeccable`, `ui-ux-pro-max`, `design-taste-frontend`.

| Site section | Page(s) | Recommended shadcnblocks slug/name | Why | Priority |
| --- | --- | --- | --- | --- |
| Hero + live #1 rail | Home `/` | **Feature 38** — Minimal split feature with masked image | Hero + side media rail matches search + top-pick stack | P0 ✅ |
| Value propositions | Home `/` | **Feature 241** — Team features grid with icon cards | Numbered icon cards for 30 sec / trade-offs / Malaysia | P0 ✅ |
| Trust strip | Home `/` | **Feature 152** — Centered headline with staggered icon badges | Four trust signals as linked badge row | P0 ✅ |
| List grid | Home `/` | **Feature 314** — Studio grid with compact cards | 3-col tiles with category pills | P0 ✅ |
| Tools strip | Home `/` | **Feature 148** — Utility grid with primary action under intro | 4-up calculator cards | P0 ✅ |
| Guides grid | Home `/` | **Feature 203** — Four feature cards with checklist rows | Guide cards with meta row | P0 ✅ |
| List methodology | `[listSlug].astro` | **Feature 203** | Researched / prices / criteria trio | P0 ✅ |
| Key takeaways | `[listSlug].astro` | **Feature 139** — Bordered spotlight card | Highlight panel for skimmers | P1 ✅ |
| Review verdict | `/reviews/[id]` | **Feature 274** — Metrics grid with canvas hover | Future | P1 |
| Tools hub | `/tools` | **Feature 20** — Utility grid with header | Future | P1 |
| How we rank | `/how-we-rank` | **Feature 187** — Three-step process | Future | P2 |
| Footer trust | `SiteFooter.astro` | **Feature 44** — Integration cards | Future | P1 |

## P0 components

| Component | Reference |
| --- | --- |
| `SectionHeader.astro` | Feature 206 |
| `HomeValueProps.astro` | Feature 241 |
| `HomeTrustStrip.astro` | Feature 152 |
| `HomeBrowseSection.astro` | Feature 314 |
| `HomeToolsStrip.astro` | Feature 148 |
| `HomeGuidesSection.astro` | Feature 203 |
| `ListMethodologyStrip.astro` | Feature 203 |

## Screenshots checklist

- [ ] Home value props + trust strip
- [ ] Home list grid + tools strip
- [ ] List methodology strip
- [ ] Dark / light theme
- [ ] Mobile 390px

## Licensing

Catalog browsing is free; **copying block source** may require purchase. We use layouts as visual reference only.
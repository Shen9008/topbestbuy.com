# TopBestBuy design system (Phase 1)

**Lenses:** frontend-design, impeccable, ui-ux-pro-max  
**Locale:** en-MY · **Currency copy:** MYR  
**Visual reference:** fora.so skin on mockup information architecture (Phase 0 plan)

## Direction

- **Structure:** Mockup page types and section order (lists, tools hub, trust, mobile tab bar).
- **Skin:** Dark default canvas `#141414` family, elevated surfaces, pill chips, 18–28px card radii, warm accent `#FF7A3D`.
- **Type:** Display **Sora** (600–800), body **Source Sans 3** (400–700), self-hosted under `public/fonts/`.

## Tokens

Source of truth: `src/styles/tokens.css` (Tailwind v4 `@theme` + `[data-theme]` overrides).

| Token | Dark (default) | Role |
|-------|----------------|------|
| `--tb-bg` | oklch(0.16 0 0) | Page canvas |
| `--tb-surface` | oklch(0.22 0 0) | Cards, rail |
| `--tb-surface-raised` | oklch(0.28 0 0) | Mega menu, modals |
| `--tb-ink` | oklch(0.93 0 0) | Primary text |
| `--tb-muted` | oklch(0.68 0.02 260) | Secondary text |
| `--tb-line` | oklch(0.32 0 0) | Borders |
| `--tb-accent` | oklch(0.72 0.16 45) | Links, primary CTA |
| `--tb-accent-ink` | oklch(0.18 0.04 45) | Text on accent |

Light theme swaps bg/surface/ink via `[data-theme='light']` and prefers-color-scheme fallback until the user toggles theme (Preact island).

## Layout shell

- Desktop: fixed **left icon rail** (`--rail-width`), sticky **top bar**, **mega menu stub**, footer with E-E-A-T links.
- Mobile: **bottom tab bar** (5 tabs), no rail; content padding accounts for `--tabbar-height`.
- **Skip link** to `#main`; focus rings use accent.
- **Z-index:** sticky → dropdown → rail → tabbar → toast (semantic scale in tokens).

## Components (Phase 1)

| Component | Path |
|-----------|------|
| Base layout | `src/layouts/BaseLayout.astro` |
| SEO | `src/components/seo/Seo.astro` |
| Image placeholder | `src/components/media/ImageSlot.astro` + `src/lib/image-manifest.ts` |
| Theme toggle | `src/components/islands/ThemeToggle.tsx` |

## Motion and a11y

- `prefers-reduced-motion: reduce` collapses transitions in `tokens.css`.
- Body line length capped via `--prose-max: 70ch`.
- Contrast target: WCAG 4.5:1 body on dark surfaces (impeccable).

## Out of scope until later phases

Product cards, scoring UI, real imagery, search drawer, compare table, tools logic, affiliate `data-aff` wiring.
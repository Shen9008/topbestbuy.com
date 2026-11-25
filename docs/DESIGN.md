# TopBestBuy design system — neon lime accent

**Lenses:** frontend-design, impeccable, ui-ux-pro-max  
**Locale:** en-MY · **Currency copy:** MYR  
**Visual reference:** fora.so dark canvas; single electric-lime accent (`#C6FF3D`)

## Direction

- **Structure:** Mockup page types and section order (lists, tools hub, trust, mobile tab bar).
- **Skin:** Dark default `#141414`, elevated `#1c1c1c` cards, 12px button radius, 32px card radii, **one neon lime fill CTA per viewport**.
- **Type:** Inter (display + body), self-hosted.

## Tokens

Source of truth: `src/styles/tokens.css` (CSS variables + Tailwind v4 `@theme`).

| Token | Dark (default) | Light | Role |
|-------|----------------|-------|------|
| `--bg` | `#141414` | `#ffffff` | Page canvas |
| `--surface` | `#1c1c1c` | `#f6f6f4` | Cards |
| `--surface-2` | `#232323` | `#ececea` | Raised / inputs |
| `--border` | `#2a2a2a` | `#e2e2de` | Hairlines |
| `--text` | `#e6e6e6` | `#1a1a1a` | Body |
| `--text-muted` | `#b4b4b4` | `#5c5c57` | Secondary |
| `--accent` | `#C6FF3D` | `#C6FF3D` | **Fills only** (CTA, score bars) |
| `--accent-fg` | `#C6FF3D` | `#4D7C0F` | Links, labels, icons, active nav |
| `--on-accent` | `#141414` | `#141414` | Text on lime fill |
| `--accent-soft` | `rgba(198,255,61,0.12)` | `rgba(77,124,15,0.10)` | Badges, rank wells |
| `--accent-line` | `rgba(198,255,61,0.35)` | `rgba(77,124,15,0.35)` | Hover borders, rules |

Legacy aliases `--tb-*` map to the same values for existing components.

### Semantic states (not brand lime)

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--success` | `#4ADE80` | `#15803D` | In stock, confirmations |
| `--warning` | `#FBBF24` | `#B45309` | Limited evidence, verify price |
| `--danger` | `#F87171` | `#B91C1C` | Errors, cons |
| `--info` | `#60A5FA` | `#1D4ED8` | Neutral notes |

## Lime usage — do / don't

**Do**

- Primary CTA: lime fill + `--on-accent`, hover `--accent-hover` + `--glow`, press `--accent-press` (scale 0.97).
- Rank badges: `--accent-soft` + `--accent-fg` + `--accent-line` border.
- Score bars: `--accent-fg` fill on `--border` track; always show numeric score.
- Active nav / tabs: `--accent-fg` icon + 2px indicator; decorative lines use `--accent-line`.
- Focus: 2px `--accent-fg` ring, 2px offset.
- Article links: `--accent-fg` with underline.

**Don't**

- Neon lime as body text or large background bands (especially on white).
- More than one lime **fill** button per viewport.
- Lime for success/warning pills (use semantic tokens).
- Lime gradients except a faint hero radial (≤ 8% opacity).

## Components

| Pattern | Class / note |
|---------|----------------|
| Primary button | `.tb-btn` |
| Secondary / ghost | `.tb-btn-secondary`, `.tb-btn-ghost` |
| Rank | `.tb-rank` |
| Warning pill | `.tb-pill-thin` → `--warning` |
| Dev gallery | `/dev/colors` (noindex) |

## Quality

- Automated: `tests/token-contrast.test.ts` (4.5:1 text pairs, light-theme accent-fg rule).
- Theme toggle: `ThemeToggle.tsx` + `localStorage` (`tb-theme`).
- `prefers-reduced-motion` and `forced-colors` handled in `tokens.css`.

## Out of scope

Production deploy is separate from token work; confirm hue tweaks (`#B8F23A`–`#C6FF3D`) with before/after screenshots on real devices when tuning.
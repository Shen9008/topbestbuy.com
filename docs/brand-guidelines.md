# TopBestBuy brand implementation

Short reference for engineers. Full spec: `C:\Users\Chia Shen\Downloads\TopBestBuy.com\TopBestBuy_Brand_Guidelines.pdf` (v1.0, November 2026).

## Logo

Canonical sources live in `C:\Users\Chia Shen\Downloads\TopBestBuy.com` (Brand Guidelines v1.0 PDF in that folder). Re-sync with `npm run brand:sync`.

| Repo file | Source file (TopBestBuy.com) | Use |
|-----------|------------------------------|-----|
| `public/brand/logo-mark.png` | `Navy Shopping Bag Checkmark.png` | Rail home mark; master for favicon PNGs |
| `public/brand/logo-wordmark.svg` | `topbestbuy-wordmark.svg` | Full lockup on light surfaces |
| `public/brand/logo-wordmark-dark.svg` | `topbestbuy-dark-lockup.svg` | Full lockup on dark surfaces (default theme) |
| `public/brand/logo-wordmark-dark.png` | `topbestbuy-dark-lockup.png` | Raster dark lockup (email / OG fallback) |
| `public/brand/logo-wordmark-light.png` | `TopBestBuy.online Logo on White.png` | Raster light lockup backup |
| `public/favicon.svg` | Hand-tuned 32×32 mark (navy field + bag geometry) |
| `public/favicon-32.png` | Generated from `logo-mark.png` via `brand:sync` | Legacy tab icon |
| `public/apple-touch-icon.png` | Generated 180×180 from mark | iOS home screen |
| `public/icon-192.png`, `icon-512.png` | Generated from mark | `site.webmanifest` |

## Colours

| Token | Hex |
|-------|-----|
| Navy | `#061D32` |
| Orange | `#FF7900` |
| White | `#FFFFFF` |
| Off-white bg | `#F7F9FB` |
| Slate | `#526273` |
| Border | `#E2E8EE` |

Implemented in `src/styles/tokens.css` as `--color-brand-*` and `--tb-*` aliases.

## Heading colour system (PDF §3–4, §15)

Editorial-first: **flat** heading colour (no type gradients; hero grid gradients in `tb-hero` stay decorative only). Orange is for **emphasis words** in headlines and ranking highlights—not default headline or icon colour (PDF §10).

| Semantic token | Dark default (`#141414` canvas) | Light (`data-theme=light` or OS light) | Use |
|----------------|----------------------------------|----------------------------------------|-----|
| `--tb-heading` | `#FFFFFF` | `#061D32` (navy) | H1–H4, `.tb-h1`–`.tb-h4` |
| `--tb-heading-muted` | `--tb-muted` (slate-tinted) | `#526273` (slate) | Eyebrows, de-emphasised titles |
| `--tb-heading-accent` | `#FF7900` | `#FF7900` | Sparingly inside headlines (e.g. rank callouts)—avoid small orange text on white body copy |

### Type scale (headings)

| Level | Desktop | Mobile | Weight | Utility |
|-------|---------|--------|--------|---------|
| H1 | 48px | 34px | 700 | `.tb-h1` |
| H2 | 32px | 26px | 700 | `.tb-h2` |
| H3 | 20px | 18px | 600 | `.tb-h3` |
| H4 | 12–13px labels | same | 700 | `.tb-h4` |

Base `h1`–`h4` in `global.css` inherit `--tb-heading`. Body copy stays `--tb-ink`; Lucide icons keep `--tb-ink` / slot tokens—not `--tb-heading-accent`.

### Contrast notes

- Navy on off-white (`#061D32` on `#F7F9FB`): passes WCAG AA for headings.
- White on `#141414`: passes AA for large/bold headings.
- Do not use orange as the sole colour for long headline strings on white (PDF §3).

## Typography

Inter (via `@fontsource/inter`) for headings and body, per PDF. Weights 400 / 500 / 600 / 700 loaded in `src/styles/fonts.css`.

## Components wired

- `SiteLogo.astro` — mark vs full lockup; light/dark SVG wordmarks swap with theme (`data-theme` on `<html>`; default dark)
- `SiteTopBar.astro`, `SiteFooter.astro`, `DesktopIconRail.astro`
- `Seo.astro` — favicon set, apple-touch, `site.webmanifest`, `theme-color`
- Heading utilities — `src/styles/components.css` (`.tb-h1` … `.tb-heading-accent`)

## Voice (editorial)

Plain, specific, no hype. See PDF §1 and `TopBestBuy.com/topbestbuy-docs/02-brand-guidelines.md` for copy rules.
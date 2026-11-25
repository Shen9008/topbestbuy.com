# TopBestBuy brand implementation

Short reference for engineers. Full spec: `C:\Users\Chia Shen\Downloads\TopBestBuy.com\TopBestBuy_Brand_Guidelines.pdf` (v1.0, November 2026).

## Logo

| File | Use |
|------|-----|
| `public/brand/logo-mark.png` | Rail home, favicons, PWA icons (from *Navy Shopping Bag Checkmark.png*) |
| `public/brand/logo-wordmark.svg` | Full lockup on light surfaces (header mobile, footer) |
| `public/brand/logo-wordmark-dark.png` | Full lockup on dark surfaces |
| `public/brand/logo-wordmark-light.png` | Raster light lockup (legacy backup; prefer SVG) |
| `public/favicon.svg` | SVG favicon (simplified geometry until vector master ships) |

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

- `SiteLogo.astro` — mark vs full lockup; SVG wordmark (light) and PNG dark lockup swap with theme
- `SiteTopBar.astro`, `SiteFooter.astro`, `DesktopIconRail.astro`
- `Seo.astro` — favicon set, apple-touch, `site.webmanifest`, `theme-color`
- Heading utilities — `src/styles/components.css` (`.tb-h1` … `.tb-heading-accent`)

## Voice (editorial)

Plain, specific, no hype. See PDF §1 and `TopBestBuy.com/topbestbuy-docs/02-brand-guidelines.md` for copy rules.
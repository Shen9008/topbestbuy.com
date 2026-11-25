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
| Off-white bg | `#F7F9FB` |
| Slate | `#526273` |
| Border | `#E2E8EE` |

Implemented in `src/styles/tokens.css` as `--color-brand-*` and `--tb-*` aliases.

## Typography

Inter (via `@fontsource/inter`) for headings and body, per PDF. Weights 400 / 500 / 600 / 700 loaded in `src/styles/fonts.css`.

## Components wired

- `SiteLogo.astro` — mark vs full lockup; light/dark SVG wordmarks swap with theme (`data-theme` on `<html>`; default dark)
- `SiteTopBar.astro`, `SiteFooter.astro`, `DesktopIconRail.astro`
- `Seo.astro` — favicon set, apple-touch, `site.webmanifest`, `theme-color`

## Voice (editorial)

Plain, specific, no hype. See PDF §1 and `TopBestBuy.com/topbestbuy-docs/02-brand-guidelines.md` for copy rules.
# TopBestBuy brand implementation

Short reference for engineers. Full spec: `C:\Users\Chia Shen\Downloads\TopBestBuy.com\TopBestBuy_Brand_Guidelines.pdf` (v1.0, November 2026).

## Logo

| File | Use |
|------|-----|
| `public/brand/logo-mark.png` | Rail home, favicons, PWA icons (from *Navy Shopping Bag Checkmark.png*) |
| `public/brand/logo-wordmark-light.png` | Header (mobile) and footer on light surfaces |
| `public/favicon.svg` | SVG favicon (simplified geometry until vector master ships) |

**Missing from source folder:** no approved SVG wordmark or dedicated dark-background lockup PNG. Dark theme uses mark + typographic `.online` fallback in `SiteLogo.astro`.

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

- `SiteLogo.astro` — mark vs full lockup, dark-theme text fallback
- `SiteTopBar.astro`, `SiteFooter.astro`, `DesktopIconRail.astro`
- `Seo.astro` — favicon set, apple-touch, `site.webmanifest`, `theme-color`

## Voice (editorial)

Plain, specific, no hype. See PDF §1 and `TopBestBuy.com/topbestbuy-docs/02-brand-guidelines.md` for copy rules.
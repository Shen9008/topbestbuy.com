# Redirects

Production redirects live in `public/_redirects` for Cloudflare Pages.

| Source | Target | Status | Notes |
|--------|--------|--------|-------|
| `www.topbestbuy.online/*` | `topbestbuy.online` | 301 | Apex canonical |
| `/how-we-make-money` | `/affiliate-disclosure` | 301 | Mockup hash rename |
| `/methodology`, `/how-we-score` | `/how-we-rank` | 301 | Canonical methodology slug TBD with user |

Trailing slash policy: **never** (`astro.config.mjs` → `trailingSlash: 'never'`).
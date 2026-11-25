# Visual asset inventory (Action Network redesign)

**Updated:** 2026-11-25 (UTC+8)  
**Sources:** `main` (PR [#18](https://github.com/Shen9008/topbestbuy.online/pull/18) merged), open PR [#20](https://github.com/Shen9008/topbestbuy.online/pull/20) (remove desktop left icon rail), pending hero crop branch `cursor/hero-banner-match-left-list-2b92`, `src/lib/image-manifest.ts`, `scripts/inventory-assets.json`, Project store `visual-asset-spec.md`, brand deliverables in `TopBestBuy.com`.

**Authoritative workbook (Project store):**  
`C:\Users\Chia Shen\AppData\Local\Cursor\AgentStores\cursor_agent_stores\bc-5a07edf9-c66f-485c-bff7-bd5280db5f21\files\docs\visual-asset-inventory.xlsx` (sheet **All assets (2026)**).

**CSV mirror:** [visual-asset-inventory.csv](./visual-asset-inventory.csv)

**Regenerate workbook + CSV from repo:**

```bash
python scripts/refresh-visual-asset-inventory.py
```

## Summary

| Metric | Count |
|--------|------:|
| **Total rows** | 310 |
| **Exists (on disk)** | 263 |
| **Missing** | 35 |
| **Needs redesign** (layout/aspect shift) | 11 |
| **Deprecated** | 1 |
| **New / tracking slots (PR #18–#20)** | 12 |

## What changed in this refresh (post–PR #18 merge)

1. **Desktop left icon rail (PR #20)** — New row `chrome-desktop-left-icon-rail` → **deprecated** (Lucide + `logo-mark` only; no raster pack). `brand-logo-mark` notes updated: mark stays in **SiteTopBar**, not fixed left rail.
2. **Hub hero art sizing** — `home-hero` and optional hub rows use **4:5 / match-column** spec (`tb-hero--hub` `1.1fr` copy + `0.9fr` `aspect=match` image), not 21:9 banner. Manifest file still 1680×720 until re-export.
3. **Category rail** — `category-rail-icons` clarified: horizontal **CategoryRail** (retained), distinct from removed left rail.
4. **Project store spec** — `visual-asset-spec.md` `home-hero` and logo-mark rows aligned with match-column hero + PR #20 chrome.

## Layout-driven flags (unchanged logic, refreshed notes)

- `home-hero` → **needs redesign** (right column match height; pending hero-banner branch).
- `cat-*` (10) → **needs redesign** (categories index `aspect=video` 16:9; manifest squares 600×600).
- Historical `category-tile-*` naming → absorbed by `cat-*` rows (spec alias in notes).

## Manifest

`src/lib/image-manifest.ts` unchanged on `main`; no new wired `ImageSlot` IDs. Re-run the refresh script after hub art or hero master files land.

## Related docs

- [ACTION-NETWORK-REDESIGN-MAP.md](./ACTION-NETWORK-REDESIGN-MAP.md)
- [FEATURE-VISUALS.md](./FEATURE-VISUALS.md)
- Project store [visual-asset-spec.md](file:///C:/Users/Chia%20Shen/AppData/Local/Cursor/AgentStores/cursor_agent_stores/bc-5a07edf9-c66f-485c-bff7-bd5280db5f21/files/docs/visual-asset-spec.md)
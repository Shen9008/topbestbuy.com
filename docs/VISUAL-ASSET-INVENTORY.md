# Visual asset inventory (Action Network redesign)

**Updated:** 2026-11-25 (Asia/Kuala_Lumpur)  
**Sources:** `main` + PR [#18](https://github.com/Shen9008/topbestbuy.online/pull/18) (`cursor/action-network-redesign-p0`), `src/lib/image-manifest.ts`, `scripts/inventory-assets.json`, brand deliverables in `TopBestBuy.com`.

**Authoritative workbook (Project store):**  
`docs/visual-asset-inventory.xlsx` in the TopBestBuy.online Project Agent Store (sheet **All assets (2026)**).

**CSV mirror:** [visual-asset-inventory.csv](./visual-asset-inventory.csv)

**Regenerate workbook from repo:**

```bash
python scripts/refresh-visual-asset-inventory.py
```

## Summary

| Metric | Count |
|--------|------:|
| **Total rows** | 309 |
| **Exists (on disk)** | 263 |
| **Missing** | 35 |
| **Needs redesign** (layout/aspect shift) | 11 |
| **New slots added for PR #18** | 11 |

## What changed vs pre–PR #18 inventory (273 rows)

1. **Column schema** — `slot_id`, page/section, dimensions/aspect, format, current + proposed paths, status, layout notes (CategoryRail, editorial bands, hub heroes, guide featured strip).
2. **Layout-driven flags**
   - `home-hero` → **needs redesign** (`aspect=match` in split hero grid, not 21:9 banner).
   - `cat-*` (10) → **needs redesign** (categories index uses `aspect=video` 16:9 in editorial tiles; manifest still 600×600).
3. **New proposed raster slots** — hub heroes (guides, tools, compare, search, saved), trust hubs (how-we-rank, editorial-policy), three guide featured card thumbs, plus `category-rail-icons` (Lucide, not manifest).
4. **Premium SVG rows** — 25 `public/icons/premium/*.svg` slots (value/trust/tool/list VisualWell art); 3 reserved tool SVGs still missing.
5. **Historical `category-tile-*` manifest aliases** — retained in data; marked **deprecated** where duplicated by `cat-*`.

## Manifest

No new `ImageSlot` IDs were wired on `main`; **`src/lib/image-manifest.ts` unchanged** on this branch. When hub/guide heroes are implemented, add slots here and re-run the refresh script.

## Related docs

- [ACTION-NETWORK-REDESIGN-MAP.md](./ACTION-NETWORK-REDESIGN-MAP.md)
- [FEATURE-VISUALS.md](./FEATURE-VISUALS.md)
- Project store [visual-asset-spec.md](file:///C:/Users/Chia%20Shen/AppData/Local/Cursor/AgentStores/cursor_agent_stores/bc-5a07edf9-c66f-485c-bff7-bd5280db5f21/files/docs/visual-asset-spec.md)
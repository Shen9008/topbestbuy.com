#!/usr/bin/env python3
"""Refresh Project-store visual-asset-inventory.xlsx from manifest + redesign map (PR #18 live, #20 rail removal)."""
from __future__ import annotations

import csv
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from copy import copy
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter

REPO = Path(__file__).resolve().parents[1]
CSV_OUT = REPO / "docs" / "visual-asset-inventory.csv"
STORE_XLSX = Path(
    r"C:\Users\Chia Shen\AppData\Local\Cursor\AgentStores\cursor_agent_stores"
    r"\bc-5a07edf9-c66f-485c-bff7-bd5280db5f21\files\docs\visual-asset-inventory.xlsx"
)
BRAND_FOLDER = Path(r"C:\Users\Chia Shen\Downloads\TopBestBuy.com")
INVENTORY_JSON = REPO / "scripts" / "inventory-assets.json"
MANIFEST_TS = REPO / "src" / "lib" / "image-manifest.ts"
LIST_VISUALS_TS = REPO / "src" / "lib" / "list-visuals.ts"
FEATURE_VISUALS_TS = REPO / "src" / "lib" / "feature-visuals.ts"

HEADERS = [
    "slot_id",
    "page/section",
    "dimensions/aspect",
    "format",
    "file_path_current",
    "file_path_proposed",
    "status",
    "notes",
]

HUB_HERO_MATCH_DIMS = "1200×1500 · 4:5 (match tb-hero--hub copy column)"
HUB_HERO_MATCH_NOTE = (
    "tb-hero--hub lg:grid-cols-[1.1fr_0.9fr]; ImageSlot aspect=match + h-full — art height tracks left copy column, not 21:9"
)

REDESIGN_BY_PREFIX = {
    "home-hero": {
        "page/section": "Home / hub hero (tb-hero--hub)",
        "layout_note": (
            "PR #18 live: split hub hero; aspect=match in right column (lg+, min-h ~14rem). "
            "Manifest still 1680×720 — re-export master 4:5, centre-right safe crop. "
            "Pending: cursor/hero-banner-match-left-list-2b92"
        ),
        "needs_redesign": True,
        "proposed_dims": HUB_HERO_MATCH_DIMS,
    },
}

REDESIGN_CAT_TILE = {
    "page/section": "Categories index / editorial band tile",
    "layout_note": "PR #18 P3: categories.astro ImageSlot aspect=video (16:9) in tb-card--editorial",
    "needs_redesign": True,
    "proposed_dims": "960×540 (16:9)",
    "proposed_aspect": "16:9",
}

BRAND_SOURCE_ALIASES = {
    "brand-wordmark-dark": BRAND_FOLDER / "topbestbuy-dark-lockup.svg",
}

# Proposed hub / editorial slots from ACTION-NETWORK-REDESIGN-MAP (typography hubs today; art optional)
NEW_REDESIGN_SLOTS = [
    {
        "slot_id": "hub-editorial-guides",
        "page/section": "Guides hub / tb-hero--hub",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/hub-guides.webp",
        "file_path_current": "",
        "status": "missing",
        "notes": f"PR #18 P2: typography hub today; optional right-column art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "hub-editorial-tools",
        "page/section": "Tools hub / tb-hero--hub",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/hub-tools.webp",
        "status": "missing",
        "notes": f"PR #18 P2: quick-tool strip + banded hub; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "hub-editorial-compare",
        "page/section": "Compare / hub hero",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/hub-compare.webp",
        "status": "missing",
        "notes": f"PR #18 P2: ComparePicker wrapper; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "hub-editorial-search",
        "page/section": "Search / hub hero",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/hub-search.webp",
        "status": "missing",
        "notes": f"PR #18 P2: feed-density results; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "hub-editorial-saved",
        "page/section": "Saved / hub hero",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/hub-saved.webp",
        "status": "missing",
        "notes": f"PR #18 P2: saved feed rows; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "trust-hub-how-we-rank",
        "page/section": "How we rank / trust hub",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/trust-how-we-rank.webp",
        "status": "missing",
        "notes": f"PR #18 P3: trust sidebar + criteria table; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "trust-hub-editorial-policy",
        "page/section": "Editorial policy / trust hub",
        "dimensions/aspect": HUB_HERO_MATCH_DIMS,
        "format": "WebP",
        "file_path_proposed": "public/images/editorial/trust-editorial-policy.webp",
        "status": "missing",
        "notes": f"PR #18 P3: trust hub layout; optional art — {HUB_HERO_MATCH_NOTE}",
    },
    {
        "slot_id": "guide-featured-is-an-air-fryer-worth-it",
        "page/section": "Guides hub / featured scroll strip",
        "dimensions/aspect": "640×360 · 16:9",
        "format": "WebP",
        "file_path_proposed": "public/images/guides/featured-is-an-air-fryer-worth-it.webp",
        "status": "missing",
        "notes": "PR #18 P2: tb-scroll-strip card thumb (text-only today)",
    },
    {
        "slot_id": "guide-featured-mattress-firmness-for-back-pain",
        "page/section": "Guides hub / featured scroll strip",
        "dimensions/aspect": "640×360 · 16:9",
        "format": "WebP",
        "file_path_proposed": "public/images/guides/featured-mattress-firmness-for-back-pain.webp",
        "status": "missing",
        "notes": "PR #18 P2: featured read card art",
    },
    {
        "slot_id": "guide-featured-do-you-need-an-ionizer",
        "page/section": "Guides hub / featured scroll strip",
        "dimensions/aspect": "640×360 · 16:9",
        "format": "WebP",
        "file_path_proposed": "public/images/guides/featured-do-you-need-an-ionizer.webp",
        "status": "missing",
        "notes": "PR #18 P2: featured read card art",
    },
    {
        "slot_id": "category-rail-icons",
        "page/section": "Global chrome / CategoryRail (P0)",
        "dimensions/aspect": "48×48 · 1:1",
        "format": "SVG (Lucide)",
        "file_path_proposed": "src/icons — CATEGORY_ICONS",
        "status": "exists",
        "notes": "PR #18 P0: horizontal CategoryRail (not desktop left icon rail); Lucide via Icon.astro",
    },
    {
        "slot_id": "chrome-desktop-left-icon-rail",
        "page/section": "Global chrome / DesktopIconRail",
        "dimensions/aspect": "n/a (Lucide + logo-mark)",
        "format": "n/a",
        "file_path_current": "src/components/layout/DesktopIconRail.astro (deleted PR #20)",
        "file_path_proposed": "",
        "status": "deprecated",
        "notes": "PR #20 open: fixed left nav removed — no raster assets; logo-mark stays in SiteTopBar; nav → top bar + CategoryRail + mobile tab bar",
    },
]

DEPRECATED_RAIL_LAYOUT_NOTES = {
    "brand-logo-mark": "PR #20: logo-mark no longer in left rail; header/top bar only (still favicon source)",
}


def parse_manifest(path: Path) -> dict[str, dict]:
    text = path.read_text(encoding="utf-8")
    entries: dict[str, dict] = {}
    for m in re.finditer(
        r"'([^']+)':\s*\{\s*src:\s*'([^']+)',\s*width:\s*(\d+),\s*height:\s*(\d+)",
        text,
    ):
        slot, src, w, h = m.groups()
        entries[slot] = {"src": src, "width": int(w), "height": int(h)}
    return entries


def repo_public_path(src: str) -> Path:
    return REPO / "public" / src.lstrip("/")


def wired_status(wired: str) -> str:
    return wired  # Shipped | Yes | No


def row_from_json(
    item: dict,
    manifest: dict[str, dict],
    existing_slot_ids: set[str],
) -> dict:
    slot = item["slotId"]
    w, h = item.get("Width_px"), item.get("Height_px")
    aspect = item.get("Aspect", "")
    dims = f"{w}×{h} · {aspect}" if w and h else aspect

    manifest_entry = manifest.get(slot)
    current_path = ""
    if manifest_entry:
        current_path = manifest_entry["src"]
    elif item.get("Notes", "").startswith("public/"):
        note = item["Notes"].split("—")[0].strip()
        if note.startswith("public/"):
            current_path = "/" + note.replace("public/", "", 1) if not note.startswith("/") else note

    pub_file: Path | None = None
    if current_path:
        pub_file = repo_public_path(current_path)
    elif slot.startswith("brand-"):
        guess = {
            "brand-logo-mark": REPO / "public/brand/logo-mark.png",
            "brand-wordmark-light": REPO / "public/brand/logo-wordmark-light.png",
            "brand-wordmark-dark": REPO / "public/brand/logo-wordmark-dark.svg",
            "brand-favicon-svg": REPO / "public/favicon.svg",
            "brand-favicon-32": REPO / "public/favicon-32.png",
            "brand-apple-touch": REPO / "public/apple-touch-icon.png",
        }.get(slot)
        pub_file = guess
        if guess and guess.exists():
            current_path = str(guess.relative_to(REPO)).replace("\\", "/")

    proposed = f"public/images/{item.get('Suggested_Filename', slot)}"
    if item.get("Format") == "SVG" or "svg" in item.get("Suggested_Filename", "").lower():
        proposed = f"public/icons/premium/{slot}.svg"

    wired = item.get("Wired_In_Site", "No")
    status = "missing"
    if pub_file and pub_file.exists():
        status = "exists"
    elif wired in ("Shipped", "Yes") and not manifest_entry:
        status = "missing"
    elif wired == "No":
        status = "missing"

    if slot.startswith("category-tile-"):
        status = "deprecated" if slot.replace("category-tile-", "cat-") in manifest else status

    page = item.get("Section", "")
    notes_parts = [item.get("Notes", "")]
    layout_note = ""

    if slot in REDESIGN_BY_PREFIX:
        rd = REDESIGN_BY_PREFIX[slot]
        page = rd["page/section"]
        layout_note = rd["layout_note"]
        dims = rd.get("proposed_dims", dims)
        if rd.get("needs_redesign") and status == "exists":
            status = "needs redesign"

    if slot.startswith("cat-") and wired == "Yes":
        page = REDESIGN_CAT_TILE["page/section"]
        layout_note = REDESIGN_CAT_TILE["layout_note"]
        dims = REDESIGN_CAT_TILE["proposed_dims"]
        if status == "exists":
            status = "needs redesign"

    if slot.startswith("review-") and status == "exists":
        layout_note = (
            "PR #18 P3: review hub 2-col — hero stays 21:9 banner; verify product not clipped on mobile"
        )

    if slot.startswith("list-hero-") and status == "exists":
        layout_note = "PR #18: list sticky subnav + editorial layout; hero 21:9 unchanged"

    if layout_note:
        notes_parts.append(layout_note)

    if slot in BRAND_SOURCE_ALIASES and BRAND_SOURCE_ALIASES[slot].exists():
        notes_parts.append(
            f"Brand deliverable: {BRAND_SOURCE_ALIASES[slot]} (TopBestBuy.com lockup)"
        )

    if slot in DEPRECATED_RAIL_LAYOUT_NOTES:
        notes_parts.append(DEPRECATED_RAIL_LAYOUT_NOTES[slot])

    return {
        "slot_id": slot,
        "page/section": page,
        "dimensions/aspect": dims,
        "format": item.get("Format", ""),
        "file_path_current": current_path,
        "file_path_proposed": proposed,
        "status": status,
        "notes": " | ".join(p for p in notes_parts if p),
    }


def premium_svg_rows() -> list[dict]:
    premium_dir = REPO / "public" / "icons" / "premium"
    rows: list[dict] = []
    list_map = {}
    lv = LIST_VISUALS_TS.read_text(encoding="utf-8")
    for m in re.finditer(r"'([^']+)':\s*'([^']+)'", lv):
        list_map[m.group(2)] = m.group(1)

    fv = FEATURE_VISUALS_TS.read_text(encoding="utf-8")
    tool_ids = re.findall(r"(\w+):\s*'tool-", fv)

    for svg in sorted(premium_dir.glob("*.svg")):
        base = svg.stem
        exists = svg.exists()
        if base in list_map.values() or base in {
            "air-fryers",
            "air-purifiers",
            "mattress",
            "vacuum",
            "earbuds",
            "cleansers",
            "washing-machines",
            "laptops",
            "smart-watches",
            "smart-tvs",
            "running-shoes",
        }:
            section = "Home / CategoryRail / list tiles (VisualWell)"
            note = "PR #18: CategoryRail + HomeBrowseSection; 48×48 viewBox SVG"
        elif base.startswith("value-"):
            section = "Home / HomeValueProps editorial band"
            note = "PR #18 P0 value strip in banded home"
        elif base.startswith("trust-"):
            section = "Home / HomeTrustStrip editorial band"
            note = "PR #18 P0 trust badges row"
        elif base.startswith("tool-"):
            section = "Home tools strip / Tools hub"
            note = "PR #18 P2 tools quick strip"
        else:
            section = "Premium illustration"
            note = ""

        status = "exists" if exists else "missing"
        rows.append(
            {
                "slot_id": f"premium-svg-{base}",
                "page/section": section,
                "dimensions/aspect": "48×48 viewBox · 1:1",
                "format": "SVG",
                "file_path_current": f"public/icons/premium/{base}.svg",
                "file_path_proposed": f"public/icons/premium/{base}.svg",
                "status": status,
                "notes": note,
            }
        )

    missing_tools = {"tool-airfryer", "tool-cost", "tool-mattress"} - {
        p.stem for p in premium_dir.glob("tool-*.svg")
    }
    for t in sorted(missing_tools):
        rows.append(
            {
                "slot_id": f"premium-svg-{t}",
                "page/section": "Tools hub / reserved",
                "dimensions/aspect": "48×48 viewBox · 1:1",
                "format": "SVG",
                "file_path_current": "",
                "file_path_proposed": f"public/icons/premium/{t}.svg",
                "status": "missing",
                "notes": "FEATURE-VISUALS reserved for /tools hubs (PR #18 P2)",
            }
        )
    return rows


def update_summary(ws_summary, rows: list[dict]) -> None:
    status_counts = Counter(r["status"] for r in rows)
    type_counts: dict[str, Counter] = defaultdict(Counter)
    for r in rows:
        fmt = r.get("format") or "Other"
        type_counts[fmt][r["status"]] += 1

    ws_summary.delete_rows(1, ws_summary.max_row)
    ws_summary.append(["Metric", "Value"])
    ws_summary.append(["Total rows", len(rows)])
    ws_summary.append(["New Action Network slots (Nov 2026)", len(NEW_REDESIGN_SLOTS)])
    ws_summary.append(["Exists", status_counts.get("exists", 0)])
    ws_summary.append(["Missing", status_counts.get("missing", 0)])
    ws_summary.append(["Needs redesign", status_counts.get("needs redesign", 0)])
    ws_summary.append(["Deprecated", status_counts.get("deprecated", 0)])
    ws_summary.append([])
    ws_summary.append(
        [
            "Source",
            "main (PR #18 merged) + PR #20 remove-left-rail + hub-hero match-column spec",
        ]
    )
    ws_summary.append(
        [
            "Updated",
            datetime.now(timezone(timedelta(hours=8))).strftime("%Y-%m-%d %H:%M UTC+8"),
        ]
    )


def write_csv(rows: list[dict]) -> None:
    CSV_OUT.parent.mkdir(parents=True, exist_ok=True)
    with CSV_OUT.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=HEADERS)
        writer.writeheader()
        for row in sorted(rows, key=lambda r: (r["page/section"], r["slot_id"])):
            writer.writerow({h: row.get(h, "") for h in HEADERS})


def copy_header_style(ws, src_row=1) -> None:
    for cell in ws[src_row]:
        cell.font = Font(bold=True)


def main() -> dict:
    inventory = json.loads(INVENTORY_JSON.read_text(encoding="utf-8"))
    manifest = parse_manifest(MANIFEST_TS)

    rows: list[dict] = []
    seen: set[str] = set()
    for item in inventory:
        row = row_from_json(item, manifest, seen)
        if row["slot_id"] in seen:
            continue
        seen.add(row["slot_id"])
        rows.append(row)

    for slot in NEW_REDESIGN_SLOTS:
        if slot["slot_id"] not in seen:
            norm = {h: slot.get(h, "") for h in HEADERS}
            rows.append(norm)
            seen.add(slot["slot_id"])

    rows.extend(premium_svg_rows())

    wb = load_workbook(STORE_XLSX)
    if "All assets" in wb.sheetnames:
        ws = wb["All assets"]
        ws.title = "All assets (2026)"
    else:
        ws = wb.create_sheet("All assets (2026)")

    # Preserve header row height / freeze if set
    if ws.max_row >= 1:
        header_font = ws[1][0].font if ws[1][0].font else Font(bold=True)
    else:
        header_font = Font(bold=True)

    ws.delete_rows(1, ws.max_row)
    ws.append(HEADERS)
    for cell in ws[1]:
        cell.font = copy(header_font) if header_font else Font(bold=True)

    for row in sorted(rows, key=lambda r: (r["page/section"], r["slot_id"])):
        ws.append([row[h] for h in HEADERS])

    # Column widths
    widths = [28, 36, 22, 12, 42, 48, 16, 64]
    for i, w in enumerate(widths, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w

    ws.freeze_panes = "A2"

    if "Summary" in wb.sheetnames:
        update_summary(wb["Summary"], rows)
    else:
        update_summary(wb.create_sheet("Summary"), rows)

    wb.save(STORE_XLSX)
    write_csv(rows)

    new_slots = [s["slot_id"] for s in NEW_REDESIGN_SLOTS]
    stats = {
        "total_rows": len(rows),
        "new_slots_added": len(new_slots),
        "missing": sum(1 for r in rows if r["status"] == "missing"),
        "needs_redesign": sum(1 for r in rows if r["status"] == "needs redesign"),
        "exists": sum(1 for r in rows if r["status"] == "exists"),
        "deprecated": sum(1 for r in rows if r["status"] == "deprecated"),
    }
    return stats


if __name__ == "__main__":
    import pprint

    pprint.pp(main())
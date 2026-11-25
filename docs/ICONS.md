# Icon system

TopBestBuy uses **[Lucide](https://lucide.dev/)** (ISC licence) for **navigation and functional UI**. Decorative **feature moments** (home list tiles, value strip, trust pills, tool cards) use premium custom SVGs — see [FEATURE-VISUALS.md](./FEATURE-VISUALS.md). Do not use Unicode emoji in UI components.

## Files

| Path | Role |
|------|------|
| `src/icons/icon-map.ts` | Semantic keys (`nav.home`, `list.air-fryers`, …) and default sizes |
| `src/icons/index.ts` | Tree-shaken Lucide imports resolved from the map |
| `src/components/ui/Icon.astro` | Astro wrapper (static pages) |
| `src/components/ui/Icon.tsx` | Preact wrapper (islands) |

Approval source: Project store `docs/icon-system-approval.md`.

## Wrapper API

```astro
<Icon name="nav.search" size={20} strokeWidth={1.5} decorative />
```

| Prop | Values | Default |
|------|--------|---------|
| `name` | Any `icon-map` key | required |
| `size` | `16` \| `20` \| `24` \| `32` \| `48` | Per-key default in map, else `24` |
| `strokeWidth` | number | **1.5** |
| `decorative` | boolean | `true` (`aria-hidden`) |
| `label` | string | Required when `decorative={false}` |
| `spin` | boolean | Auto for `state.loading`; respects `prefers-reduced-motion` |

Icons use `stroke="currentColor"` only — colour comes from CSS tokens (`--tb-ink`, `--tb-accent`, `--tb-muted`).

Dense chrome (top bar, breadcrumbs) may use `strokeWidth={2}` at 16–20px for legibility.

## Containers

Interactive icon controls use `.tb-icon-slot` (+ `--hover`, `pad-16` / `pad-20`): surface background, 1px border, 150ms hover to accent. Icon-only controls keep **min 44×44** hit area.

## Licence

Lucide is licensed under the [ISC Licence](https://opensource.org/license/isc-license-txt). Attribution is satisfied by this document and the `lucide` dependency in `package.json`.

## Lucide glyphs in use

Each semantic key maps to one Lucide glyph (stroke icons, 24×24 viewBox):

| Glyph | Semantic keys (sample) |
|-------|------------------------|
| ArrowUp | `nav.back-to-top` |
| Award | `score.warr` |
| BadgePercent | `score.value` |
| Ban | `trust.no-paid` |
| BedDouble | `list.mattress`, `tool.mattress` |
| Bookmark | `nav.saved`, `tab.saved`, `product.save` |
| BookmarkCheck | `product.saved` |
| BookmarkX | `state.empty-saved` |
| BrushCleaning | `list.vacuum`, `tool.vacuum` |
| Calculator | `tool.cost` |
| CalendarClock | `trust.dated` |
| ChartNoAxesColumnIncreasing | `score.total` |
| ChefHat | `category.kitchen` |
| ChevronDown | `nav.mega-chevron`, `product.expand` |
| ChevronLeft | `tool.back` |
| ChevronRight | `nav.chevron-right` |
| CircleAlert | `state.error` |
| CircleCheck | `state.success` |
| CircleMinus | `product.con` |
| CirclePlus | `product.pro` |
| ClipboardList | `trust.methodology` |
| Compass | `tool.finder` |
| Droplets | `list.cleansers`, `tool.cleanser` |
| ExternalLink | `product.source`, `state.external` |
| FileWarning | `trust.corrections` |
| Flame | `list.air-fryers`, `tool.airfryer` |
| Footprints | `list.running-shoes`, `category.fitness` |
| Gauge | `score.perf` |
| GitCompare | `product.compare`, `tool.compare` |
| Headphones | `list.earbuds`, `category.audio` |
| History | `trust.log` |
| House | `nav.home`, `tab.home` |
| Info | `trust.about` |
| Laptop | `list.laptops`, `category.computing` |
| LayoutGrid | `nav.categories`, `tab.browse`, `category.all` |
| Leaf | `score.safe` |
| Link | `trust.affiliate` |
| LoaderCircle | `state.loading` |
| Lock | `trust.privacy` |
| Mail | `trust.contact` |
| Moon | `category.sleep`, `state.theme-dark` |
| Newspaper | `trust.editorial` |
| Package | `score.avail` |
| Puzzle | `score.feat` |
| Refrigerator | `category.appliances` |
| Scale | `trust.terms` |
| ScrollText | `trust.scorecard` |
| Search | `nav.search`, `tab.search` |
| SearchX | `state.empty-search` |
| ShieldCheck | `score.rel` |
| Smartphone | `category.phones` |
| Sparkles | `category.beauty` |
| Sun | `state.theme-light` |
| TriangleAlert | `product.thin-evidence` |
| Trophy | `product.rank-gold` |
| Tv | `list.smart-tvs`, `category.tv` |
| Users | `trust.team` |
| WashingMachine | `list.washing-machines` |
| Watch | `list.smart-watches` |
| Wind | `list.air-purifiers`, `tool.purifier`, `category.air` |
| Wrench | `nav.tools`, `tab.tools` |
| X | `state.close` |

Full key list: `ICON_MAP_KEYS` in `src/icons/icon-map.ts` or the gallery at `/dev/icons` (noindex).

## Premium list illustrations

Home **Start with a list** tiles and matching category-hub list tiles use bespoke SVG illustrations (not Lucide). Nav, chips, mega-menu, and footer links keep Lucide via `LIST_SLUG_ICONS`.

| Asset (`public/icons/premium/`) | List slug |
|---------------------------------|-----------|
| `air-fryers.svg` | `best-air-fryers-malaysia` |
| `air-purifiers.svg` | `best-air-purifiers-malaysia` |
| `mattress.svg` | `best-mattress-malaysia` |
| `vacuum.svg` | `best-vacuum-cleaners-malaysia` |
| `earbuds.svg` | `best-wireless-earbuds-malaysia` |
| `cleansers.svg` | `best-facial-cleansers-malaysia` |
| `washing-machines.svg` | `best-washing-machines-malaysia` |
| `laptops.svg` | `best-laptops-for-students-malaysia` |
| `smart-watches.svg` | `best-smart-watches-malaysia` |
| `smart-tvs.svg` | `best-smart-tvs-malaysia` |
| `running-shoes.svg` | `best-running-shoes-malaysia` |

Rendered by `src/components/ui/ListVisual.astro` inside `.tb-list-visual-well` (soft bordered well, accent glow on tile hover). Spec: 48×48 viewBox, 1.5px rounded strokes, `currentColor` with `#FF7900` accents at ≤30% opacity, transparent background. Mapping: `src/lib/list-visuals.ts`.

**Licence:** MIT — authored for TopBestBuy (this repo). Separate from Lucide; do not merge into `icon-map` Lucide keys.

## Lint / tests

`tests/icon-policy.test.ts` fails CI if:

- Emoji appear under `src/` (excluding `src/data/`)
- Raw `<svg>` appears outside `Icon.astro` / `Icon.tsx` (premium assets load via `VisualWell.astro` / `set:html` from `public/icons/premium/`)
- Any `icon-map` key fails to resolve to Lucide nodes

Run: `npm run test`
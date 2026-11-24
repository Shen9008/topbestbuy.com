# Component sources (21st.dev redesign)

MCP `@21st-dev/magic` was not authenticated in this environment. Patterns below were implemented manually in Astro/Preact + Tailwind v4 to match referenced 21st categories.

| UI block | Inspired by (21st.dev category) | Author / licence | Our implementation | Changes |
|----------|--------------------------------|------------------|---------------------|---------|
| Hero search row | Heroes → command-style input | N/A (custom) | `tb-search-hero` in `components.css`, `index.astro` | Tokens, ⌘K hint, dispatches `tb-open-search` |
| Pill chips | Tabs / chips | N/A (existing `tb-chip`) | `components.css` | Hover border accent |
| Spotlight card | Cards → hover glow | Community pattern | `tb-tile` | Transform + accent ring, no WebGL |
| Command palette | Command menu | shadcn/cmdk style | `AppChrome.tsx` | Ctrl/Cmd+K, Lucide icons |
| Toast | Sonner | MIT (concept) | `AppChrome.tsx` | Fixed bottom status, reduced motion safe |
| Data table | Table | shadcn table | `tb-table*` classes | Sticky header via existing markup |
| Accordion | Accordion | shadcn accordion | `<details>` on product cards | CSS summary chevron via Icon |
| Navigation menu | Navigation menu | Radix pattern | `MegaMenu.astro` | Lucide category icons |

All colours use `--tb-*` and brand tokens in `src/styles/tokens.css`. Icons use `src/icons/icon-map.ts` only.
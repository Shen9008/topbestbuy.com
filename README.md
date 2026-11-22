# TopBestBuy (topbestbuy.online)

Malaysia-first editorial product lists (MYR, en-MY). Static site: **Astro 5**, **TypeScript**, **Tailwind CSS v4**, **Preact** islands, deployed to **Cloudflare Pages**.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview production build |
| `npm run check` | `astro check` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (mockup rank golden tests) |
| `npm run data:extract` | Regenerate `src/data/*` from `reference/mockup.html` |

## Docs

- Design tokens and shell: [`docs/DESIGN.md`](./docs/DESIGN.md)
- Redirect notes: [`src/redirects/README.md`](./src/redirects/README.md)

## Reference mockup

Canonical interactive mockup for data extraction: [`reference/mockup.html`](./reference/mockup.html) (copied from local design bundle). Override path with `MOCKUP_PATH` when running `npm run data:extract`.

## Phase 2 (current)

Typed content under `src/data/` is generated verbatim from the mockup script (no invented products). Ranking logic lives in `src/lib/scoring.ts` and is locked by `tests/golden/ranked.json`.

## Phase 1

Foundation: layout shell, stub routes, SEO baseline, Wrangler/Pages config.
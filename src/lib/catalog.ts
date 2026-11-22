import { LISTS } from '../data/lists';
import { CATS } from '../data/categories';
import { buildRankedCatalog, type RankedProduct } from './scoring';

export const RANKED = buildRankedCatalog(LISTS);

export type ListSlug = keyof typeof LISTS;

export function getList(slug: string) {
  return LISTS[slug as ListSlug];
}

export function getCategory(id: string) {
  return CATS.find((c) => c.id === id);
}

export function listSlugs(): string[] {
  return Object.keys(LISTS);
}

export function productById(id: string): RankedProduct | undefined {
  for (const rows of Object.values(RANKED)) {
    const hit = rows.find((r) => r.id === id);
    if (hit) return hit;
  }
  return undefined;
}

export function allProductsMap(): Record<string, RankedProduct> {
  const out: Record<string, RankedProduct> = {};
  for (const rows of Object.values(RANKED)) {
    for (const row of rows) out[row.id] = row;
  }
  return out;
}

export function topPick(slug: string): RankedProduct | undefined {
  return RANKED[slug]?.[0];
}

export function budgetBands(rows: RankedProduct[]): { lo: number; hi: number } {
  const prices = rows.map((r) => r.price).sort((a, b) => a - b);
  return { lo: prices[3] ?? prices[0] ?? 0, hi: prices[6] ?? prices.at(-1) ?? 0 };
}
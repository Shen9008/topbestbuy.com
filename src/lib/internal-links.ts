import { CATS } from '../data/categories';
import { LISTS } from '../data/lists';
import type { ListSlug } from './catalog';
import { RANKED } from './catalog';
import type { RankedProduct } from './scoring';
import { productFullName } from './format';

export type ListLink = { slug: string; short: string; h1: string };

/** Other live lists in the same category (excludes current). */
export function relatedListsInCategory(
  categoryId: string,
  excludeSlug?: string,
  limit = 3,
): ListLink[] {
  const cat = CATS.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.lists
    .filter((slug) => slug !== excludeSlug)
    .slice(0, limit)
    .map((slug) => {
      const L = LISTS[slug as ListSlug];
      return { slug, short: L.short, h1: L.h1 };
    });
}

/** Top-ranked products on a list for in-content review links. */
export function topReviewsOnList(listSlug: string, limit = 3): RankedProduct[] {
  return (RANKED[listSlug] ?? []).slice(0, limit);
}

/** One top pick per sibling list in the category (for cross-list review links). */
export function categorySpotlightReviews(
  categoryId: string,
  excludeListSlug: string,
  limit = 2,
): RankedProduct[] {
  const cat = CATS.find((c) => c.id === categoryId);
  if (!cat) return [];
  const picks: RankedProduct[] = [];
  for (const slug of cat.lists) {
    if (slug === excludeListSlug) continue;
    const top = RANKED[slug]?.[0];
    if (top) picks.push(top);
    if (picks.length >= limit) break;
  }
  return picks;
}

/**
 * Same-list picks near the current rank (±window), closest ranks first.
 * Used for “Also ranked on this list” blocks on review pages.
 */
export function nearbySiblingReviews(
  listSlug: string,
  current: Pick<RankedProduct, 'id' | 'rank'>,
  limit = 3,
  window = 3,
): RankedProduct[] {
  const peers = RANKED[listSlug] ?? [];
  const minRank = Math.max(1, current.rank - window);
  const maxRank = current.rank + window;
  return peers
    .filter((p) => p.id !== current.id && p.rank >= minRank && p.rank <= maxRank)
    .sort(
      (a, b) =>
        Math.abs(a.rank - current.rank) - Math.abs(b.rank - current.rank) ||
        a.rank - b.rank,
    )
    .slice(0, limit);
}

/** Vary in-content anchor text for sibling review links (product name first). */
export function siblingReviewAnchor(product: RankedProduct, index: number): string {
  const full = productFullName(product);
  const patterns: ((p: RankedProduct, name: string) => string)[] = [
    (_, name) => name,
    (p, name) => `#${p.rank} on this list — ${name}`,
    (_, name) => `Our ${name} review`,
  ];
  return patterns[index % patterns.length](product, full);
}

/**
 * #1–#3 review pages across lists in a category (capped for link budget).
 */
export function categoryTopReviewed(
  categoryId: string,
  perList = 3,
  maxTotal = 6,
): RankedProduct[] {
  const cat = CATS.find((c) => c.id === categoryId);
  if (!cat) return [];
  const out: RankedProduct[] = [];
  for (const slug of cat.lists) {
    const rows = (RANKED[slug] ?? []).slice(0, perList);
    for (const row of rows) {
      out.push(row);
      if (out.length >= maxTotal) return out;
    }
  }
  return out;
}
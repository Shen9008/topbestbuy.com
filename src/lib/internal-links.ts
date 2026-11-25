import { CATS } from '../data/categories';
import { LISTS } from '../data/lists';
import type { ListSlug } from './catalog';
import { RANKED } from './catalog';
import type { RankedProduct } from './scoring';

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
export function topReviewsOnList(
  listSlug: string,
  limit = 3,
): RankedProduct[] {
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
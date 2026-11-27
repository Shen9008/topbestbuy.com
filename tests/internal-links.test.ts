import { describe, expect, it } from 'vitest';
import {
  categoryTopReviewed,
  nearbySiblingReviews,
  siblingReviewAnchor,
} from '../src/lib/internal-links';
import { RANKED } from '../src/lib/catalog';

const LIST = 'best-wireless-earbuds-malaysia';

describe('nearbySiblingReviews', () => {
  it('returns nearby ranks on the same list, excluding self', () => {
    const current = RANKED[LIST]?.[4];
    expect(current).toBeDefined();
    const siblings = nearbySiblingReviews(LIST, current!, 3, 3);
    expect(siblings.length).toBeGreaterThanOrEqual(2);
    expect(siblings.length).toBeLessThanOrEqual(3);
    expect(siblings.every((p) => p.id !== current!.id)).toBe(true);
    expect(siblings.every((p) => Math.abs(p.rank - current!.rank) <= 3)).toBe(true);
  });

  it('orders by proximity to current rank', () => {
    const current = RANKED[LIST]?.[7];
    expect(current).toBeDefined();
    const siblings = nearbySiblingReviews(LIST, current!, 3, 3);
    if (siblings.length >= 2) {
      const d0 = Math.abs(siblings[0].rank - current!.rank);
      const d1 = Math.abs(siblings[1].rank - current!.rank);
      expect(d0).toBeLessThanOrEqual(d1);
    }
  });
});

describe('siblingReviewAnchor', () => {
  it('varies anchor text by index', () => {
    const p = RANKED[LIST]![0];
    const a0 = siblingReviewAnchor(p, 0);
    const a1 = siblingReviewAnchor(p, 1);
    expect(a0).not.toBe(a1);
    expect(a0).toContain(p.brand);
  });
});

describe('categoryTopReviewed', () => {
  it('includes rank 1–3 picks with a cap', () => {
    const picks = categoryTopReviewed('air', 3, 6);
    expect(picks.length).toBeGreaterThan(0);
    expect(picks.length).toBeLessThanOrEqual(6);
    for (const p of picks) {
      expect(p.rank).toBeGreaterThanOrEqual(1);
      expect(p.rank).toBeLessThanOrEqual(3);
    }
  });
});

describe('review page sibling link contract', () => {
  it('every ranked product has at least two nearby siblings when not at list edge', () => {
    const mid = RANKED[LIST]?.[4];
    expect(mid).toBeDefined();
    const siblings = nearbySiblingReviews(LIST, mid!, 3, 3);
    expect(siblings.map((p) => `/reviews/${p.id}`)).toEqual(
      expect.arrayContaining([expect.stringMatching(/^\/reviews\//)]),
    );
    expect(siblings.length).toBe(3);
  });
});
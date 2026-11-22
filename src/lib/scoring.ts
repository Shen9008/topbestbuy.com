import { SCORE_KEYS, W, type ScoreWeights } from '../data/scorecard';
import type { ListCatalog } from '../data/lists';

/** Raw product row shape from mockup `LISTS[*].products` (v3 tuple). */
export type ProductTuple = readonly [
  id: string,
  brand: string,
  name: string,
  tag: string,
  price: number,
  subs: readonly number[],
  bestFor: string,
  specs: readonly string[],
  pros: readonly string[],
  cons: readonly string[],
  num: ProductNum,
  evidence?: ProductEvidence,
];

export type ProductEvidence = {
  b?: string;
  a?: string;
  p?: string;
  s?: readonly string[];
};

export type ProductNum = Record<string, unknown> & {
  types?: readonly string[];
  tex?: string;
  fragfree?: boolean;
};

export type FragranceEvidence = 'confirmed-free' | 'confirmed-scented' | 'unknown';

export type RankedProduct = {
  id: string;
  brand: string;
  name: string;
  tag: string;
  price: number;
  subs: number[];
  best: string;
  specs: string[];
  pros: string[];
  cons: string[];
  num: ProductNum;
  X: ProductEvidence;
  list: string;
  total: number;
  rank: number;
  thin: boolean;
  /** Derived for cleanser matcher; null when unknown (inclusive filter). */
  fragfree: boolean | null;
  fragranceEvidence: FragranceEvidence;
};

export type ListDefinition = ListCatalog[keyof ListCatalog];

export const DEFAULT_WEIGHTS: ScoreWeights = W;

export function r1(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1);
}

/** Match mockup `total(subs, w)`. */
export function scoreTotal(
  subs: readonly number[],
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): number {
  return SCORE_KEYS.reduce(
    (sum, key, i) => sum + weights[key] * subs[i]! / 5,
    0,
  );
}

/** Match mockup thin-evidence cap (≥2 "not stated" spec cells). */
export function applyThinEvidenceCap(
  subs: readonly number[],
  specs: readonly string[],
): { subs: number[]; thin: boolean } {
  const thin = specs.filter((cell) => /^not stated/i.test(cell)).length >= 2;
  const capped = thin
    ? subs.map((v, i) => (i === 0 || i === 3 ? Math.min(v, 3) : v))
    : [...subs];
  return { subs: capped, thin };
}

export function sortByRankScore(
  a: Pick<RankedProduct, 'total' | 'subs'>,
  b: Pick<RankedProduct, 'total' | 'subs'>,
): number {
  return (
    b.total - a.total ||
    b.subs[2]! - a.subs[2]! ||
    b.subs[1]! - a.subs[1]!
  );
}

function scanFragranceFromCopy(
  specs: readonly string[],
  pros: readonly string[],
  cons: readonly string[],
): FragranceEvidence {
  const blob = [...specs, ...pros, ...cons].join(' ');
  if (/\bfragrance[- ]free\b/i.test(blob)) return 'confirmed-free';
  if (
    /\bcontains fragrance\b/i.test(blob) ||
    /\blight scent\b/i.test(blob) ||
    /\bwith fragrance\b/i.test(blob)
  ) {
    return 'confirmed-scented';
  }
  return 'unknown';
}

/**
 * Derive fragrance flags for facial cleansers (Phase 2 fix).
 * Unknown products stay in the matcher when "fragrance-free only" is selected.
 */
export function deriveFragrance(
  num: ProductNum,
  specs: readonly string[],
  pros: readonly string[],
  cons: readonly string[],
): { fragfree: boolean | null; fragranceEvidence: FragranceEvidence } {
  if (typeof num.fragfree === 'boolean') {
    return {
      fragfree: num.fragfree,
      fragranceEvidence: num.fragfree ? 'confirmed-free' : 'confirmed-scented',
    };
  }
  const evidence = scanFragranceFromCopy(specs, pros, cons);
  if (evidence === 'confirmed-free') {
    return { fragfree: true, fragranceEvidence: 'confirmed-free' };
  }
  if (evidence === 'confirmed-scented') {
    return { fragfree: false, fragranceEvidence: 'confirmed-scented' };
  }
  return { fragfree: null, fragranceEvidence: 'unknown' };
}

/** Cleanser matcher: fragrance-free filter with unknown = inclusive. */
export function matchesFragrancePreference(
  product: Pick<RankedProduct, 'fragfree'>,
  fragranceFreeOnly: boolean,
): boolean {
  if (!fragranceFreeOnly) return true;
  if (product.fragfree === false) return false;
  return true;
}

export function tupleToRankedRow(
  listKey: string,
  tuple: ProductTuple,
  kind?: string,
): RankedProduct {
  const [id, brand, name, tag, price, rawSubs, best, specs, pros, cons, num, X] =
    tuple;
  const { subs, thin } = applyThinEvidenceCap(rawSubs, specs);
  const fragrance =
    kind === 'cleanser'
      ? deriveFragrance(num, specs, pros, cons)
      : { fragfree: null as boolean | null, fragranceEvidence: 'unknown' as const };

  return {
    id,
    brand,
    name,
    tag,
    price,
    subs,
    best,
    specs: [...specs],
    pros: [...pros],
    cons: [...cons],
    num: { ...num },
    X: X ?? {},
    list: listKey,
    total: scoreTotal(subs),
    thin,
    fragfree: fragrance.fragfree,
    fragranceEvidence: fragrance.fragranceEvidence,
    rank: 0,
  };
}

export function buildRankedForList(
  listKey: string,
  list: Pick<ListDefinition, 'products' | 'kind'>,
): RankedProduct[] {
  const rows = list.products.map((tuple) =>
    tupleToRankedRow(listKey, tuple as ProductTuple, list.kind),
  );
  rows.sort(sortByRankScore);
  rows.forEach((row, i) => {
    row.rank = i + 1;
  });
  return rows;
}

export function buildRankedCatalog(
  lists: ListCatalog,
): Record<string, RankedProduct[]> {
  const ranked: Record<string, RankedProduct[]> = {};
  for (const [listKey, list] of Object.entries(lists)) {
    ranked[listKey] = buildRankedForList(listKey, list);
  }
  return ranked;
}

/** Usage profile score — same weight override shape as mockup `usages`. */
export function scoreForUsage(
  subs: readonly number[],
  usageWeights: ScoreWeights,
): number {
  return scoreTotal(subs, usageWeights);
}
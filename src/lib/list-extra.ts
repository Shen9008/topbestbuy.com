import { CRIT, SCORE_KEYS, type ScoreWeights } from '../data/scorecard';
import { SITE_DATE } from '../data/meta';
import type { RankedProduct } from './scoring';
import { scoreForUsage, scoreTotal } from './scoring';
import { formatRM, productFullName } from './format';
import { escapeHtml, productThumbMarkup } from './product-thumb';
import type { ListSlug } from './catalog';
import { LISTS } from '../data/lists';
import { resolveSources } from './sources';

function median(prices: number[]): number {
  const s = [...prices].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

export function quickPicksTable(rows: RankedProduct[], listShort: string): string {
  const top5 = rows.slice(0, 5);
  const bestValue = [...top5].sort(
    (a, b) => b.subs[1]! - a.subs[1]! || b.total - a.total,
  )[0]!;
  const cheapest = [...rows].sort((a, b) => a.price - b.price)[0]!;
  const premium = [...top5].sort((a, b) => b.price - a.price)[0]!;
  const productCell = (p: RankedProduct) => {
    const name = productFullName(p);
    const thumb = productThumbMarkup(p.id, name, 'sm', { decorative: true });
    return `<div class="tb-compare-product">${thumb}<span class="tb-compare-product__copy">${escapeHtml(name)}</span></div>`;
  };
  const row = (label: string, p: RankedProduct) =>
    `<tr><th scope="row">${label}</th><td>${productCell(p)}</td><td class="tb-num">${p.total.toFixed(1)}</td><td class="tb-num">${formatRM(p.price)}</td></tr>`;
  return `<table class="tb-table tb-qp"><caption class="sr-only">Quick picks for ${listShort.toLowerCase()} in Malaysia</caption><thead><tr><th>Pick</th><th>Product</th><th>Score</th><th>Price</th></tr></thead><tbody>${row('Best overall', rows[0]!)}${row('Best value (top 5)', bestValue)}${row('Cheapest listed', cheapest)}${row('Premium choice (top 5)', premium)}</tbody></table>`;
}

export function usageBlocks(slug: ListSlug, rows: RankedProduct[]): string {
  const L = LISTS[slug];
  const s = L.short.toLowerCase();
  return L.usages
    .map((u) => {
      const weights = u[1] as unknown as ScoreWeights;
      const scored = rows
        .map((p) => [p, scoreForUsage(p.subs, weights)] as const)
        .sort((a, b) => b[1] - a[1]);
      const [a, aScore] = scored[0]!;
      const b = scored[1];
      return `<h3>Best ${s} for ${u[0].toLowerCase()}</h3><p><strong>${productFullName(a)}</strong> scores ${aScore.toFixed(1)}/100 on our ${u[0].toLowerCase()} weighting at ${formatRM(a.price)}, as reported ${SITE_DATE}. ${b ? `<strong>${productFullName(b[0])}</strong> is next at ${b[1].toFixed(1)}/100 (${formatRM(b[0].price)}).` : ''}</p>`;
    })
    .join('');
}

export function priceBandCopy(slug: ListSlug, rows: RankedProduct[]): string {
  const L = LISTS[slug];
  const s = L.short.toLowerCase();
  const prices = rows.map((r) => r.price);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const m = median(prices);
  const cheapest = rows.find((r) => r.price === lo)!;
  const dear = rows.find((r) => r.price === hi)!;
  return `<p>The ten ${s} we list range from ${formatRM(lo)} (${productFullName(cheapest)}) to ${formatRM(hi)} (${productFullName(dear)}), with a middle price of about ${formatRM(Math.round(m))}. Every figure comes from the source named on its card and was last reviewed on ${SITE_DATE}. Promotions on Shopee, Lazada and retailer sites change often, so confirm the current price and the seller before you pay. See <a href="/affiliate-disclosure">how we make money</a> and <a href="/editorial-policy">our editorial policy</a>.</p>`;
}

export function sourcesSection(_slug: ListSlug, rows: RankedProduct[]): {
  links: ReturnType<typeof resolveSources>;
  gapWarranty: number;
  gapPrice: number;
} {
  const keys = [
    ...new Set(rows.flatMap((r) => r.X.s ?? [])),
  ] as string[];
  const links = resolveSources(keys);
  const gap = (field: 'a' | 'p') =>
    rows.filter((r) =>
      /not stated|not verified|not checked|not confirmed|estimate|verify/i.test(
        String(r.X[field] ?? ''),
      ),
    ).length;
  return { links, gapWarranty: gap('a'), gapPrice: gap('p') };
}

export function faqJsonLd(
  faq: ReadonlyArray<readonly [string, string]>,
): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text },
    })),
  };
}

export function itemListJsonLd(
  h1: string,
  rows: RankedProduct[],
  baseUrl: string,
): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: h1,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: rows.length,
    itemListElement: rows.map((r) => ({
      '@type': 'ListItem',
      position: r.rank,
      name: productFullName(r),
      url: `${baseUrl}/reviews/${r.id}`,
    })),
  };
}

export const TOOL_FOR: Record<string, [string, string]> = {
  airfryer: ['airfryer', 'air fryer size calculator'],
  purifier: ['purifier', 'purifier room size calculator'],
  mattress: ['mattress', 'mattress firmness picker'],
  vacuum: ['vacuum', 'vacuum type chooser'],
  earbuds: ['finder', 'product finder'],
  cleanser: ['cleanser', 'cleanser matcher'],
  washer: ['finder', 'product finder'],
  laptop: ['finder', 'product finder'],
  watch: ['finder', 'product finder'],
  tv: ['finder', 'product finder'],
  shoes: ['finder', 'product finder'],
};

export function criterionBars(subs: number[]): Array<{ label: string; score: number; weight: number }> {
  return CRIT.map((c, i) => ({
    label: c[1].split(' and ')[0] ?? c[1],
    score: subs[i] ?? 0,
    weight: c[2],
  }));
}

export type UsageRow = readonly [string, ScoreWeights | Record<keyof ScoreWeights, number>];

export function usageScoresForProduct(
  subs: readonly number[],
  usages: ReadonlyArray<UsageRow>,
): Array<{ label: string; score: number }> {
  return usages.map((u) => ({
    label: u[0],
    score: scoreForUsage(subs, u[1] as unknown as ScoreWeights),
  }));
}

export { scoreTotal, SCORE_KEYS };
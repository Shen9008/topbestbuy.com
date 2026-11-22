import { LISTS } from '../data/lists';
import { POSTS } from '../data/posts';

export type SearchHit = {
  title: string;
  href: string;
  keywords: string;
};

export const SEARCH_INDEX: SearchHit[] = [
  ...Object.entries(LISTS).map(([slug, L]) => [
    {
      title: L.h1.split(':')[0] ?? L.short,
      href: `/${slug}`,
      keywords: `${L.short} ${L.kw[0]} malaysia top 10`,
    },
  ]).flat(),
  ...Object.entries(POSTS).map(([slug, p]) => ({
    title: p.h1,
    href: `/guides/${slug.replace(/^blog-/, '')}`,
    keywords: `${p.kw} ${p.type} guide`,
  })),
  { title: 'Product finder', href: '/tools', keywords: 'quiz finder recommend' },
  { title: 'Compare products', href: '/compare', keywords: 'vs compare side by side' },
  { title: 'How we rank', href: '/how-we-rank', keywords: 'scorecard methodology weights' },
  { title: 'All categories', href: '/categories', keywords: 'browse lists kitchen air sleep' },
];

export function searchSite(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return SEARCH_INDEX.slice(0, 6);
  return SEARCH_INDEX.filter(
    (hit) =>
      hit.title.toLowerCase().includes(q) || hit.keywords.toLowerCase().includes(q),
  ).slice(0, limit);
}
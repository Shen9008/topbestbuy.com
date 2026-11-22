import { SRC } from '../data/sources';

export type SourceLink = { key: string; title: string; href: string };

export function resolveSources(keys?: readonly string[]): SourceLink[] {
  if (!keys?.length) return [];
  return keys
    .filter((k) => k in SRC)
    .map((k) => {
      const row = SRC[k as keyof typeof SRC];
      return { key: k, title: row[0], href: row[1] };
    });
}
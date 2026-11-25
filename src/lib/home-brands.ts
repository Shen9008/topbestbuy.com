import { listSlugs, topPick } from './catalog';

export type HomeBrand = {
  name: string;
  slug: string;
  src: string;
};

function brandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Unique manufacturers from the current #1 pick in each published list (homepage order). */
export function homeTopBrands(): HomeBrand[] {
  const seen = new Set<string>();
  const brands: HomeBrand[] = [];

  for (const listSlug of listSlugs()) {
    const pick = topPick(listSlug);
    if (!pick?.brand || seen.has(pick.brand)) continue;
    seen.add(pick.brand);
    const slug = brandSlug(pick.brand);
    brands.push({
      name: pick.brand,
      slug,
      src: `/images/brands/${slug}.svg`,
    });
  }

  return brands;
}
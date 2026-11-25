/** List slug → premium illustration basename (public/icons/premium/<id>.svg) */
export const LIST_VISUAL_BY_SLUG: Record<string, string> = {
  'best-air-fryers-malaysia': 'air-fryers',
  'best-air-purifiers-malaysia': 'air-purifiers',
  'best-mattress-malaysia': 'mattress',
  'best-vacuum-cleaners-malaysia': 'vacuum',
  'best-wireless-earbuds-malaysia': 'earbuds',
  'best-facial-cleansers-malaysia': 'cleansers',
  'best-washing-machines-malaysia': 'washing-machines',
  'best-laptops-for-students-malaysia': 'laptops',
  'best-smart-watches-malaysia': 'smart-watches',
  'best-smart-tvs-malaysia': 'smart-tvs',
  'best-running-shoes-malaysia': 'running-shoes',
};

export function hasListVisual(slug: string): boolean {
  return slug in LIST_VISUAL_BY_SLUG;
}
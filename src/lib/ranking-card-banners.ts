import type { ListSlug } from './catalog';

const BANNER_PRODUCTS = {
  'best-air-fryers-malaysia': 'tefal-easy-fry-mega-ey855d',
  'best-air-purifiers-malaysia': 'xiaomi-ap4-compact',
  'best-mattress-malaysia': 'origin-hybrid',
  'best-vacuum-cleaners-malaysia': 'dyson-v12-detect-slim-absolute',
  'best-wireless-earbuds-malaysia': 'apple-airpods-pro-2',
  'best-facial-cleansers-malaysia': 'cetaphil-gentle-skin-cleanser',
  'best-washing-machines-malaysia': 'bosch-wgg254a0sg',
  'best-laptops-for-students-malaysia': 'macbook-air-13-m5',
  'best-smart-watches-malaysia': 'apple-watch-se-3',
  'best-smart-tvs-malaysia': 'tcl-p8l-65',
  'best-running-shoes-malaysia': 'nike-pegasus-41',
} as const satisfies Record<ListSlug, string>;

export function rankingCardBanner(slug: ListSlug, productId: string | undefined) {
  return BANNER_PRODUCTS[slug] === productId ? `/images/ranking-cards/${productId}.webp` : undefined;
}

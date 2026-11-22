/** Launch list slugs (Phase 2 will load from content). */
export const LIST_SLUGS = [
  'best-air-fryers-malaysia',
  'best-air-purifiers-malaysia',
  'best-mattress-malaysia',
  'best-vacuum-cleaners-malaysia',
  'best-wireless-earbuds-malaysia',
  'best-facial-cleansers-malaysia',
  'best-washing-machines-malaysia',
  'best-laptops-for-students-malaysia',
  'best-smart-watches-malaysia',
  'best-smart-tvs-malaysia',
  'best-running-shoes-malaysia',
] as const;

export const CATEGORY_IDS = [
  'kitchen',
  'air',
  'sleep',
  'appliances',
  'audio',
  'computing',
  'phones',
  'tv',
  'beauty',
  'fitness',
] as const;

export const TRUST_ROUTES = [
  { href: '/about', label: 'About' },
  { href: '/editorial-policy', label: 'Editorial policy' },
  { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
  { href: '/team', label: 'Team' },
  { href: '/corrections', label: 'Corrections' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
] as const;

export const MOBILE_TABS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/search', label: 'Search', icon: 'search' },
  { href: '/category/kitchen', label: 'Browse', icon: 'grid' },
  { href: '/saved', label: 'Saved', icon: 'bookmark' },
  { href: '/tools', label: 'Tools', icon: 'tools' },
] as const;

export const REVIEW_STUB_IDS = ['sample-product-a', 'sample-product-b'] as const;

export const GUIDE_STUB_SLUGS = [
  'how-to-read-our-scores',
  'malaysia-buying-basics',
] as const;
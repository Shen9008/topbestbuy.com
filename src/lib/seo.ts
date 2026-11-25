import { SITE_DATE } from '../data/meta';
import { FOUNDER } from '../data/founder';

export const SITE_ORIGIN = 'https://topbestbuy.online';
export const BRAND_SUFFIX = ' · TopBestBuy';

/** Visible <title> length target including brand suffix (Google ~60 chars). */
export const TITLE_MAX = 60;
export const META_DESC_MAX = 155;

const LIST_OG_IMAGES: Record<string, string> = {
  'best-air-fryers-malaysia': '/images/card-photos/air-fryers.webp',
  'best-air-purifiers-malaysia': '/images/card-photos/air-purifiers.webp',
  'best-mattress-malaysia': '/images/card-photos/mattresses.webp',
  'best-vacuum-cleaners-malaysia': '/images/card-photos/vacuum-cleaners.webp',
  'best-wireless-earbuds-malaysia': '/images/card-photos/wireless-earbuds.webp',
  'best-facial-cleansers-malaysia': '/images/card-photos/facial-cleansers.webp',
  'best-washing-machines-malaysia': '/images/card-photos/washing-machines.webp',
  'best-laptops-for-students-malaysia': '/images/card-photos/student-laptops.webp',
  'best-smart-watches-malaysia': '/images/card-photos/smartwatches.webp',
  'best-smart-tvs-malaysia': '/images/card-photos/smart-tvs.webp',
  'best-running-shoes-malaysia': '/images/card-photos/running-shoes.webp',
};

export function listOgImage(slug: string): string | undefined {
  return LIST_OG_IMAGES[slug];
}

export function siteDateIso(): string {
  const ms = Date.parse(String(SITE_DATE).replace(/(\d+) (\w+) (\d+)/, '$1 $2 $3'));
  if (Number.isNaN(ms)) return '2026-11-22';
  return new Date(ms).toISOString().slice(0, 10);
}

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}

/** Build document title with brand suffix, clipped to TITLE_MAX. */
export function documentTitle(pageTitle: string): string {
  if (pageTitle.includes('TopBestBuy')) {
    return pageTitle.length <= TITLE_MAX ? pageTitle : clipAtWord(pageTitle, TITLE_MAX);
  }
  const suffix = BRAND_SUFFIX;
  const maxBase = TITLE_MAX - suffix.length;
  const base =
    pageTitle.length <= maxBase ? pageTitle : clipAtWord(pageTitle, maxBase);
  return `${base}${suffix}`;
}

function clipAtWord(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const slice = text.slice(0, maxLen - 1);
  const lastSpace = slice.lastIndexOf(' ');
  if (lastSpace > maxLen * 0.6) return `${slice.slice(0, lastSpace).trimEnd()}…`;
  return `${slice.trimEnd()}…`;
}

export function clampMetaDescription(text: string, max = META_DESC_MAX): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const slice = t.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > max * 0.65 ? slice.slice(0, lastSpace) : slice).trimEnd()}.`;
}

export function listDocumentTitle(short: string): string {
  return documentTitle(`Best ${short} Malaysia: Top 10 (2026)`);
}

export function listMetaDescription(
  short: string,
  fallback?: string,
): string {
  const generated = `Best ${short.toLowerCase()} in Malaysia: scored Top 10 with MYR prices, trade-offs and cited sources (${SITE_DATE}).`;
  const raw = fallback && fallback.length <= META_DESC_MAX ? fallback : generated;
  return clampMetaDescription(raw);
}

export function reviewDocumentTitle(productName: string): string {
  return documentTitle(`${productName} review (Malaysia)`);
}

export function reviewMetaDescription(
  productName: string,
  score: number,
): string {
  return clampMetaDescription(
    `${productName} scores ${score.toFixed(1)}/100 on our Malaysia scorecard — specs, usage fit, pros, cons and where it ranks.`,
  );
}

export function categoryDocumentTitle(categoryName: string): string {
  return documentTitle(`${categoryName}: Top 10 lists (Malaysia)`);
}

export function categoryMetaDescription(
  categoryName: string,
  categoryDesc: string,
): string {
  return clampMetaDescription(
    `Top 10 ${categoryName.toLowerCase()} lists for Malaysia shoppers. ${categoryDesc} Scored picks with MYR prices.`,
  );
}

export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export const FOUNDER_ID = `${SITE_ORIGIN}/#founder`;

export function founderPersonJsonLd(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.jobTitle,
    url: absoluteUrl('/team'),
    description: FOUNDER.bio,
    worksFor: { '@id': `${SITE_ORIGIN}/#organization` },
    sameAs: [FOUNDER.linkedIn],
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'TopBestBuy',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/images/inventory-refresh/brand-wordmark-dark.png`,
    description:
      'TopBestBuy publishes scored Top 10 product lists for shoppers in Malaysia, with transparent methodology and MYR prices.',
    founder: { '@id': FOUNDER_ID },
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: 'TopBestBuy',
    inLanguage: 'en-MY',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_ORIGIN}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function homePageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd(), founderPersonJsonLd(), websiteJsonLd()],
  };
}

export function aboutPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About TopBestBuy',
        url: absoluteUrl('/about'),
        inLanguage: 'en-MY',
        mainEntity: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      organizationJsonLd(),
      founderPersonJsonLd(),
      breadcrumbListJsonLd([
        { label: 'Trust', href: '/about' },
        { label: 'About us' },
      ]),
    ],
  };
}

export function teamPageJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        name: 'TopBestBuy team',
        url: absoluteUrl('/team'),
        inLanguage: 'en-MY',
        mainEntity: { '@id': FOUNDER_ID },
      },
      founderPersonJsonLd(),
      organizationJsonLd(),
      breadcrumbListJsonLd([
        { label: 'Trust', href: '/about' },
        { label: 'Team' },
      ]),
    ],
  };
}

export type BreadcrumbInput = { label: string; href?: string };

export function breadcrumbListJsonLd(
  items: BreadcrumbInput[],
): Record<string, unknown> {
  const list = [
    { label: 'Home', href: '/' },
    ...items.filter((i) => i.label),
  ];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: list.map((item, idx) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: idx + 1,
        name: item.label,
      };
      if (item.href) entry.item = absoluteUrl(item.href);
      return entry;
    }),
  };
}

export function articleJsonLd(opts: {
  headline: string;
  description: string;
  path: string;
  type?: 'Article' | 'BlogPosting';
}): Record<string, unknown> {
  return {
    '@type': opts.type ?? 'Article',
    headline: opts.headline,
    description: opts.description,
    inLanguage: 'en-MY',
    dateModified: siteDateIso(),
    datePublished: siteDateIso(),
    mainEntityOfPage: absoluteUrl(opts.path),
    author: {
      '@type': 'Organization',
      name: 'TopBestBuy',
      url: SITE_ORIGIN,
    },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

export function productReviewJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  image?: string;
}): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
  };
  if (opts.image) node.image = absoluteUrl(opts.image);
  return node;
}

/** Replace mockup hash links in guide HTML with real paths. */
export function normalizeGuideBodyHtml(html: string): string {
  return html
    .replace(/href="#compare"/g, 'href="/compare"')
    .replace(/href="#corrections"/g, 'href="/corrections"')
    .replace(/href="#tools"([^>]*data-tool="([^"]+)")/g, 'href="/tools?tool=$2"$1')
    .replace(/href="#tools"/g, 'href="/tools"')
    .replace(/href="#(best-[a-z0-9-]+)"/g, 'href="/$1"')
  .replace(/href="#how-we-score"/g, 'href="/how-we-rank"');
}

export const HOME = {
  title: 'Best Top 10 Lists for Malaysia',
  description:
    'Scored Top 10 lists for appliances, home and lifestyle in Malaysia. Transparent MYR prices, trade-offs and sources — no hype.',
} as const;

export const TRUST_META: Record<string, { title: string; description: string }> = {
  about: {
    title: 'About TopBestBuy Malaysia',
    description:
      'Why TopBestBuy exists: short, honest Top 10 lists for people shopping in Malaysia, with a published scorecard and affiliate transparency.',
  },
  'affiliate-disclosure': {
    title: 'Affiliate disclosure',
    description:
      'How TopBestBuy may earn commission from retailer links, how that affects our rankings (it does not), and where to verify our editorial policy.',
  },
  contact: {
    title: 'Contact TopBestBuy',
    description:
      'Reach the TopBestBuy team about list corrections, editorial questions or partnership enquiries for our Malaysia buying guides.',
  },
  corrections: {
    title: 'Corrections and updates',
    description:
      'Log of factual corrections and list updates on TopBestBuy. We fix errors openly and note what changed on affected Top 10 pages.',
  },
  team: {
    title: 'TopBestBuy editorial team',
    description:
      'Meet founder Ooi Chia Shen and the editorial approach behind TopBestBuy Top 10 lists for Malaysia — methodology, sources, and how we score.',
  },
  privacy: {
    title: 'Privacy policy',
    description:
      'How TopBestBuy handles data on topbestbuy.online, including local shortlists, analytics and affiliate links for Malaysia readers.',
  },
  terms: {
    title: 'Terms of use',
    description:
      'Terms for using TopBestBuy lists, tools and reviews. Informational content only — confirm prices and specs with retailers in Malaysia.',
  },
};
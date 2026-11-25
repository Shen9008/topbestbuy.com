import { EDITORIAL_BYLINE } from '../data/editorial';
import { FOUNDER } from '../data/founder';
import { productFullName } from './format';
import type { RankedProduct } from './scoring';

const SITE = 'https://topbestbuy.online';
const ORG_ID = `${SITE}/#organization`;
const FOUNDER_ID = `${SITE}/#founder`;

function founderPersonNode(): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    alternateName: FOUNDER.alternateName,
    jobTitle: FOUNDER.role,
    url: `${SITE}/team`,
    sameAs: [FOUNDER.linkedIn],
    homeLocation: {
      '@type': 'Place',
      name: FOUNDER.location,
    },
  };
}

export function siteOrganizationGraph(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      founderPersonNode(),
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'TopBestBuy',
        url: SITE,
        logo: `${SITE}/icon-512.png`,
        description:
          'Editorial Top 10 product lists for Malaysia with transparent scorecards and dated sources.',
        founder: { '@id': FOUNDER_ID },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'TopBestBuy',
        publisher: { '@id': ORG_ID },
        inLanguage: 'en-MY',
      },
    ],
  };
}

export function reviewPageGraph(product: RankedProduct, listTitle: string): Record<string, unknown> {
  const name = productFullName(product);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'TopBestBuy',
        url: SITE,
      },
      {
        '@type': 'Review',
        '@id': `${SITE}/reviews/${product.id}#review`,
        name: `${name} review`,
        reviewBody: product.X.b ?? `${name} ranked #${product.rank} on ${listTitle}.`,
        author: {
          '@type': 'Organization',
          name: EDITORIAL_BYLINE,
          url: `${SITE}/about`,
        },
        publisher: { '@id': ORG_ID },
        dateModified: '2026-11-22',
        itemReviewed: {
          '@type': 'Product',
          name,
          description: product.best,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: product.total.toFixed(1),
          bestRating: '100',
          worstRating: '0',
        },
      },
    ],
  };
}

export function articlePageGraph(
  title: string,
  description: string,
  path: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: `${SITE}${path}`,
    headline: title,
    description,
    url: `${SITE}${path}`,
    author: {
      '@type': 'Person',
      '@id': FOUNDER_ID,
      name: FOUNDER.name,
      url: `${SITE}/team`,
    },
    publisher: {
      '@id': ORG_ID,
    },
    inLanguage: 'en-MY',
  };
}
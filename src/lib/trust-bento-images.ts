export type TrustBentoImage = {
  avif: string;
  webp: string;
  jpg: string;
  alt: string;
  width: number;
  height: number;
};

export const TRUST_BENTO_IMAGES = {
  scorecard: {
    avif: '/images/trust/trust-scorecard.avif',
    webp: '/images/trust/trust-scorecard.webp',
    jpg: '/images/trust/trust-scorecard.jpg',
    alt: 'Editor reviewing a product scorecard and criteria spreadsheet at a desk',
    width: 800,
    height: 600,
  },
  sources: {
    avif: '/images/trust/trust-sources.avif',
    webp: '/images/trust/trust-sources.webp',
    jpg: '/images/trust/trust-sources.jpg',
    alt: 'Research notes, highlighted articles, and linked sources laid out for fact-checking',
    width: 800,
    height: 600,
  },
  independenceHero: {
    avif: '/images/trust/trust-independence-hero.avif',
    webp: '/images/trust/trust-independence-hero.webp',
    jpg: '/images/trust/trust-independence-hero.jpg',
    alt: 'Editorial team workspace suggesting independent, commission-free rankings',
    width: 1600,
    height: 900,
  },
  correctionsPanel: {
    avif: '/images/trust/trust-corrections-panel.avif',
    webp: '/images/trust/trust-corrections-panel.webp',
    jpg: '/images/trust/trust-corrections-panel.jpg',
    alt: 'Correction log with dated entries on a desk beside a laptop',
    width: 800,
    height: 600,
  },
} satisfies Record<string, TrustBentoImage>;
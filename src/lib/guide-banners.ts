import type { PostCatalog } from '../data/posts';

export type GuideId = keyof PostCatalog;

export const FEATURED_GUIDES = [
  'blog-is-an-air-fryer-worth-it',
  'blog-mattress-firmness-for-back-pain',
  'blog-do-you-need-an-ionizer',
] as const satisfies readonly GuideId[];

const BANNER_ALT: Record<GuideId, string> = {
  'blog-is-an-air-fryer-worth-it': 'A hand slides a basket of food out of a countertop air fryer.',
  'blog-how-to-clean-an-air-fryer': 'Hands clean a removable air fryer basket with a soft sponge.',
  'blog-do-you-need-an-ionizer': 'An air purifier stands beside a sunlit apartment window.',
  'blog-mattress-firmness-for-back-pain': 'A person presses down on a mattress to feel its firmness.',
  'blog-update-air-fryer-list': 'Two air fryers sit side by side on a kitchen counter.',
  'blog-robot-vs-cordless-vacuum': 'A robot vacuum and a cordless stick vacuum on a timber floor.',
  'blog-how-to-choose-a-facial-cleanser': 'A hand reaches for a cleanser on a bathroom counter.',
};

export function guideBanner(id: GuideId) {
  const slug = id.replace(/^blog-/, '');
  const base = `/images/guides/${slug}`;
  return {
    href: `/guides/${slug}`,
    alt: BANNER_ALT[id],
    small: `${base}-576.webp`,
    large: `${base}-1152.webp`,
  };
}

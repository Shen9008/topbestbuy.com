/**
 * Image manifest hook (Phase 4 attaches real assets).
 * Keys match mockup `ph()` slot ids where applicable.
 */
export type ImageManifestEntry = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const imageManifest: Record<string, ImageManifestEntry | undefined> = {
  'site-logo': undefined,
  'hero-home': undefined,
  'category-tile': undefined,
  'product-thumb': undefined,
};

export function resolveManifestSlot(
  slotId: string,
): ImageManifestEntry | undefined {
  return imageManifest[slotId];
}
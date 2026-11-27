import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  productManifestSlotId,
  productThumbMarkup,
  resolveProductThumb,
} from '../src/lib/product-thumb';

describe('product thumbs', () => {
  it('resolves wired product manifest slots', () => {
    const thumb = resolveProductThumb('bosch-wgg254a0sg', 'Bosch Serie 6');
    expect(thumb?.src).toBe('/images/products/bosch-wgg254a0sg.webp');
    expect(productManifestSlotId('bosch-wgg254a0sg')).toBe('prod-bosch-wgg254a0sg');
  });

  it('ships markup with thumb CSS classes', () => {
    const html = productThumbMarkup('bosch-wgg254a0sg', 'Bosch Serie 6', 'sm');
    expect(html).toContain('tb-product-thumb--sm');
    expect(html).toContain('bosch-wgg254a0sg.webp');
    expect(html).toContain('loading="lazy"');
  });

  it('wires thumb helpers into list surfaces', () => {
    const root = join(import.meta.dirname, '..');
    const rankedRow = readUtf8(join(root, 'src/components/list/RankedProductRow.astro'));
    const compareCell = readUtf8(join(root, 'src/components/list/CompareProductCell.astro'));
    const listClient = readUtf8(join(root, 'src/components/islands/ListPageClient.tsx'));
    const strip = readUtf8(join(root, 'src/components/sections/TopReviewsStrip.astro'));

    expect(rankedRow).toContain('ProductThumb');
    expect(compareCell).toContain('tb-compare-product');
    expect(listClient).toContain('compareProductCellMarkup');
    expect(strip).toContain('RankedProductRow');
  });
});

function readUtf8(path: string): string {
  expect(existsSync(path), path).toBe(true);
  return readFileSync(path, 'utf8');
}
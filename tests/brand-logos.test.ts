import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { homeTopBrands } from '../src/lib/home-brands';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

describe('homepage brand logo assets', () => {
  it('ships vector or raster marks (not text-placeholder SVGs)', () => {
    for (const brand of homeTopBrands()) {
      const assetPath = path.join(repoRoot, 'public', brand.src);
      expect(fs.existsSync(assetPath), `${brand.name} → ${brand.src}`).toBe(true);
      const buf = fs.readFileSync(assetPath);
      expect(buf.byteLength).toBeGreaterThan(200);

      if (brand.src.endsWith('.svg')) {
        const text = buf.toString('utf8');
        expect(text, brand.name).not.toMatch(/<text\b/i);
        expect(text, brand.name).toMatch(/<path\b/i);
      }
    }
  });
});
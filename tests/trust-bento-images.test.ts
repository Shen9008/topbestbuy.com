import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TRUST_BENTO_IMAGES } from '../src/lib/trust-bento-images';

const publicRoot = join(import.meta.dirname, '..', 'public');

describe('trust bento editorial images', () => {
  it('ships avif, webp, and jpg for each trust card theme', () => {
    for (const entry of Object.values(TRUST_BENTO_IMAGES)) {
      for (const src of [entry.avif, entry.webp, entry.jpg]) {
        const path = join(publicRoot, src.replace(/^\//, ''));
        expect(existsSync(path), path).toBe(true);
      }
      expect(entry.alt.length).toBeGreaterThan(12);
    }
  });
});
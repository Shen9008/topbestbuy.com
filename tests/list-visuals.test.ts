import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { LIST_VISUAL_BY_SLUG } from '../src/lib/list-visuals';
import { listSlugs } from '../src/lib/catalog';

const PREMIUM_DIR = join(import.meta.dirname, '..', 'public', 'icons', 'premium');

describe('premium list illustrations', () => {
  it('covers every live list slug', () => {
    for (const slug of listSlugs()) {
      expect(LIST_VISUAL_BY_SLUG[slug], slug).toBeTruthy();
    }
  });

  it('ships SVG assets with 48 viewBox and currentColor strokes', () => {
    for (const file of Object.values(LIST_VISUAL_BY_SLUG)) {
      const path = join(PREMIUM_DIR, `${file}.svg`);
      expect(existsSync(path), path).toBe(true);
      const svg = readFileSync(path, 'utf8');
      expect(svg).toMatch(/viewBox="0 0 48 48"/);
      expect(svg).toMatch(/stroke="currentColor"|fill="currentColor"/);
      expect(svg).toMatch(/#FF7900/);
    }
  });
});

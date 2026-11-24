import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

const ALLOWED_SVG = new Set([
  'src/components/ui/Icon.astro',
  'src/components/ui/Icon.tsx',
]);

/** Emoji / symbol blocks sometimes used as UI icons (not © etc. in footer copy). */
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

const RAW_SVG_RE = /<svg[\s>]/i;

async function walk(dir: string, acc: string[] = []): Promise<string[]> {
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const info = await stat(full);
    if (info.isDirectory()) {
      if (name === 'data') continue;
      await walk(full, acc);
    } else if (/\.(astro|tsx|ts|jsx|js)$/.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

describe('icon policy', () => {
  it('forbids emoji glyphs in src (excluding auto-generated data)', async () => {
    const files = await walk(SRC);
    const offenders: string[] = [];
    for (const file of files) {
      const text = await readFile(file, 'utf8');
      if (EMOJI_RE.test(text)) {
        offenders.push(relative(ROOT, file));
      }
    }
    expect(offenders, `Emoji found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('forbids raw <svg> outside Icon wrapper', async () => {
    const files = await walk(SRC);
    const offenders: string[] = [];
    for (const file of files) {
      const rel = relative(ROOT, file);
      if (ALLOWED_SVG.has(rel)) continue;
      const text = await readFile(file, 'utf8');
      if (RAW_SVG_RE.test(text)) {
        offenders.push(rel);
      }
    }
    expect(offenders, `Raw SVG in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('registers every icon-map key', async () => {
    const { ICON_MAP_KEYS, getIconNodes } = await import('../src/icons');
    for (const key of ICON_MAP_KEYS) {
      expect(getIconNodes(key).length, key).toBeGreaterThan(0);
    }
  });
});
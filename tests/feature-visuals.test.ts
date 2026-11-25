import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  TOOL_VISUAL_IDS,
  TRUST_VISUAL_IDS,
  VALUE_VISUAL_IDS,
} from '../src/lib/feature-visuals';

const PREMIUM_DIR = join(import.meta.dirname, '..', 'public', 'icons', 'premium');

function assertPremiumSvg(file: string) {
  const path = join(PREMIUM_DIR, `${file}.svg`);
  expect(existsSync(path), path).toBe(true);
  const svg = readFileSync(path, 'utf8');
  expect(svg).toMatch(/viewBox="0 0 48 48"/);
  expect(svg).toMatch(/(?:stroke|fill)="(?:currentColor|#172542)"/);
  expect(svg).toMatch(/#FF7900/);
  expect(svg).toMatch(/stroke-width="1\.[0-9]"/);
}

describe('premium feature illustrations', () => {
  it('ships value strip assets', () => {
    for (const file of Object.values(VALUE_VISUAL_IDS)) assertPremiumSvg(file);
  });

  it('ships trust pill assets', () => {
    for (const file of Object.values(TRUST_VISUAL_IDS)) assertPremiumSvg(file);
  });

  it('ships home tool tile assets', () => {
    for (const id of ['finder', 'vacuum', 'cleanser', 'purifier'] as const) {
      assertPremiumSvg(TOOL_VISUAL_IDS[id]);
    }
  });
});

describe('home section wiring', () => {
  const root = join(import.meta.dirname, '..', 'src', 'components', 'sections');
  const pages = join(import.meta.dirname, '..', 'src', 'pages');

  it('uses illustration components instead of Lucide in feature regions', () => {
    const value = readFileSync(join(root, 'HomeValueProps.astro'), 'utf8');
    const trust = readFileSync(join(root, 'HomeTrustStrip.astro'), 'utf8');
    const browse = readFileSync(join(root, 'HomeBrowseSection.astro'), 'utf8');
    const tools = readFileSync(join(root, 'HomeToolsStrip.astro'), 'utf8');
    const tile = readFileSync(join(root, 'HomeToolTile.astro'), 'utf8');
    const toolsPage = readFileSync(join(pages, 'tools', 'index.astro'), 'utf8');

    expect(value).toContain('ValueVisual');
    expect(value).not.toContain('<Icon');
    expect(trust).toContain('TrustVisual');
    expect(trust).not.toContain('<Icon');
    expect(browse).toContain('ListVisual');
    expect(browse).not.toContain('LIST_SLUG_ICONS');
    expect(tools).toContain('HomeToolTile');
    expect(tools).not.toContain('TOOL_TAB_ICONS');
    expect(tile).toContain('ToolVisual');
    expect(tile).toContain('tb-utility-tile');
    expect(toolsPage).toContain('HomeToolTile');
    expect(toolsPage).not.toContain('tb-utility-tile__icon');
  });
});

describe('static build embeds premium paths', () => {
  it('home HTML inlines custom SVG (not only Lucide) when dist exists', () => {
    const distIndex = join(import.meta.dirname, '..', 'dist', 'index.html');
    if (!existsSync(distIndex)) return;
    const html = readFileSync(distIndex, 'utf8');
    const svgCount = (html.match(/viewBox="0 0 48 48"/g) ?? []).length;
    expect(svgCount).toBeGreaterThanOrEqual(18);
    expect(html).toContain('M24 8l12 4v10');
    expect(html).toContain('M13 34.5l3 3 7-7');
  });
});
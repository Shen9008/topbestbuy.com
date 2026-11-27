import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

describe('light theme glass navy band contrast', () => {
  it('components.css scopes dark ink on light glass navy bands', () => {
    const css = readFileSync(join(ROOT, 'src/styles/components.css'), 'utf8');
    expect(css).toContain("[data-theme='light'] .tb-band--navy");
    expect(css).toMatch(
      /\[data-theme='light'\] \.tb-band--navy[\s\S]*?--tb-ink: var\(--tb-band-on-light-ink\)/,
    );
    expect(css).toMatch(
      /prefers-reduced-transparency[\s\S]*?\[data-theme='light'\] \.tb-band--navy[\s\S]*?--tb-ink: var\(--tb-band-on-navy-ink\)/,
    );
  });

  it('tokens define separate light and navy band ink in light theme', () => {
    const css = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
    expect(css).toContain("[data-theme='light']");
    expect(css).toMatch(
      /--tb-band-on-light-ink: var\(--tb-ink\)/,
    );
    expect(css).toMatch(
      /\[data-theme='light'\][\s\S]*--tb-band-on-navy-ink: oklch\(0\.99/,
    );
  });
});
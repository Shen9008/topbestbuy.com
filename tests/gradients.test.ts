import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

describe('gradient design system', () => {
  it('tokens.css defines amplified palette stops and motion durations', () => {
    const css = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
    expect(css).toContain('--tb-gradient-lime-16');
    expect(css).toContain('--tb-gradient-orange-08');
    expect(css).toContain('--tb-gradient-dur-ambient: 48s');
    expect(css).toContain('--tb-gradient-dur-hero: 42s');
    expect(css).toContain('--tb-gradient-dur-band: 55s');
  });

  it('gradients.css exposes section washes and reduced-motion fallbacks', () => {
    const css = readFileSync(join(ROOT, 'src/styles/gradients.css'), 'utf8');
    expect(css).toContain('--tb-gradient-band-wash-light');
    expect(css).toContain('--tb-gradient-list-column');
    expect(css).toContain('@keyframes tb-gradient-ambient-drift');
    expect(css).toContain('prefers-reduced-motion: reduce');
  });
});
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(import.meta.dirname, '..');

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

function parseColor(raw: string): [number, number, number] {
  const v = raw.trim();
  if (v.startsWith('#')) return hexToRgb(v);
  const m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  throw new Error(`Unsupported color: ${v}`);
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relLuminance(parseColor(fg));
  const l2 = relLuminance(parseColor(bg));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type ThemeTokens = Record<string, string>;

const DARK: ThemeTokens = {
  bg: '#141414',
  surface: '#1c1c1c',
  surface2: '#232323',
  text: '#e6e6e6',
  textStrong: '#ffffff',
  textMuted: '#b4b4b4',
  accent: '#c6ff3d',
  onAccent: '#141414',
  accentFg: '#c6ff3d',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
};

const LIGHT: ThemeTokens = {
  bg: '#ffffff',
  surface: '#f6f6f4',
  surface2: '#ececea',
  text: '#1a1a1a',
  textMuted: '#5c5c57',
  accent: '#c6ff3d',
  onAccent: '#141414',
  accentFg: '#4d7c0f',
  accentInk: '#4d7c0f',
  success: '#15803d',
  warning: '#b45309',
  danger: '#b91c1c',
  info: '#1d4ed8',
};

const TEXT_PAIRS: Array<{ fg: keyof ThemeTokens; bg: keyof ThemeTokens; min: number }> = [
  { fg: 'text', bg: 'bg', min: 4.5 },
  { fg: 'text', bg: 'surface', min: 4.5 },
  { fg: 'textMuted', bg: 'bg', min: 4.5 },
  { fg: 'textMuted', bg: 'surface', min: 4.5 },
  { fg: 'textStrong', bg: 'bg', min: 4.5 },
  { fg: 'onAccent', bg: 'accent', min: 4.5 },
  { fg: 'accentFg', bg: 'bg', min: 4.5 },
  { fg: 'success', bg: 'bg', min: 4.5 },
  { fg: 'warning', bg: 'bg', min: 4.5 },
  { fg: 'danger', bg: 'bg', min: 4.5 },
  { fg: 'info', bg: 'bg', min: 4.5 },
];

function assertPairs(theme: ThemeTokens, themeName: string) {
  const failures: string[] = [];
  for (const { fg, bg, min } of TEXT_PAIRS) {
    const fgHex = theme[fg];
    const bgHex = theme[bg];
    if (!fgHex || !bgHex) continue;
    const ratio = contrastRatio(fgHex, bgHex);
    if (ratio < min) {
      failures.push(`${themeName} ${fg} on ${bg}: ${ratio.toFixed(2)} < ${min}`);
    }
  }
  return failures;
}

describe('design token contrast (WCAG)', () => {
  it('tokens.css defines lime accent', () => {
    const css = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');
    expect(css).toContain('--accent: #c6ff3d');
    expect(css).toContain('--accent-fg');
    expect(css).not.toContain('#ff7900');
    expect(css).not.toContain('#FF7A3D');
  });

  it('dark theme text pairs meet 4.5:1', () => {
    const failures = assertPairs(DARK, 'dark');
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('light theme text pairs meet 4.5:1', () => {
    const failures = assertPairs(LIGHT, 'light');
    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('neon lime is never used as body text on white (accent-fg uses ink)', () => {
    const onWhite = contrastRatio(LIGHT.accent, LIGHT.bg);
    expect(onWhite).toBeLessThan(2);
    const inkOnWhite = contrastRatio(LIGHT.accentFg, LIGHT.bg);
    expect(inkOnWhite).toBeGreaterThanOrEqual(4.5);
  });
});
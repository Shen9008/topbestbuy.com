/** WCAG relative luminance and contrast helpers (dev gallery). */

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').toLowerCase();
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [
    parseInt(n.slice(0, 2), 16),
    parseInt(n.slice(2, 4), 16),
    parseInt(n.slice(4, 6), 16),
  ];
}

function relLuminance([r, g, b]: [number, number, number]): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relLuminance(hexToRgb(fgHex));
  const l2 = relLuminance(hexToRgb(bgHex));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export const TOKEN_SWATCHES = [
  { name: 'bg', var: '--bg' },
  { name: 'surface', var: '--surface' },
  { name: 'surface-2', var: '--surface-2' },
  { name: 'border', var: '--border' },
  { name: 'text', var: '--text' },
  { name: 'text-strong', var: '--text-strong' },
  { name: 'text-muted', var: '--text-muted' },
  { name: 'brand orange', var: '--color-brand-orange' },
  { name: 'heading accent', var: '--tb-heading-accent' },
  { name: 'accent', var: '--accent' },
  { name: 'accent-fg', var: '--accent-fg' },
  { name: 'on-accent', var: '--on-accent' },
  { name: 'accent-ink (light)', var: '--accent-ink' },
  { name: 'success', var: '--success' },
  { name: 'warning', var: '--warning' },
  { name: 'danger', var: '--danger' },
  { name: 'info', var: '--info' },
] as const;

export const CONTRAST_PAIRS = [
  { label: 'Body on canvas', fg: '--text', bg: '--bg' },
  { label: 'Body on surface', fg: '--text', bg: '--surface' },
  { label: 'Muted on canvas', fg: '--text-muted', bg: '--bg' },
  { label: 'Heading on canvas', fg: '--text-strong', bg: '--bg' },
  { label: 'Orange accent on canvas', fg: '--tb-heading-accent', bg: '--bg' },
  { label: 'Orange accent on navy band', fg: '--tb-heading-accent', bg: '--tb-band-bg-alt' },
  { label: 'On-accent on fill', fg: '--on-accent', bg: '--accent' },
  { label: 'Accent-fg on canvas', fg: '--accent-fg', bg: '--bg' },
  { label: 'Success on canvas', fg: '--success', bg: '--bg' },
  { label: 'Warning on canvas', fg: '--warning', bg: '--bg' },
  { label: 'Danger on canvas', fg: '--danger', bg: '--bg' },
] as const;
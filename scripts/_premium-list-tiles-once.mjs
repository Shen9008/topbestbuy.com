import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const premium = join(root, 'public', 'icons', 'premium');
mkdirSync(premium, { recursive: true });

const svgs = {
  'air-fryers': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><defs><linearGradient id="tb-af-heat" x1="24" y1="8" x2="24" y2="22" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#FF7900" stop-opacity="0.3"/><stop offset="100%" stop-color="#FF7900" stop-opacity="0"/></linearGradient></defs><rect x="10" y="20" width="28" height="22" rx="6" stroke="currentColor" stroke-width="1.5"/><path d="M14 20V17a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v3" stroke="currentColor" stroke-width="1.5"/><path d="M18 32h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="24" cy="15" rx="8" ry="6" fill="url(#tb-af-heat)"/><path d="M22 9c0 2 1.5 3.5 2 5M26 9c0 2-1.5 3.5-2 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  'air-purifiers': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><defs><linearGradient id="tb-ap-flow" x1="38" y1="18" x2="46" y2="30" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#FF7900" stop-opacity="0.28"/><stop offset="100%" stop-color="#FF7900" stop-opacity="0"/></linearGradient></defs><rect x="14" y="8" width="20" height="34" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="24" r="7" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="24" r="2.5" fill="#FF7900" fill-opacity="0.25"/><path d="M37 16c3 2 4 5 4 8s-1 6-4 8M41 20c2 1.5 2.5 3.5 2.5 5.5S43 29 41 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M36 18c4 3 5 7 5 10" fill="url(#tb-ap-flow)"/><rect x="19" y="36" width="10" height="3" rx="1" fill="currentColor" fill-opacity="0.35"/></svg>`,
  mattress: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 32V22a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v10" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="6" y="30" width="36" height="10" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M10 34h28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.45"/><rect x="12" y="18" width="18" height="8" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M14 20h14" stroke="#FF7900" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/><path d="M11 40v4M37 40v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  vacuum: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M22 8v22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 30h-6a4 4 0 0 0-4 4v2h20v-2a4 4 0 0 0-4-4h-6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="18" y="12" width="8" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><ellipse cx="32" cy="36" rx="9" ry="5" stroke="currentColor" stroke-width="1.5"/><path d="M26 34c3-1 6-1 9 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="32" cy="36" r="2.5" fill="#FF7900" fill-opacity="0.28"/><path d="M10 38h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  earbuds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="10" y="14" width="28" height="22" rx="7" stroke="currentColor" stroke-width="1.5"/><path d="M17 14V11a7 7 0 0 1 14 0v3" stroke="currentColor" stroke-width="1.5"/><ellipse cx="19" cy="24" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><ellipse cx="29" cy="24" rx="4" ry="5" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="24" r="1.5" fill="#FF7900" fill-opacity="0.3"/><circle cx="29" cy="24" r="1.5" fill="#FF7900" fill-opacity="0.3"/><path d="M24 32v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  cleansers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M20 10h8l2 6H18l2-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 16h16v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V16z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 24h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.4"/><path d="M32 12c2 3 3 6 3 9a6 6 0 0 1-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="33" cy="11" r="3" fill="#FF7900" fill-opacity="0.28"/></svg>`,
  'washing-machines': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="10" y="6" width="28" height="38" rx="4" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="10" width="20" height="4" rx="1" fill="currentColor" fill-opacity="0.2"/><circle cx="24" cy="27" r="10" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="27" r="6" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.45"/><path d="M20 27c2-3 6-3 8 0" stroke="#FF7900" stroke-opacity="0.35" stroke-width="1.5" stroke-linecap="round"/><circle cx="32" cy="12" r="1.25" fill="currentColor"/></svg>`,
  laptops: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 14h24l2 16H10l2-16z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 18h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.35"/><rect x="8" y="32" width="32" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M6 36h36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 22h12" stroke="#FF7900" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/></svg>`,
  'smart-watches': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M16 8h16v6H16V8zM16 34h16v6H16v-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><rect x="16" y="12" width="16" height="24" rx="5" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="24" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M24 22v2l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24" r="1.5" fill="#FF7900" fill-opacity="0.3"/></svg>`,
  'smart-tvs': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="6" y="12" width="36" height="22" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M6 18h36" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25"/><path d="M22 34v4M26 34v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 38h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="14" y="22" width="12" height="6" rx="1" fill="#FF7900" fill-opacity="0.22"/><path d="M30 24l6-4v12l-6-4v-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  'running-shoes': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 30c6-2 12-2 18 0 4 2 8 2 14 0v6c-6 3-12 3-18 0-6-3-12-3-14-1v-5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 28c4-6 10-10 16-12 6 4 10 10 10 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 20l4 4M24 18l6 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-opacity="0.45"/><ellipse cx="34" cy="26" rx="4" ry="2.5" fill="#FF7900" fill-opacity="0.28"/><path d="M10 36h28" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

for (const [name, svg] of Object.entries(svgs)) {
  writeFileSync(join(premium, `${name}.svg`), svg, 'utf8');
}

writeFileSync(
  join(root, 'src', 'components', 'ui', 'ListVisual.astro'),
  `---
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LIST_VISUAL_BY_SLUG } from '../../lib/list-visuals';

interface Props {
  slug: string;
  size?: 'sm' | 'md';
}

const { slug, size = 'sm' } = Astro.props;
const visualId = LIST_VISUAL_BY_SLUG[slug];
if (!visualId) return;

const svgPath = join(process.cwd(), 'public', 'icons', 'premium', \`\${visualId}.svg\`);
let markup = '';
try {
  markup = readFileSync(svgPath, 'utf-8');
} catch {
  return;
}
---

<span
  class:list={['tb-list-visual-well', size === 'md' && 'tb-list-visual-well--md']}
  aria-hidden="true"
  set:html={markup}
/>
`,
  'utf8',
);

console.log('premium list tile assets written');
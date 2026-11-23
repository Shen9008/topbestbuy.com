const NAVY = '#061D32';
const ORANGE = '#FF7900';
const MIST = '#B8C5D0';
const INK = '#E8EEF4';

/** @param {string} s */
export function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function tone(seed, lo, hi) {
  const t = (hash(String(seed)) % 1000) / 1000;
  return Math.round(lo + (hi - lo) * t);
}

function bodyGradient(id, defs) {
  const a = tone(id, 35, 55);
  const b = tone(id + 'b', 25, 42);
  const gid = `body-${hash(id)}`;
  defs.push(
    `<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(215,18%,${a}%)" />
      <stop offset="55%" stop-color="hsl(218,22%,${b}%)" />
      <stop offset="100%" stop-color="hsl(220,14%,${Math.max(12, b - 8)}%)" />
    </linearGradient>`,
  );
  return gid;
}

function rimLight(defs) {
  const gid = `rim-${defs.length}`;
  defs.push(
    `<linearGradient id="${gid}" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0" />
      <stop offset="72%" stop-color="${ORANGE}" stop-opacity="0.85" />
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0.15" />
    </linearGradient>`,
  );
  return gid;
}

function shadowEllipse(cx, cy, rx, ry) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" fill-opacity="0.35" />`;
}

/**
 * @param {string} kind
 * @param {number} w
 * @param {number} h
 * @param {string} seed
 */
function productShape(kind, w, h, seed) {
  const cx = w / 2;
  const cy = h / 2;
  const tilt = ((hash(seed) % 7) - 3) * 1.2;
  const defs = [];
  const gid = bodyGradient(seed, defs);
  const rim = rimLight(defs);
  const shapes = [];

  switch (kind) {
    case 'airfryer':
      shapes.push(
        shadowEllipse(cx, h * 0.88, w * 0.32, h * 0.06),
        `<g transform="translate(${cx},${cy}) rotate(${tilt})">`,
        `<rect x="${-w * 0.28}" y="${-h * 0.22}" width="${w * 0.56}" height="${h * 0.38}" rx="${w * 0.08}" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.24}" y="${-h * 0.12}" width="${w * 0.48}" height="${h * 0.14}" rx="${w * 0.04}" fill="${INK}" fill-opacity="0.12" stroke="${MIST}" stroke-opacity="0.35" />`,
        `<rect x="${-w * 0.1}" y="${-h * 0.3}" width="${w * 0.2}" height="${h * 0.08}" rx="${w * 0.03}" fill="url(#${gid})" />`,
        `<rect x="${w * 0.18}" y="${-h * 0.18}" width="${w * 0.06}" height="${h * 0.22}" rx="3" fill="${ORANGE}" fill-opacity="0.9" />`,
        `</g>`,
        `<rect x="${w * 0.12}" y="${h * 0.18}" width="${w * 0.76}" height="${h * 0.62}" fill="none" stroke="url(#${rim})" stroke-width="3" rx="${w * 0.1}" />`,
      );
      return { defs, shapes };
    case 'purifier':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.28, h * 0.055),
        `<g transform="translate(${cx},${cy}) rotate(${tilt * 0.5})">`,
        `<rect x="${-w * 0.16}" y="${-h * 0.32}" width="${w * 0.32}" height="${h * 0.58}" rx="${w * 0.06}" fill="url(#${gid})" />`,
        ...Array.from({ length: 6 }, (_, i) => {
          const y = -h * 0.22 + i * (h * 0.07);
          return `<rect x="${-w * 0.12}" y="${y}" width="${w * 0.24}" height="4" fill="${INK}" fill-opacity="0.15" />`;
        }),
        `<circle cx="0" cy="${h * 0.22}" r="${w * 0.05}" fill="${ORANGE}" fill-opacity="0.85" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'mattress':
      shapes.push(
        shadowEllipse(cx, h * 0.86, w * 0.38, h * 0.07),
        `<g transform="translate(${cx},${cy}) rotate(${tilt * 0.3})">`,
        `<rect x="${-w * 0.36}" y="${-h * 0.12}" width="${w * 0.72}" height="${h * 0.24}" rx="${w * 0.04}" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.34}" y="${-h * 0.16}" width="${w * 0.68}" height="${h * 0.06}" rx="${w * 0.03}" fill="${INK}" fill-opacity="0.2" />`,
        ...Array.from({ length: 5 }, (_, i) =>
          `<line x1="${-w * 0.3 + i * w * 0.15}" y1="${-h * 0.04}" x2="${-w * 0.22 + i * w * 0.15}" y2="${h * 0.08}" stroke="${MIST}" stroke-opacity="0.25" stroke-width="2" />`,
        ),
        `</g>`,
      );
      return { defs, shapes };
    case 'vacuum':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.3, h * 0.05),
        `<g transform="translate(${cx},${cy}) rotate(${-8 + tilt})">`,
        `<ellipse cx="${-w * 0.12}" cy="${h * 0.14}" rx="${w * 0.14}" ry="${h * 0.08}" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.04}" y="${-h * 0.28}" width="${w * 0.08}" height="${h * 0.42}" rx="4" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.08}" y="${-h * 0.34}" width="${w * 0.16}" height="${h * 0.12}" rx="${w * 0.04}" fill="${INK}" fill-opacity="0.15" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'earbuds':
      shapes.push(
        shadowEllipse(cx, h * 0.88, w * 0.22, h * 0.05),
        `<g transform="translate(${cx},${cy})">`,
        `<rect x="${-w * 0.2}" y="${-h * 0.08}" width="${w * 0.4}" height="${h * 0.18}" rx="${w * 0.08}" fill="url(#${gid})" />`,
        `<ellipse cx="${-w * 0.14}" cy="${h * 0.18}" rx="${w * 0.06}" ry="${h * 0.09}" fill="url(#${gid})" />`,
        `<ellipse cx="${w * 0.14}" cy="${h * 0.18}" rx="${w * 0.06}" ry="${h * 0.09}" fill="url(#${gid})" />`,
        `<circle cx="${w * 0.16}" cy="${h * 0.18}" r="${w * 0.02}" fill="${ORANGE}" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'cleanser':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.18, h * 0.045),
        `<g transform="translate(${cx},${cy}) rotate(${tilt * 0.4})">`,
        `<rect x="${-w * 0.1}" y="${-h * 0.2}" width="${w * 0.2}" height="${h * 0.38}" rx="${w * 0.05}" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.08}" y="${-h * 0.28}" width="${w * 0.16}" height="${h * 0.1}" rx="${w * 0.03}" fill="${ORANGE}" fill-opacity="0.75" />`,
        `<ellipse cx="0" cy="${-h * 0.08}" rx="${w * 0.05}" ry="${h * 0.08}" fill="${INK}" fill-opacity="0.12" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'washer':
      shapes.push(
        shadowEllipse(cx, h * 0.88, w * 0.32, h * 0.06),
        `<g transform="translate(${cx},${cy})">`,
        `<rect x="${-w * 0.3}" y="${-h * 0.26}" width="${w * 0.6}" height="${h * 0.48}" rx="${w * 0.04}" fill="url(#${gid})" />`,
        `<circle cx="${-w * 0.08}" cy="${h * 0.02}" r="${w * 0.14}" fill="${INK}" fill-opacity="0.08" stroke="${MIST}" stroke-opacity="0.5" stroke-width="3" />`,
        `<circle cx="${w * 0.08}" cy="${h * 0.02}" r="${w * 0.08}" fill="${INK}" fill-opacity="0.06" stroke="${MIST}" stroke-opacity="0.35" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'laptop':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.34, h * 0.05),
        `<g transform="translate(${cx},${cy}) rotate(${tilt * 0.2})">`,
        `<path d="M ${-w * 0.34} ${h * 0.1} L ${w * 0.34} ${h * 0.1} L ${w * 0.3} ${h * 0.18} L ${-w * 0.3} ${h * 0.18} Z" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.32}" y="${-h * 0.22}" width="${w * 0.64}" height="${h * 0.32}" rx="6" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.28}" y="${-h * 0.18}" width="${w * 0.56}" height="${h * 0.24}" rx="4" fill="${NAVY}" fill-opacity="0.65" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'watch':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.2, h * 0.045),
        `<g transform="translate(${cx},${cy})">`,
        `<rect x="${-w * 0.06}" y="${-h * 0.22}" width="${w * 0.12}" height="${h * 0.12}" rx="4" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.14}" y="${-h * 0.14}" width="${w * 0.28}" height="${h * 0.22}" rx="${w * 0.08}" fill="url(#${gid})" stroke="${ORANGE}" stroke-opacity="0.4" stroke-width="2" />`,
        `<circle cx="0" cy="${h * 0.02}" r="${w * 0.07}" fill="${NAVY}" fill-opacity="0.8" />`,
        `<line x1="0" y1="${h * 0.02}" x2="0" y2="${-h * 0.03}" stroke="${ORANGE}" stroke-width="2" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'tv':
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.36, h * 0.05),
        `<g transform="translate(${cx},${cy})">`,
        `<rect x="${-w * 0.38}" y="${-h * 0.2}" width="${w * 0.76}" height="${h * 0.38}" rx="8" fill="url(#${gid})" />`,
        `<rect x="${-w * 0.34}" y="${-h * 0.16}" width="${w * 0.68}" height="${h * 0.3}" rx="4" fill="${NAVY}" fill-opacity="0.75" />`,
        `<rect x="${-w * 0.04}" y="${h * 0.2}" width="${w * 0.08}" height="${h * 0.06}" fill="url(#${gid})" />`,
        `</g>`,
      );
      return { defs, shapes };
    case 'shoes':
    default:
      shapes.push(
        shadowEllipse(cx, h * 0.9, w * 0.3, h * 0.05),
        `<g transform="translate(${cx},${cy}) rotate(${-12 + tilt})">`,
        `<path d="M ${-w * 0.28} ${h * 0.06} Q ${-w * 0.1} ${-h * 0.12} ${w * 0.22} ${-h * 0.04} L ${w * 0.3} ${h * 0.08} Q ${w * 0.05} ${h * 0.14} ${-w * 0.28} ${h * 0.1} Z" fill="url(#${gid})" />`,
        `<path d="M ${-w * 0.12} ${-h * 0.08} L ${w * 0.08} ${-h * 0.06} L ${w * 0.12} ${h * 0.02} Z" fill="${ORANGE}" fill-opacity="0.55" />`,
        `</g>`,
      );
      return { defs, shapes };
  }
}

function wrapSvg(w, h, defs, body, extra = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>${defs.join('')}</defs>
  ${body.join('\n  ')}
  ${extra}
</svg>`;
}

export function productSquareSvg(kind, seed) {
  const w = 800;
  const h = 800;
  const { defs, shapes } = productShape(kind, w, h, seed);
  return wrapSvg(w, h, defs, shapes);
}

export function reviewHeroSvg(kind, seed, label) {
  const w = 1680;
  const h = 720;
  const { defs, shapes } = productShape(kind, w * 0.45, h * 0.85, seed);
  const glow = `<radialGradient id="glow"><stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.22"/><stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/></radialGradient>`;
  defs.push(glow);
  const body = [
    `<ellipse cx="${w * 0.38}" cy="${h * 0.62}" rx="${w * 0.22}" ry="${h * 0.08}" fill="#000" fill-opacity="0.4" />`,
    `<circle cx="${w * 0.38}" cy="${h * 0.45}" r="${w * 0.2}" fill="url(#glow)" />`,
    `<g transform="translate(${w * 0.38}, ${h * 0.48}) scale(1.35) translate(${-w * 0.225}, ${-h * 0.425})">`,
    ...shapes,
    `</g>`,
    `<text x="${w * 0.62}" y="${h * 0.48}" fill="${INK}" font-family="system-ui,sans-serif" font-size="42" font-weight="700">${escapeXml(label.slice(0, 48))}</text>`,
    `<text x="${w * 0.62}" y="${h * 0.56}" fill="${MIST}" font-family="system-ui,sans-serif" font-size="22">Studio product cutout</text>`,
    `<rect x="${w * 0.62}" y="${h * 0.62}" width="180" height="4" fill="${ORANGE}" />`,
  ];
  return wrapSvg(w, h, defs, body);
}

const LIST_SCENE = {
  'best-air-fryers-malaysia': { label: 'Kitchen counter', icon: 'airfryer' },
  'best-air-purifiers-malaysia': { label: 'Clean living air', icon: 'purifier' },
  'best-mattress-malaysia': { label: 'Bedroom rest', icon: 'mattress' },
  'best-vacuum-cleaners-malaysia': { label: 'Spotless floors', icon: 'vacuum' },
  'best-wireless-earbuds-malaysia': { label: 'Commute audio', icon: 'earbuds' },
  'best-facial-cleansers-malaysia': { label: 'Skincare shelf', icon: 'cleanser' },
  'best-washing-machines-malaysia': { label: 'Laundry day', icon: 'washer' },
  'best-laptops-for-students-malaysia': { label: 'Study desk', icon: 'laptop' },
  'best-smart-watches-malaysia': { label: 'Everyday wrist', icon: 'watch' },
  'best-smart-tvs-malaysia': { label: 'Living room', icon: 'tv' },
  'best-running-shoes-malaysia': { label: 'Morning run', icon: 'shoes' },
};

export function listHeroSvg(listSlug, title) {
  const w = 1680;
  const h = 720;
  const scene = LIST_SCENE[listSlug] ?? { label: 'Malaysia picks', icon: 'shoes' };
  const { defs, shapes } = productShape(scene.icon, w * 0.35, h * 0.7, listSlug);
  const body = [
    `<text x="80" y="120" fill="${INK}" font-family="system-ui,sans-serif" font-size="56" font-weight="800">${escapeXml(title)}</text>`,
    `<text x="80" y="180" fill="${MIST}" font-family="system-ui,sans-serif" font-size="28">${escapeXml(scene.label)} · Malaysia</text>`,
    `<rect x="80" y="200" width="220" height="5" fill="${ORANGE}" />`,
    ...Array.from({ length: 5 }, (_, i) =>
      `<circle cx="${120 + i * 90}" cy="${h - 80}" r="6" fill="${ORANGE}" fill-opacity="${0.35 + i * 0.1}" />`,
    ),
    `<g transform="translate(${w * 0.68}, ${h * 0.52}) scale(1.2) translate(${-w * 0.175}, ${-h * 0.35})">`,
    ...shapes,
    `</g>`,
  ];
  return wrapSvg(w, h, defs, body);
}

export function homeHeroSvg() {
  const w = 1680;
  const h = 720;
  const defs = [
    `<linearGradient id="tower" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${MIST}"/><stop offset="100%" stop-color="${ORANGE}" stop-opacity="0.35"/></linearGradient>`,
  ];
  const body = [
    `<text x="80" y="130" fill="${INK}" font-family="system-ui,sans-serif" font-size="62" font-weight="800">Shop smarter in Malaysia</text>`,
    `<text x="80" y="200" fill="${MIST}" font-family="system-ui,sans-serif" font-size="30">Honest top-10 lists, scored on value and warranty</text>`,
    `<rect x="80" y="220" width="260" height="5" fill="${ORANGE}" />`,
    `<rect x="${w * 0.55}" y="${h * 0.25}" width="50" height="${h * 0.55}" fill="url(#tower)" opacity="0.7" rx="4" />`,
    `<rect x="${w * 0.62}" y="${h * 0.3}" width="44" height="${h * 0.5}" fill="url(#tower)" opacity="0.85" rx="4" />`,
    `<path d="M ${w * 0.72} ${h * 0.55} Q ${w * 0.78} ${h * 0.42} ${w * 0.88} ${h * 0.5} L ${w * 0.9} ${h * 0.65} Q ${w * 0.8} ${h * 0.68} ${w * 0.72} ${h * 0.62} Z" fill="${ORANGE}" fill-opacity="0.35" />`,
    `<circle cx="${w * 0.84}" cy="${h * 0.48}" r="32" fill="none" stroke="${ORANGE}" stroke-width="3" opacity="0.6" />`,
  ];
  return wrapSvg(w, h, defs, body);
}

export function ogDefaultSvg() {
  const w = 1200;
  const h = 630;
  const defs = [
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${NAVY}"/><stop offset="100%" stop-color="#0a2a45"/></linearGradient>`,
  ];
  const body = [
    `<rect width="${w}" height="${h}" fill="url(#bg)" />`,
    `<text x="80" y="200" fill="${INK}" font-family="system-ui,sans-serif" font-size="64" font-weight="800">TopBestBuy</text>`,
    `<text x="80" y="280" fill="${MIST}" font-family="system-ui,sans-serif" font-size="34">Best products in Malaysia — scored, not sponsored</text>`,
    `<rect x="80" y="310" width="200" height="6" fill="${ORANGE}" />`,
    `<circle cx="${w - 160}" cy="${h / 2}" r="120" fill="${ORANGE}" fill-opacity="0.15" />`,
    `<circle cx="${w - 160}" cy="${h / 2}" r="80" fill="none" stroke="${ORANGE}" stroke-width="4" opacity="0.5" />`,
  ];
  return wrapSvg(w, h, defs, body);
}

const CAT_KIND = {
  kitchen: 'airfryer',
  air: 'purifier',
  sleep: 'mattress',
  appliances: 'washer',
  audio: 'earbuds',
  computing: 'laptop',
  phones: 'watch',
  tv: 'tv',
  beauty: 'cleanser',
  fitness: 'shoes',
};

export function categoryTileSvg(catId, title) {
  const w = 600;
  const h = 600;
  const kind = CAT_KIND[catId] ?? 'shoes';
  const { defs, shapes } = productShape(kind, w, h, catId);
  const body = [
    `<text x="32" y="64" fill="${INK}" font-family="system-ui,sans-serif" font-size="32" font-weight="700">${escapeXml(title)}</text>`,
    ...shapes,
  ];
  return wrapSvg(w, h, defs, body);
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
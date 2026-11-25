#!/usr/bin/env node
/**
 * Wire image-manifest.ts to files on disk under public/.
 * Prefers public/images/inventory-refresh/ and public/images/card-photos/.
 *
 * Usage: node scripts/wire-image-manifest.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadListMeta, loadProductCatalog, productFullName } from './lib/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const manifestPath = path.join(root, 'src/lib/image-manifest.ts');
const inventoryPath = path.join(root, 'scripts/inventory-assets.json');
const csvPath = path.join(root, 'docs/visual-asset-inventory.csv');

const REFRESH_DIR = path.join(publicDir, 'images/inventory-refresh');
const CARD_DIR = path.join(publicDir, 'images/card-photos');

const CARD_PHOTO_TO_LIST = {
  'air-fryers': 'best-air-fryers-malaysia',
  'air-purifiers': 'best-air-purifiers-malaysia',
  'facial-cleansers': 'best-facial-cleansers-malaysia',
  mattresses: 'best-mattress-malaysia',
  'running-shoes': 'best-running-shoes-malaysia',
  'smart-tvs': 'best-smart-tvs-malaysia',
  smartwatches: 'best-smart-watches-malaysia',
  'student-laptops': 'best-laptops-for-students-malaysia',
  'vacuum-cleaners': 'best-vacuum-cleaners-malaysia',
  'washing-machines': 'best-washing-machines-malaysia',
  'wireless-earbuds': 'best-wireless-earbuds-malaysia',
};

const LIST_TO_CARD = Object.fromEntries(
  Object.entries(CARD_PHOTO_TO_LIST).map(([k, v]) => [v, k]),
);

const EDITORIAL_DEFAULTS = {
  width: 1680,
  height: 720,
};
const TRUST_METHODOLOGY = { width: 1200, height: 800 };

/** @type {Record<string, { src: string, width: number, height: number, alt: string }>} */
function parseExistingManifest() {
  const text = fs.readFileSync(manifestPath, 'utf8');
  /** @type {Record<string, { src: string, width: number, height: number, alt: string }>} */
  const out = {};
  const re =
    /'([^']+)':\s*\{\s*src:\s*'([^']+)',\s*width:\s*(\d+),\s*height:\s*(\d+),\s*alt:\s*'((?:\\'|[^'])*)'\s*\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out[m[1]] = {
      src: m[2],
      width: Number(m[3]),
      height: Number(m[4]),
      alt: m[5].replace(/\\'/g, "'"),
    };
  }
  return out;
}

function publicUrlFromAbs(abs) {
  const rel = path.relative(publicDir, abs).replace(/\\/g, '/');
  return `/${rel}`;
}

function existsPublicUrl(url) {
  if (!url.startsWith('/')) return false;
  return fs.existsSync(path.join(publicDir, url.slice(1)));
}

function refreshFileForSlot(slotId) {
  for (const ext of ['.webp', '.png', '.svg', '.jpg', '.jpeg']) {
    const abs = path.join(REFRESH_DIR, `${slotId}${ext}`);
    if (fs.existsSync(abs)) return publicUrlFromAbs(abs);
  }
  return null;
}

function defaultPathForSlot(slotId) {
  if (slotId.startsWith('prod-')) {
    const id = slotId.slice(5);
    return `/images/products/${id}.webp`;
  }
  if (slotId.startsWith('review-')) {
    const id = slotId.slice(7);
    return `/images/reviews/${id}.webp`;
  }
  if (slotId.startsWith('list-hero-')) {
    const slug = slotId.slice('list-hero-'.length);
    const card = LIST_TO_CARD[slug];
    if (card) {
      const cardUrl = `/images/card-photos/${card}.webp`;
      if (existsPublicUrl(cardUrl)) return cardUrl;
    }
    return `/images/lists/${slug}.webp`;
  }
  if (slotId.startsWith('cat-') || slotId.startsWith('category-tile-')) {
    const id = slotId.replace(/^category-tile-/, '').replace(/^cat-/, '');
    return `/images/categories/${id}.webp`;
  }
  if (slotId === 'home-hero') {
    if (existsPublicUrl('/images/editorial/home-hero-cutouts.webp')) {
      return '/images/editorial/home-hero-cutouts.webp';
    }
    return '/images/editorial/home-hero.webp';
  }
  if (slotId === 'og-default') return '/og-default.png';
  if (slotId.startsWith('guide-hero-')) {
    const proposed = `/images/guides/${slotId.replace('guide-hero-', '')}.webp`;
    if (existsPublicUrl(proposed)) return proposed;
    return null;
  }
  if (slotId === 'about-hero') {
    const p = '/images/about/about-hero.webp';
    return existsPublicUrl(p) ? p : null;
  }
  if (slotId === 'categories-hero') {
    const p = '/images/categories/categories-hero.webp';
    return existsPublicUrl(p) ? p : null;
  }
  if (slotId === 'trust-methodology') {
    const p = '/images/editorial/trust-methodology.webp';
    return existsPublicUrl(p) ? p : null;
  }
  return null;
}

function resolveSrc(slotId, existing) {
  const refresh = refreshFileForSlot(slotId);
  if (refresh) return refresh;

  if (slotId.startsWith('list-hero-')) {
    const slug = slotId.slice('list-hero-'.length);
    const card = LIST_TO_CARD[slug];
    if (card) {
      const cardUrl = `/images/card-photos/${card}.webp`;
      if (existsPublicUrl(cardUrl)) return cardUrl;
    }
  }

  if (existing?.src && existsPublicUrl(existing.src)) return existing.src;

  const fallback = defaultPathForSlot(slotId);
  if (fallback && existsPublicUrl(fallback)) return fallback;

  if (existing?.src) return existing.src;
  return fallback;
}

function dimsForSlot(slotId, src, existing, inventoryItem) {
  if (slotId === 'home-hero' && src?.includes('home-hero-cutouts')) {
    return { width: 1200, height: 1500 };
  }
  if (slotId === 'trust-methodology') return TRUST_METHODOLOGY;
  if (slotId.startsWith('prod-')) return { width: 800, height: 800 };
  if (
    slotId.startsWith('review-') ||
    slotId.startsWith('list-hero-') ||
    slotId.startsWith('guide-hero-') ||
    slotId === 'about-hero' ||
    slotId === 'categories-hero'
  ) {
    return EDITORIAL_DEFAULTS;
  }
  if (slotId.startsWith('cat-') || slotId.startsWith('category-tile-')) {
    return { width: 600, height: 600 };
  }
  if (slotId === 'og-default') return { width: 1200, height: 630 };
  if (inventoryItem?.Width_px && inventoryItem?.Height_px) {
    return { width: inventoryItem.Width_px, height: inventoryItem.Height_px };
  }
  if (existing) return { width: existing.width, height: existing.height };
  return EDITORIAL_DEFAULTS;
}

function altForSlot(slotId, existing, inventoryItem, catalog, listTitles) {
  if (existing?.alt) return existing.alt;
  if (slotId.startsWith('prod-')) {
    const id = slotId.slice(5);
    const p = catalog[id];
    if (p) return `${productFullName(p)} product photo`;
  }
  if (slotId.startsWith('review-')) {
    const id = slotId.slice(7);
    const p = catalog[id];
    if (p) return `${productFullName(p)} review hero`;
  }
  if (slotId.startsWith('list-hero-')) {
    const slug = slotId.slice('list-hero-'.length);
    const title = listTitles[slug];
    if (title) return `${title} category hero`;
  }
  if (slotId.startsWith('guide-hero-')) {
    const slug = slotId.replace('guide-hero-', '').replace(/-/g, ' ');
    return `Guide: ${slug}`;
  }
  if (inventoryItem?.Notes) return inventoryItem.Notes.split('—')[0].trim().slice(0, 120);
  return `${slotId} image`;
}

const MANIFEST_EXCLUDE_PREFIX = [
  'brand-',
  'premium-svg-',
  'tool-icon-',
  'team-headshot-',
  'hub-editorial-',
  'trust-hub-',
  'guide-featured-',
  'chrome-',
  'category-rail-',
];

function shouldWireSlot(slotId) {
  return !MANIFEST_EXCLUDE_PREFIX.some((p) => slotId.startsWith(p));
}

function collectSlotIds(inventory, existing) {
  const ids = new Set(Object.keys(existing).filter(shouldWireSlot));
  for (const item of inventory) {
    if (item.slotId && shouldWireSlot(item.slotId)) ids.add(item.slotId);
  }
  if (fs.existsSync(REFRESH_DIR)) {
    for (const f of fs.readdirSync(REFRESH_DIR)) {
      const stem = path.parse(f).name;
      if (!shouldWireSlot(stem)) continue;
      if (stem.startsWith('prod-') || stem.startsWith('review-') || stem.startsWith('guide-hero-')) {
        ids.add(stem);
      } else if (
        ['about-hero', 'categories-hero', 'trust-methodology'].includes(stem)
      ) {
        ids.add(stem);
      }
    }
  }
  for (const slug of Object.keys(loadListMeta())) {
    ids.add(`list-hero-${slug}`);
  }
  for (const id of Object.keys(loadProductCatalog())) {
    ids.add(`prod-${id}`);
    ids.add(`review-${id}`);
  }
  const categories = [
    'air',
    'appliances',
    'audio',
    'beauty',
    'computing',
    'fitness',
    'kitchen',
    'phones',
    'sleep',
    'tv',
  ];
  for (const c of categories) {
    ids.add(`cat-${c}`);
    ids.add(`category-tile-${c}`);
  }
  ids.add('home-hero');
  ids.add('og-default');
  ids.add('about-hero');
  ids.add('categories-hero');
  ids.add('trust-methodology');
  const guideSlugs = [
    'is-an-air-fryer-worth-it',
    'how-to-clean-an-air-fryer',
    'do-you-need-an-ionizer',
    'mattress-firmness-for-back-pain',
    'update-air-fryer-list',
    'robot-vs-cordless-vacuum',
    'how-to-choose-a-facial-cleanser',
    'how-to-read-our-scores',
    'malaysia-buying-basics',
  ];
  for (const g of guideSlugs) ids.add(`guide-hero-${g}`);
  return [...ids].sort();
}

function syncToolIconsFromRefresh() {
  const premiumDir = path.join(publicDir, 'icons/premium');
  fs.mkdirSync(premiumDir, { recursive: true });
  const map = {
    'tool-icon-airfryer.svg': 'tool-airfryer.svg',
    'tool-icon-cleanser.svg': 'tool-cleanser.svg',
    'tool-icon-cost.svg': 'tool-cost.svg',
    'tool-icon-finder.svg': 'tool-finder.svg',
    'tool-icon-mattress.svg': 'tool-mattress.svg',
    'tool-icon-purifier.svg': 'tool-purifier.svg',
    'tool-icon-vacuum.svg': 'tool-vacuum.svg',
  };
  for (const [srcName, destName] of Object.entries(map)) {
    const from = path.join(REFRESH_DIR, srcName);
    const to = path.join(premiumDir, destName);
    if (fs.existsSync(from)) {
      fs.copyFileSync(from, to);
    }
  }
}

function copyRefreshEditorialToCanonical() {
  const copies = [
    ['about-hero.webp', 'images/about/about-hero.webp'],
    ['categories-hero.webp', 'images/categories/categories-hero.webp'],
    ['trust-methodology.webp', 'images/editorial/trust-methodology.webp'],
    ['brand-wordmark-dark.png', 'brand/logo-wordmark-dark.png'],
  ];
  for (const [srcName, destRel] of copies) {
    const from = path.join(REFRESH_DIR, srcName);
    const to = path.join(publicDir, destRel);
    if (fs.existsSync(from)) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
  for (const f of fs.readdirSync(REFRESH_DIR)) {
    if (!f.startsWith('guide-hero-')) continue;
    const from = path.join(REFRESH_DIR, f);
    const slug = f.replace('guide-hero-', '').replace(/\.webp$/, '');
    const to = path.join(publicDir, 'images/guides', `${slug}.webp`);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

function writeManifestTs(entries, report) {
  const keys = Object.keys(entries).sort();
  const body = keys
    .map((k) => {
      const e = entries[k];
      const alt = e.alt.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
      return `  '${k}': { src: '${e.src}', width: ${e.width}, height: ${e.height}, alt: '${alt}' },`;
    })
    .join('\n');

  const ts = `/**
 * Image manifest — wired visual assets (generated).
 * Regenerate: npm run assets:wire
 */
export type ImageManifestEntry = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const imageManifest: Record<string, ImageManifestEntry | undefined> = {
${body}
};

export function resolveManifestSlot(
  slotId: string,
): ImageManifestEntry | undefined {
  return imageManifest[slotId];
}
`;
  fs.writeFileSync(manifestPath, ts);
  const reportPath = path.join(root, 'scripts/.wire-manifest-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

function main() {
  syncToolIconsFromRefresh();
  copyRefreshEditorialToCanonical();

  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  const inventoryBySlot = Object.fromEntries(inventory.map((i) => [i.slotId, i]));
  const existing = parseExistingManifest();
  const catalog = loadProductCatalog();
  const listTitles = loadListMeta();
  const slotIds = collectSlotIds(inventory, existing);

  /** @type {Record<string, { src: string, width: number, height: number, alt: string }>} */
  const wired = {};
  const missing = [];
  const wiredFromRefresh = [];
  const wiredFromCard = [];

  for (const slotId of slotIds) {
    const ex = existing[slotId];
    const item = inventoryBySlot[slotId];
    const src = resolveSrc(slotId, ex);
    if (!src || !existsPublicUrl(src)) {
      if (ex) {
        wired[slotId] = ex;
        missing.push({ slotId, reason: 'no file on disk', hadManifest: true });
      } else {
        missing.push({ slotId, reason: 'no file on disk', hadManifest: false });
      }
      continue;
    }
    const dims = dimsForSlot(slotId, src, ex, item);
    wired[slotId] = {
      src,
      width: dims.width,
      height: dims.height,
      alt: altForSlot(slotId, ex, item, catalog, listTitles),
    };
    if (src.includes('/inventory-refresh/')) wiredFromRefresh.push(slotId);
    if (src.includes('/card-photos/')) wiredFromCard.push(slotId);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalSlots: slotIds.length,
    wiredCount: Object.keys(wired).length,
    missingCount: missing.filter((m) => !m.hadManifest).length,
    missingWithPlaceholder: missing.filter((m) => m.hadManifest).length,
    wiredFromInventoryRefresh: wiredFromRefresh.length,
    wiredFromCardPhotos: wiredFromCard.length,
    missing,
    wiredFromRefresh,
    wiredFromCard,
  };

  writeManifestTs(wired, report);
}

main();
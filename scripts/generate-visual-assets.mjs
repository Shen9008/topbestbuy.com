#!/usr/bin/env node
/**
 * Generate wired TopBestBuy visual assets (SVG → WebP/PNG with alpha).
 * Run: node scripts/generate-visual-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { loadProductCatalog, productFullName } from './lib/catalog.mjs';
import {
  categoryTileSvg,
  homeHeroSvg,
  listHeroSvg,
  ogDefaultSvg,
  productSquareSvg,
  reviewHeroSvg,
} from './lib/draw-svgs.mjs';
import { loadListMeta, loadCategories } from './lib/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const counts = { prod: 0, review: 0, 'list-hero': 0, category: 0, editorial: 0, og: 0, other: 0 };

/** @type {Record<string, { src: string, width: number, height: number, alt: string }>} */
const manifest = {};

async function renderWebp(svg, outPath, width, height) {
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  const buf = await sharp(Buffer.from(svg)).resize(width, height).webp({ alphaQuality: 100, quality: 88 }).toBuffer();
  await fs.promises.writeFile(outPath, buf);
}

async function renderPng(svg, outPath, width, height) {
  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  const buf = await sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
  await fs.promises.writeFile(outPath, buf);
}

function addManifest(slotId, src, width, height, alt) {
  manifest[slotId] = { src, width, height, alt };
}

async function main() {
  const catalog = loadProductCatalog();
  const listTitles = loadListMeta();
  const categories = loadCategories();

  for (const [id, p] of Object.entries(catalog)) {
    const sq = productSquareSvg(p.kind, id);
    const rel = `/images/products/${id}.webp`;
    const out = path.join(publicDir, rel.slice(1));
    await renderWebp(sq, out, 800, 800);
    addManifest(`prod-${id}`, rel, 800, 800, `${productFullName(p)} product photo`);
    counts.prod++;

    const label = productFullName(p);
    const hero = reviewHeroSvg(p.kind, id, label);
    const relR = `/images/reviews/${id}.webp`;
    await renderWebp(hero, path.join(publicDir, relR.slice(1)), 1680, 720);
    addManifest(`review-${id}`, relR, 1680, 720, `${label} review hero`);
    counts.review++;
  }

  for (const [slug, title] of Object.entries(listTitles)) {
    const svg = listHeroSvg(slug, title);
    const rel = `/images/lists/${slug}.webp`;
    await renderWebp(svg, path.join(publicDir, rel.slice(1)), 1680, 720);
    addManifest(`list-hero-${slug}`, rel, 1680, 720, `${title} category hero`);
    counts['list-hero']++;
  }

  const home = homeHeroSvg();
  await renderWebp(home, path.join(publicDir, 'images/editorial/home-hero.webp'), 1680, 720);
  addManifest('home-hero', '/images/editorial/home-hero.webp', 1680, 720, 'TopBestBuy home — shop smarter in Malaysia');

  const og = ogDefaultSvg();
  await renderPng(og, path.join(publicDir, 'og-default.png'), 1200, 630);
  addManifest('og-default', '/og-default.png', 1200, 630, 'TopBestBuy — best products in Malaysia');

  for (const c of categories) {
    const svg = categoryTileSvg(c.id, c.name);
    const rel = `/images/categories/${c.id}.webp`;
    await renderWebp(svg, path.join(publicDir, rel.slice(1)), 600, 600);
    addManifest(`cat-${c.id}`, rel, 600, 600, `${c.name} category`);
    addManifest(`category-tile-${c.id}`, rel, 600, 600, `${c.name} category tile`);
    counts.category++;
  }

  counts.editorial = 1;
  counts.og = 1;

  const report = {
    generatedAt: new Date().toISOString(),
    method: 'Programmatic SVG studio-cutout illustrations rendered with sharp → WebP/PNG (alpha). 9Router unavailable on VM.',
    counts,
    totalFiles: counts.prod + counts.review + counts['list-hero'] + counts.category + counts.editorial + counts.og,
    manifestSlots: Object.keys(manifest).length,
  };

  await fs.promises.mkdir(path.join(root, 'docs'), { recursive: true });
  await fs.promises.writeFile(
    path.join(root, 'docs/visual-assets-generated.md'),
    `# Visual assets generated\n\n${JSON.stringify(report, null, 2)}\n\n## Counts\n\n| Type | Count |\n|------|-------|\n| Product squares (\`prod-*\`) | ${counts.prod} |\n| Review heroes (\`review-*\`) | ${counts.review} |\n| List heroes (\`list-hero-*\`) | ${counts['list-hero']} |\n| Category tiles (\`cat-*\`) | ${counts.category} |\n| Home hero | 1 |\n| OG default | 1 |\n\n**Total raster files:** ${report.totalFiles}\n\n**Manifest slot entries:** ${report.manifestSlots}\n`,
  );

  writeManifestTs(manifest);
  console.log(JSON.stringify(report, null, 2));
}

function writeManifestTs(entries) {
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
 * Regenerate: npm run assets:generate
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
  fs.writeFileSync(path.join(root, 'src/lib/image-manifest.ts'), ts);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
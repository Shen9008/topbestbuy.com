#!/usr/bin/env node
/**
 * Generate wired TopBestBuy visual assets via 9Router /v1/images/generations.
 * Resume: scripts/.asset-generation-state.json
 *
 * Env:
 *   NINEROUTER_URL (default http://127.0.0.1:20128)
 *   NINEROUTER_KEY
 *   NINEROUTER_IMAGE_MODEL (default gemini/gemini-2.5-flash-image)
 *   NINEROUTER_IMAGE_FALLBACK=pollinations|off  (pollinations only when 9Router providers missing)
 *   ASSETS_GEN_LIMIT=N  (smoke test)
 *   ASSETS_GEN_DELAY_MS=1200
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  categoryTilePrompt,
  homeHeroPrompt,
  listHeroPrompt,
  ogDefaultPrompt,
  productSquarePrompt,
  reviewHeroPrompt,
} from './lib/image-prompts.mjs';
import { postProcessOgPng, postProcessRaster } from './lib/image-postprocess.mjs';
import { generateImageBytes, probeNineRouter } from './lib/ninerouter-client.mjs';
import { loadProductCatalog, productFullName, loadListMeta, loadCategories } from './lib/catalog.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const shardLabel = process.env.ASSETS_GEN_SHARD ?? '';
const statePath = path.join(
  __dirname,
  shardLabel ? `.asset-generation-state.${shardLabel.replace('/', '-')}.json` : '.asset-generation-state.json',
);
const delayMs = Number(process.env.ASSETS_GEN_DELAY_MS ?? 1200);
const limit = process.env.ASSETS_GEN_LIMIT ? Number(process.env.ASSETS_GEN_LIMIT) : null;

/** @type {Record<string, { src: string, width: number, height: number, alt: string }>} */
const manifest = {};
const counts = { prod: 0, review: 0, 'list-hero': 0, category: 0, editorial: 0, og: 0, skipped: 0, failed: 0 };
/** @type {{ completed: Record<string, object>, failures: Record<string, string> }} */
let state = { completed: {}, failures: {} };

function loadState() {
  if (fs.existsSync(statePath)) {
    try {
      state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    } catch {
      state = { completed: {}, failures: {} };
    }
  }
}

function saveState() {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function addManifest(slotId, src, width, height, alt) {
  manifest[slotId] = { src, width, height, alt };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function jobKey(kind, id) {
  return `${kind}:${id}`;
}

function alreadyDone(key) {
  return Boolean(state.completed[key]);
}

function shardOk(id) {
  if (!shardLabel) return true;
  const [idx, total] = shardLabel.split('/').map(Number);
  if (!Number.isFinite(idx) || !Number.isFinite(total) || total < 1) return true;
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % total === idx;
}

/**
 * @param {string} key
 * @param {string} prompt
 * @param {string} outPath
 * @param {{ width: number, height: number, removeWhiteBg?: boolean, png?: boolean }} spec
 */
/** @returns {'skipped'|'ok'|'fail'} */
async function renderJob(key, prompt, outPath, spec) {
  if (alreadyDone(key) && fs.existsSync(outPath)) {
    counts.skipped++;
    return 'skipped';
  }
  try {
    const size = spec.width >= 1600 ? '1792x1024' : spec.width >= 1200 && spec.height < spec.width ? '1536x864' : '1024x1024';
    const raw = await generateImageBytes(prompt, { size });
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    if (spec.png) {
      const buf = await postProcessOgPng(raw);
      await fs.promises.writeFile(outPath, buf);
    } else {
      const buf = await postProcessRaster(raw, {
        width: spec.width,
        height: spec.height,
        removeWhiteBg: spec.removeWhiteBg,
      });
      await fs.promises.writeFile(outPath, buf);
    }
    state.completed[key] = {
      at: new Date().toISOString(),
      method: process.env.NINEROUTER_IMAGE_FALLBACK === 'off' ? '9router' : '9router-or-fallback',
    };
    delete state.failures[key];
    saveState();
    await sleep(delayMs);
    return 'ok';
  } catch (err) {
    counts.failed++;
    state.failures[key] = String(err?.message ?? err);
    saveState();
    console.error(`FAIL ${key}:`, err?.message ?? err);
    return 'fail';
  }
}

async function main() {
  loadState();
  const probe = await probeNineRouter();
  const catalog = loadProductCatalog();
  const listTitles = loadListMeta();
  const categories = loadCategories();
  let jobsRun = 0;

  for (const [id, p] of Object.entries(catalog)) {
    if (!shardOk(id)) continue;
    if (limit != null && jobsRun >= limit) break;
    const label = productFullName(p);
    const sqKey = jobKey('prod', id);
    const rel = `/images/products/${id}.webp`;
    const out = path.join(publicDir, rel.slice(1));
    const sqRes = await renderJob(sqKey, productSquarePrompt(p), out, { width: 800, height: 800, removeWhiteBg: true });
    if (sqRes === 'ok') counts.prod++;
    jobsRun++;

    if (limit != null && jobsRun >= limit) break;
    const rvKey = jobKey('review', id);
    const relR = `/images/reviews/${id}.webp`;
    const rvRes = await renderJob(rvKey, reviewHeroPrompt(p), path.join(publicDir, relR.slice(1)), { width: 1680, height: 720 });
    if (rvRes === 'ok') counts.review++;
    jobsRun++;
  }

  const primaryShard = !shardLabel || shardLabel.startsWith('0/');
  if (!primaryShard) {
    console.log(JSON.stringify(buildPartialReport(probe), null, 2));
    return;
  }

  for (const [slug, title] of Object.entries(listTitles)) {
    if (limit != null && jobsRun >= limit) break;
    const key = jobKey('list', slug);
    const rel = `/images/lists/${slug}.webp`;
    if ((await renderJob(key, listHeroPrompt(slug, title), path.join(publicDir, rel.slice(1)), { width: 1680, height: 720 })) === 'ok') {
      counts['list-hero']++;
    }
    jobsRun++;
  }

  if (limit == null || jobsRun < limit) {
    const key = jobKey('editorial', 'home-hero');
    const rel = '/images/editorial/home-hero.webp';
    if ((await renderJob(key, homeHeroPrompt(), path.join(publicDir, rel.slice(1)), { width: 1680, height: 720 })) === 'ok') {
      counts.editorial++;
    }
    jobsRun++;
  }

  if (limit == null || jobsRun < limit) {
    const key = jobKey('og', 'default');
    if ((await renderJob(key, ogDefaultPrompt(), path.join(publicDir, 'og-default.png'), { width: 1200, height: 630, png: true })) === 'ok') {
      counts.og++;
    }
    jobsRun++;
  }

  for (const c of categories) {
    if (limit != null && jobsRun >= limit) break;
    const key = jobKey('cat', c.id);
    const rel = `/images/categories/${c.id}.webp`;
    if ((await renderJob(key, categoryTilePrompt(c.id, c.name), path.join(publicDir, rel.slice(1)), { width: 600, height: 600 })) === 'ok') {
      counts.category++;
    }
    jobsRun++;
  }

  // Rebuild manifest from existing files for completed slots not in this partial run
  mergeExistingManifestFromDisk(catalog, listTitles, categories);

  const report = buildPartialReport(probe);
  await writeOutputs(report);
  console.log(JSON.stringify(report, null, 2));
}

function buildPartialReport(probe) {
  const method = probe.ok
    ? `9Router image API (${probe.url}); fallback=${process.env.NINEROUTER_IMAGE_FALLBACK ?? 'pollinations-on-provider-miss'}`
    : `9Router unreachable (${probe.reason}); photorealistic fallback when providers missing`;
  return {
    generatedAt: new Date().toISOString(),
    method,
    shard: shardLabel || 'all',
    counts,
    totalCompleted: Object.keys(state.completed).length,
    manifestSlots: Object.keys(manifest).length,
    failures: Object.keys(state.failures).length,
  };
}

async function writeOutputs(report) {
  await fs.promises.mkdir(path.join(root, 'docs'), { recursive: true });
  await fs.promises.writeFile(path.join(root, 'docs/visual-assets-generated.md'), buildDoc(report));
  writeManifestTs(manifest);
}

function mergeExistingManifestFromDisk(catalog, listTitles, categories) {
  for (const [id, p] of Object.entries(catalog)) {
    const label = productFullName(p);
  const prodRel = `/images/products/${id}.webp`;
    const revRel = `/images/reviews/${id}.webp`;
    if (fs.existsSync(path.join(publicDir, prodRel.slice(1)))) {
      addManifest(`prod-${id}`, prodRel, 800, 800, `${label} product photo`);
    }
    if (fs.existsSync(path.join(publicDir, revRel.slice(1)))) {
      addManifest(`review-${id}`, revRel, 1680, 720, `${label} review hero`);
    }
  }
  for (const [slug, title] of Object.entries(listTitles)) {
    const rel = `/images/lists/${slug}.webp`;
    if (fs.existsSync(path.join(publicDir, rel.slice(1)))) {
      addManifest(`list-hero-${slug}`, rel, 1680, 720, `${title} category hero`);
    }
  }
  if (fs.existsSync(path.join(publicDir, 'images/editorial/home-hero.webp'))) {
    addManifest('home-hero', '/images/editorial/home-hero.webp', 1680, 720, 'TopBestBuy home — shop smarter in Malaysia');
  }
  if (fs.existsSync(path.join(publicDir, 'og-default.png'))) {
    addManifest('og-default', '/og-default.png', 1200, 630, 'TopBestBuy — best products in Malaysia');
  }
  for (const c of categories) {
    const rel = `/images/categories/${c.id}.webp`;
    if (fs.existsSync(path.join(publicDir, rel.slice(1)))) {
      addManifest(`cat-${c.id}`, rel, 600, 600, `${c.name} category`);
      addManifest(`category-tile-${c.id}`, rel, 600, 600, `${c.name} category tile`);
    }
  }
}

function buildDoc(report) {
  const c = report.counts ?? {};
  const lines = [
    '# Visual assets generated',
    '',
    JSON.stringify(report, null, 2),
    '',
    '## Generation',
    '',
    'Assets are produced with `npm run assets:generate`, which calls **9Router** `POST /v1/images/generations` using product/list metadata from `scripts/lib/catalog.mjs`.',
    '',
    'Resume state: `scripts/.asset-generation-state.json`.',
    '',
    '## Counts',
    '',
    '| Type | Count |',
    '|------|-------|',
    `| Product squares | ${c.prod ?? 0} |`,
    `| Review heroes | ${c.review ?? 0} |`,
    `| List heroes | ${c['list-hero'] ?? 0} |`,
    `| Category tiles | ${c.category ?? 0} |`,
    `| Home hero | ${c.editorial ?? 0} |`,
    `| OG default | ${c.og ?? 0} |`,
    '',
    `**Manifest slot entries:** ${report.manifestSlots}`,
    '',
  ];
  return lines.join('\n');
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
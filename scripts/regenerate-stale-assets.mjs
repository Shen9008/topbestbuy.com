#!/usr/bin/env node
/** Regenerate image paths listed in a file (paths relative to public/). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadProductCatalog, productFullName } from './lib/catalog.mjs';
import { productSquarePrompt, reviewHeroPrompt } from './lib/image-prompts.mjs';
import { generateImageBytes } from './lib/ninerouter-client.mjs';
import { postProcessRaster } from './lib/image-postprocess.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const listFile = process.argv[2];
if (!listFile) {
  console.error('Usage: node scripts/regenerate-stale-assets.mjs <paths.txt>');
  process.exit(1);
}
const catalog = loadProductCatalog();
const lines = fs.readFileSync(listFile, 'utf8').trim().split('\n').filter(Boolean);

for (const rel of lines) {
  const out = path.join(root, 'public', rel.replace(/^public\//, ''));
  const m = rel.match(/products\/(.+)\.webp$/);
  const m2 = rel.match(/reviews\/(.+)\.webp$/);
  const id = m?.[1] ?? m2?.[1];
  if (!id || !catalog[id]) {
    console.warn('skip', rel);
    continue;
  }
  const p = catalog[id];
  const prompt = m ? productSquarePrompt(p) : reviewHeroPrompt(p);
  const spec = m
    ? { w: 800, h: 800, size: '1024x1024', alpha: true }
    : { w: 1680, h: 720, size: '1792x1024', alpha: false };
  const raw = await generateImageBytes(prompt, { size: spec.size });
  const buf = await postProcessRaster(raw, { width: spec.w, height: spec.h, removeWhiteBg: spec.alpha });
  await fs.promises.mkdir(path.dirname(out), { recursive: true });
  await fs.promises.writeFile(out, buf);
  console.log('ok', rel, buf.length);
}
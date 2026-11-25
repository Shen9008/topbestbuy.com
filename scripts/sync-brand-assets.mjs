/**
 * Copy canonical brand files from the TopBestBuy.com asset folder and
 * regenerate favicon / PWA PNG sizes from logo-mark.png (Navy Shopping Bag Checkmark).
 *
 * Usage: node scripts/sync-brand-assets.mjs [sourceDir]
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const defaultSource = path.join(
  process.env.USERPROFILE ?? '',
  'Downloads',
  'TopBestBuy.com',
);
const sourceDir = process.argv[2] ?? defaultSource;
const publicDir = path.join(root, 'public');
const brandDir = path.join(publicDir, 'brand');

const copies = [
  ['Navy Shopping Bag Checkmark.png', 'brand/logo-mark.png'],
  ['topbestbuy-wordmark.svg', 'brand/logo-wordmark.svg'],
  ['topbestbuy-dark-lockup.svg', 'brand/logo-wordmark-dark.svg'],
  ['topbestbuy-dark-lockup.png', 'brand/logo-wordmark-dark.png'],
  ['TopBestBuy.online Logo on White.png', 'brand/logo-wordmark-light.png'],
];

const rasterTargets = [
  { out: 'favicon-32.png', size: 32 },
  { out: 'apple-touch-icon.png', size: 180 },
  { out: 'icon-192.png', size: 192 },
  { out: 'icon-512.png', size: 512 },
];

await mkdir(brandDir, { recursive: true });

for (const [srcName, destRel] of copies) {
  const from = path.join(sourceDir, srcName);
  const to = path.join(publicDir, destRel);
  await copyFile(from, to);
  console.log(`copied ${srcName} -> ${destRel}`);
}

const markPath = path.join(brandDir, 'logo-mark.png');
for (const { out, size } of rasterTargets) {
  await sharp(markPath)
    .resize(size, size, { fit: 'contain', background: { r: 6, g: 29, b: 50, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, out));
  console.log(`generated ${out} (${size}x${size})`);
}

const png32 = await sharp(markPath)
  .resize(32, 32, { fit: 'contain', background: { r: 6, g: 29, b: 50, alpha: 1 } })
  .png()
  .toBuffer();
await sharp(png32).toFile(path.join(publicDir, 'favicon.ico'));
console.log('generated favicon.ico');
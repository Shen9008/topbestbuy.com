/**
 * Minify third-party brand SVGs for the homepage logo strip:
 * single fill (#000), strip metadata, keep viewBox.
 * Usage: node scripts/normalize-brand-logo-svg.mjs <in.svg> <out.svg>
 */
import fs from 'node:fs';

const [inPath, outPath] = process.argv.slice(2);
if (!inPath || !outPath) {
  console.error('Usage: node scripts/normalize-brand-logo-svg.mjs <in.svg> <out.svg>');
  process.exit(1);
}

let svg = fs.readFileSync(inPath, 'utf8');

svg = svg
  .replace(/<\?xml[^?]*\?>/gi, '')
  .replace(/<!DOCTYPE[^>]*>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

const vbMatch = svg.match(/viewBox=["']([^"']+)["']/i);
const viewBox = vbMatch ? vbMatch[1] : '0 0 24 24';

const paths = [...svg.matchAll(/<path\b[^>]*\/?>/gi)]
  .map((m) => m[0])
  .filter((tag) => !/\bd=["']m0 0h\d/i.test(tag));
const polys = [...svg.matchAll(/<polygon\b[^>]*\/?>/gi)].map((m) => m[0]);
const shapes = [...paths, ...polys];

if (!shapes.length) {
  console.error(`No paths found in ${inPath}`);
  process.exit(1);
}

const body = shapes
  .map((tag) =>
    tag
      .replace(/\sclass="[^"]*"/gi, '')
      .replace(/\sstyle="[^"]*"/gi, '')
      .replace(/\sfill="[^"]*"/gi, '')
      .replace(/\sfill-opacity="[^"]*"/gi, '')
      .replace(/\/?>$/, ' fill="#000"/>')
  )
  .join('\n  ');

const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n  ${body}\n</svg>\n`;
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${shapes.length} paths, viewBox=${viewBox})`);
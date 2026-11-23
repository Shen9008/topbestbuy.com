import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const CORE_MARKER = '/* ===== CORE ===== */';

function mockupDataPrefix() {
  const mockupPath = path.join(root, 'reference', 'mockup.html');
  const html = fs.readFileSync(mockupPath, 'utf8');
  const match = html.match(/<script>\s*([\s\S]*?)\s*<\/script>\s*<\/body>/i);
  if (!match) throw new Error('mockup script not found');
  const coreAt = match[1].indexOf(CORE_MARKER);
  if (coreAt < 0) throw new Error('CORE marker not found');
  return match[1].slice(0, coreAt);
}

function runSuffix(suffix) {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.runInNewContext(`${mockupDataPrefix()}${suffix}`, sandbox, { timeout: 60_000 });
  return sandbox;
}

/** @returns {Record<string, { id: string, brand: string, name: string, list: string, kind: string, short: string, cat: string }>} */
export function loadProductCatalog() {
  const ctx = runSuffix(`
const CATALOG = {};
Object.entries(LISTS).forEach(([slug, L]) => {
  for (const p of L.products) {
    CATALOG[p[0]] = {
      id: p[0],
      brand: p[1],
      name: p[2],
      list: slug,
      kind: L.kind,
      short: L.short,
      cat: L.cat,
    };
  }
});
globalThis.__catalog__ = CATALOG;`);
  return ctx.__catalog__;
}

export function productFullName(p) {
  return `${p.brand} ${p.name}`;
}

export function loadListMeta() {
  const ctx = runSuffix(`
const META = {};
Object.entries(LISTS).forEach(([slug, L]) => {
  META[slug] = String(L.h1).replace(/\\(.*\\)/, '').trim();
});
globalThis.__meta__ = META;`);
  return ctx.__meta__;
}

export function loadCategories() {
  const ctx = runSuffix(`globalThis.__cats__ = CATS.map((c) => ({ id: c.id, name: c.name }));`);
  return ctx.__cats__;
}
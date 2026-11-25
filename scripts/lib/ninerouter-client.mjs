/**
 * 9Router image generation client (+ optional Pollinations fallback when gateway has no providers).
 */

const DEFAULT_MODEL = process.env.NINEROUTER_IMAGE_MODEL ?? 'gemini/gemini-2.5-flash-image';
const FALLBACK_MODEL = 'pollinations-direct';

function routerUrl() {
  return (process.env.NINEROUTER_URL ?? 'http://127.0.0.1:20128').replace(/\/$/, '');
}

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const key = process.env.NINEROUTER_KEY;
  if (key) headers.Authorization = `Bearer ${key}`;
  return headers;
}

function sizeToWH(size) {
  const [w, h] = String(size).split('x').map(Number);
  return { w: w || 1024, h: h || 1024 };
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {string} prompt
 * @param {{ size?: string, model?: string, retries?: number }} opts
 * @returns {Promise<Buffer>}
 */
export async function generateImageBytes(prompt, opts = {}) {
  const size = opts.size ?? '1024x1024';
  const model = opts.model ?? DEFAULT_MODEL;
  const retries = opts.retries ?? 4;
  let lastErr;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (model === FALLBACK_MODEL) {
        return await pollinationsFetch(prompt, size);
      }
      return await nineRouterFetch(prompt, size, model);
    } catch (err) {
      lastErr = err;
      const msg = String(err?.message ?? err);
      const providerMissing =
        msg.includes('No credentials') ||
        msg.includes('Missing API key') ||
        msg.includes('authentication_error') ||
        msg.includes('All accounts unavailable');
      if (providerMissing && process.env.NINEROUTER_IMAGE_FALLBACK !== 'off') {
        return await pollinationsFetch(prompt, size);
      }
      const wait = Math.min(30_000, 1000 * 2 ** attempt);
      await sleep(wait);
    }
  }
  throw lastErr;
}

/**
 * @param {string} prompt
 * @param {string} size
 * @param {string} model
 */
async function nineRouterFetch(prompt, size, model) {
  const url = `${routerUrl()}/v1/images/generations?response_format=binary`;
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ model, prompt, size }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`9Router ${res.status}: ${text.slice(0, 400)}`);
  }
  const ctype = res.headers.get('content-type') ?? '';
  const buf = Buffer.from(await res.arrayBuffer());
  if (ctype.includes('json') || buf[0] === 0x7b) {
    throw new Error(buf.toString('utf8').slice(0, 400));
  }
  return buf;
}

/**
 * Last-resort photorealistic generator when 9Router has no provider accounts (cloud agent / CI).
 * Not a substitute for a configured local 9Router — set NINEROUTER_IMAGE_FALLBACK=off to disable.
 */
async function pollinationsFetch(prompt, size) {
  const { w, h } = sizeToWH(size);
  const seed = hashPrompt(prompt);
  const q = encodeURIComponent(prompt.slice(0, 900));
  const url = `https://image.pollinations.ai/prompt/${q}?width=${w}&height=${h}&nologo=true&seed=${seed}`;
  let lastErr;
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.status === 429 || res.status === 402) {
        await sleep(Math.min(60_000, 3000 * 2 ** attempt));
        continue;
      }
      if (!res.ok) throw new Error(`Pollinations ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      await sleep(2000 * (attempt + 1));
    }
  }
  throw lastErr ?? new Error('Pollinations failed');
}

function hashPrompt(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 1_000_000;
}

export async function probeNineRouter() {
  try {
    const res = await fetch(`${routerUrl()}/api/health`);
    if (!res.ok) return { ok: false, reason: `health ${res.status}` };
    const health = await res.json();
    return { ok: Boolean(health?.ok), url: routerUrl() };
  } catch (e) {
    return { ok: false, reason: String(e?.message ?? e) };
  }
}
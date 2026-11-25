/** Photorealistic prompt templates — tuned for TopBestBuy brand (no hype, MY context). */

const STYLE_PRODUCT =
  'Professional e-commerce studio pack shot, photorealistic, soft box lighting, subtle contact shadow, square framing, no text, no watermark, no people';

const STYLE_REVIEW =
  'Wide cinematic product hero banner, photorealistic lifestyle editorial, product as focal subject on brand-appropriate scene, Malaysian urban home aesthetic, moody yet clean, no text overlay';

const STYLE_LIST =
  'Wide lifestyle editorial category scene, photorealistic, Malaysian apartment context, aspirational but realistic, shallow depth of field, no text, no logos';

const STYLE_CATEGORY =
  'Category icon-style still life, photorealistic, single representative product cluster on dark navy seamless backdrop with soft orange accent rim light, centered composition, no text';

const STYLE_HOME =
  'Wide photorealistic editorial hero, young Malaysian family shopping online at home evening, laptop and phone, modern condo interior, navy and warm orange accents in decor, honest documentary tone, no logos';

const STYLE_OG =
  'Social share card scene, photorealistic flat lay of assorted Malaysian consumer electronics and home products on dark navy surface, subtle orange accent props, professional studio lighting, leave negative space for typography on left third, no readable text in image';

const LIST_CONTEXT = {
  'best-air-fryers-malaysia': 'modern Malaysian kitchen counter with air fryer cooking scene, warm ambient light',
  'best-air-purifiers-malaysia': 'bedroom or living room with air purifier improving air quality, clean aesthetic',
  'best-mattress-malaysia': 'peaceful bedroom with premium mattress, soft morning light',
  'best-vacuum-cleaners-malaysia': 'living room floor cleaning scene with cordless vacuum',
  'best-wireless-earbuds-malaysia': 'commuter or desk scene with wireless earbuds and phone',
  'best-facial-cleansers-malaysia': 'bathroom vanity with gentle skincare routine, spa-like lighting',
  'best-washing-machines-malaysia': 'laundry area with front-load washing machine',
  'best-laptops-for-students-malaysia': 'student study desk with laptop, books, campus vibe',
  'best-smart-watches-malaysia': 'fitness or daily wear smartwatch on wrist, active lifestyle',
  'best-smart-tvs-malaysia': 'living room movie night with large TV glow',
  'best-running-shoes-malaysia': 'outdoor urban running track at dawn, running shoes in action',
};

const CAT_CONTEXT = {
  kitchen: 'air fryer and small kitchen appliances',
  air: 'air purifier and vacuum',
  sleep: 'mattress and bedding',
  appliances: 'washing machine',
  audio: 'wireless earbuds and headphones',
  computing: 'laptop computer',
  phones: 'smartwatch and phone accessories',
  tv: 'smart TV',
  beauty: 'facial cleanser bottles',
  fitness: 'running shoes',
};

/** @param {{ brand: string, name: string, kind: string }} p */
export function productSquarePrompt(p) {
  const label = `${p.brand} ${p.name}`.trim();
  return `${STYLE_PRODUCT}. Product: ${label}, category ${p.kind}. Pure white seamless background (#FFFFFF).`;
}

/** @param {{ brand: string, name: string, kind: string }} p */
export function reviewHeroPrompt(p) {
  const label = `${p.brand} ${p.name}`.trim();
  return `${STYLE_REVIEW}. Featuring ${label} (${p.kind}), dramatic but realistic lighting.`;
}

/** @param {string} slug @param {string} title */
export function listHeroPrompt(slug, title) {
  const ctx = LIST_CONTEXT[slug] ?? 'consumer electronics lifestyle scene Malaysia';
  return `${STYLE_LIST}. Theme: ${title}. Scene: ${ctx}.`;
}

/** @param {string} catId @param {string} name */
export function categoryTilePrompt(catId, name) {
  const props = CAT_CONTEXT[catId] ?? name;
  return `${STYLE_CATEGORY}. Category: ${name}. Show ${props}.`;
}

export function homeHeroPrompt() {
  return STYLE_HOME;
}

export function ogDefaultPrompt() {
  return STYLE_OG;
}
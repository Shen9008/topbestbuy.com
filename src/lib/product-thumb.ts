import { resolveManifestSlot } from './image-manifest';

export type ProductThumbSize = 'sm' | 'md';

export function productManifestSlotId(productId: string): string {
  return `prod-${productId}`;
}

export function resolveProductThumb(productId: string, fallbackAlt?: string) {
  const slotId = productManifestSlotId(productId);
  const entry = resolveManifestSlot(slotId);
  if (!entry) return undefined;
  return {
    slotId,
    src: entry.src,
    width: entry.width,
    height: entry.height,
    alt: fallbackAlt ?? entry.alt,
  };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function productThumbMarkup(
  productId: string,
  alt: string,
  size: ProductThumbSize = 'sm',
  options?: { decorative?: boolean; extraClass?: string },
): string {
  const thumb = resolveProductThumb(productId, alt);
  const sizeClass = size === 'md' ? 'tb-product-thumb--md' : 'tb-product-thumb--sm';
  const extra = options?.extraClass ?? '';
  const safeAlt = escapeHtml(alt);
  const aria = options?.decorative ? ' aria-hidden="true"' : '';

  if (!thumb) {
    return `<span class="tb-product-thumb ${sizeClass} tb-product-thumb--empty ${extra}"${aria}></span>`;
  }

  const imgAlt = options?.decorative ? '' : ` alt="${safeAlt}"`;
  return `<span class="tb-product-thumb ${sizeClass} ${extra}"${aria}><img src="${thumb.src}"${imgAlt} width="${thumb.width}" height="${thumb.height}" loading="lazy" decoding="async" class="tb-product-thumb__img" /></span>`;
}

export function compareProductCellMarkup(
  productId: string,
  productName: string,
  nameHtml: string,
  subHtml: string,
): string {
  const thumb = resolveProductThumb(productId, productName);
  const imgPart = thumb
    ? `<span class="tb-product-thumb tb-product-thumb--md tb-compare-product__thumb"><img src="${thumb.src}" alt="${escapeHtml(thumb.alt)}" width="${thumb.width}" height="${thumb.height}" loading="lazy" decoding="async" class="tb-product-thumb__img" /></span>`
    : `<span class="tb-product-thumb tb-product-thumb--md tb-product-thumb--empty tb-compare-product__thumb" aria-hidden="true"></span>`;

  return `<div class="tb-compare-product">${imgPart}<div class="tb-compare-product__copy min-w-[10rem]">${nameHtml}${subHtml}</div></div>`;
}
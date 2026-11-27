import {
  resolveProductThumb,
  type ProductThumbSize,
} from '../../lib/product-thumb';

type Props = {
  productId: string;
  alt: string;
  size?: ProductThumbSize;
  className?: string;
  decorative?: boolean;
};

export default function ProductThumbImg({
  productId,
  alt,
  size = 'sm',
  className = '',
  decorative = true,
}: Props) {
  const thumb = resolveProductThumb(productId, alt);
  const sizeClass = size === 'md' ? 'tb-product-thumb--md' : 'tb-product-thumb--sm';
  return (
    <span
      class={`tb-product-thumb ${sizeClass} ${thumb ? '' : 'tb-product-thumb--empty'} ${className}`.trim()}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {thumb ? (
        <img
          src={thumb.src}
          alt={decorative ? '' : thumb.alt}
          width={thumb.width}
          height={thumb.height}
          loading="lazy"
          decoding="async"
          class="tb-product-thumb__img"
        />
      ) : null}
    </span>
  );
}
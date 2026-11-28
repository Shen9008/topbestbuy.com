import { useEffect, useState } from 'preact/hooks';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import Icon from '../ui/Icon';
import ProductThumbImg from '../ui/ProductThumbImg';
import { shortlistCompareHref } from '../../lib/routes';

const STORAGE_KEY = 'tb-shortlist';

export default function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);
  const catalog = allProductsMap();
  const savedIds = ids.filter((id) => Object.hasOwn(catalog, id));

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : [];
        setIds(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []);
      } catch {
        setIds([]);
      }
    };
    sync();
    window.addEventListener('tb-shortlist-change', sync);
    return () => window.removeEventListener('tb-shortlist-change', sync);
  }, []);

  if (savedIds.length === 0) {
    return (
      <div class="tb-callout tb-card--editorial mt-6 flex items-start gap-3">
        <Icon name="state.empty-saved" size={32} class="shrink-0 opacity-80" />
        <div>
          <p class="m-0 font-semibold">Nothing saved yet</p>
          <p class="m-0 mt-1 text-sm text-[var(--tb-muted)]">
            Tap Save on any product card, or browse a{' '}
            <a href="/categories" class="font-semibold text-[var(--tb-accent-fg)]">
              Top 10 list
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class="mt-6 space-y-2">
      {savedIds.map((id) => {
        const p = catalog[id];
        return (
          <div class="tb-feed-row tb-feed-row--thumb" key={id}>
            <ProductThumbImg productId={id} alt={productFullName(p)} size="sm" decorative />
            <span class="min-w-0">
              <strong class="block wrap-anywhere text-[var(--tb-ink)]">{productFullName(p)}</strong>
              <small class="text-[var(--tb-muted)]">
                {formatRM(p.price)} · {p.tag}
              </small>
              <a href={`/reviews/${id}`} class="tb-btn tb-btn-ghost tb-btn-sm mt-2 min-h-11 inline-flex lg:mt-1">
                Review
              </a>
            </span>
            <span class="tb-score text-lg">{p.total.toFixed(1)}</span>
          </div>
        );
      })}
      <a href={shortlistCompareHref(savedIds)} class="tb-btn mt-4 inline-flex min-h-11 items-center gap-2">
        <Icon name="tool.compare" size={20} />
        {savedIds.length === 1 ? 'Compare saved product' : 'Compare saved products'}
      </a>
    </div>
  );
}

import { useEffect, useState } from 'preact/hooks';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';

const STORAGE_KEY = 'tb-shortlist';

export default function SavedPage() {
  const [ids, setIds] = useState<string[]>([]);
  const catalog = allProductsMap();

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

  if (ids.length === 0) {
    return <div class="tb-callout mt-6">Nothing saved yet. Tap Save on any product card.</div>;
  }

  return (
    <div class="mt-6 space-y-3">
      {ids.map((id) => {
        const p = catalog[id];
        if (!p) return null;
        return (
          <div class="tb-card flex flex-wrap items-center gap-3" key={id}>
            <div class="flex-1">
              <strong>{productFullName(p)}</strong>
              <br />
              <small class="text-[var(--tb-muted)]">
                {formatRM(p.price)} · {p.total.toFixed(1)}/100
              </small>
            </div>
            <a href={`/reviews/${id}`} class="tb-btn tb-btn-ghost tb-btn-sm">
              Review
            </a>
          </div>
        );
      })}
      <a href="/compare" class="tb-btn">
        Compare these
      </a>
    </div>
  );
}
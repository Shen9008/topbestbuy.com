import { useEffect, useState } from 'preact/hooks';
import { dispatchToggleSave } from './AppChrome';
import Icon from '../ui/Icon';

const STORAGE_KEY = 'tb-shortlist';

function readShortlist(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

export default function SaveButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readShortlist().has(productId));
    sync();
    window.addEventListener('tb-shortlist-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('tb-shortlist-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, [productId]);

  return (
    <button
      type="button"
      class={`tb-btn tb-btn-ghost tb-btn-sm inline-flex min-h-11 items-center gap-1.5 ${saved ? '!border-[var(--tb-accent)] !bg-[var(--tb-accent)] !text-[var(--tb-accent-ink)]' : ''}`}
      aria-pressed={saved}
      onClick={() => dispatchToggleSave(productId)}
    >
      <Icon name={saved ? 'product.saved' : 'product.save'} size={16} strokeWidth={2} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
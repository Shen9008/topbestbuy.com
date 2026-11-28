import { useCallback, useEffect, useRef, useState, type Dispatch, type StateUpdater } from 'preact/hooks';
import { searchSite } from '../../lib/search-index';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import ProductThumbImg from '../ui/ProductThumbImg';
import Icon from '../ui/Icon';
import { shortlistCompareHref } from '../../lib/routes';
import { playEntrance } from '../../lib/motion/entrance';

const STORAGE_KEY = 'tb-shortlist';

type Toast = { message: string; id: number };

function readShortlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeShortlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('tb-shortlist-change', { detail: ids }));
}

function showToast(setter: Dispatch<StateUpdater<Toast | null>>, message: string) {
  const id = Date.now();
  setter({ message, id });
  window.setTimeout(() => setter((cur) => (cur?.id === id ? null : cur)), 2600);
}

export default function AppChrome() {
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<'search' | 'shortlist' | null>(null);
  const [query, setQuery] = useState('');
  const searchDialog = useRef<HTMLDialogElement>(null);
  const shortlistDialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const toastElement = useRef<HTMLParagraphElement>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const catalog = allProductsMap();
  const savedIds = shortlist.filter((id) => Object.hasOwn(catalog, id));
  const results = searchSite(query);

  const syncShortlist = useCallback(() => setShortlist(readShortlist()), []);

  useEffect(() => {
    syncShortlist();
    const onChange = () => syncShortlist();
    window.addEventListener('tb-shortlist-change', onChange);
    window.addEventListener('storage', onChange);
    const onSave = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (!id) return;
      const ids = readShortlist();
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      writeShortlist(next);
      setShortlist(next);
      showToast(setToast, ids.includes(id) ? 'Removed from shortlist' : 'Saved to shortlist');
    };
    const onOpenSearch = () => {
      setQuery('');
      setOverlay('search');
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      const link = (e.target as Element | null)?.closest('[data-open-overlay]');
      if (!link) return;
      e.preventDefault();
      if (link.getAttribute('data-open-overlay') === 'search') onOpenSearch();
      else setOverlay('shortlist');
    };
    window.addEventListener('tb-toggle-save', onSave as EventListener);
    document.addEventListener('click', onClick);
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || document.querySelector('dialog[open]')) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('input, textarea, select') || target?.isContentEditable) return;
      if (
        (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) ||
        (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey) && !e.altKey)
      ) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('tb-shortlist-change', onChange);
      window.removeEventListener('storage', onChange);
      window.removeEventListener('tb-toggle-save', onSave as EventListener);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [syncShortlist]);

  useEffect(() => {
    const dialog = overlay === 'search' ? searchDialog.current : shortlistDialog.current;
    if (!overlay || !dialog || dialog.open) return;
    dialog.showModal();
    if (overlay === 'search') searchInput.current?.focus();
    return overlay === 'shortlist'
      ? playEntrance(dialog, { x: 24, y: 0, duration: 240 })
      : playEntrance(dialog, { y: 6, duration: 150 });
  }, [overlay]);

  useEffect(() => {
    if (toastElement.current && toast) return playEntrance(toastElement.current, { duration: 160 });
  }, [toast]);

  const dismissBackdrop = (event: MouseEvent) => {
    const dialog = event.currentTarget as HTMLDialogElement;
    if (event.target !== dialog) return;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) {
      dialog.close();
    }
  };

  const dismissOnEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || event.isComposing) return;
    event.preventDefault();
    (event.currentTarget as HTMLDialogElement).close();
  };

  return (
    <>
      <dialog
        ref={shortlistDialog}
        class="fixed inset-y-0 right-0 left-auto m-0 h-full max-h-none w-[min(420px,100%)] max-w-none overflow-y-auto border-l border-[var(--tb-line)] bg-[var(--tb-surface)] p-5 text-[var(--tb-ink)] shadow-2xl backdrop:bg-black/55"
        aria-label="My shortlist"
        onClose={() => setOverlay(null)}
        onClick={dismissBackdrop}
        onKeyDown={dismissOnEscape}
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="m-0 tb-h3">My shortlist</h2>
          <button
            type="button"
            class="tb-btn tb-btn-ghost tb-btn-sm inline-flex min-h-11 items-center gap-1.5"
            onClick={() => shortlistDialog.current?.close()}
          >
            <Icon name="state.close" size={16} strokeWidth={2} />
            Close
          </button>
        </div>
        <p class="text-sm text-[var(--tb-muted)]">
          Saved on this device only. Compare up to 3 products.
        </p>
        {savedIds.length === 0 ? (
          <div class="tb-callout tb-card--editorial mt-4 flex items-start gap-3">
            <Icon name="state.empty-saved" size={32} class="shrink-0 opacity-80" />
            <p class="m-0 text-sm">Nothing saved yet. Tap Save on any product card.</p>
          </div>
        ) : (
          <div class="mt-4 space-y-2">
            {savedIds.map((id) => {
              const p = catalog[id];
              return (
                <div class="tb-feed-row tb-feed-row--thumb" key={id}>
                  <ProductThumbImg productId={id} alt={productFullName(p)} size="sm" decorative />
                  <div class="min-w-0">
                    <strong class="block wrap-anywhere text-sm">{productFullName(p)}</strong>
                    <small class="tb-num text-[var(--tb-muted)]">
                      {formatRM(p.price)} · {p.total.toFixed(1)}/100
                    </small>
                  </div>
                  <button
                    type="button"
                    class="tb-btn tb-btn-ghost tb-btn-sm min-h-11 shrink-0"
                    aria-label={`Remove ${productFullName(p)} from shortlist`}
                    onClick={() => {
                      const next = shortlist.filter((x) => x !== id);
                      writeShortlist(next);
                      setShortlist(next);
                      shortlistDialog.current?.querySelector('button')?.focus();
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <a
              href={shortlistCompareHref(savedIds)}
              class="tb-btn mt-2 inline-flex w-full min-h-11 items-center justify-center gap-2"
            >
              <Icon name="tool.compare" size={20} strokeWidth={2} />
              {savedIds.length === 1 ? 'Compare saved product' : 'Compare saved products'}
            </a>
          </div>
        )}
      </dialog>

      <dialog
        ref={searchDialog}
        class="fixed inset-0 m-auto max-h-[85dvh] w-[min(620px,calc(100%-2rem))] max-w-none overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--tb-line)] bg-[var(--tb-surface)] p-4 text-[var(--tb-ink)] shadow-2xl backdrop:bg-black/55"
        aria-label="Search"
        onClose={() => setOverlay(null)}
        onClick={dismissBackdrop}
        onKeyDown={dismissOnEscape}
      >
        <div class="mb-3 flex justify-end">
          <button
            type="button"
            class="tb-btn tb-btn-ghost tb-btn-sm inline-flex min-h-11 items-center gap-1.5"
            onClick={() => searchDialog.current?.close()}
          >
            <Icon name="state.close" size={16} strokeWidth={2} />
            Close
          </button>
        </div>
        <label
          class="mb-2 flex items-center gap-2 text-sm font-bold"
          for="tb-search-q"
        >
          <Icon name="nav.search" size={20} strokeWidth={2} />
          Search lists, guides and tools
        </label>
        <input
          ref={searchInput}
          id="tb-search-q"
          type="search"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Try: air fryer, haze, back pain"
          class="w-full min-h-11 rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3 py-2.5 text-base text-[var(--tb-ink)]"
          autoComplete="off"
        />
        <p class="sr-only" role="status">{query.trim() ? `${results.length} results shown` : ''}</p>
        <div class="mt-4 space-y-2">
          {results.length === 0 ? (
            <div class="tb-callout flex items-start gap-3">
              <Icon name="state.empty-search" size={32} class="shrink-0 opacity-80" />
              <p class="m-0">No match. Try a product type like air fryer or mattress.</p>
            </div>
          ) : (
            results.map((hit) => (
              <a
                key={hit.href}
                href={hit.href}
                class="tb-feed-row text-sm no-underline"
              >
                <span class="inline-flex min-h-10 min-w-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-surface-raised)]">
                  <Icon name="nav.search" size={16} strokeWidth={2} />
                </span>
                <span class="min-w-0 font-semibold text-[var(--tb-ink)]">{hit.title}</span>
                <span class="text-xs font-bold text-[var(--tb-accent-fg)]" aria-hidden="true">→</span>
              </a>
            ))
          )}
        </div>
      </dialog>

      {toast && (
        <p
          ref={toastElement}
          class="fixed bottom-[calc(var(--tabbar-height)+1rem)] left-1/2 z-[calc(var(--z-tabbar)+20)] max-w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-[var(--radius-sm)] bg-[var(--tb-ink)] px-4 py-3 text-sm text-[var(--tb-bg)]"
          role="status"
        >
          {toast.message}
        </p>
      )}
    </>
  );
}

export function dispatchToggleSave(id: string) {
  window.dispatchEvent(new CustomEvent('tb-toggle-save', { detail: id }));
}

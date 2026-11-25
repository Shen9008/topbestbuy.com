import { useCallback, useEffect, useState, type Dispatch, type StateUpdater } from 'preact/hooks';
import { searchSite, type SearchHit } from '../../lib/search-index';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import Icon from '../ui/Icon';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchHit[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  const catalog = allProductsMap();

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
      setSearchOpen(true);
      setQuery('');
      setResults(searchSite(''));
    };
    const onOpenDrawer = () => setDrawerOpen(true);
    window.addEventListener('tb-toggle-save', onSave as EventListener);
    window.addEventListener('tb-open-search', onOpenSearch);
    window.addEventListener('tb-open-shortlist', onOpenDrawer);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
      if (
        e.key === '/' &&
        !/input|textarea|select/i.test((document.activeElement as HTMLElement)?.tagName ?? '')
      ) {
        e.preventDefault();
        onOpenSearch();
      }
      if (
        (e.key === 'k' || e.key === 'K') &&
        (e.metaKey || e.ctrlKey) &&
        !/input|textarea|select/i.test((document.activeElement as HTMLElement)?.tagName ?? '')
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
      window.removeEventListener('tb-open-search', onOpenSearch);
      window.removeEventListener('tb-open-shortlist', onOpenDrawer);
      document.removeEventListener('keydown', onKey);
    };
  }, [syncShortlist]);

  useEffect(() => {
    if (searchOpen) setResults(searchSite(query));
  }, [query, searchOpen]);

  const overlayOpen = drawerOpen || searchOpen;

  return (
    <>
      {(overlayOpen || toast) && (
        <div
          class="fixed inset-0 z-[calc(var(--z-tabbar)+5)] bg-black/55"
          role="presentation"
          onClick={() => {
            setDrawerOpen(false);
            setSearchOpen(false);
          }}
          hidden={!overlayOpen}
        />
      )}

      <aside
        class="fixed right-0 top-0 z-[calc(var(--z-tabbar)+10)] h-full w-[min(420px,100%)] translate-x-0 overflow-y-auto border-l border-[var(--tb-line)] bg-[var(--tb-surface)] p-5 shadow-2xl transition-transform duration-200"
        style={{ transform: drawerOpen ? 'none' : 'translateX(105%)' }}
        aria-label="My shortlist"
        role="dialog"
        aria-modal="true"
        hidden={!drawerOpen}
      >
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="m-0 tb-h3">My shortlist</h2>
          <button
            type="button"
            class="tb-btn tb-btn-ghost tb-btn-sm inline-flex min-h-11 items-center gap-1.5"
            onClick={() => setDrawerOpen(false)}
          >
            <Icon name="state.close" size={16} strokeWidth={2} />
            Close
          </button>
        </div>
        <p class="text-sm text-[var(--tb-muted)]">
          Saved on this device only. Compare up to 3 products.
        </p>
        {shortlist.length === 0 ? (
          <div class="tb-callout mt-4 flex items-start gap-3">
            <Icon name="state.empty-saved" size={32} class="shrink-0 opacity-80" />
            <p class="m-0">Nothing saved yet. Tap Save on any product.</p>
          </div>
        ) : (
          <div class="mt-4 space-y-3">
            {shortlist.map((id) => {
              const p = catalog[id];
              if (!p) return null;
              return (
                <div
                  class="tb-card flex items-center gap-3"
                  key={id}
                >
                  <div class="min-w-0 flex-1">
                    <strong class="block text-sm">{productFullName(p)}</strong>
                    <small class="tb-num text-[var(--tb-muted)]">
                      {formatRM(p.price)} · {p.total.toFixed(1)}/100
                    </small>
                  </div>
                  <button
                    type="button"
                    class="tb-btn tb-btn-ghost tb-btn-sm"
                    onClick={() => {
                      const next = shortlist.filter((x) => x !== id);
                      writeShortlist(next);
                      setShortlist(next);
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            <a href="/compare" class="tb-btn inline-flex w-full items-center justify-center gap-2">
              <Icon name="tool.compare" size={20} strokeWidth={2} />
              Compare these
            </a>
          </div>
        )}
      </aside>

      <ApplicationDialog open={searchOpen} onClose={() => setSearchOpen(false)}>
        <label
          class="mb-2 flex items-center gap-2 text-sm font-bold"
          for="tb-search-q"
        >
          <Icon name="nav.search" size={20} strokeWidth={2} />
          Search lists, guides and tools
        </label>
        <input
          id="tb-search-q"
          type="search"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Try: air fryer, haze, back pain"
          class="w-full rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3 py-2.5 text-base text-[var(--tb-ink)]"
          autoComplete="off"
        />
        <div class="mt-4 space-y-2" aria-live="polite">
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
                class="tb-card block p-3 text-sm font-semibold no-underline"
                onClick={() => setSearchOpen(false)}
              >
                {hit.title}
              </a>
            ))
          )}
        </div>
      </ApplicationDialog>

      {toast && (
        <p
          class="fixed bottom-[calc(var(--tabbar-height)+1rem)] left-1/2 z-[calc(var(--z-tabbar)+20)] max-w-[min(100%-2rem,28rem)] -translate-x-1/2 rounded-[var(--radius-sm)] bg-[var(--tb-ink)] px-4 py-3 text-sm text-[var(--tb-bg)]"
          role="status"
        >
          {toast.message}
        </p>
      )}
    </>
  );
}

function ApplicationDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: preact.ComponentChildren;
}) {
  if (!open) return null;
  return (
    <div
      class="fixed left-1/2 top-[12vh] z-[calc(var(--z-tabbar)+10)] max-h-[76vh] w-[min(620px,calc(100%-2rem))] -translate-x-1/2 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--tb-line)] bg-[var(--tb-surface)] p-4 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      onClick={(e) => e.stopPropagation()}
    >
      <div class="mb-3 flex justify-end">
        <button
          type="button"
          class="tb-btn tb-btn-ghost tb-btn-sm inline-flex min-h-11 items-center gap-1.5"
          onClick={onClose}
        >
          <Icon name="state.close" size={16} strokeWidth={2} />
          Close
        </button>
      </div>
      {children}
    </div>
  );
}

export function dispatchToggleSave(id: string) {
  window.dispatchEvent(new CustomEvent('tb-toggle-save', { detail: id }));
}
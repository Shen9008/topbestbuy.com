import { useState } from 'preact/hooks';
import { searchSite } from '../../lib/search-index';
import Icon from '../ui/Icon';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = searchSite(query);

  return (
    <div class="mt-6">
      <label class="block text-sm font-bold" for="search-page-q">
        <span class="inline-flex items-center gap-2">
          <Icon name="nav.search" size={20} strokeWidth={2} />
          Search lists, guides and tools
        </span>
      </label>
      <div class="relative mt-2">
        <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--tb-muted)]">
          <Icon name="nav.search" size={20} strokeWidth={2} />
        </span>
        <input
          id="search-page-q"
          type="search"
          class="w-full min-h-11 rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] py-2.5 pl-10 pr-3"
          value={query}
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          placeholder="Try: air fryer, mattress, purifier"
          autoComplete="off"
        />
      </div>
      <div class="mt-4 space-y-2" aria-live="polite">
        {query.length > 0 && results.length === 0 ? (
          <div class="tb-callout flex items-start gap-3">
            <Icon name="state.empty-search" size={32} class="shrink-0 opacity-80" />
            <p class="m-0 text-sm">No match. Try a product type like air fryer or mattress.</p>
          </div>
        ) : (
          results.map((hit) => (
            <a key={hit.href} href={hit.href} class="tb-feed-row no-underline">
              <span class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-surface-raised)]">
                <Icon name="nav.search" size={20} strokeWidth={2} />
              </span>
              <span class="min-w-0 font-semibold text-[var(--tb-ink)]">{hit.title}</span>
              <span class="text-xs font-bold text-[var(--tb-accent)]">Open →</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
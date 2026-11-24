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
        {results.map((hit) => (
          <a key={hit.href} href={hit.href} class="tb-card block p-3 font-semibold no-underline">
            {hit.title}
          </a>
        ))}
      </div>
    </div>
  );
}
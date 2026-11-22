import { useState } from 'preact/hooks';
import { searchSite } from '../../lib/search-index';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const results = searchSite(query);

  return (
    <div class="mt-6">
      <label class="block text-sm font-bold" for="search-page-q">
        Search lists, guides and tools
      </label>
      <input
        id="search-page-q"
        type="search"
        class="mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3 py-2.5"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder="Try: air fryer, mattress, purifier"
        autoComplete="off"
      />
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
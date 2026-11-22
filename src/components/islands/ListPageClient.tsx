import { useEffect, useMemo, useState } from 'preact/hooks';
import { scoreForUsage, type RankedProduct } from '../../lib/scoring';
import type { ScoreWeights } from '../../data/scorecard';
import { formatRM, productFullName } from '../../lib/format';

export type ListClientProps = {
  listSlug: string;
  rows: RankedProduct[];
  specCols: readonly string[];
  usages: ReadonlyArray<readonly [string, ScoreWeights | Record<string, number>]>;
  budgetLo: number;
  budgetHi: number;
};

type BudgetFilter = 'all' | 'low' | 'mid' | 'high';

export default function ListPageClient({
  rows,
  specCols: _specCols,
  usages,
  budgetLo,
  budgetHi,
}: ListClientProps) {
  const [budget, setBudget] = useState<BudgetFilter>('all');
  const [brand, setBrand] = useState('');
  const [sortKey, setSortKey] = useState('rank');
  const brands = useMemo(
    () => [...new Set(rows.map((r) => r.brand))].sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    let list = rows.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (budget === 'low') return p.price < budgetLo;
      if (budget === 'mid') return p.price >= budgetLo && p.price <= budgetHi;
      if (budget === 'high') return p.price > budgetHi;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortKey.startsWith('u')) {
        const idx = Number(sortKey.slice(1));
        const w = usages[idx]?.[1];
        if (!w) return a.rank - b.rank;
        return (
          scoreForUsage(b.subs, w as ScoreWeights) - scoreForUsage(a.subs, w as ScoreWeights)
        );
      }
      if (sortKey === 'price') return a.price - b.price;
      if (sortKey === 'value') return b.subs[1]! - a.subs[1]! || a.rank - b.rank;
      return a.rank - b.rank;
    });
    return list;
  }, [rows, budget, brand, sortKey, budgetLo, budgetHi, usages]);

  useEffect(() => {
    const cards = document.querySelectorAll('[data-product-card]');
    const visible = new Set(filtered.map((p) => p.id));
    cards.forEach((el) => {
      const id = (el as HTMLElement).dataset.productId;
      if (id) (el as HTMLElement).hidden = !visible.has(id);
    });
    const tbody = document.getElementById('cmp-table-body');
    if (!tbody) return;
    tbody.innerHTML =
      filtered.length === 0
        ? '<tr><td colspan="99">No products in this band. Try another filter.</td></tr>'
        : filtered
            .map(
              (p) =>
                `<tr><td><span class="tb-rank">${p.rank}</span></td><td><a href="#${p.id}" class="font-semibold text-[var(--tb-accent)]">${productFullName(p)}</a><br/><small>${p.tag}</small></td><td class="tb-num"><strong>${p.total.toFixed(1)}</strong></td><td class="tb-num">${p.price.toLocaleString('en-MY')}</td>${p.specs.map((s) => `<td>${s}</td>`).join('')}<td>${p.best}</td></tr>`,
            )
            .join('');
  }, [filtered]);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id^="sec-"]');
    const links = document.querySelectorAll('[data-jump-sec]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          links.forEach((a) => {
            a.classList.toggle(
              'tb-jump-active',
              (a as HTMLElement).dataset.jumpSec === en.target.id,
            );
          });
        });
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div class="space-y-4">
      <div
        class="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter by budget"
      >
        {(
          [
            ['all', 'All'],
            ['low', `Under ${formatRM(budgetLo)}`],
            ['mid', `${formatRM(budgetLo)} to ${formatRM(budgetHi)}`],
            ['high', `Over ${formatRM(budgetHi)}`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            class={`tb-chip ${budget === key ? 'tb-chip-on' : ''}`}
            aria-pressed={budget === key}
            onClick={() => setBudget(key)}
          >
            {label}
          </button>
        ))}
        <label class="ml-auto flex items-center gap-2 text-sm">
          Brand
          <select
            class="min-h-10 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-surface)] px-2 text-[var(--tb-ink)]"
            value={brand}
            onChange={(e) => setBrand((e.target as HTMLSelectElement).value)}
          >
            <option value="">All</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label class="flex items-center gap-2 text-sm">
          Rank by
          <select
            class="min-h-10 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-surface)] px-2 text-[var(--tb-ink)]"
            value={sortKey}
            onChange={(e) => setSortKey((e.target as HTMLSelectElement).value)}
          >
            <option value="rank">Overall score</option>
            {usages.map((u, i) => (
              <option key={u[0]} value={`u${i}`}>
                Best for: {u[0]}
              </option>
            ))}
            <option value="price">Price, low to high</option>
            <option value="value">Best value score</option>
          </select>
        </label>
      </div>
    </div>
  );
}
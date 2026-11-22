import { useEffect, useMemo, useState } from 'preact/hooks';
import { CRIT } from '../../data/scorecard';
import { LISTS } from '../../data/lists';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import { scoreForUsage } from '../../lib/scoring';

export default function ComparePicker({ initialIds }: { initialIds?: string[] }) {
  const all = useMemo(() => allProductsMap(), []);
  const grouped = useMemo(
    () =>
      Object.entries(LISTS).map(([slug, L]) => ({
        slug,
        label: L.short,
        ids: Object.values(all)
          .filter((p) => p.list === slug)
          .map((p) => p.id),
      })),
    [all],
  );

  const [ids, setIds] = useState<[string, string, string]>([
    initialIds?.[0] ?? 'crispa-dualzone-9l',
    initialIds?.[1] ?? 'aeris-family-8l',
    initialIds?.[2] ?? '',
  ]);

  useEffect(() => {
    if (initialIds?.length) {
      setIds([initialIds[0] ?? '', initialIds[1] ?? '', initialIds[2] ?? '']);
    }
  }, [initialIds]);

  const products = ids.filter(Boolean).map((id) => all[id]).filter(Boolean);
  const sameList = products.every((p) => p.list === products[0]?.list);
  const list = products[0] ? LISTS[products[0].list as keyof typeof LISTS] : null;
  const best = Math.max(...products.map((p) => p.total), 0);

  return (
    <div>
      <div class="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <label class="block text-sm font-bold" key={i}>
            Product {i + 1}
            {i === 2 ? ' (optional)' : ''}
            <select
              class="mt-1 w-full min-h-10 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-bg)] px-2"
              value={ids[i]}
              onChange={(e) => {
                const v = (e.target as HTMLSelectElement).value;
                const next = [...ids] as [string, string, string];
                next[i] = v;
                setIds(next);
              }}
            >
              {i === 2 && <option value="">None</option>}
              {grouped.map((g) => (
                <optgroup label={g.label} key={g.slug}>
                  {g.ids.map((id) => (
                    <option value={id} key={id}>
                      {all[id] ? productFullName(all[id]) : id}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        ))}
      </div>

      {products.length >= 2 && (
        <div class="mt-6 space-y-4" aria-live="polite">
          {!sameList && (
            <Box class="tb-callout">
              These products are from different lists. Usage scores and specs show only when
              products share a list.
            </Box>
          )}
          <div class="tb-tablewrap">
            <table class="tb-table">
              <thead>
                <tr>
                  <th />
                  {products.map((p) => (
                    <th scope="col" key={p.id}>
                      {productFullName(p)}
                      <br />
                      <small>{p.tag}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Overall score</th>
                  {products.map((p) => (
                    <td key={p.id} class="tb-num">
                      <strong>{p.total.toFixed(1)}</strong>
                      {p.total === best && <span class="tb-pill tb-pill-good"> Highest</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Price</th>
                  {products.map((p) => (
                    <td key={p.id}>{formatRM(p.price)}</td>
                  ))}
                </tr>
                {CRIT.map((c, i) => (
                  <tr key={c[0]}>
                    <th scope="row">{c[1]}</th>
                    {products.map((p) => (
                      <td key={p.id} class="tb-num">
                        {p.subs[i]}/5
                      </td>
                    ))}
                  </tr>
                ))}
                {sameList &&
                  list &&
                  list.usages.map((u) => (
                    <tr key={u[0]}>
                      <th scope="row">Usage: {u[0]}</th>
                      {products.map((p) => (
                        <td key={p.id} class="tb-num">
                          {scoreForUsage(p.subs, u[1] as unknown as import('../../data/scorecard').ScoreWeights).toFixed(1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                <tr>
                  <th scope="row">Best for</th>
                  {products.map((p) => (
                    <td key={p.id}>{p.best}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Box({ class: className, children }: { class?: string; children: preact.ComponentChildren }) {
  return <div class={className}>{children}</div>;
}
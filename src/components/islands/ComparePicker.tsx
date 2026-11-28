import { useEffect, useMemo, useState } from 'preact/hooks';
import { CRIT } from '../../data/scorecard';
import { LISTS } from '../../data/lists';
import { allProductsMap } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import ProductThumbImg from '../ui/ProductThumbImg';
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
    initialIds?.[0] ?? grouped[0]?.ids[0] ?? '',
    initialIds?.[1] ?? grouped[0]?.ids[1] ?? '',
    initialIds?.[2] ?? '',
  ]);

  useEffect(() => {
    const requested = initialIds ?? new URLSearchParams(window.location.search).getAll('product');
    const valid = [...new Set(requested)].filter((id) => Object.hasOwn(all, id));
    if (valid.length) {
      setIds([valid[0] ?? '', valid[1] ?? '', valid[2] ?? '']);
    }
  }, [all, initialIds]);

  const products = ids.filter(Boolean).map((id) => all[id]).filter(Boolean);
  const sameList = products.every((p) => p.list === products[0]?.list);
  const list = products[0] ? LISTS[products[0].list as keyof typeof LISTS] : null;
  const best = Math.max(...products.map((p) => p.total), 0);

  return (
    <div>
      <div class="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <label class="block min-w-0 text-sm font-bold" key={i}>
            Product {i + 1}
            {i === 2 ? ' (optional)' : ''}
            <select
              class="mt-1 w-full min-h-11 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3"
              value={ids[i]}
              onChange={(e) => {
                const v = (e.target as HTMLSelectElement).value;
                const next = [...ids] as [string, string, string];
                next[i] = v;
                setIds(next);
              }}
            >
              <option value="">{i === 2 ? 'None' : 'Choose a product'}</option>
              {grouped.map((g) => (
                <optgroup label={g.label} key={g.slug}>
                  {g.ids.map((id) => (
                    <option value={id} key={id} disabled={ids.some((selected, index) => index !== i && selected === id)}>
                      {all[id] ? productFullName(all[id]) : id}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        ))}
      </div>

      {products.length < 2 && (
        <p class="mt-4 text-sm text-[var(--tb-muted)]" role="status">
          Choose at least two products to see their scores and prices side by side.
        </p>
      )}
      {products.length >= 2 && (
        <div class="mt-6 space-y-4" aria-live="polite">
          {!sameList && (
            <Box class="tb-callout">
              Choose products from the same list to compare their scores for specific uses.
            </Box>
          )}
          <div class="tb-tablewrap" tabindex={0} role="region" aria-label="Product comparison">
            <table class="tb-table">
              <thead>
                <tr>
                  <th />
                  {products.map((p) => (
                    <th scope="col" key={p.id}>
                      <div class="tb-compare-product flex-col items-center sm:flex-row sm:items-start">
                        <ProductThumbImg
                          productId={p.id}
                          alt={productFullName(p)}
                          size="md"
                          className="tb-compare-product__thumb !inline-flex"
                          decorative={false}
                        />
                        <span class="tb-compare-product__copy text-left">
                          {productFullName(p)}
                          <br />
                          <small>{p.tag}</small>
                        </span>
                      </div>
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

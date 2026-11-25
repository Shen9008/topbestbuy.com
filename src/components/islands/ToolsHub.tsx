import { useEffect, useState } from 'preact/hooks';
import { CRIT } from '../../data/scorecard';
import { LISTS } from '../../data/lists';
import { RANKED } from '../../lib/catalog';
import { formatRM, productFullName } from '../../lib/format';
import { matchesFragrancePreference } from '../../lib/scoring';
import type { RankedProduct } from '../../lib/scoring';
import { TOOL_TAB_ICONS, type IconMapKey } from '../../icons';
import Icon from '../ui/Icon';

const TABS = [
  ['finder', 'Product finder'],
  ['vacuum', 'Vacuum chooser'],
  ['cleanser', 'Cleanser matcher'],
  ['airfryer', 'Air fryer size'],
  ['purifier', 'Purifier room size'],
  ['cost', 'Running cost'],
  ['mattress', 'Mattress firmness'],
] as const;

type TabId = (typeof TABS)[number][0];

export default function ToolsHub({ initialTool }: { initialTool?: string }) {
  const [tab, setTab] = useState<TabId>('finder');

  useEffect(() => {
    if (initialTool && TABS.some(([id]) => id === initialTool)) {
      setTab(initialTool as TabId);
    }
  }, [initialTool]);

  return (
    <div>
      <div class="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Tools">
        {TABS.map(([id, label]) => {
          const icon = TOOL_TAB_ICONS[id] as IconMapKey | undefined;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              class={`tb-chip inline-flex min-h-11 items-center gap-1.5 ${tab === id ? 'tb-chip-on' : ''}`}
              onClick={() => setTab(id)}
            >
              {icon ? <Icon name={icon} size={16} strokeWidth={2} /> : null}
              {label}
            </button>
          );
        })}
      </div>
      <div class="tb-card" role="tabpanel">
        {tab === 'finder' && <FinderTool />}
        {tab === 'vacuum' && <VacuumTool />}
        {tab === 'cleanser' && <CleanserTool />}
        {tab === 'airfryer' && <AirfryerTool />}
        {tab === 'purifier' && <PurifierTool />}
        {tab === 'cost' && <CostTool />}
        {tab === 'mattress' && <MattressTool />}
      </div>
    </div>
  );
}

function FinderTool() {
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState('');
  const [budget, setBudget] = useState('mid');
  const [pri, setPri] = useState('perf');
  const listKeys = Object.keys(LISTS);

  if (step < 3) {
    const steps = [
      {
        title: 'What are you shopping for?',
        options: listKeys.map((k) => [k, `Top 10: ${LISTS[k as keyof typeof LISTS].short}`]),
        onPick: (v: string) => {
          setKind(v);
          setStep(1);
        },
      },
      {
        title: 'What is your budget?',
        options: [
          ['low', 'Keep it low'],
          ['mid', 'Mid range'],
          ['high', 'Happy to pay for the best'],
        ],
        onPick: (v: string) => {
          setBudget(v);
          setStep(2);
        },
      },
      {
        title: 'What matters most?',
        options: CRIT.slice(0, 3).map((c) => [c[0], c[1]]),
        onPick: (v: string) => {
          setPri(v);
          setStep(3);
        },
      },
    ];
    const current = steps[step]!;
    return (
      <Question
        title={current.title}
        options={current.options as [string, string][]}
        onPick={current.onPick}
        onBack={step > 0 ? () => setStep(step - 1) : undefined}
      />
    );
  }

  const rows = RANKED[kind] ?? [];
  const prices = rows.map((r) => r.price).sort((a, b) => a - b);
  const lo = prices[3] ?? prices[0] ?? 0;
  const hi = prices[6] ?? prices.at(-1) ?? 0;
  const idx = CRIT.findIndex((c) => c[0] === pri);
  let pool = rows.filter((p) =>
    budget === 'low' ? p.price < lo : budget === 'mid' ? p.price >= lo && p.price <= hi : p.price > hi,
  );
  if (pool.length < 3) pool = rows;
  const pick = [...pool]
    .sort((a, b) => (b.subs[idx] ?? 0) - (a.subs[idx] ?? 0) || b.total - a.total)
    .slice(0, 3);

  return (
    <Panel>
      <p class="text-xs font-bold uppercase tracking-wide text-[var(--tb-muted)]">Your shortlist</p>
      <h2 class="mt-0 tb-h3">Three picks for you</h2>
      <ProductPickList products={pick} />
      <a href={`/${kind}`} class="tb-btn mt-3">
        See the full Top 10
      </a>
      <button type="button" class="tb-btn tb-btn-ghost tb-btn-sm mt-2" onClick={() => setStep(0)}>
        Start again
      </button>
    </Panel>
  );
}

function VacuumTool() {
  const [floor, setFloor] = useState('mixed');
  const [home, setHome] = useState('s');
  const [pets, setPets] = useState(false);
  const [stairs, setStairs] = useState(false);

  let type: 'robot' | 'cordless' | 'canister' = 'cordless';
  let why = 'Mixed floors suit a cordless stick.';
  if (floor === 'hard' && !stairs && !pets) {
    type = 'robot';
    why = 'Mostly hard floors with no stairs suit a robot for daily upkeep.';
  } else if (floor === 'carpet' || pets || stairs) {
    why = 'Carpet, pet hair or stairs favour a cordless stick.';
  }
  if (home === 'l' && floor !== 'hard' && !stairs) {
    type = 'canister';
    why = 'A large carpeted home may suit a corded canister.';
  }

  const rows = RANKED['best-vacuum-cleaners-malaysia'] ?? [];
  const matches = rows
    .filter((p) => p.num.type === type || (type === 'canister' && p.num.type === 'wetdry'))
    .sort((a, b) => (pets ? (Number(b.num.pets) || 0) - (Number(a.num.pets) || 0) : 0) || b.total - a.total)
    .slice(0, 3);

  const title = type === 'robot' ? 'Robot vacuum' : type === 'canister' ? 'Corded canister' : 'Cordless stick';

  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Vacuum type chooser</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <Select label="Main floor type" value={floor} onInput={setFloor} options={[['hard', 'Tile or laminate'], ['mixed', 'Mixed'], ['carpet', 'Carpet or rugs']]} />
        <Select label="Home size" value={home} onInput={setHome} options={[['s', 'Apartment'], ['m', 'Terrace or semi-D'], ['l', 'Large landed']]} />
        <Select label="Pets that shed?" value={pets ? 'y' : 'n'} onInput={(v) => setPets(v === 'y')} options={[['n', 'No'], ['y', 'Yes']]} />
        <Select label="Stairs?" value={stairs ? 'y' : 'n'} onInput={(v) => setStairs(v === 'y')} options={[['n', 'No'], ['y', 'Yes']]} />
      </div>
      <ResultBox title={title}>
        <p>{why}</p>
        <ProductLinks products={matches} />
      </ResultBox>
    </Panel>
  );
}

function CleanserTool() {
  const [skin, setSkin] = useState('oily');
  const [frag, setFrag] = useState('any');
  const [budget, setBudget] = useState('any');
  const rows = RANKED['best-facial-cleansers-malaysia'] ?? [];
  const matches = rows
    .filter((p) => {
      const types = (p.num.types as string[] | undefined) ?? [];
      if (!types.includes(skin)) return false;
      if (frag === 'free' && !matchesFragrancePreference(p, true)) return false;
      if (budget === 'low' && p.price >= 40) return false;
      if (budget === 'mid' && (p.price < 40 || p.price > 60)) return false;
      return true;
    })
    .slice(0, 3);

  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Facial cleanser matcher</h2>
      <Callout class="tb-callout mb-3 text-sm">General guidance only, not medical advice.</Callout>
      <div class="grid gap-3 sm:grid-cols-3">
        <Select label="Skin type" value={skin} onInput={setSkin} options={[['oily', 'Oily'], ['combination', 'Combination'], ['normal', 'Normal'], ['dry', 'Dry'], ['sensitive', 'Sensitive']]} />
        <Select label="Fragrance" value={frag} onInput={setFrag} options={[['any', 'No preference'], ['free', 'Fragrance-free only']]} />
        <Select label="Budget" value={budget} onInput={setBudget} options={[['any', 'Any'], ['low', 'Under RM 40'], ['mid', 'RM 40 to 60']]} />
      </div>
      <ResultBox title="Matches">{matches.length ? <ProductLinks products={matches} /> : <p>No match in our ten.</p>}</ResultBox>
    </Panel>
  );
}

function AirfryerTool() {
  const [people, setPeople] = useState(3);
  const [style, setStyle] = useState('1.3');
  const litres = Math.max(2, Math.ceil(Math.round(people * Number(style) * 10) / 10 + 1));
  const rows = RANKED['best-air-fryers-malaysia'] ?? [];
  const fit = rows.filter((p) => Number(p.num.cap) >= litres - 1 && Number(p.num.cap) <= litres + 4).slice(0, 3);
  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Air fryer size</h2>
      <Grid2>
        <Num label="People you cook for" value={people} onInput={setPeople} min={1} max={12} />
        <Select label="Cooking style" value={style} onInput={setStyle} options={[['1', 'Snacks'], ['1.3', 'Everyday meals'], ['1.6', 'Batch cooking']]} />
      </Grid2>
      <ResultBox title={`${litres} litres or more`}>
        <p>A rough guide is about 1 litre per person, scaled by how you cook.</p>
        <ProductLinks products={fit} />
      </ResultBox>
    </Panel>
  );
}

function PurifierTool() {
  const [l, setL] = useState(5);
  const [w, setW] = useState(4);
  const [h, setH] = useState(2.6);
  const [ach, setAch] = useState(5);
  const vol = l * w * h;
  const cadr = Math.round(vol * ach);
  const rows = RANKED['best-air-purifiers-malaysia'] ?? [];
  const fit = rows.filter((p) => Number(p.num.cadr) >= cadr).sort((a, b) => b.total - a.total).slice(0, 3);
  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Purifier room size</h2>
      <Grid2>
        <Num label="Length (m)" value={l} onInput={setL} min={1} max={20} step={0.1} />
        <Num label="Width (m)" value={w} onInput={setW} min={1} max={20} step={0.1} />
        <Num label="Ceiling height (m)" value={h} onInput={setH} min={2} max={5} step={0.1} />
        <Select label="Air changes per hour" value={String(ach)} onInput={(v) => setAch(Number(v))} options={[['4', '4 everyday'], ['5', '5 recommended'], ['6', '6 sensitive']]} />
      </Grid2>
      <ResultBox title={`${cadr} m³/h CADR needed`}>
        <p>Room volume {vol.toFixed(1)} m³ × {ach} air changes.</p>
        <ProductLinks products={fit} />
      </ResultBox>
    </Panel>
  );
}

function CostTool() {
  const [watts, setWatts] = useState(1500);
  const [hours, setHours] = useState(1);
  const [tariff, setTariff] = useState(0.5);
  const kwh = (watts * hours) / 1000 * 30;
  const cost = kwh * tariff;
  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Running cost</h2>
      <Grid3>
        <Num label="Power (watts)" value={watts} onInput={setWatts} min={5} max={5000} />
        <Num label="Hours per day" value={hours} onInput={setHours} min={0.1} max={24} step={0.1} />
        <Num label="Tariff (RM per kWh)" value={tariff} onInput={setTariff} min={0.05} max={2} step={0.01} />
      </Grid3>
      <ResultBox title={`RM ${cost.toFixed(2)} per month`}>
        <p>{kwh.toFixed(1)} kWh a month (30 days).</p>
      </ResultBox>
    </Panel>
  );
}

function MattressTool() {
  const [pos, setPos] = useState('side');
  const [weight, setWeight] = useState('m');
  const [hot, setHot] = useState(false);
  let firm = { side: 3, back: 5, stomach: 6, mixed: 5 }[pos] ?? 5;
  if (weight === 'l') firm -= 1;
  if (weight === 'h') firm += 1;
  firm = Math.max(1, Math.min(10, firm));
  const rows = RANKED['best-mattress-malaysia'] ?? [];
  const matches = rows.filter((p) => Math.abs(Number(p.num.firm) - firm) <= 1.5 && (!hot || Number(p.num.hot) >= 3)).slice(0, 3);
  return (
    <Panel>
      <h2 class="mt-0 tb-h3">Mattress firmness picker</h2>
      <Grid3>
        <Select label="Sleeping position" value={pos} onInput={setPos} options={[['side', 'Side'], ['back', 'Back'], ['stomach', 'Stomach'], ['mixed', 'Mixed']]} />
        <Select label="Body weight" value={weight} onInput={setWeight} options={[['l', 'Under 60 kg'], ['m', '60 to 90 kg'], ['h', 'Over 90 kg']]} />
        <Select label="Sleep hot?" value={hot ? 'y' : 'n'} onInput={(v) => setHot(v === 'y')} options={[['n', 'No'], ['y', 'Yes']]} />
      </Grid3>
      <ResultBox title={`${firm} / 10 firmness`}>
        <ProductLinks products={matches} />
      </ResultBox>
    </Panel>
  );
}

function ProductPickList({ products }: { products: RankedProduct[] }) {
  return (
    <div class="space-y-3">
      {products.map((p) => (
        <div class="tb-card flex flex-wrap items-center gap-3" key={p.id}>
          <span class="tb-rank">{p.rank}</span>
          <div class="min-w-[12rem] flex-1">
            <strong>{productFullName(p)}</strong>
            <br />
            <small>
              {p.tag} · {p.best}
            </small>
          </div>
          <span class="tb-num text-sm">
            {p.total.toFixed(1)}/100 · {formatRM(p.price)}
          </span>
          <a href={`/reviews/${p.id}`} class="tb-btn tb-btn-ghost tb-btn-sm">
            Review
          </a>
        </div>
      ))}
    </div>
  );
}

function ProductLinks({ products }: { products: RankedProduct[] }) {
  return (
    <p>
      {products.map((p, i) => (
        <span key={p.id}>
          {i > 0 && ', '}
          <a href={`/reviews/${p.id}`}>{productFullName(p)}</a>
        </span>
      ))}
    </p>
  );
}

function Question({
  title,
  options,
  onPick,
  onBack,
}: {
  title: string;
  options: [string, string][];
  onPick: (v: string) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      <h2 class="mt-0 tb-h3">{title}</h2>
      <div class="grid gap-2 sm:grid-cols-2">
        {options.map(([value, label]) => (
          <button
            key={value}
            type="button"
            class="min-h-14 cursor-pointer rounded-[var(--radius-sm)] border-2 border-[var(--tb-line)] bg-[var(--tb-surface)] px-3 text-left text-sm font-bold transition-colors hover:border-[var(--tb-accent)]"
            onClick={() => onPick(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {onBack && (
        <button
          type="button"
          class="tb-btn tb-btn-ghost tb-btn-sm mt-3 inline-flex min-h-11 items-center gap-1.5"
          onClick={onBack}
        >
          <Icon name="tool.back" size={16} strokeWidth={2} />
          Back
        </button>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onInput,
  options,
}: {
  label: string;
  value: string;
  onInput: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <label class="block text-sm font-bold">
      {label}
      <select
        class="mt-1 w-full min-h-10 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-bg)] px-2"
        value={value}
        onChange={(e) => onInput((e.target as HTMLSelectElement).value)}
      >
        {options.map(([v, l]) => (
          <option value={v} key={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function Num({
  label,
  value,
  onInput,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onInput: (n: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <label class="block text-sm font-bold">
      {label}
      <input
        type="number"
        class="mt-1 w-full min-h-10 rounded-lg border border-[var(--tb-line)] bg-[var(--tb-bg)] px-2"
        value={value}
        min={min}
        max={max}
        step={step}
        onInput={(e) => onInput(Number((e.target as HTMLInputElement).value))}
      />
    </label>
  );
}

function ResultBox({ title, children }: { title: string; children: preact.ComponentChildren }) {
  return (
    <ResultPanel class="col-span-full mt-3 rounded-[var(--radius-sm)] border-2 border-dashed border-[var(--tb-accent)] bg-[var(--tb-surface)] p-4">
      <h3 class="m-0 tb-h2">{title}</h3>
      <div class="text-sm">{children}</div>
    </ResultPanel>
  );
}

function Panel({ children }: { children: preact.ComponentChildren }) {
  return <div>{children}</div>;
}

function Grid2({ children }: { children: preact.ComponentChildren }) {
  return <div class="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Grid3({ children }: { children: preact.ComponentChildren }) {
  return <div class="grid gap-3 sm:grid-cols-3">{children}</div>;
}

function Callout({
  class: className,
  children,
}: {
  class?: string;
  children: preact.ComponentChildren;
}) {
  return <div class={className}>{children}</div>;
}

function ResultPanel({
  class: className,
  children,
}: {
  class?: string;
  children: preact.ComponentChildren;
}) {
  return <div class={className}>{children}</div>;
}
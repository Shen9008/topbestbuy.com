import { useState } from 'preact/hooks';

const INITIAL: Record<string, number> = {
  'Laptops for students': 44,
  'Washing machines': 38,
  'Smart TVs': 31,
  Sunscreens: 27,
  'Smart watches': 21,
  'Robot vacuums': 19,
};

export default function PollWidget() {
  const [votes, setVotes] = useState(INITIAL);
  const [picked, setPicked] = useState<string | null>(null);
  const total = Object.values(votes).reduce((a, b) => a + b, 0);

  if (picked) {
    return (
      <div class="tb-card mt-6" aria-live="polite">
        {Object.entries(votes)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n]) => (
            <div class="mb-2 grid grid-cols-[1fr_2fr_auto] items-center gap-3 text-sm" key={k}>
              <span>
                {k}
                {picked === k ? ' (your vote)' : ''}
              </span>
              <span class="h-2 overflow-hidden rounded-full bg-[var(--tb-line)]">
                <i
                  class="block h-full bg-[var(--tb-accent)]"
                  style={{ width: `${(n / total) * 100}%` }}
                />
              </span>
              <span class="tb-num">{Math.round((n / total) * 100)}%</span>
            </div>
          ))}
        <p class="mt-4 text-sm text-[var(--tb-muted)]">Thanks. We use this to plan the queue.</p>
      </div>
    );
  }

  return (
    <div class="tb-card mt-6 space-y-2">
      {Object.keys(votes).map((k) => (
        <button
          key={k}
          type="button"
          class="tb-btn tb-btn-ghost w-full justify-start text-left"
          onClick={() => {
            setPicked(k);
            setVotes((v) => ({ ...v, [k]: v[k]! + 1 }));
          }}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
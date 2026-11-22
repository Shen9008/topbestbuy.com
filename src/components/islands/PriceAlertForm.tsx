import { useState } from 'preact/hooks';

export default function PriceAlertForm({ listKey }: { listKey: string }) {
  const [msg, setMsg] = useState('');

  return (
    <form
      class="tb-card"
      aria-label="Price alert"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg('Saved for the demo. Nothing was sent or stored.');
      }}
    >
      <h3 class="mt-0 font-display text-lg font-bold">Get a price-drop note</h3>
      <p class="text-sm text-[var(--tb-muted)]">
        Demo only: nothing is sent or stored.
      </p>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="block text-sm font-bold">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            class="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3 py-2"
          />
        </label>
        <label class="block text-sm font-bold">
          Target price (RM)
          <input
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="e.g. 450"
            class="mt-1 w-full rounded-[var(--radius-sm)] border border-[var(--tb-line)] bg-[var(--tb-bg)] px-3 py-2"
          />
        </label>
      </div>
      <button type="submit" class="tb-btn mt-3">
        Notify me
      </button>
      {msg && (
        <p class="mt-2 text-sm text-[var(--color-good)]" role="status">
          {msg}
        </p>
      )}
      <input type="hidden" name="list" value={listKey} />
    </form>
  );
}
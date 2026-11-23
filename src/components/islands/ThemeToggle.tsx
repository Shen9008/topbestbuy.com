import { useEffect, useState } from 'preact/hooks';
import Icon from '../ui/Icon';

type Theme = 'dark' | 'light';

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const stored = localStorage.getItem('tb-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('tb-theme', theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--tb-line)] bg-[var(--tb-surface)] px-3 py-1.5 text-sm font-medium text-[var(--tb-ink)] transition-colors hover:border-[var(--tb-accent)]"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon
        name={theme === 'dark' ? 'sun' : 'moon'}
        size={18}
        strokeWidth={2}
      />
      <span class="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
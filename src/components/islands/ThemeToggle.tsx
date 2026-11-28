import { useEffect, useState } from 'preact/hooks';
import Icon from '../ui/Icon';

type Theme = 'dark' | 'light';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem('tb-theme', next);
    } catch {
      /* Honor the toggle even when storage is unavailable. */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      class="tb-icon-slot tb-icon-slot--hover inline-flex min-h-11 cursor-pointer items-center gap-2 px-3 py-1.5 text-sm font-medium"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon
        name={theme === 'dark' ? 'state.theme-light' : 'state.theme-dark'}
        size={20}
        strokeWidth={2}
      />
      <span class="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

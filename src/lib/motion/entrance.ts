import { waapi } from 'animejs/waapi';
import { stagger } from 'animejs/utils';

const MOTION_PREFERENCE = '(prefers-reduced-motion: reduce)';

export function playEntrance(
  targets: HTMLElement | HTMLElement[],
  { x = 0, y = 8, duration = 200, fade = false, staggered = false } = {},
) {
  const [first] = Array.isArray(targets) ? targets : [targets];
  if (!first?.animate) return;
  const preference = window.matchMedia(MOTION_PREFERENCE);
  if (preference.matches) return;

  let stopped = false;
  const stop = () => {
    if (stopped) return;
    stopped = true;
    preference.removeEventListener('change', onPreferenceChange);
    animation.revert();
  };
  const onPreferenceChange = () => {
    if (preference.matches) stop();
  };
  const animation = waapi.animate(targets, {
    transform: [`translate(${x}px, ${y}px)`, 'none'],
    ...(fade ? { opacity: [0.72, 1] } : {}),
    duration,
    delay: staggered ? stagger(30) : 0,
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    onComplete: stop,
  });
  preference.addEventListener('change', onPreferenceChange);
  return stop;
}

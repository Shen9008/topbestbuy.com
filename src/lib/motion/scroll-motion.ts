/**
 * Scroll-triggered entrance motion (progressive enhancement).
 * Animates transform + opacity only; respects prefers-reduced-motion.
 */

const REVEAL_SEL =
  '.tb-reveal, .tb-reveal-stagger, [data-tb-motion], .tb-motion-card';
const PARALLAX_SEL = '[data-tb-parallax]';

const IO_OPTS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: '0px 0px -6% 0px',
};

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function markVisible(el: Element, observer: IntersectionObserver) {
  el.classList.add('tb-motion-visible');
  observer.unobserve(el);
}

export function initScrollMotion(): void {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;

  const root = document.documentElement;
  root.classList.add('tb-motion-ready', 'tb-scroll-smooth');

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) markVisible(entry.target, observer);
    }
  }, IO_OPTS);

  document.querySelectorAll(REVEAL_SEL).forEach((el) => {
    if (el.closest('.tb-reveal-stagger') && !el.classList.contains('tb-reveal-stagger')) return;
    observer.observe(el);
  });

  const parallaxEls = document.querySelectorAll<HTMLElement>(PARALLAX_SEL);
  if (parallaxEls.length) initParallax(parallaxEls);
}

function initParallax(els: NodeListOf<HTMLElement>): void {
  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      const offset = (rect.top + rect.height * 0.35 - vh * 0.5) * 0.035;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}
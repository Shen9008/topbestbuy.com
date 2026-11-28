import { playEntrance } from './entrance';

export function initScrollMotion(): void {
  const main = document.querySelector('main');
  if (!main) return;

  const sectionSelector = 'main > header, main > section, .tb-page-bands > section, .tb-editorial-main > section';
  const sections = Array.from(main.querySelectorAll(sectionSelector)).filter(
    (section) => !section.querySelector(sectionSelector),
  );
  const washes = (sections.length ? sections : [main]).map((section) => {
    const wash = document.createElement('div');
    wash.className = 'tb-atmosphere__wash';
    wash.setAttribute('aria-hidden', 'true');
    section.classList.add('tb-atmosphere');
    section.prepend(wash);
    return wash;
  });

  if (!('IntersectionObserver' in window)) return;

  const artworkSelector = '.tb-hero__media';
  const cardSelector = '.tb-reveal-stagger > *';
  const headingSelector = '.tb-reveal > .tb-section__inner > .tb-section__bar';
  const observer = new IntersectionObserver((entries) => {
    const cardsByGroup = new Map<HTMLElement, HTMLElement[]>();

    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target as HTMLElement;
      observer.unobserve(target);
      if (target.classList.contains('tb-atmosphere__wash')) {
        target.classList.add('tb-atmosphere__wash--entered');
      } else if (target.matches(cardSelector)) {
        const group = target.parentElement!;
        const cards = cardsByGroup.get(group) ?? [];
        cards.push(target);
        cardsByGroup.set(group, cards);
      } else if (target.matches(artworkSelector)) {
        playEntrance(target, { y: 14, duration: 360, fade: true });
      } else {
        playEntrance(target, { y: 6, duration: 240 });
      }
    }

    for (const [group, cards] of cardsByGroup) {
      const visibleCards = Array.from(group.children)
        .filter((card): card is HTMLElement => cards.includes(card as HTMLElement))
        .slice(0, 6);
      playEntrance(visibleCards, { duration: 260, staggered: true });
    }
  }, { threshold: 0.1 });

  washes.forEach((wash) => observer.observe(wash));
  document.querySelectorAll(`${artworkSelector}, ${cardSelector}, ${headingSelector}`).forEach(
    (target) => observer.observe(target),
  );
}

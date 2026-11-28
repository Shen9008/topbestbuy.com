import { playEntrance } from './entrance';

export function initScrollMotion(): void {
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
      if (target.matches(cardSelector)) {
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

  document.querySelectorAll(`${artworkSelector}, ${cardSelector}, ${headingSelector}`).forEach(
    (target) => observer.observe(target),
  );
}

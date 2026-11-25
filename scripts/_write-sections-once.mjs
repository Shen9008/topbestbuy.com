import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'src/components/sections');
fs.mkdirSync(dir, { recursive: true });

const files = {
  'HomeValueProps.astro': `---
import Icon from '../ui/Icon.astro';
import SectionHeader from './SectionHeader.astro';
import type { IconMapKey } from '../../icons';

const items: { step: string; icon: IconMapKey; title: string; copy: string }[] = [
  { step: '01', icon: 'tool.finder', title: 'Pick in 30 seconds', copy: 'Top 3 summary, then ten scored picks.' },
  { step: '02', icon: 'trust.scorecard', title: 'Know the trade-offs', copy: 'Every pick lists what it does badly.' },
  { step: '03', icon: 'trust.dated', title: 'Built for Malaysia', copy: 'MYR prices, local warranty notes, local retailers.' },
];
---

<section class="tb-section" aria-labelledby="home-value-heading">
  <SectionHeader
    titleId="home-value-heading"
    align="center"
    eyebrow="Why TopBestBuy"
    title="Research you can scan in a minute"
    description="No hype — scored lists, dated prices, and the downsides we found."
  />
  <div class="tb-feature-grid tb-reveal-stagger mt-8">
    {
      items.map((item) => (
        <article class="tb-value-card">
          <div class="tb-value-card__head">
            <span class="tb-value-card__step">{item.step}</span>
            <span class="tb-value-card__icon" aria-hidden="true">
              <Icon name={item.icon} size={20} strokeWidth={2} />
            </span>
          </div>
          <h3 class="m-0 font-display text-base font-bold">{item.title}</h3>
          <p class="m-0 text-sm leading-relaxed text-[var(--tb-muted)]">{item.copy}</p>
        </article>
      ))
    }
  </div>
</section>
`,
  'HomeTrustStrip.astro': `---
import Icon from '../ui/Icon.astro';
import type { IconMapKey } from '../../icons';

const items: { key: IconMapKey; label: string; href: string }[] = [
  { key: 'trust.no-paid', label: 'No paid rankings', href: '/editorial-policy' },
  { key: 'trust.dated', label: 'Dated prices and sources', href: '/how-we-rank' },
  { key: 'trust.scorecard', label: 'Scorecard published', href: '/how-we-rank' },
  { key: 'trust.log', label: 'Corrections log', href: '/corrections' },
];
---

<section class="tb-trust-strip" aria-label="Editorial independence">
  <div class="tb-trust-strip__grid tb-reveal-stagger">
    {
      items.map((item) => (
        <a href={item.href} class="tb-trust-pill no-underline">
          <span class="tb-trust-pill__icon" aria-hidden="true">
            <Icon name={item.key} size={20} strokeWidth={2} />
          </span>
          <span>{item.label}</span>
        </a>
      ))
    }
  </div>
</section>
`,
  'HomeBrowseSection.astro': `---
import Icon from '../ui/Icon.astro';
import SectionHeader from './SectionHeader.astro';
import { CATS } from '../../data/categories';
import { LISTS } from '../../data/lists';
import { RANKED, listSlugs } from '../../lib/catalog';
import { productFullName } from '../../lib/format';
import { CATEGORY_ICONS, LIST_SLUG_ICONS, type IconMapKey } from '../../icons';
---

<section class="tb-section" aria-labelledby="home-browse-heading">
  <SectionHeader titleId="home-browse-heading" eyebrow="Browse" title="What are you shopping for?" />
  <div class="mt-4 flex flex-wrap gap-2">
    {
      CATS.map((c) => {
        const icon = CATEGORY_ICONS[c.id] as IconMapKey | undefined;
        return (
          <a href={\`/category/\${c.id}\`} class="tb-chip inline-flex items-center gap-1.5">
            {icon ? <Icon name={icon} size={20} /> : null}
            {c.name}
            {c.lists.length ? \` (\${c.lists.length})\` : ''}
          </a>
        );
      })
    }
  </div>
  <SectionHeader
    class="mt-12"
    titleId="home-lists-heading"
    title="Start with a list"
    description="Every card opens a dated Top 10 with sources and trade-offs."
  />
  <div class="tb-studio-grid tb-reveal-stagger mt-6">
    {
      listSlugs().map((slug) => {
        const L = LISTS[slug as keyof typeof LISTS];
        const p = RANKED[slug]?.[0];
        const icon = LIST_SLUG_ICONS[slug];
        return (
          <a href={\`/\${slug}\`} class="tb-tile tb-studio-tile">
            <span class="tb-pill">{CATS.find((c) => c.id === L.cat)?.name}</span>
            <div class="tb-studio-tile__head">
              {icon ? (
                <span class="tb-icon-slot tb-icon-slot-pad-16 shrink-0" aria-hidden="true">
                  <Icon name={icon} size={20} />
                </span>
              ) : null}
              <h3 class="m-0 font-display text-lg font-bold leading-snug">{L.short}: Top 10 in Malaysia</h3>
            </div>
            {
              p && (
                <p class="tb-tile__score m-0 mt-auto text-sm text-[var(--tb-muted)]">
                  #1 {productFullName(p)}{' '}
                  <span class="tb-num font-semibold text-[var(--tb-ink)]">({p.total.toFixed(1)}/100)</span>
                </p>
              )
            }
          </a>
        );
      })
    }
  </div>
</section>
`,
  'HomeToolsStrip.astro': `---
import Icon from '../ui/Icon.astro';
import SectionHeader from './SectionHeader.astro';
import { TOOL_TAB_ICONS, type IconMapKey } from '../../icons';

const tools: [string, string, string][] = [
  ['finder', 'Product finder', 'Three questions, three picks.'],
  ['vacuum', 'Vacuum type chooser', 'Robot, cordless or corded.'],
  ['cleanser', 'Cleanser matcher', 'Filter by skin type.'],
  ['purifier', 'Purifier room size', 'The CADR your room needs.'],
];
---

<section class="tb-section tb-section--band" aria-labelledby="home-tools-heading">
  <SectionHeader
    titleId="home-tools-heading"
    align="center"
    eyebrow="Tools"
    title="Narrow it down in a minute"
    description="Short calculators and choosers — estimates only; verify before you buy."
  />
  <div class="tb-utility-grid tb-reveal-stagger mt-8">
    {
      tools.map(([tool, title, desc]) => {
        const icon = TOOL_TAB_ICONS[tool] as IconMapKey | undefined;
        return (
          <a href={\`/tools?tool=\${tool}\`} class="tb-tile tb-utility-tile">
            <div class="tb-utility-tile__icon" aria-hidden="true">
              {icon ? <Icon name={icon} size={20} strokeWidth={2} /> : null}
            </div>
            <div>
              <h3 class="m-0 font-display text-base font-bold">{title}</h3>
              <p class="m-0 mt-1 text-sm text-[var(--tb-muted)]">{desc}</p>
            </div>
            <span class="tb-utility-tile__cta text-xs font-bold text-[var(--tb-accent)]">Open tool →</span>
          </a>
        );
      })
    }
  </div>
  <p class="mt-6 text-center text-sm">
    <a href="/tools" class="font-semibold text-[var(--tb-accent)]">See all buying tools</a>
  </p>
</section>
`,
  'HomeGuidesSection.astro': `---
import SectionHeader from './SectionHeader.astro';
import { POSTS } from '../../data/posts';

const postIds = [
  'blog-is-an-air-fryer-worth-it',
  'blog-mattress-firmness-for-back-pain',
  'blog-do-you-need-an-ionizer',
];
---

<section class="tb-section" aria-labelledby="home-guides-heading">
  <SectionHeader
    titleId="home-guides-heading"
    title="Guides and explainers"
    description="Longer reads when you need context before you open a list."
  />
  <div class="tb-feature-grid tb-reveal-stagger mt-6">
    {
      postIds.map((id) => {
        const p = POSTS[id as keyof typeof POSTS];
        return (
          <a href={\`/guides/\${id.replace(/^blog-/, '')}\`} class="tb-tile tb-guide-tile">
            <span class="tb-pill">{p.type}</span>
            <h3 class="m-0 font-display text-base font-bold leading-snug">{p.h1}</h3>
            <p class="m-0 mt-auto flex items-center gap-2 text-xs text-[var(--tb-muted)]">
              <span class="tb-guide-tile__dot" aria-hidden="true" />
              {p.time} read
            </p>
          </a>
        );
      })
    }
  </div>
</section>
`,
};

for (const [name, body] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), body.replace(/^\uFEFF/, ''), 'utf8');
}

console.log('wrote', Object.keys(files).length, 'section components');
# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** TopBestBuy.online
**Guidelines:** Brand Guidelines v1.0 (November 2026)
**Category:** Editorial product rankings (Malaysia)

---

## Brand identity (approved)

| Element | Rule |
|---------|------|
| Mark | Shopping bag + orange checkmark; favicons and compact nav |
| Wordmark | `TopBestBuy` navy + `.online` orange; light lockup in header/footer |
| Clear space | ≥ height of capital **T** around the lockup |
| Nav height | Logo ~36–44 px tall on desktop |
| Don’t | Stretch, rotate, arbitrary recolour, drop shadows, gradients on logo |

**Repo assets:** `public/brand/logo-mark.png`, `logo-wordmark-light.png`, `public/favicon.svg`.

## Global Rules

### Color Palette

| Token | Hex | Use |
|-------|-----|-----|
| Primary navy | `#061D32` | Headings, primary buttons, `--color-brand-navy` |
| Accent orange | `#FF7900` | Rank highlights, selected states |
| White | `#FFFFFF` | Cards, surfaces |
| Off-white | `#F7F9FB` | Page background |
| Slate grey | `#526273` | Supporting copy |
| Border grey | `#E2E8EE` | Dividers, inputs |

**Allocation target:** ~65% neutrals, 25% navy, 10% orange.

### Typography

- **Typeface:** Inter (400 body, 600–700 headings)
- **Loaded via:** `@fontsource/inter` in `src/styles/fonts.css`
- **Tabular figures:** prices and scores

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #CA8A04;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #1C1917;
  border: 2px solid #1C1917;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAFAF9;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #1C1917;
  outline: none;
  box-shadow: 0 0 0 3px #1C191720;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Editorial-first rankings site (light default)

**Keywords:** Trust, clarity, comparison tables, restrained accent, mobile-first

**Best For:** Top 10 lists, methodology pages, product cards with scores

### Page Pattern

**Pattern Name:** Product Review/Ratings Focused

- **Conversion Strategy:** User-generated content builds trust. Show verified purchases. Filter by rating. Respond to negative reviews.
- **CTA Placement:** After reviews summary + Buy button alongside reviews
- **Section Order:** 1. Hero (product + aggregate rating), 2. Rating breakdown, 3. Individual reviews, 4. Buy/CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Off-brand logo treatment (see Brand identity)
- ❌ Multiple competing orange CTAs in one viewport
- ❌ Poor data viz / missing price currency and date

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile

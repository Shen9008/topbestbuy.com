# CURSOR PROMPT: Neon lime accent colour system for topbestbuy.online

This replaces the orange accent in the earlier prompts (main build prompt, icon prompt, 21st.dev redesign prompt). Everything else in those prompts still applies. Use the skills **frontend-design**, **impeccable** and **ui-ux-pro-max**, and name the skill when you apply one of its rules.

---

## 1. The decision

Brand palette: **dark and white neutrals plus one neon accent: electric lime.** Lime suggests value and savings, stands out from the blue and orange used by most review and affiliate sites, and matches the dark, near-monochrome fora.so look we are following.

Replace every orange accent (`#FF7A3D` family) from the mockup and earlier prompts with the tokens below. Search the codebase for the old orange values and for any raw hex colours inside components, and move them all to tokens.

---

## 2. Design tokens (single source of truth)

Define these as CSS variables in `src/styles/tokens.css` and map them into Tailwind v4 theme tokens. Components must use semantic names only, never raw hex.

### Dark theme (default)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#141414` | page background |
| `--surface` | `#1c1c1c` | cards |
| `--surface-2` | `#232323` | raised or hovered surfaces, inputs |
| `--border` | `#2a2a2a` | hairline borders |
| `--border-strong` | `#3a3a3a` | hover borders, dividers on emphasis |
| `--text` | `#e6e6e6` | body text |
| `--text-strong` | `#ffffff` | headings |
| `--text-muted` | `#b4b4b4` | secondary text (verify contrast) |
| `--accent` | `#C6FF3D` | neon lime: CTA fill, lines, rank, focus |
| `--accent-hover` | `#D4FF6B` | CTA hover (slightly lighter) |
| `--accent-press` | `#B3EB2E` | CTA pressed |
| `--on-accent` | `#141414` | text and icons placed on a lime fill |
| `--accent-soft` | `rgba(198,255,61,0.12)` | tinted backgrounds, badges, selected rows |
| `--accent-line` | `rgba(198,255,61,0.35)` | subtle lime hairlines and glows |
| `--glow` | `0 0 0 1px var(--accent-line), 0 8px 32px rgba(198,255,61,0.18)` | hover glow on the primary CTA only |

### Light theme (a proper design, not an inversion)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | page background |
| `--surface` | `#f6f6f4` | cards |
| `--surface-2` | `#ececea` | raised or hovered surfaces |
| `--border` | `#e2e2de` | hairline borders |
| `--text` | `#1a1a1a` | body text |
| `--text-muted` | `#5c5c57` | secondary text |
| `--accent` | `#C6FF3D` | **fills only**, always with dark text on top |
| `--accent-ink` | `#4D7C0F` | lime-family colour for **text, links, thin lines and icons on white** |
| `--on-accent` | `#141414` | text on a lime fill |
| `--accent-soft` | `rgba(77,124,15,0.10)` | tinted backgrounds |

**Hard rule:** never place neon lime `#C6FF3D` as text, a link, a thin line or an icon on a white or light surface. On white use `--accent-ink` (`#4D7C0F`). Introduce a semantic token `--accent-fg` that resolves to `--accent` in dark mode and `--accent-ink` in light mode, and use it for any lime-coloured text, links, icons, borders and score bars.

### Contrast reference (my own calculation with the WCAG formula; re-verify in the browser)

- `#C6FF3D` on `#141414`: about 15.6:1. On `#1c1c1c`: about 14.4:1.
- `#141414` on a `#C6FF3D` fill (button text): about 15:1.
- `#C6FF3D` on white: about 1.2:1, so it fails as text or a thin line on light surfaces.
- `#4D7C0F` on white: about 5:1, passes AA for normal text.
- `#4D7C0F` on `#141414`: about 3.7:1, so do not use it as small text on dark.

Add an automated contrast test over every foreground and background token pair (both themes) that fails the build below 4.5:1 for text and 3:1 for icons, borders carrying meaning and focus rings.

---

## 3. Where lime goes (and where it does not)

Use lime for **one job per screen: the thing we want the user to click or notice.** Allowed uses:

1. **Primary CTA button** ("Check price", "Compare", "Search", "See the top 10"): lime fill, `--on-accent` text, 12px radius or full pill to match the design system. Hover: `--accent-hover` and the `--glow` shadow. Pressed: `--accent-press` and scale 0.97. Disabled: `--surface-2` with `--text-muted`.
2. **Secondary button:** white pill on dark, dark pill on light, or a ghost button with a `--border-strong` outline. Never two lime buttons competing in the same viewport.
3. **Rank numeral and "Best overall" / "Best value" badges:** `--accent-soft` fill with `--accent-fg` text and an `--accent-line` border.
4. **Score bars and score rings:** lime fill on a `--border` track. Always show the numeric score as text next to it (do not rely on colour alone).
5. **Lines:** the active-tab underline, active nav indicator on the rail and tab bar, the sticky jumpbar active chip, section dividers on hover, and thin accent rules on hero and card edges. Use `--accent-line` (35% lime) for decorative lines and full `--accent-fg` only for active states.
6. **Focus ring:** 2px `--accent-fg` ring with a 2px offset on every interactive element, visible on both themes.
7. **Links in article text:** `--accent-fg` with an underline (underline stays, so links are not colour-only).
8. **Selection and caret:** `::selection` as `--accent-soft` with `--text-strong`; `caret-color: var(--accent-fg)`.

Not allowed:
- Lime as body text, as large background blocks or full-width bands, as card backgrounds, or behind long text.
- More than one lime fill button per viewport, or a lime element in every card.
- Lime gradients, rainbow gradients, or neon on neon. A single very faint radial lime glow behind the hero (max 8% opacity) is the only gradient allowed.
- Using lime to mean "success" in tools or forms. Keep semantic states separate (section 4).

---

## 4. Semantic state colours (kept apart from the brand accent)

So users never confuse "brand" with "good" or "bad", define these separately, each with an icon and text label, never colour alone:

| Token | Dark | Light | Use |
|---|---|---|---|
| `--success` | `#4ADE80` | `#15803D` | confirmations, "In stock" |
| `--warning` | `#FBBF24` | `#B45309` | "Limited evidence", "Verify price", "Estimate" |
| `--danger` | `#F87171` | `#B91C1C` | errors, cons |
| `--info` | `#60A5FA` | `#1D4ED8` | neutral notes |

Because lime and green are close, make the success colour visibly different (use a check icon and the word "Success" or "Saved") and keep the lime accent out of validation messages. Verify each pair meets 4.5:1 on its background in both themes.

The "Limited evidence" pill and the "Prices as reported, verify" pill must use `--warning` styling, not lime, so cautionary content never looks promotional.

---

## 5. Component-level rules

- **Product card:** card stays `--surface` with a `--border` hairline. On hover the border moves to `--accent-line`. The rank numeral is lime. The "Check price" CTA is the only lime fill in the card. Pros use a `--success` check icon, cons use a `--danger` minus icon.
- **Compare table:** the best value in each row gets an `--accent-soft` cell background plus a small text label ("Best"), not lime text alone.
- **Navigation rail and tab bar:** inactive icons are `--text-muted`; the active item gets `--accent-fg` icon and label plus a 2px lime indicator.
- **Charts and score visuals:** one lime series, other series in neutral greys. Add direct labels and values so charts work without colour.
- **Inputs:** focus state is a lime ring; error state is `--danger` with message text under the field.
- **Skeletons and loading:** neutral greys with a subtle shimmer; a lime progress bar only for page-level progress.
- **Badges for categories:** neutral `--surface-2` with `--text`; do not tint every category lime.
- **Hero:** a single faint lime radial glow (max 8% opacity, no blur filters that hurt performance) and one lime CTA.
- **Images and placeholders:** neutral. The `ImageSlot` placeholder must not use lime.
- **Affiliate disclosure and compliance notes:** neutral, never lime, so they read as information and not as promotion.

---

## 6. Motion on the accent

- Hover and press transitions on colour, border and shadow: 150–200ms ease-out; scale press 0.97.
- Optional single lime "sweep" or border-beam effect on the hero CTA or one featured card, max one per page, and disabled under `prefers-reduced-motion`.
- No pulsing, flashing or looping neon animation anywhere.

---

## 7. Implementation steps

1. Add `tokens.css` with the dark and light tables above, plus `color-scheme` and `prefers-color-scheme` handling and a manual theme toggle that persists (local storage inside try/catch).
2. Map tokens into Tailwind v4 (`@theme`) so utilities like `bg-accent`, `text-accent-fg`, `border-accent-line`, `text-on-accent` exist. Remove default palette colours that are not used.
3. Codemod: find and replace the old orange values and any raw hex or `rgb()` in components with tokens. Report what you replaced.
4. Update the shadcn/21st.dev components already installed so their `primary` token maps to `--accent` with `--on-accent` foreground, and `ring` maps to `--accent-fg`.
5. Update the icon system so icons use `currentColor` and take `--accent-fg` only for active or emphasised states.
6. Update `DESIGN.md` with the palette, usage rules and the do/don't list from section 3.
7. Add a `/dev/colors` page (`noindex`, excluded from the sitemap) that shows every token swatch in both themes, each pair's contrast ratio, and live examples of every button state, badge, link and focus ring.

---

## 8. Quality gates

- Contrast test for all token pairs passes in both themes (text 4.5:1, icons and meaningful borders 3:1).
- axe-core: no colour-contrast violations on home, a list page, a review page, the compare view and a tool.
- Visual check at 360, 768 and 1440 px in both themes: exactly one lime fill CTA per viewport, no lime body text, no neon on white.
- Screenshot review on a real phone screen. Neon lime can look different on OLED and LCD displays, so show me before and after screenshots, and if it feels too yellow or too green, propose a hue adjustment within `#B8F23A` to `#C6FF3D` and let me decide.
- Grayscale test: the page must still communicate rank, best picks, warnings and active states with colour removed (icons, labels, weight and position carry the meaning).
- Print and forced-colours modes still readable (`forced-colors` media query keeps focus rings and borders).

---

## 9. Process

Phase 1: audit current colour use and post a short report (where orange and raw colours appear). Phase 2: implement tokens and the `/dev/colors` page and post screenshots for my approval. Phase 3: roll the tokens through all components and pages. Phase 4: run the quality gates and report results. If a contrast pair fails, adjust the token and tell me what changed instead of silently shipping it.

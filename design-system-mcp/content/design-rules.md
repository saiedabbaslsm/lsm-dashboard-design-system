# Design rules

The Figma "unified AI design system" and the `@lsm/design-system` package are the source of truth. These rules keep every dashboard on-system.

## Tokens (non-negotiable)
- **Never hardcode a hex color, font size, line-height, or radius.** Use a CSS variable (`var(--color-*)`) or a type class (`.text-*`).
- Colors are themed: light by default, dark under `[data-theme="dark"]`. Anything built from tokens re-themes for free.
- If no token fits a value you need, stop and flag it — don't invent a raw value.

## Typography
- Use the M3 type classes: `.text-display-*`, `.text-headline-*`, `.text-title-*`, `.text-body-*`, `.text-label-*`, each with an `-emphasized` variant for heavier weight.
- Big metric numbers: `text-display-small-emphasized`. Labels: `text-title-small` or `text-label-large`. Body/captions: `text-body-medium` / `text-body-small`.

## Color usage
- Primary (gold) is the brand accent — **one primary action per view**; everything else is secondary/outlined/text.
- Positive trend = `--color-success` (green), negative = `--color-error` (red), neutral = `--color-on-surface-variant`.
- Cards: `--color-surface-container-lowest` background with a `--color-outline-variant` border (needed so cards separate from the page in dark mode).
- The gold bold surface (`--color-primary-fixed`) is for a single hero/emphasis element, not for every card.
- For subtle neutral greys, derive them from existing tokens using opacity or `color-mix()` (for example, mixing `--color-on-surface` into a surface token). Do not introduce raw grey hex values.
- Table/header emphasis can use a very light gold tint made from `--color-primary` mixed into a surface token; keep it subtle so gold still reads as the single accent.

## Colour balance — 60/30/10 (per screenful)
Balance colour by what's visible on an **average screen** (a ~1-viewport fold), NOT the whole scrollable dashboard — re-balance each fold as the user scrolls:
- **~60% neutral base** — page surface, whitespace, body text.
- **~30% neutral surfaces** — the cards, panels, and tables (white / surface-container).
- **~10% gold accent** — used deliberately: ONE hero card (`KpiCard tone="brand"` gold, or `tone="gradient"`), the primary button, and the odd key highlight. **Don't tone every card** — if gold creeps past ~10% it stops reading as the accent.
- Semantic status colours (`--color-success` green / `--color-error` red for up/down trends) are **functional and separate** from this balance — they don't count as "the 10%".
- **Toned cards use dark charts** (the chart + text follow the surface so they stay legible); green/red charts stay on neutral cards. Never put a green chart on a gold card.

This is how a dashboard gets colour without going bland OR garish: mostly neutral, one gold moment per screen.

## Gold surfaces always take dark text
A gold surface pairs with **`--color-on-primary-fixed` (`#111`, the same in both modes)** — never `--color-on-surface`.

- Use the utility classes: **`ds-surface-brand`** (gold) or **`ds-surface-gradient`** (gold gradient). They set the background, pin the text, and expose `--ds-on` / `--ds-on-muted` for children. `KpiCard tone="brand"` does this for you.
- **Why this bites:** `--color-on-surface` is near-black in light mode, so a gold card styled with it *looks correct* — then it flips to cream in dark mode and the text vanishes. **The bug is invisible until you toggle the theme.**
- So: after building any toned/hero surface, **switch to dark mode and actually look at it.**
- Same rule for anything sitting on gold: icons, deltas, and dividers all take `--ds-on` / `--ds-on-muted`, not the neutral on-surface tokens.

## Control height & padding (the most-repeated mistake)
**Never size an inline control with vertical padding.** Writing `padding: 3px 8px` on a pill is what makes it look cramped, and it is the single most common thing that goes wrong. Every control in this system sets an **explicit height, zero vertical padding, and centres with flex**:

```css
display: inline-flex; align-items: center; gap: 7px;
height: 28px;          /* explicit */
padding: 0 12px;       /* horizontal ONLY — never a vertical value */
```

Heights to match (these are what the real components use):

| Control | Height | Padding |
|---|---|---|
| Badge / status pill | 28px | `0 12px` |
| Chip (clickable) | 32px | `0 14px` |
| Button sm / md / lg | 32 / 40 / 48px | `0 16px` / `0 24px` / `0 32px` |
| Text field | 52px | `0 16px` |

- A metadata pill ("Owner: …", "Linked risk: R43") is a **`Badge`** — use `<Badge icon={…}>`, don't hand-roll it. Hand-rolling is what produces the tight padding.
- If you must hand-roll something inline, copy the block above verbatim and set the height from the table.
- Same idea for cards/panels: **16–24px of internal padding**, never less than 12px. When in doubt, more air.

## Status colours & badges (RAG)
Statuses have **real tokens**. Never invent a status colour, and never hand-roll a status pill.
- Use the **`Badge`** component: `tone="danger"` (red) · `"warning"` (amber) · `"success"` (green) · `"info"` (blue) · `"neutral"` (round-table / N/A).
- Tokens: `--color-error`, `--color-warning`, `--color-success`, `--color-info` — each with `on*`, `*Container`, `on*Container`.
- **Amber is `--color-warning` (a burnt orange), NOT brand gold.** Gold is the 10% accent; if amber matched it, every amber row would read as a hero highlight. Keep status and brand visually separate.
- **Status badges have NO border.** A border reads as "clickable". Recipe: soft tinted fill + a saturated dot + dark label text. A bordered, faint status pill is the classic tell of a hand-rolled one.
- **Badge (inert status) vs Chip (clickable control)** — Chip has a border and a pointer cursor because it *does* something. Don't use a Chip to show a status.
- Status colours are functional; like trend green/red they are **exempt** from the 60/30/10 balance above.

## Icons (Lucide — always include them)
- The system uses **Lucide** icons. Never mix icon families, and don't skip icons — they're part of the look.
- **KPI cards MUST have a top-right icon** relevant to the metric: revenue → `dollar-sign` or `wallet`; ROAS / growth → `trending-up`; CAC / cost → `user-plus` or `wallet`; conversion → `target` or `percent`; users → `users`; orders → `shopping-cart`.
- **On the web / in an HTML report** (this is the common case), load Lucide from a CDN and use its markup:
  ```html
  <script src="https://unpkg.com/lucide@latest"></script>
  <!-- place an icon: -->
  <i data-lucide="trending-up"></i>
  <!-- once, after the DOM is built: -->
  <script>lucide.createIcons();</script>
  ```
  **Pin the size — `lucide.createIcons()` emits `24x24` by default**, so icons render inconsistently (mismatched check/✕ icons in a list are the classic symptom). Always ship this rule:
  ```css
  svg.lucide { width: 16px; height: 16px; flex: none; stroke-width: 2; vertical-align: middle; }
  ```
  Then override per context (KPI card icons 18px). **Every icon in the same list must be the same size** — set it in CSS, not per-icon, so they can't drift. Icons inherit `currentColor`, so set the container's `color` to a token (usually `var(--color-on-surface-variant)`; on a gold surface, `--ds-on-muted`).
- **An icon wrapper inside a flex row needs `flex: none`.** Without it the label shrinks the icon horizontally: it renders *squashed* (roughly half width) rather than smaller, which is easy to misread as "the icon is too small". Any `icon + label` row — buttons, pills, list items — needs it.
- **In a React app:** use `lucide-react` and pass the icon via the component's `icon` / `leadingIcon` prop.

## Charts & data-viz
- **Single-series trend** (one metric over time, and KPI-card sparklines): a thin line with a **soft area fill** (~12% of the line colour) underneath.
- **Multi-series** (e.g. actual vs target, channel comparisons): **plain lines only — NO area fill.** Tell series apart by colour and by making the secondary/target line **dashed**, with a small legend. Shading a multi-line chart is wrong; the area fill is reserved for single-series charts. (The `LineChart` component already defaults `showArea` to single-only — match that.)
- Keep charts minimal: thin lines (~1.5–2px), faint gridlines (low opacity), no gridline/axis clutter. Encode trend by colour (success / error / neutral).

## Theme toggle
- Every dashboard must include a visible light/dark mode toggle, usually in the top toolbar/header.
- Wire the toggle to `data-theme="light"` / `data-theme="dark"` on the app root or `document.documentElement`; do not build separate dark-mode CSS by hand.
- Verify both modes. Borders and token surfaces should keep cards, tables, and charts readable in light and dark.

## Actionable insights
- Use an actionable-insight pattern for decisions, not a table. Tables are for records; insights should read as prioritized actions.
- Default to `ActionInsightList` with the **ranked impact-tile** pattern: each item has a rank, impact value, short title, one-sentence reason, verb chip, and owner chip.
- Keep the older left-edge status-rail card as an acceptable secondary variant, but don't use it as the default because colored rails are becoming a generic AI-dashboard visual signature.
- Use tone quietly: tint the impact/score area with token-based `color-mix()` and keep borders neutral. Avoid large colored blocks or multiple competing accents.

## Source flows
- For source-to-order-to-goal views, default to `SourceFlowMap`: curved connectors should make the direction of flow obvious at a glance.
- Use connector thickness to encode source contribution/strength. This is easier to understand than equal-width arrows or a rigid process grid.
- Keep node cards quiet and flat; the flow line weight is the main visual signal. Avoid decorative gradients, shadows, or many colors.
- A rigid card-grid source diagram is acceptable as a secondary/fallback view, not the default.

## Building components not yet in the package
- Compose from tokens + type classes + existing components. Match the density and radius of what's there (button radius = pill; card radius = 14px; control radius = 8px).
- Reuse `Button` etc. rather than re-implementing them.

## KPIs (Phase 1: presentation, not mandate)
- Teams currently use their own KPIs. Call `get_team_kpis` for presentation guidance: lead with the 3–5 metrics the team actually decides on, each as a KPI Card; supporting breakdowns go below. Don't crowd the top with 10 KPIs.
- (Later: `get_team_kpis` will return each team's approved core KPIs once those are agreed and signed off.)

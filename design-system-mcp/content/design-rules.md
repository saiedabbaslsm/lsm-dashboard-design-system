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

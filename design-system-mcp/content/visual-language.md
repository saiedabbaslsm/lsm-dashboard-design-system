# Visual language

How the system *feels* — the principles for building anything not already in it, so new things still belong. Tokens make the atoms match; this makes the composition match. Read this when you need a component or pattern that doesn't exist yet.

## Personality
- **Calm and flat.** No drop shadows, no gradients, no glows in dashboard UI. Surfaces are flat; depth comes from a 1px hairline border, not elevation. (Gradient tokens exist for the occasional marketing moment, not dashboards.)
- **Restraint over decoration.** Most of the screen is neutral. Gold (`--color-primary` / `--color-primary-fixed`) is the *one* accent — use it for a single primary action, one hero metric, or a selected state. If gold is everywhere, it means nothing.
- **Content first.** The data is the hero. Chrome — labels, icons, borders — stays quiet (muted `onSurfaceVariant`, thin, small) so numbers and charts stand out.

## Shape language
- Radius scale, applied consistently: **buttons = pill** (fully rounded); **controls (inputs, chips) = 8px**; **cards / panels = 14px**. When unsure, match the nearest existing element.
- Don't mix a hard corner and a pill in the same cluster.

## Separation & elevation
- Separate surfaces with a **1px `outline-variant` border**, not a shadow. (Borders are required so cards read in dark mode.)
- At most one floating layer (menu / dialog) at a time; everything else sits in-flow.
- Neutral grey variation should come from token opacity or `color-mix()` with surface/on-surface tokens, not raw grey values. This keeps greys coherent across light and dark themes.
- Header rows or quiet emphasis areas may use a low-opacity gold tint mixed into a surface token, but it should read as structure, not decoration.

## Spacing & density
- Comfortable, not cramped. Card padding 20–24px. Gaps step through 8 / 12 / 16 / 24. Group related things tightly; separate groups clearly.
- One clear hierarchy per card: big emphasized value, a quiet label above, a quiet caption below.

## Data visualization
- Minimal. Thin 2px lines, soft ~13% area fill, **no gridlines or axes** in inline/sparkline charts — let the shape read at a glance.
- Encode trend by color: up = `success` (green), down = `error` (red), flat = neutral. Inline charts bleed to the card's edges.
- Categorical series cycle a small, consistent palette — never a rainbow.

## Actionable insight patterns
- Insights are decisions, not rows of data. Use a ranked card/tile pattern when showing "fix / watch / do more / absorb" recommendations.
- The preferred pattern is `ActionInsightList` with **ranked impact tiles**: rank + impact are grouped in a quiet score area, while verb and owner are small chips. This should feel like an action queue, not a spreadsheet.
- The left-edge colored status rail is allowed as a secondary variant, but avoid making it the default. It can look like a generic AI-generated dashboard treatment when overused.
- Keep tone subtle: small tinted score areas, neutral borders, restrained chips, and short one-sentence explanations.

## Source flow patterns
- Use `SourceFlowMap` for source-to-order-to-goal relationships. Curved connectors make the direction of travel easier to understand than rigid arrow grids.
- Connector thickness should carry the comparison: strongest source = thickest line, weaker sources = thinner lines. Keep labels and node cards quiet so the flow weight does the work.
- Use one accent family for the flow. Don't color every line differently unless the colors encode a real category the user needs.
- Keep the rigid card-grid diagram as a secondary variant for exact reading, not the default visual.

## Icons
- Lucide, outline/stroke style, ~1.5–2px stroke, sized 16–20px. Default color `onSurfaceVariant`; use the accent or trend color only when the icon carries meaning. Don't mix icon families.

## Interaction & states
- Hover / press = a subtle state-layer tint (~8% / 12% of the on-color), not a color swap. Focus = a visible ring. Disabled = reduced opacity, never a new gray.
- Motion is quick and functional (~150ms), never bouncy or decorative.

## Copy
- Sentence case everywhere. Short, verb-first labels. No exclamation marks in system UI.

## When inventing a new component
1. Find the nearest existing component and match its radius, padding, border, and type roles.
2. Compose from existing components + tokens before drawing anything from scratch.
3. Choose the quieter option when unsure — "too plain" is a one-line fix; "too loud" spreads across the product.
4. It must work in light *and* dark: bind tokens, separate with borders, never hardcode.

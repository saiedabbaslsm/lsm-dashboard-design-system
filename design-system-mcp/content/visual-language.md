# Visual language

How the system *feels* — the principles for building anything not already in it, so new things still belong. Tokens make the atoms match; this makes the composition match. Read this when you need a component or pattern that doesn't exist yet.

## Personality
- **Flat, not shadowed.** No drop shadows, no glows, no fake elevation. Depth comes from a 1px hairline border, not a shadow. (Gradients are reserved for gold hero surfaces and marketing, not general chrome.) This is *structure* — it does not mean "hold back on colour".
- **Colour is governed by 60/30/10, not by "restraint".** ~60% neutral base, ~30% neutral surfaces, ~10% gold accent, per screenful (see `get_design_rules` → Colour balance). Gold (`--color-primary` / `--color-primary-fixed`) is the ONE brand accent — it *is* the 10%. Semantic colours (success/error/warning/info) are functional and separate, and you should use them freely to encode meaning: trends, comparisons, status, direction. **Bland is a failure here, the same as garish is.** Do not leave something grey to play it safe — grey that should be carrying meaning is a bug, not a neutral choice.
- **Content first.** The data is the hero. Chrome — labels, borders, axes — stays muted `onSurfaceVariant` so the numbers, charts and status colours are what stand out.

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
- Tint the score area with a token-based mix and keep borders neutral, but the verb/owner chips are `Badge`s with real status tone — use them. Short one-sentence explanations.

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
3. When unsure, reach for 60/30/10 rather than defaulting to grey — encode meaning with colour (trend, status, comparison). The guardrail is *not* "keep it quiet"; it's "don't rainbow" — colour must mean something, and gold stays the single brand accent.
4. It must work in light *and* dark: bind tokens, separate with borders, never hardcode.

# Visual language

How the system *feels* — the principles for building anything not already in it, so new things still belong. Tokens make the atoms match; this makes the composition match. Read this when you need a component or pattern that doesn't exist yet.

## Personality
- **Bordered AND softly lifted.** Every card keeps its 1px hairline border *and* sits on a very soft shadow (`--elev-1`). The border separates surfaces (it is what makes cards read in dark mode); the shadow adds a quiet sense of depth. **Never a shadow instead of the border.** (This replaced the old "flat, no shadows" rule on 2026-10-13.)
- **Polished, never busy.** This is a data-heavy product: polish must add to the experience, not take from it. Motion plays only when something appears or responds; nothing moves at rest.
- **Colour is governed by 60/30/10, not by "restraint".** ~60% neutral base, ~30% neutral surfaces, ~10% gold accent, per screenful (see `get_design_rules` → Colour balance). Gold (`--color-primary` / `--color-primary-fixed`) is the ONE brand accent — it *is* the 10%. Semantic colours (success/error/warning/info) are functional and separate, and you should use them freely to encode meaning: trends, comparisons, status, direction. **Bland is a failure here, the same as garish is.** Do not leave something grey to play it safe — grey that should be carrying meaning is a bug, not a neutral choice.
- **Content first.** The data is the hero. Chrome — labels, borders, axes — stays muted `onSurfaceVariant` so the numbers, charts and status colours are what stand out.

## Shape language
- Radius scale, applied consistently: **buttons = pill** (fully rounded); **controls (inputs, chips) = 8px**; **cards / panels = 14px**. When unsure, match the nearest existing element.
- Don't mix a hard corner and a pill in the same cluster.

## Separation & elevation
- Separate surfaces with a **1px hairline border** (`--card-line`, a softened `outline-variant`) **plus** an elevation shadow. Borders are still required so cards read in dark mode.
- Three elevation levels, by role — never by taste:
  - **`--elev-1`** — every card / panel at rest (`class="ds-card"` does both border and shadow).
  - **`--elev-2`** — the *response* when an interactive card is hovered (`ds-card--interactive`, clickable `KpiCard`), with a 2px lift.
  - **`--elev-3`** — the one floating layer: menu, popover, dialog, drawer (`class="ds-floating"`).
- At most one floating layer (menu / dialog) at a time; everything else sits in-flow.
- **Sticky chrome only** (a pinned filter bar, pinned jump links) may be frosted glass: 86% surface + `blur(12px)` (`class="ds-sticky-glass"`), so figures stay legible as they scroll underneath. **Never on cards.**
- **Glow: at most one per view, on the selected item only** — the chosen chart bar, the selected tile (`filter: var(--glow-selected)`). Never on resting elements, never more than one.
- Neutral grey variation should come from token opacity or `color-mix()` with surface/on-surface tokens, not raw grey values. This keeps greys coherent across light and dark themes.
- Header rows or quiet emphasis areas may use a low-opacity gold tint mixed into a surface token, but it should read as structure, not decoration.

## Spacing & density
- Comfortable, not cramped. Card padding 20–24px. Gaps step through 8 / 12 / 16 / 24. Group related things tightly; separate groups clearly.
- One clear hierarchy per card: big emphasized value, a quiet label above, a quiet caption below.

## Data visualization
- Minimal. Thin 2px lines, **an area that fades from ~24% of the line colour to 0** (a vertical gradient, not a flat slab), **no gridlines or axes** in inline/sparkline charts — let the shape read at a glance.
- Encode trend by color: up = `success` (green), down = `error` (red), flat = neutral. Inline charts bleed to the card's edges.
- Categorical series cycle a small, consistent palette — never a rainbow.

## Actionable insight patterns
- Insights are decisions, not rows of data. Use a ranked card/tile pattern when showing "fix / watch / do more / absorb" recommendations.
- The preferred pattern is `ActionInsightList` with **ranked impact tiles**: rank + impact are grouped in a quiet score area, while verb and owner are small chips. This should feel like an action queue, not a spreadsheet.
- The left-edge colored status rail is allowed as a secondary variant, but avoid making it the default. It can look like a generic AI-generated dashboard treatment when overused. When a toned left edge IS used (summary cards), make it quiet: a 3px inset edge plus a soft tint fading out by 45% (`class="ds-summary-card"`), never a heavy 4px border.
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
- Motion follows the timing rules below — see **Motion**.

## Gradients
- **Gold hero surfaces** keep `--gradient-tonal` (unchanged).
- **Sparkline / single-series areas** fade from ~24% of the line colour to 0%.
- **Gold bars** (the accent series in a bar chart) may run light-to-gold: `--color-primary-container` at the base to `--color-primary` at the top (`ds-bar-gold`, or the same two stops in an SVG `<linearGradient>`). Gold is still the 10% — only the accent series, never every bar.
- **Page wash:** a faint gold radial wash at the top of the page (9% primary, gone by 70%; `ds-page-wash` on the page background). On the page only — never on cards, tables or behind figures.
- Nothing else gets a gradient: no gradient chrome, buttons, borders or text.

## Motion
Two kinds of motion, two budgets — use the tokens (`--dur-1/2/3`, `--ease-out`, `--ease-in-out`):

| Kind | When | Budget | Examples |
|---|---|---|---|
| **Response** | the reader did something | **≤ 200ms** | hover (`--dur-1` 120ms), press `scale(.97)`, a popover opening (`--dur-2` 200ms), a card lifting |
| **Entrance** | something arrives | **≤ 700ms, once per mount** | cards rise in reading order (`ds-enter`, 320ms, 40ms stagger), a sparkline draws left to right (700ms), bars grow from the axis (520ms), share bars fill (600ms) |

The rules that make motion acceptable on a data-heavy product:
1. **Motion plays only when something appears or responds.** Never on a loop, never on a timer, never at rest. A finished page has zero running animations.
2. **A figure already on screen never moves** — except when the reader changes what it measures (a filter or range): then the value may glide to its new figure (≤ 450ms), *because* they acted. Never count up on first paint, and only glide when old and new share a format ("£48.5k" → "£52.1k"; "£980" → "£1.2k" just swaps). The visible text is `aria-hidden`; an `sr-only` copy carries the final value. Figures need `font-variant-numeric: tabular-nums` or they jitter.
3. **Entrances run once per mount**, not on every re-render or data change.
4. **Transform and opacity only.** Never animate width, height, top or margin — nothing may shift the layout.
5. **Everything sits inside `@media (prefers-reduced-motion: no-preference)`**; with reduced motion the page is identical, only still. JS animation checks `matchMedia('(prefers-reduced-motion: reduce)')`.
6. **No bounce, overshoot or attention-seeking** (no pulses, no "nudges", no shakes). Easing is `--ease-out` for arrivals and responses, `--ease-in-out` for line drawing.
- The theme toggle *may* reveal the new theme as a circle spreading from the toggle (View Transitions API, ~450ms) — one user-initiated moment; it must switch instantly without support or with reduced motion.

## Copy
- Sentence case everywhere. Short, verb-first labels. No exclamation marks in system UI.

## When inventing a new component
1. Find the nearest existing component and match its radius, padding, border, and type roles.
2. Compose from existing components + tokens before drawing anything from scratch.
3. When unsure, reach for 60/30/10 rather than defaulting to grey — encode meaning with colour (trend, status, comparison). The guardrail is *not* "keep it quiet"; it's "don't rainbow" — colour must mean something, and gold stays the single brand accent.
4. It must work in light *and* dark: bind tokens, separate with borders (plus `--elev-1` on cards), never hardcode.

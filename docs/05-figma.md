# 05 — Figma (design source of truth)

## The file

- **Name:** "unified AI design system"
- **File key:** `RoiwgeonsmbhJV9sCyFUZk`
- **URL:** https://www.figma.com/design/RoiwgeonsmbhJV9sCyFUZk/unified-AI-design-system

The Figma variables define the tokens; the component sets define what the code components look like. Code was ported *from* Figma, so Figma leads.

## Pages & structure

- **Page 1** contains:
  - Variable collections: **M3 Color** (Light/Dark), **M3 Fixed**, **M3 Extended** (Light/Dark — **17 vars**: the `success`, `warning`, `info` families + 5 `badgeSurface*` fills; all added by us), **M3 Gradients** (Light/Dark, STRING). Full token list in [docs/03](03-design-system-package.md#tokens).
  - Component sets (each is a Figma `COMPONENT_SET` with variant properties):
    - **Button** — Variant (Filled/Secondary/Tonal/Secondary Container/Outlined/Text/Elevated/Destructive) × Size (Small/Medium/Large) × State (Enabled/Hover/Pressed/Disabled) + `Show icon` boolean. (The *code* Button is a trimmed set: filled/tonal/secondary/outlined/text/destructive.)
    - **KPI Card** — Size (Default/Compact) × Trend (Up/Down/Flat) + `Show icon` + `Selected` booleans. Default has a bottom area chart; the earlier richer version had Emphasis/Visual props but was restyled to a clean "Stripe-like" look (big value, "vs last month" delta line, full-bleed bottom chart, `outlineVariant` border).
    - **Text Field** — Variant (Filled/Outlined) × State (Enabled/Focused/Error/Disabled) + `Leading icon`.
    - **Checkbox** — State (Unchecked/Checked/Indeterminate) × Disabled.
    - **Switch** — State (Off/On) × Disabled.
    - **Chip** — Type (Assist/Filter/Input/Suggestion) × Selected. **Interactive** — it has a border and a pointer cursor. Never use it for a status.
    - **Badge** — Tone (Neutral/Danger/Warning/Success/Info) × Lead (Dot/Icon/None), 15 variants, set id `28:256` in the `Badge` section at (1500, 1700). **Inert status label — deliberately borderless.** Height 28, padding `0/12`, radius 8, label-large (14/500/20). Every fill/text/dot is variable-bound, so it re-themes with the mode. Fill = `badgeSurface{Tone}`; dot = the saturated base tone; text = `on{Tone}Container`, except **Danger, whose text is `error`** (because `onErrorContainer` is `#111` in the export and black-on-pink reads flat, not red).
    - **KPI Card Tone** — Surface (Neutral/Brand/Gradient) × Size (Default/Compact). Still a *separate* set; folding it into the main `KPI Card` set is a pending task (see [docs/08](08-current-state-and-handoff.md)).
  - Sections: **Typography** (specimen of the 30 text styles), **Buttons**, **KPI Card**, **KPI Card — Colourful**, **Text Field**, **Checkbox**, **Switch**, **Chip**, **Badge**, **Sample Dashboard** (a dashboard assembled from component instances).
  - Text styles: 30 total (M3 expressive scale, Roboto) named `Display/Large`, `Display/Large Emphasized`, `Headline/Medium`, `Body/Large`, `Label/Small`, etc.
- **`icons` page** — one frame `Icons` containing **1546 Lucide icon components** (names like `plus`, `wallet`, `trending-up`, `circle-alert`, `check`, `minus`, `x`, `mail`, `clock`, `chevron-down`). They are 24×24, **stroke-based** (inner VECTOR, no fills, strokeWeight 2). To use one: `component.createInstance()`, resize, and recolor by setting `strokes` on the instance's descendant VECTORs.

## Tooling for working in Figma

Two writing paths were available in the environment used to build this:

1. **Desktop bridge plugin** — MCP tools `mcp__figma-console__*` (e.g. `figma_execute` to run JS in the Figma plugin context, `figma_capture_screenshot`, `figma_list_open_files`). **This is what was used** to build everything. `figma_execute` runs arbitrary Figma plugin API JS against the active file.
2. **`figma-ds-cli`** — a CLI (JSX render syntax, `var:token` binding) installed at `~/.npm-global/bin/figma-ds-cli`. The team convention is "create with CLI, verify with bridge," but the CLI daemon wasn't running, so the bridge was used for both. Connecting the CLI needs a remote-debug patch + Figma restart.

Reading designs can also use the official Figma MCP (`get_variable_defs`, `get_metadata`, `get_screenshot`), which requires auth.

## Figma plugin API gotchas (learned the hard way)

If you script Figma via `figma_execute` / the plugin API, these will bite:

- **`figma.currentPage = page` throws** under `documentAccess: dynamic-page` ("Cannot call with documentAccess: dynamic-page"). Use **`await figma.setCurrentPageAsync(page)`**, and `await figma.loadAllPagesAsync()` before searching across pages.
- **A CSS `color-mix()` cannot become a Figma variable.** Figma variables hold literal values, so any colour the code *computes* has no Figma equivalent — you'd have to hardcode it, and a hardcoded fill does **not** follow Light/Dark modes. If code computes a colour that Figma must mirror, **promote it to a real token** (this is why `badgeSurface*` exists). Rule of thumb: a colour that only exists in CSS is a colour outside the token pipeline.
- **`figma.variables.setBoundVariableForPaint` wipes the paint's `opacity`.** Binding a variable to a fill resets opacity to 1. For translucent state layers / tints, use **node opacity** (an overlay rect with `node.opacity = 0.08`) instead of per-fill opacity.
- **`node.resize(w, h)` flips an auto-layout frame's sizing to FIXED.** After a resize, set `primaryAxisSizingMode='AUTO'` again if you want hug-width, or content clips.
- **`vectorPaths` data must use ABSOLUTE SVG commands** (`M`, `L`) — relative (`h`, `v`) throws "Invalid command".
- **Figma nodes are non-extensible** — `node._myProp = x` throws "object is not extensible". Don't stash data on nodes; re-find by name.
- **Text nodes need `textAutoResize='WIDTH_AND_HEIGHT'`** to hug their content; otherwise long labels clip.
- **`combineAsVariants` does not auto-arrange** — set the resulting set to an auto-layout (wrap) or the variants overlap at one spot.
- **`node.componentPropertyReferences = { visible: propId }`** wires a boolean component property to a layer's visibility; the `propId` is the suffixed string returned by `addComponentProperty`.
- **The bridge screenshot can return a stale/cached image** (identical byteLength) — when unsure, verify via node data (`figma_execute` reading properties) instead of trusting the picture.
- Load fonts before setting text/styles (`await figma.loadFontAsync({family:'Roboto', style:'Medium'})`); Roboto (Regular/Medium/Bold) is installed. `setTextStyleIdAsync` requires the style's font loaded.

## Keeping Figma ↔ code in sync

- **Tokens:** re-export Figma variables to `design-system/tokens/tokens.json`, then `npm run build:tokens`. (An export helper reads all four collections and converts colors to hex; gradients/strings pass through.)
- **Components:** when a Figma component set changes, mirror it in `design-system/src/components/<name>/` (structure → layout → tokens → typography, in that order), and update `design-system-mcp/content/components.json`.

### Verify parity — don't trust that you wrote both the same

After changing tokens in both places, **read the variables back out of Figma and diff them against `tokens.json`.** Writing the same values twice is not evidence they match. This catches drift immediately:

```js
// figma_execute — dump a collection as { name: {Light, Dark} }
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const c = cols.find(x => x.name === 'M3 Extended');
const L = c.modes.find(m => m.name === 'Light').modeId;
const D = c.modes.find(m => m.name === 'Dark').modeId;
const hex = (v) => '#' + ['r','g','b'].map(k => Math.round(v[k]*255).toString(16).padStart(2,'0')).join('');
const out = {};
for (const id of c.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v && v.resolvedType === 'COLOR') out[v.name] = { Light: hex(v.valuesByMode[L]), Dark: hex(v.valuesByMode[D]) };
}
return out; // diff this against tokens.json
```

Also worth asserting on a component set after building it: every fill is **bound to a variable** (`node.fills[0].boundVariables.color`) rather than static — a static fill silently ignores dark mode. Flip a section to Dark (`setExplicitVariableModeForCollection`) and screenshot to prove it, then set it back to Light.

**Two known parity traps, both hit in practice:**
1. A colour computed in CSS (`color-mix`) can't be a variable → promote it to a token (see gotchas).
2. A component that sets **no `font-size`** inherits its surroundings and renders at different sizes per context — so there is no single truth for Figma to mirror. Pin type on any component that has a fixed spec (this bit `Badge`: 16px in a tile, 14px in a table).

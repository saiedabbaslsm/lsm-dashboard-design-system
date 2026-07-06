# 05 — Figma (design source of truth)

## The file

- **Name:** "unified AI design system"
- **File key:** `RoiwgeonsmbhJV9sCyFUZk`
- **URL:** https://www.figma.com/design/RoiwgeonsmbhJV9sCyFUZk/unified-AI-design-system

The Figma variables define the tokens; the component sets define what the code components look like. Code was ported *from* Figma, so Figma leads.

## Pages & structure

- **Page 1** contains:
  - Variable collections: **M3 Color** (Light/Dark), **M3 Fixed**, **M3 Extended** (success — added by us), **M3 Gradients** (Light/Dark, STRING). Full token list in [docs/03](03-design-system-package.md#tokens).
  - Component sets (each is a Figma `COMPONENT_SET` with variant properties):
    - **Button** — Variant (Filled/Secondary/Tonal/Secondary Container/Outlined/Text/Elevated/Destructive) × Size (Small/Medium/Large) × State (Enabled/Hover/Pressed/Disabled) + `Show icon` boolean. (The *code* Button is a trimmed set: filled/tonal/secondary/outlined/text/destructive.)
    - **KPI Card** — Size (Default/Compact) × Trend (Up/Down/Flat) + `Show icon` + `Selected` booleans. Default has a bottom area chart; the earlier richer version had Emphasis/Visual props but was restyled to a clean "Stripe-like" look (big value, "vs last month" delta line, full-bleed bottom chart, `outlineVariant` border).
    - **Text Field** — Variant (Filled/Outlined) × State (Enabled/Focused/Error/Disabled) + `Leading icon`.
    - **Checkbox** — State (Unchecked/Checked/Indeterminate) × Disabled.
    - **Switch** — State (Off/On) × Disabled.
    - **Chip** — Type (Assist/Filter/Input/Suggestion) × Selected.
  - Sections: **Typography** (specimen of the 30 text styles), **Buttons**, **KPI Card**, **Text Field**, **Checkbox**, **Switch**, **Chip**, **Sample Dashboard** (a dashboard assembled from component instances).
  - Text styles: 30 total (M3 expressive scale, Roboto) named `Display/Large`, `Display/Large Emphasized`, `Headline/Medium`, `Body/Large`, `Label/Small`, etc.
- **`icons` page** — one frame `Icons` containing **1546 Lucide icon components** (names like `plus`, `wallet`, `trending-up`, `circle-alert`, `check`, `minus`, `x`, `mail`, `clock`, `chevron-down`). They are 24×24, **stroke-based** (inner VECTOR, no fills, strokeWeight 2). To use one: `component.createInstance()`, resize, and recolor by setting `strokes` on the instance's descendant VECTORs.

## Tooling for working in Figma

Two writing paths were available in the environment used to build this:

1. **Desktop bridge plugin** — MCP tools `mcp__figma-console__*` (e.g. `figma_execute` to run JS in the Figma plugin context, `figma_capture_screenshot`, `figma_list_open_files`). **This is what was used** to build everything. `figma_execute` runs arbitrary Figma plugin API JS against the active file.
2. **`figma-ds-cli`** — a CLI (JSX render syntax, `var:token` binding) installed at `~/.npm-global/bin/figma-ds-cli`. The team convention is "create with CLI, verify with bridge," but the CLI daemon wasn't running, so the bridge was used for both. Connecting the CLI needs a remote-debug patch + Figma restart.

Reading designs can also use the official Figma MCP (`get_variable_defs`, `get_metadata`, `get_screenshot`), which requires auth.

## Figma plugin API gotchas (learned the hard way)

If you script Figma via `figma_execute` / the plugin API, these will bite:

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

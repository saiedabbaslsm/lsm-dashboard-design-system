# 03 — The design-system package (`@lsm/design-system`)

Path: `design-system/`. React components + design tokens, generated from Figma. Ships compiled ESM/CJS/types + bundled CSS from `dist/`, built with `tsup`. TypeScript is clean (`npm run typecheck`).

## Layout

```
design-system/
  package.json              @lsm/design-system, GitHub Packages, exports
  tsconfig.json             jsx: react-jsx, moduleResolution: Bundler
  tokens/
    tokens.json             SOURCE OF TRUTH for tokens (exported from Figma)
  scripts/
    build-tokens.mjs        tokens.json → CSS + TS  (npm run build:tokens)
    copy-build-assets.mjs   copies standalone CSS exports + assembles dist/index.css
  tsup.config.ts            src/index.ts → dist/index.js / index.cjs / index.d.ts
  src/
    css.d.ts                declare module '*.css'  (so tsc accepts css imports)
    index.ts                exports all components + `color` token map
    index.css               '@lsm/design-system/styles.css' — imports everything
    styles/
      tokens.css            GENERATED — CSS variables (light/dark/fixed/gradients)
      typography.css        GENERATED — .text-* type classes
    tokens.ts               GENERATED — `color` map: { primary: 'var(--color-primary)', … }
    components/
      button/               button.tsx + button.css
      kpi-card/             kpi-card.tsx + kpi-card.css
      text-field/          text-field.tsx + text-field.css
      chip/                 chip.tsx + chip.css
      checkbox/            checkbox.tsx + checkbox.css
      switch/              switch.tsx + switch.css
      data-table/          data-table.tsx + data-table.css
      line-chart/          line-chart.tsx + line-chart.css
      bar-chart/           bar-chart.tsx + bar-chart.css
  dist/
    index.js                ESM bundle
    index.cjs               CJS bundle
    index.d.ts              type declarations
    index.css               bundled tokens + type scale + component styles
    tokens.css              standalone token CSS export
    typography.css          standalone type-scale CSS export
```

`GENERATED` files are produced by `build-tokens.mjs` — **do not edit by hand**; edit `tokens/tokens.json` (or the type-scale table in the script) and re-run `npm run build`.

## Tokens

Source: `tokens/tokens.json`, four Figma collections:

- **M3 Color** (modes: Light, Dark) — 29 semantic roles: `primary`, `onPrimary`, `primaryContainer`, `onPrimaryContainer`, `primaryText`, `secondary`/`onSecondary`/`secondaryContainer`/`onSecondaryContainer`, `error` family, full `surface`/`surfaceDim`/`surfaceBright`/`surfaceContainerLowest…Highest`, `onSurface`, `onSurfaceVariant`, `outline`, `outlineVariant`, `inverseSurface`, `inverseOnSurface`, `inversePrimary`, `scrim`.
- **M3 Fixed** (single mode) — 9 theme-independent: `primaryFixed`, `primaryFixedDim`, `onPrimaryFixed`, `onPrimaryFixedVariant`, `secondaryFixed`, `secondaryFixedDim`, `onSecondaryFixed`, `onSecondaryFixedVariant`, `boldSurfaceContainer`.
- **M3 Extended** (Light, Dark) — the `success`, `warning`, and `info` families (each `x` / `onX` / `xContainer` / `onXContainer`). **Added by us**, not from the original Figma export, because dashboards need green up / red down and full RAG + informational statuses. Kept separate so `M3 Color` stays a mirror of the Figma export. `warning` is a **burnt orange** (`#b06a00`), deliberately *not* brand gold — amber statuses must not be mistaken for the gold 10% accent. Every `Badge` tone is verified ≥4.5:1 in both themes.
- **M3 Gradients** (Light, Dark) — 11 STRING tokens (`gradientTonal`, `gradientVibrant`, `onGradient*`, `gradientAngle`). Figma variables can't hold gradient fills, so they're stored as CSS strings. Use sparingly (marketing, not dashboards).

**Naming:** CSS var = `--color-{kebab(name)}` (e.g. `onPrimary` → `--color-on-primary`; `surfaceContainerLowest` → `--color-surface-container-lowest`). Gradient vars drop the `color-` prefix (`--gradient-vibrant`, `--on-gradient-tonal`). Light values go in `:root, [data-theme='light']`; dark in `[data-theme='dark']`; fixed in `:root`.

**Identity:** gold is primary. In light mode `--color-primary` = `#f5bf2d` with near-black `--color-on-primary` = `#111`. (Deliberately bends M3's white-on-primary convention — the brand gold leads.)

## Typography

`typography.css` = the full **M3 expressive** scale as classes: 15 roles (`display`/`headline`/`title`/`body`/`label` × `large`/`medium`/`small`), each with an `-emphasized` variant. Font is **Roboto** (`--font-sans`). Class names: `.text-display-large`, `.text-headline-small-emphasized`, `.text-body-medium`, `.text-label-large`, etc. Emphasis rule: weight 400 → 500, and already-500 roles (title m/s, all labels) → 700. The role table lives in `build-tokens.mjs` (sizes/line-heights/tracking per M3 spec, tracking in px).

## Components

All are token-driven, typed, class-prefixed `ds-`, and take icons as props (no icon dependency shipped). Import from the package root.

| Component | Key props | Notes |
|---|---|---|
| `Button` | `variant` (filled\|tonal\|secondary\|outlined\|text\|destructive), `size` (sm\|md\|lg), `icon?`, + native button attrs | M3 state layer via `::before`; focus ring; disabled treatment. |
| `KpiCard` | `label`, `value`, `delta?`, `caption?='vs last month'`, `trend?` (up\|down\|flat), `size?` (default\|compact), `selected?`, `icon?`, `data?: number[]`, + native div attrs | Responsive/fill-container by default. `default` renders a bottom SVG area chart from `data`; `compact` has no chart (3–4 per row). Trend sets delta color (success/error/neutral) + arrow. Native div props make it usable as an interactive card with `onClick`, `role`, `tabIndex`, and ARIA attrs. |
| `TextField` | `label?`, `helperText?`, `variant?` (filled\|outlined), `error?`, `leadingIcon?`, + native input attrs | Focus state via `:focus-within`; error shows red border/helper + a built-in alert icon. |
| `Chip` | `type?` (assist\|filter\|input\|suggestion), `selected?`, `leadingIcon?`, `onRemove?`, children=label | **Interactive** control — bordered, pointer cursor. Selected → `secondaryContainer` fill + built-in check icon; `input` shows a trailing ×. Never use for a status. |
| `Badge` | `tone?` (neutral\|danger\|warning\|success\|info), `dot?`=true, `icon?` (leading Lucide icon, replaces the dot), children=label, + native span attrs | **Inert** status label (RAG, states). Deliberately borderless — a border reads as clickable. Soft tinted fill + saturated dot + dark AA-contrast text; per-tone `--ds-badge-dot`/`--ds-badge-fg` verified ≥4.5:1 in both themes. `danger` takes its text from `error` because `onErrorContainer` is `#111` in the Figma export. |
| `Checkbox` | `label?`, `checked?`, `indeterminate?`, `disabled?`, `onChange?` | Real hidden `<input>`; `indeterminate` set via ref/effect; check/minus are inline SVG shown by CSS state. |
| `Switch` | native input attrs (`checked`, `onChange`, `disabled`) | Standalone control (compose your own label row). `role="switch"`. |
| `DataTable` | `columns`, `rows`, `className?` | Alternating token-surface rows for readability, numeric alignment, tone states (`success`/`error`/etc.), horizontal overflow containment. |
| `LineChart` | `series`, `labels?`, `variant?` (single\|multi), `showLegend?`, `showArea?` | Single mode keeps the soft area-fill style; multi mode supports actual/predicted/target with legends, dashed lines, and shared tooltip. |
| `BarChart` | `labels`, `bars`, `lines?`, `referenceLines?`, `yFormatter?` | Grouped vertical bars with optional line overlays and dashed reference lines, for spend/revenue/comparison views. |
| `ActionInsightList` | `items`, `variant?` (tiles\|rail), + native div attrs | Prioritized fix/watch/do-more/absorb insights. `tiles` is the default and preferred pattern; `rail` is a secondary variant. Use this instead of a table for decision queues. |
| `SourceFlowMap` | `sources`, `order`, `goal`, `badge?`, + native div attrs | Curved source-to-order-to-goal map. Connector thickness encodes source strength/contribution, making the flow easier to understand than rigid node grids. |

State/interaction icons inside components (trend arrows, check, ×, alert) are **inline SVG using lucide paths**. Header/leading icons are **passed in** by the consumer.

## Install & use (consumer)

```bash
echo "@lsm:registry=https://npm.pkg.github.com" >> .npmrc
npm install @lsm/design-system
```
```tsx
import '@lsm/design-system/styles.css';
import { Button, KpiCard } from '@lsm/design-system';
import { Plus } from 'lucide-react';

<Button variant="filled" icon={<Plus size={18} />}>New report</Button>
<KpiCard size="compact" label="MRR" value="$48.2k" delta="+4.1%" trend="up" />
```
Dark mode: set `data-theme="dark"` on a wrapper. Tokens in JS: `import { color } from '@lsm/design-system'` → `color.primary === 'var(--color-primary)'`.

## Adding a new component (the pattern)

1. `src/components/<name>/<name>.tsx` + `<name>.css`.
2. CSS: classes prefixed `ds-`; every color = `var(--color-*)`, every text size = a `.text-*` class (or apply the class in the TSX). No hardcoded hex/px for color/type. Follow `design-system-mcp/content/visual-language.md` (radius: pill buttons / 8px controls / 14px cards; borders not shadows; one accent).
3. TSX: typed props interface exported; icons via props; spread native attrs; `className` merge.
4. Export it from `src/index.ts` and `@import` its css in `src/index.css`.
5. `npm run typecheck` and `npm run build` should stay clean.

Reference the Figma component of the same name for exact variants/values (see [docs/05-figma.md](05-figma.md)). The 6 existing components were ported 1:1 from their Figma component sets.

## <a name="demo"></a>The demo app (`demo/`)

A Vite + React app that consumes the package **exactly like a coworker** — via a vite alias in `demo/vite.config.ts` (`@lsm/design-system` → `../design-system/dist/index.js`, styles → `../design-system/dist/index.css`). Used to test the whole system end-to-end.

```bash
cd demo && npm install && npm run dev      # http://localhost:5173
```

It renders a marketing dashboard using library components (`Button`, `Chip`, `KpiCard`, `TextField`, `Checkbox`, `Switch`, `DataTable`, `LineChart`, `BarChart`, `ActionInsightList`, `SourceFlowMap`) **plus deliberately-novel components** (NOT in the library) to test the visual language:
- `demo/src/ChartPanel.tsx` — a full-view chart panel with a `7d/28d/90d` segmented control and close button, powered by the library `LineChart`.
- `demo/src/widgets.tsx` — `Dropdown` (trigger + popover menu, click-outside backdrop).
- `demo/src/demo.css` — layout styles and hover rules for dropdown items.

The remaining novel component is a **prototype** for a future library addition (Dropdown/Select). It validates that new components built only from tokens + type classes + the visual language still look like the system.

**Preview gotcha:** the app must be viewed at the **Vite dev server** (`http://localhost:5173`), not by opening `demo/index.html` as a static file — the static file can't compile `main.tsx` and shows a blank page.

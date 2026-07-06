# @lsm/design-system

The Little Star Media unified design system: **design tokens + React components**, generated from the Figma "unified AI design system" file. Use this so every team's dashboards share one look and feel.

> Status: **v0.1 — foundation.** Tokens + the full M3 type scale + core dashboard components are available, with a `tsup` build that emits ESM, CJS, types, and bundled CSS.

## Install

This is a private package published to GitHub Packages. One-time setup per project:

```bash
# tell npm where @lsm packages live
echo "@lsm:registry=https://npm.pkg.github.com" >> .npmrc
npm install @lsm/design-system
```

## Usage

Import the styles once at your app root, then use components:

```tsx
import '@lsm/design-system/styles.css';
import { Button } from '@lsm/design-system';

export default function Toolbar() {
  return (
    <div>
      <Button variant="filled">New report</Button>
      <Button variant="outlined" size="lg">Export</Button>
    </div>
  );
}
```

### Tokens

Every color is a CSS variable, themed for light/dark:

```css
.card {
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  border: 1px solid var(--color-outline-variant);
}
```

Switch a subtree to dark mode with `data-theme="dark"`:

```html
<body data-theme="dark"> … </body>
```

For JS/inline styles, import the typed map (autocomplete + type-safety):

```ts
import { color } from '@lsm/design-system';
const style = { color: color.primary }; // 'var(--color-primary)'
```

### Typography

The M3 expressive type scale ships as classes — Standard and Emphasized:

```tsx
<h1 className="text-headline-large-emphasized">Marketing overview</h1>
<p className="text-body-medium">Last 28 days</p>
```

## The rules (always)

- **Never hardcode a hex, font size, or radius** — use a token / type class.
- One accent action per view; default to the quieter variant.
- For anything not yet in this package, build it from tokens + the type scale so it still looks like the system.

## Updating the design system (maintainers)

The Figma file is the source of truth. When tokens change:

1. In Figma, re-export the variables to `tokens/tokens.json`.
2. Regenerate the CSS + TS:
   ```bash
   npm run build
   ```
3. Bump the version and publish. Consumers pick it up with `npm update @lsm/design-system` (intentional, so a live dashboard never changes underneath someone).

```
tokens/tokens.json   ← exported from Figma (source of truth)
        │  build:tokens
        ▼
src/styles/tokens.css        (CSS variables, light + dark)
src/styles/typography.css    (M3 type scale classes)
src/tokens.ts                (typed token map)
dist/                        (compiled ESM/CJS/types + bundled CSS)
```

## Components

`Button`, `KpiCard`, `TextField`, `Chip`, `Checkbox`, `Switch`, `DataTable`, `LineChart`, `BarChart`, `ActionInsightList`, `SourceFlowMap` — all token-driven and typed. Import any one from the package root; import icons yourself (e.g. `lucide-react`) and pass via `icon` / `leadingIcon` props (the package ships no icon dependency).

Use `ActionInsightList` for prioritized fix/watch/do-more/absorb recommendations; its default `tiles` variant is the go-to insight pattern. Use `SourceFlowMap` for source-to-order-to-goal views where curved connector thickness communicates contribution.

## Roadmap

- [x] Tokens + M3 type scale (generated from Figma)
- [x] Core components ported from Figma
- [x] Compiled build (tsup) for faster consumer installs
- [x] **MCP server** (`../design-system-mcp`) — serves the rules + component catalog + KPI guidance to Claude, so coworkers paste one config and Claude builds on-system automatically

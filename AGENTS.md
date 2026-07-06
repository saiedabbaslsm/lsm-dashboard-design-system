# AGENTS.md — Little Star Media unified design system

> Entrypoint for any coding agent (Codex, Claude, etc.) working in this repo.
> Read this file first, then the relevant file in `docs/`.

## What this project is

A **company-wide design system for dashboards** at Little Star Media, plus a way to distribute it so every team's dashboards share one look and feel — and (later) surface the right KPIs. It exists to solve two problems the CEO raised:

1. **Unify the look** — everyone builds their own dashboards with their own visual style; make them consistent.
2. **Right KPIs** — people make decisions off dashboards showing the wrong metrics; each team should lead with a few sanctioned KPIs.

**Rollout decision (important):** we are in **Phase 1 = prove the visuals first**. Teams use their *own* KPIs for now; the focus is getting the design system adopted and the look right. **Phase 2 = per-team approved KPIs**, added only once the boss signs off. Don't build KPI enforcement yet — keep the KPI side generic.

## The four parts

| Part | Path | What it is |
|---|---|---|
| **Figma file** | (cloud) | The design source of truth. Key `RoiwgeonsmbhJV9sCyFUZk`, file "unified AI design system". Tokens + all components live here. See [docs/05-figma.md](docs/05-figma.md). |
| **npm package** | `design-system/` | `@lsm/design-system` — design tokens (generated from Figma) + React components. What coworkers install. See [docs/03-design-system-package.md](docs/03-design-system-package.md). |
| **MCP server** | `design-system-mcp/` | Serves the rules, visual language, component catalog, and KPI guidance to Claude/agents. The auto-updating distribution channel. See [docs/04-mcp-server.md](docs/04-mcp-server.md). |
| **Demo app** | `demo/` | A throwaway Vite app that consumes the package like a real coworker would; used to test the system end-to-end (incl. novel components). See [docs/03-design-system-package.md](docs/03-design-system-package.md#demo). |

The **distribution model**: coworkers `npm install @lsm/design-system` (versioned code) **and** add the MCP server once (`claude mcp add`). The package carries running code; the MCP carries guidance that auto-updates when we edit its content and redeploy. See [docs/02-architecture.md](docs/02-architecture.md).

## Read next

- [docs/01-overview.md](docs/01-overview.md) — the vision, the two problems, the phased rollout, glossary.
- [docs/02-architecture.md](docs/02-architecture.md) — how the four parts fit and the distribution strategy.
- [docs/03-design-system-package.md](docs/03-design-system-package.md) — tokens pipeline, components, how to add one, the demo.
- [docs/04-mcp-server.md](docs/04-mcp-server.md) — tools, editable content, run/deploy, how coworkers connect.
- [docs/05-figma.md](docs/05-figma.md) — Figma structure, tokens, components, the plugin/CLI tooling, and hard-won API gotchas.
- [docs/06-roadmap-and-gaps.md](docs/06-roadmap-and-gaps.md) — status, next steps, known gaps.

## Core conventions (apply everywhere)

- **Never hardcode a color, font size, line-height, or radius.** Use a token (`var(--color-*)`) or a type class (`.text-*`). This is the whole point of the system.
- **Gold is the one accent.** Primary = gold; use it for a single primary action / hero / selected state. Everything else is neutral.
- **Flat, bordered, calm.** No shadows/gradients in dashboards; separate surfaces with a 1px `--color-outline-variant` border (also required for dark mode). Full personality spec: `design-system-mcp/content/visual-language.md`.
- **Actionable insights are not tables.** Default to `ActionInsightList` with ranked impact tiles; the left-edge colored rail is only a secondary variant.
- **Source flows should feel like flows.** Default to `SourceFlowMap` with curved connectors and line thickness for contribution strength; rigid source grids are secondary/fallback.
- **Component CSS classes are prefixed `ds-`.** Icons are never bundled — components take icon elements via `icon`/`leadingIcon` props (consumers pass `lucide-react` etc.).
- **Everything must work in light AND dark** (`[data-theme="dark"]`).
- **Every dashboard must include a visible light/dark mode toggle** wired to `data-theme="light"` / `data-theme="dark"` on the app root or document element.

## Build / run quick reference

```bash
# design system package
cd design-system && npm install
npm run build               # regenerate tokens + build dist/
npm run typecheck           # typecheck (expect clean)

# MCP server
cd design-system-mcp && npm install
npm run dev                 # http://localhost:3000/mcp  (health: /health)

# demo app
cd demo && npm install
npm run dev                 # http://localhost:5173  (consumes the package via alias)
```

## Gotchas you will hit (see docs/05 for the full list)
- Figma plugin API: `setBoundVariableForPaint` wipes paint `opacity` (use node opacity); `node.resize()` flips auto-layout sizing to FIXED; `vectorPaths` needs absolute SVG commands; Figma nodes are non-extensible (`node._x = ...` throws).
- Token CSS var names are `--color-{kebab}` (Figma var `onPrimary` → `--color-on-primary`).
- Ignore the two stray root files `button.css` and `m3-tokens (1).css` — early scratch, superseded by `design-system/`.

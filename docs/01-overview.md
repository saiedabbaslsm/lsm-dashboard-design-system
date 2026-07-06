# 01 — Overview

## The problem (from the CEO)

At Little Star Media, every team builds their own dashboards. Two issues:

1. **Inconsistent look & feel.** Each person designs their own visual style — no shared components, colors, or typography. Dashboards look like they come from different companies.
2. **Wrong KPIs drive decisions.** Anyone can create any KPI. People sometimes make calls off dashboards that don't show the metrics that actually matter for their team. Each team should focus on a few core, sanctioned KPIs — then build whatever else they want *on top of* those.

## The solution

A **unified design system** delivered through two channels that require almost no technical setup from coworkers:

- A **private npm package** (`@lsm/design-system`) with the tokens + React components — the actual reusable code.
- An **MCP server** that serves the design rules, the visual language, the component catalog, and (later) each team's approved KPIs to Claude/agents. Coworkers add it once; when we update the content and redeploy, everyone's agent gets the update automatically — no re-download, no editing their own config.

The **Figma file is the design source of truth**; tokens are exported from it into the package, and the visual decisions there define what the components look like.

## Phased rollout (current strategy)

The founder decided to sequence adoption to de-risk it:

- **Phase 1 — prove the visuals (WE ARE HERE).** Let every team build dashboards with their *own* KPIs. Focus entirely on getting the design system right and adopted, and on the boss being happy with the look. The MCP's KPI tool returns *generic presentation guidance only* (`get_team_kpis` → "lead with 3–5 core metrics, present them as KPI Cards…"), not mandates.
- **Phase 2 — KPI governance.** Once the look is signed off, fill in each team's approved core KPIs (marketing, sales, product, …) in `design-system-mcp/content/kpis.json`, set `confirmed: true`, and the same `get_team_kpis` tool starts returning real per-team lists. Nothing else changes for coworkers.

Implication for agents: **do not build KPI enforcement or hardcode team KPIs now.** Keep the KPI side generic until Phase 2 is explicitly started.

## Design identity (short version)

- **Material 3 (M3) expressive** foundation, with **gold as the primary/brand accent** (`#f5bf2d`), warm-tinted neutrals, light + dark themes.
- **Flat, calm, restrained.** One accent per view; separation via hairline borders, not shadows; minimal data-viz.
- Full personality spec lives in `design-system-mcp/content/visual-language.md` (served to agents by the `get_visual_language` MCP tool). Read it before building any new/unlisted component.

## Glossary

- **Token** — a named design value (color, later spacing/type) that lives in Figma as a Variable and in code as a CSS custom property (`var(--color-primary)`).
- **Type class** — a CSS class implementing one M3 type role, e.g. `.text-headline-small`, `.text-body-medium`, each with a `-emphasized` (heavier) variant.
- **Component set / variant** — Figma's term for a component with variant properties (e.g. Button = Variant × Size × State).
- **MCP** — Model Context Protocol; the way the server exposes tools/resources to Claude/agents.
- **Novel component** — something not in the library that an agent builds from tokens + type classes + the visual language (e.g. the demo's chart, table, dropdown). A key test: these must still look like the system.

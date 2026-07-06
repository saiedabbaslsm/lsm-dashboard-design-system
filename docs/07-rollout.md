# 07 — Rollout runbook

This is the handoff path from local proof-of-visuals to real coworker adoption.

## What is ready locally

- `@lsm/design-system` builds to `design-system/dist/` with ESM, CJS, types, and bundled CSS.
- `design-system-mcp` serves onboarding, rules, visual language, component catalog, and KPI guidance over `/mcp`.
- `demo/` consumes the built package like a coworker project and verifies the visual language end to end.

## What needs access from the maintainer

1. A GitHub org/repo destination for this project.
2. A GitHub Packages token with permission to publish `@lsm/design-system`.
3. A Vercel project for the MCP server, using `design-system-mcp/` as the project root.
4. The public MCP URL after deploy. Current Vercel pilot URL: `https://design-system-mcp-two.vercel.app/mcp`.

## Publish package

From `design-system/`:

```bash
npm run build
npm pack --dry-run
npm publish
```

Consumers install:

```bash
echo "@lsm:registry=https://npm.pkg.github.com" >> .npmrc
npm install @lsm/design-system
```

## Deploy MCP on Vercel

Deploy `design-system-mcp/` as the Vercel project root.

- Install command: `npm install`
- Build command: leave empty or `npm run typecheck`
- Health check: `/health`
- MCP endpoint: `/mcp`
- Current pilot health check: `https://design-system-mcp-two.vercel.app/health`
- Current pilot MCP endpoint: `https://design-system-mcp-two.vercel.app/mcp`

Coworkers connect once:

```bash
claude mcp add --transport http lsm-design https://YOUR-HOST/mcp
```

Then add this to their project instructions:

> Use the Little Star Media design system. At the start of dashboard work, call `get_onboarding`, follow `get_design_rules` / `get_visual_language`, check `list_components`, and call `get_team_kpis`.

## First adoption test

1. Pick 1-2 coworkers with real dashboard needs.
2. Ask them to build with their own KPIs, not approved KPI mandates yet.
3. Confirm every dashboard has the light/dark toggle.
4. Confirm preferred patterns are used:
   - `ActionInsightList` tiles for actionable insights.
   - `SourceFlowMap` for source-to-order-to-goal flows.
5. Collect boss feedback on visual consistency before moving to Phase 2 KPI governance.

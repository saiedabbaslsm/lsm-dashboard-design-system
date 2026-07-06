# 02 — Architecture

## The pieces and how they relate

```
                ┌─────────────────────────┐
                │  Figma: "unified AI      │   design source of truth
                │  design system"          │   (tokens + component designs)
                │  key RoiwgeonsmbhJV9sCyFUZk
                └───────────┬─────────────┘
                            │  export variables → tokens.json
                            ▼
   ┌──────────────────────────────────────────┐
   │  design-system/  (@lsm/design-system)     │   the CODE
   │  tokens.json → build → dist CSS/JS/TS     │
   │  + React components (Button, KpiCard, …)  │
   └───────────────┬──────────────────────────┘
                   │  npm install (versioned)
                   ▼
   ┌──────────────────────────────────────────┐        ┌──────────────────────────────┐
   │  Coworker's dashboard project (React)     │◀───────│  design-system-mcp/          │
   │  imports @lsm/design-system               │  MCP   │  serves rules, visual        │
   │  Claude/agent builds the dashboard        │  tools │  language, catalog, KPI guide │
   └──────────────────────────────────────────┘        └──────────────────────────────┘

   demo/  = a stand-in "coworker project" we use to test the whole loop.
```

## Two distribution channels, on purpose

| Channel | Carries | Update model | Why |
|---|---|---|---|
| **npm package** (`@lsm/design-system`) | Running code: tokens (CSS vars) + React components | **Intentional** — `npm update`, versioned | A live dashboard must not change under someone's feet because we tweaked a color. Versioning protects production. |
| **MCP server** (`design-system-mcp`) | Guidance: onboarding, rules, visual language, component catalog, KPI presentation | **Automatic** — edit content, redeploy, everyone's next agent session sees it | Rules/KPIs should propagate instantly without anyone reinstalling or editing their config. |

The split is the core idea: *code* is versioned and deliberate; *guidance* auto-updates. Content the MCP serves is plain files in `design-system-mcp/content/`, read fresh per request — updating the system = editing text, not code.

## How a coworker uses it (target flow)

1. **Once:** `npm install @lsm/design-system` + `import '@lsm/design-system/styles.css'`, and `claude mcp add --transport http lsm-design https://HOST/mcp`, plus one line in their `CLAUDE.md` pointing at the system.
2. **Per task:** they ask Claude to build/adjust a dashboard. Claude calls the MCP (`get_onboarding` → `get_design_rules` / `get_visual_language` / `list_components` → `get_team_kpis`), imports components from the package, and builds on-system. For anything not in the package, it composes from tokens + type classes following the visual language.

Their own `CLAUDE.md` and progress stay untouched — the system lives in the package + MCP, not in their file.

## Why Figma → code pipeline matters

The tokens are **generated**, not hand-written. `design-system/tokens/tokens.json` is exported from the Figma variables; `design-system/scripts/build-tokens.mjs` turns it into `tokens.css` + `typography.css` + `tokens.ts`. So the update loop is:

> edit Figma variables → re-export `tokens.json` → `npm run build` → bump version → publish.

This keeps the code palette identical to the design palette by construction. (Typography roles are defined in the build script, since M3 text styles aren't Figma variables.)

## Deployment / hosting (not done yet)

- **Package:** publish to **GitHub Packages** (`publishConfig.registry` is set). Needs `git init` + `npm publish` (a maintainer action).
- **MCP:** it's a long-lived Streamable-HTTP Node server (`tsx src/http.ts`). Deploy to an **always-on host** (Railway / Render / Fly.io). For Vercel specifically, wrap with `mcp-handler` in a Next.js route instead (Vercel serverless doesn't love long-lived streaming). See [docs/04-mcp-server.md](04-mcp-server.md).

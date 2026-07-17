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

## Deployment / hosting (LIVE — this section was written before launch)

> ⚠️ The rest of this doc describes the **original design**. Two things changed in practice — see [docs/08](08-current-state-and-handoff.md) for the current truth.

- **MCP: deployed and in use** at `https://design-system-mcp-two.vercel.app/mcp` (Vercel project `design-system-mcp`). Deployed **from the CLI** (`npx vercel deploy --prod --token …`).
  - **The Vercel project is NOT connected to GitHub.** Verified against the API: `link: NONE`, and every deployment is `source=cli`. **Pushing to `main` does not deploy anything.** It *looks* connected because the CLI attaches your local git metadata (`gitCommitMessage`, `gitCommitSha`) to each deploy, so the dashboard shows a commit next to it. The tell is `gitDirty: 1` — it deploys the working tree, not the commit.
  - Push and deploy are **two separate steps**. Doing one without the other is the most common way changes fail to reach coworkers.
- **Package:** still not published to a registry. This turned out not to block anyone — the connector serves the **real compiled CSS and component source** directly, so the mostly non-technical audience never installs anything.

**The distribution model in practice diverged from the table above:** the npm channel is largely unused, and the MCP carries *both* the guidance **and** the look (`get_stylesheet` returns the real `dist/index.css`). See [docs/08](08-current-state-and-handoff.md#how-its-actually-delivered-important--this-evolved).

# 04 — The MCP server (`design-system-mcp`)

Path: `design-system-mcp/`. An HTTP MCP server that serves the design system's guidance to Claude/agents. Built with `@modelcontextprotocol/sdk` + Express, stateless **Streamable HTTP**. Runs via `tsx` (no build step).

## Layout

```
design-system-mcp/
  package.json         deps: @modelcontextprotocol/sdk, express, zod; scripts dev/start (tsx)
  tsconfig.json        NodeNext
  src/
    content.ts         readText/readJson — reads content/ FRESH per request
    server.ts          buildServer(): registers the tools
    http.ts            Express app; POST /mcp (stateless), GET /health
  content/             ← EDIT THESE to update the system (no code change)
    onboarding.md      start-here for a coworker's agent
    design-rules.md    token / typography / color rules
    visual-language.md the design PERSONALITY (for building new components)
    components.json    package + component catalog with props
    kpis.json          per-team KPI content (currently generic — Phase 1)
```

**Design principle:** all substance is in `content/*`, read fresh on every request. Updating the system means editing those files and redeploying — never touching `src/`.

## Tools

`server.ts` registers these (verified working locally):

| Tool | Args | Returns |
|---|---|---|
| `get_onboarding` | — | `onboarding.md` — the start-here steps |
| `get_design_rules` | — | `design-rules.md` — token/type/color rules |
| `get_visual_language` | — | `visual-language.md` — personality for NEW components |
| `list_components` | — | `components.json` — package + component APIs |
| `list_teams` | — | team names with KPIs (Phase 1: "none defined yet" message) |
| `get_team_kpis` | `team: string` | Phase 1: generic KPI *presentation* guidance from `kpis.json._guidance`. Phase 2: a team's approved list once teams are added as keys. |

## Content files — what to edit

- **`onboarding.md`** — the 3-step start-here (install → follow rules → present KPIs well; call `get_visual_language` before building anything new).
- **`design-rules.md`** — the hard rules (never hardcode; use `.text-*`; color usage; how to build unlisted components). KPI section is Phase-1 soft ("present well", not mandated).
- **`visual-language.md`** — the personality: flat/calm, one gold accent, radius language (pill/8px/14px), bordered-not-shadowed, minimal data-viz, icons, states, motion, copy, and a "when inventing a new component" checklist. This is the file that keeps novel components on-system.
- **`components.json`** — the package version, install line, and each component's import + props + summary. **Keep in sync when the package changes.**
- **`kpis.json`** — currently `{ _status, _guidance }` only (Phase 1: generic presentation guidance). **Phase 2:** add team keys, e.g.
  ```json
  "marketing": { "confirmed": true, "coreKpis": [ { "name": "ROAS", "definition": "…", "why": "…" } ], "guidance": "…" }
  ```
  `get_team_kpis` automatically returns a team's list when its key exists; otherwise it returns `_guidance`.

## Run locally

```bash
cd design-system-mcp && npm install
npm run dev        # http://localhost:3000/mcp   (health: http://localhost:3000/health)
```
Quick manual check (SSE responses; strip the `data:` prefix):
```bash
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Deploy (not done yet)

It's a long-lived Streamable-HTTP server. Deploy to an **always-on host** (Railway / Render / Fly.io): start command `npm start`, expose the port, you get `https://HOST/mcp`.

> Vercel note: Vercel serverless doesn't suit a long-lived streaming server. To use Vercel, rewrap the handler with `mcp-handler` inside a Next.js app-router route (`app/api/[transport]/route.ts`) instead of the Express entry.

## How coworkers connect it (one time)

```bash
claude mcp add --transport http lsm-design https://HOST/mcp
```
Plus one line in their project `CLAUDE.md`:
> Use the Little Star Media design system. At the start of dashboard work, call `get_onboarding`, follow `get_design_rules` / `get_visual_language`, and check `get_team_kpis`.

## Adding a new tool

In `server.ts`, `server.registerTool(name, { title, description, inputSchema? }, handler)`. Use `text()`/`json()` helpers to return content. Put any served data in `content/` and read it with `readText`/`readJson` so it stays editable.

# lsm-design-system-mcp

The auto-updating channel for the Little Star Media design system. It's an **MCP server** that serves two things to Claude:

1. **The design system** — onboarding, the design rules, and the component list (so coworkers' dashboards look the same).
2. **KPI governance** — each team's approved core KPIs (so dashboards surface the *right* metrics).

Coworkers add it **once**; when you edit the content and redeploy, everyone's Claude gets the update automatically — no re-download, no touching their setup.

## What it exposes (tools)

| Tool | Purpose |
|---|---|
| `get_onboarding` | Start-here: what the system is, install, mandatory steps |
| `get_design_rules` | Token/typography/color rules |
| `list_components` | Package + available/planned components |
| `list_teams` | Teams that have approved KPIs |
| `get_team_kpis` | A team's sanctioned core KPIs (call before designing) |

All content lives in `content/` (`*.md`, `*.json`). **Updating the system = editing those files** — no code changes.

## Run locally

```bash
npm install
npm run dev       # http://localhost:3000/mcp   (health: /health)
```

## Deploy (host once, everyone points at it)

Any always-on Node host works (Railway, Render, Fly.io, a small VM). Build step isn't required — it runs `tsx src/http.ts`. Set the start command to `npm start` and expose the port. You'll get a public URL like `https://ds.littlestarmedia.com/mcp`.

> Vercel note: this is a long-lived Streamable-HTTP server. For Vercel specifically, wrap it with `mcp-handler` in a Next.js route instead; for a first deploy, an always-on host is simpler.

## How coworkers connect it (one time)

In Claude Code:

```bash
claude mcp add --transport http lsm-design https://YOUR-HOST/mcp
```

Then add one line to their project's `CLAUDE.md`:

> Use the Little Star Media design system. At the start of dashboard work, call `get_onboarding`, follow `get_design_rules`, and check `get_team_kpis` for the relevant team.

Their own CLAUDE.md and progress stay untouched — the system lives here, not in their file.

## Updating

1. Edit `content/onboarding.md`, `content/design-rules.md`, `content/components.json`, or `content/kpis.json`.
2. Redeploy (or restart). Content is read fresh per request, so changes take effect immediately.
3. Everyone's next Claude session sees the update. Nothing for them to install.

### KPI sign-off
`content/kpis.json` ships with **placeholder** KPIs (`confirmed: false`). Replace each team's list with the real agreed metrics and set `confirmed: true` once a team lead approves.

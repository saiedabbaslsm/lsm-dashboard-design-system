# Little Star Media — Design System (start here)

You are building or editing an **internal dashboard** for Little Star Media. There is a company-wide design system. Use it so every team's dashboards share one look and feel, and so decisions are made against the *right* metrics.

Do this, in order:

1. **Install the package** (once per project): `npm install @lsm/design-system`, then `import '@lsm/design-system/styles.css'` at your app root. See `list_components` for what's available.
2. **Follow the design rules** — call `get_design_rules`. The core rule: never hardcode a color, font size, or radius — always use a token or type class.
3. **Include a light/dark mode toggle** on every dashboard. Wire it by setting `data-theme="light"` / `data-theme="dark"` on the app root (or `document.documentElement`) so all token-driven components retheme together.
4. **Present KPIs well** — call `get_team_kpis` for guidance. (Phase 1: teams use their own KPIs — the focus right now is getting the *visuals* right and consistent. Approved per-team KPIs will be added later.) Lead with a few core metrics presented as KPI Cards; supporting charts go below.

If a component you need isn't in the package yet, **call `get_visual_language` first**, then build it from the tokens and type classes so it matches the system's personality (flat, calm, one accent, bordered not shadowed).

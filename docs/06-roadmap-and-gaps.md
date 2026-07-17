# 06 — Status, roadmap & known gaps

> ⚠️ **This file lags reality. [docs/08](08-current-state-and-handoff.md) is the current truth.** The connector is live and in daily use; the "not deployed" gap below is stale and has been corrected in place.

## Status (what's done)

- ✅ **Figma design system** — tokens (M3 Color/Fixed/Extended/Gradients), 30 Roboto text styles (M3 expressive, standard + emphasized), and 6 component sets (Button, KPI Card, Text Field, Checkbox, Switch, Chip). A "Sample Dashboard" section assembled from instances.
- ✅ **Token pipeline** — `tokens.json` (from Figma) → `build:tokens` → `tokens.css` / `typography.css` / `tokens.ts`. Tested.
- ✅ **npm package `@lsm/design-system`** — core components ported to React, token-driven, typed, `npm run typecheck` clean, and built with `tsup` to `dist/` (ESM/CJS/types/bundled CSS).
- ✅ **MCP server** — 6 tools (`get_onboarding`, `get_design_rules`, `get_visual_language`, `list_components`, `list_teams`, `get_team_kpis`), content in editable files, runs and verified locally.
- ✅ **Visual-language doc** — the personality spec that governs new/unlisted components.
- ✅ **End-to-end test** (`demo/`) — a Vite app consuming the package like a coworker, with package table/chart/insight/flow components plus novel dropdown/funnel/activity patterns that landed on-system.

## Known gaps / bugs

1. ~~**Not published / not deployed.**~~ **OUTDATED.** The repo is on GitHub (`saiedabbaslsm/lsm-dashboard-design-system`) and the MCP is live at `https://design-system-mcp-two.vercel.app/mcp`. The package is still unpublished, which is fine — the connector serves the real CSS + component code, so the (mostly non-technical) audience installs nothing. **Deploy is CLI-only; pushing does not deploy** — see [docs/02](02-architecture.md#deployment--hosting-live--this-section-was-written-before-launch).
2. **Per-team KPIs are placeholders (Phase 1).** `content/kpis.json` is generic on purpose. Do NOT fill in real team KPIs until Phase 2 is explicitly started.
3. **Stray root files** — `button.css` and `m3-tokens (1).css` at the repo root are early scratch artifacts, superseded by `design-system/`. Safe to delete.
4. **Icons decoupled by design** — components take icon elements as props; the package intentionally has no icon dependency. Consumers use `lucide-react` (the Figma icons are Lucide too).

## Roadmap (suggested order)

**Round out the library (Phase 1 — visuals):**
- [x] Fix `KpiCard` native prop / `onClick` forwarding.
- [x] Formalize the demo's proven **`DataTable`** and **`LineChart`** components into the package, including alternating table rows and multi-line actual/predicted/target charts.
- [x] Formalize the boss-dashboard patterns into **`ActionInsightList`** (ranked impact tiles preferred; rail secondary) and **`SourceFlowMap`** (curved lines, thickness = contribution).
- [ ] Formalize the remaining demo dropdown into the package as **`Select`/`Dropdown`**.
- [ ] Consider more primitives as needed: radio, badge, tabs/segmented control, menu.

**Go live:**
- [x] Add a `tsup` build for `@lsm/design-system`.
- [x] `git init` + push to GitHub. (`publish @lsm/design-system` — deferred, not needed for the current audience.)
- [x] Deploy the MCP to an always-on host; public URL is `https://design-system-mcp-two.vercel.app/mcp`.
- [x] Onboard coworkers and run real dashboard builds — **done, and the feedback drove most of the current rules** (see [docs/08](08-current-state-and-handoff.md#what-real-usage-taught-us-dont-re-learn-these)).
- [ ] Get the boss's sign-off on the look → this is the gate for **Phase 2 (per-team KPIs)**.

**Phase 2 — KPI governance (only after sign-off):**
- [ ] With each team lead, define their 3–5 approved core KPIs.
- [ ] Add them to `content/kpis.json` as team keys with `confirmed: true`. `get_team_kpis` starts returning them automatically.
- [ ] Optionally strengthen `design-rules.md` to make leading with core KPIs a requirement, not just guidance.

## Where to look when...

- **…changing a color/token** → Figma variable → re-export `design-system/tokens/tokens.json` → `npm run build`. Never edit generated CSS.
- **…changing a rule the agents follow** → `design-system-mcp/content/*.md` (redeploy MCP). No code change.
- **…adding/altering a component** → `design-system/src/components/…` + mirror in Figma + update `content/components.json`.
- **…rolling out to coworkers** → follow [docs/07-rollout.md](07-rollout.md).
- **…the demo looks blank** → view `http://localhost:5173` (the Vite server), not the static `index.html`.
- **…project context/decisions** → this `docs/` folder and `AGENTS.md`.

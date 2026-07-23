# 08 — Current state & handoff

Read this to pick up the project where it stands. It captures what's **live**, how it's delivered, what was learned from real coworker usage, how to operate it, and what's next. (Older docs 01–06 explain the original design; some of their "not deployed yet" notes are now out of date — this file is the current truth.)

## Where things stand (LIVE)

- **The MCP connector is deployed and in use.** URL: `https://design-system-mcp-two.vercel.app/mcp` (Vercel project `design-system-mcp`). Coworkers have connected it and built real dashboards.
- **The npm package builds** to `design-system/dist/` (tsup). Not yet published to a registry — but the connector serves the component *code* + stylesheet directly, so coworkers don't need to install anything.
- **Figma** has all components incl. `KPI Card Tone` and the new `Badge` set, and is **verified in token parity with code** (see "Figma parity" below).

### State as of 2026-07-16

**Everything is pushed and deployed.** `main` is at `0aab8e0` on GitHub, and production is `READY` on the same SHA (verified: 20/20 checks against the live `/mcp`, including regression checks on the earlier rounds). Nothing is sitting local.

**Remember: push ≠ deploy.** The Vercel project is not git-connected, so any future change needs BOTH `git push` AND `npx vercel deploy --prod` from `design-system-mcp/`. Credentials at `~/.lsm-design-system/credentials.md` (both tokens filled in and verified). Confirm with the user before a production deploy.

## How it's actually delivered (important — this evolved)

The audience is **mostly non-technical** (marketing, commercial, managers) on **Claude.ai**, plus some Claude Code / Codex users. They don't run React projects — they ask Claude for a **report or dashboard**. So the connector serves the **look itself**, not just rules:

- `get_stylesheet` → the REAL compiled CSS (`design-system/dist/index.css`), so output looks identical to the system. **It prepends a `REQUIRED_HEADER`** (in `design-system-mcp/src/server.ts`) with paste-ready snippets for the two most-skipped must-haves: **Lucide icons** (CDN) and a **light/dark toggle**. This is the single most effective lever — coworkers' Claude always calls `get_stylesheet`, so putting mandates *in its output* is how they actually get followed.
- `get_component_code(name)` → the real `.tsx` + `.css` for a component (mirror the markup/`ds-` classes for an HTML report, or use as code for an app).
- `get_onboarding` routes by task: **HTML report** (embed stylesheet + markup, no install) / **deployed app** (drop component code in, wire APIs, deploy) / **novel component** (build from tokens + visual language).
- Content lives in `design-system-mcp/content/` (onboarding.md, design-rules.md, visual-language.md, components.json, kpis.json) + synced assets (`stylesheet.css`, `components-src/`). All read fresh per request.

### How coworkers connect (per surface — this is a real gotcha)
`claude mcp add` is **Claude Code only**. Claude.ai (web/desktop) uses **Settings → Connectors → Add custom connector** (paste the `/mcp` URL; no auth needed — confirmed working). Team/Enterprise admins can add it **org-wide once** so it appears for everyone. Codex uses `npx mcp-remote <url>` in `~/.codex/config.toml`. Full instructions: `design-system-mcp/CONNECT.md`.

## Colour / tone (latest work)

Coworker feedback: dashboards came out **bland** when there was no trend/chart to carry colour. Fix, now shipped everywhere:

- **`KpiCard` has a `tone` prop:** `neutral` (default, white + green/red chart) · `brand` (gold `primaryFixed`) · `gradient` (gold `gradientTonal`). On toned cards the **chart + text auto-go dark** (via `--ds-on`/`--ds-delta`/`--ds-chart` vars + `color-mix`) so they stay legible — never a green chart on a gold card.
- **60/30/10 colour rule (in `design-rules.md`), applied PER SCREENFUL** (what's visible, not the whole scroll): ~60% neutral base, ~30% neutral surfaces (cards/panels/tables), ~10% **gold accent** (ONE toned hero card + the primary button). Semantic green/red (trend up/down) are functional and exempt. Don't tone every card.
- **Figma:** the tone is in a separate `KPI Card Tone` component set (`Surface: Neutral/Brand/Gradient × Size: Default/Compact`) — NOT yet folded into the main `KPI Card` set (`Size × Trend`). See "Next tasks".

## Operating it (the update loop)

- **Change a rule the AI follows** (colour balance, icons, etc.) → edit `design-system-mcp/content/*.md` → redeploy the connector. No code.
- **Change a token (colour/type)** → edit in Figma → re-export `design-system/tokens/tokens.json` → `npm run build` in `design-system/` → `npm run sync-assets` in `design-system-mcp/` → commit → redeploy.
- **Change/add a component** → edit `design-system/src/components/…` → `npm run build` → `npm run sync-assets` → update `content/components.json` → commit → redeploy. Mirror it in Figma.
- **Redeploy the connector** → from `design-system-mcp/`: `npx vercel deploy --prod` (needs the Vercel token — see credentials). It is **CLI-deploy, not git-auto-deploy** — pushing to GitHub alone does NOT update the live connector.
- **Credentials** (GitHub PAT for push, Vercel token for deploy) are kept PRIVATE at `~/.lsm-design-system/credentials.md` (outside the repo, never committed). Fill it with fresh tokens. If it's missing, ask the user.

## What real usage taught us (don't re-learn these)
- Guidance only works if the AI reads it → put must-haves in `get_stylesheet`'s output, not just onboarding.
- Multi-line charts (actual vs target) must be **plain lines, no area fill** (area fill is single-series only).
- Scope: the system is for **dashboards/reports/apps**. For social/print, use brand colours + fonts but NOT the dashboard rules — there's a scope note in `onboarding.md`. A dedicated social/brand kit is a possible future track (the `--gradient-*` tokens are for exactly that).

### The single most useful lesson (2026-07-16 feedback round)

Five separate pieces of coworker feedback — faint status chips, cramped padding, white text on gold in dark mode, mismatched icon sizes, a bordered pill — all had **the same root cause: the system failed to *say* something.** Their Claude was not being careless; it improvised precisely where we left a gap, and it improvised badly in the same predictable places:

| Symptom reported | Actual gap |
|---|---|
| Status chips look faint + have an ugly stroke | No status component existed → `Chip` (interactive, bordered) got borrowed. No amber/blue tokens at all. |
| Padding too tight, "again and again" | Every component already used `height + padding: 0 Xpx`, but **that convention was written down nowhere**. |
| White text on the gold card in dark mode | `KpiCard tone="brand"` solved it *inside the component*; no reusable utility existed for a hand-built gold surface. |
| Check/✕ icons different sizes | The rule said "size icons 16–20px" but gave **no mechanism**, and `lucide.createIcons()` emits 24×24. |

**So when feedback arrives, ask "what didn't we say?" before "what did it do wrong?"** The fix is usually (a) ship the missing component, and (b) put the rule in `get_stylesheet`'s `REQUIRED_HEADER` — the one thing their Claude always reads. Rules in `onboarding.md` alone get skipped.

Corollary: **a bug that only appears in dark mode will ship.** `--color-on-surface` is near-black in light, so a gold card styled with it looks perfect until someone toggles. Always check both modes.

## UX rules round (2026-07-20)

Feedback: a long report looked good but was "page after page with no way to get around it". Same root cause as the visual rounds — **every rule we had was about appearance; nothing covered whether the artifact is usable once it's longer than a screen.**

Six rules added to `design-rules.md`, sourced from the user's UX Strategy reference and filtered to this project's scope. Each has an explicit **anti-rule** so it doesn't over-fire:

- **Structure & navigation** — triggered on **section count** (countable while writing) rather than "is it long" (a judgement the model gets wrong both ways). 1–3 → none · 4–7 → contents block · 8+ → sticky sidebar. Heading hierarchy is folded in as a *precondition*, since the contents block is generated from headings. Anti-rule: never on a single-screen dashboard.
- **Line length** 65–75ch (`.ds-prose`) — excludes tables/charts/KPI rows.
- **Empty & no-data** — never a blank box; never `0`/`NaN` for unknown; muted colour, not error.
- **Base-8 spacing** (`--space-1..9`) — we had control heights but no spacing scale.
- **Density cap** 5–7 tiles per view, group beyond.
- **Verb + noun button labels**; destructive styling on the final confirm only.

Backed by real CSS in `design-system/src/styles/layout.css`. **This is the pattern that works:** a rule with a class behind it gets followed; a rule that is only prose gets skipped.

**What was deliberately excluded** from the source doc, and why it matters: mobile-app patterns (bottom nav, thumb zones, swipe — actively wrong for desktop dashboards), modals/focus traps, onboarding/paywall states, and every QA item Claude cannot perform in a chat (cross-browser, Lighthouse, real-device and screen-reader testing). **Unactionable rules teach the model that the rules list contains things you skip**, which weakens the rules that are actionable.

**Still on the table, deferred by the user:** "colour is never the only signal" (pair colour with icon/label). We comply by accident in `Badge` and multi-line charts but not as a principle — a bar chart or colour-only status column still fails it.

**Header note:** `REQUIRED_HEADER` grew 3,674 → 4,342 chars with item 5. If the earlier mandates start slipping, item 5 is the first candidate to pull back to `design-rules.md` only.

## Open issue — mobile (raised, NOT yet diagnosed)

The user reported: **"not working on mobile"**. This was raised at the very end of the last session and **no diagnosis or fix was done** — do not assume the cause. Before touching anything, establish *what* is broken and *where*:

- **Which artifact is broken?** Three different things could be meant: (a) dashboards/reports that coworkers' Claude generates from the connector, (b) the `demo/` Vite app, or (c) the components themselves at narrow viewports. **Ask the user / get a screenshot before assuming.**
- **Most likely suspect if it's (a) or (c):** nothing in the system currently states a **responsive rule**. `design-rules.md` and `visual-language.md` have no breakpoint guidance, so coworkers' Claude is free to emit fixed multi-column grids (e.g. the demo's `grid-template-columns: repeat(4, minmax(0,1fr))` in `demo/src/demo.css`) that never collapse on a phone. `KpiCard` itself is fill-container and fine; the **layouts around it** are the risk. If confirmed, the fix follows the established lever: add a responsive rule to `design-rules.md` **and** to the `REQUIRED_HEADER` in `design-system-mcp/src/server.ts` (that header is what actually gets followed), then redeploy.
- The user's phrasing "**lets deploy on vercel**" in the same breath suggested they wanted to *see* it on a real URL to test on a phone — the connector is already on Vercel, so this likely meant deploying the **demo app** as a testable link. Clarify which.

## Figma parity (updated 2026-07-16)

Figma now matches code for the Badge work — verified by reading the variables back out of Figma and diffing against `tokens.json`: **all 17 `M3 Extended` variables identical in both modes.**

- `M3 Extended` gained the **`warning`** and **`info`** families, plus five **`badgeSurface*`** fills.
- **Why `badgeSurface*` exists:** `badge.css` used to compute its fill with `color-mix()`. A computed CSS value **cannot be a Figma variable**, so the fill would have had to be hardcoded in Figma and would not track Light/Dark. These tokens hold the exact same colours (verified: max drift 0.46/255 — invisible), so design and code share one source of truth.
- **`Badge` component set** (`Tone: Neutral/Danger/Warning/Success/Info × Lead: Dot/Icon/None`, 15 variants) is on Page 1 in a `Badge` section at (1500, 1700). Every fill/text/dot is **variable-bound**, so it re-themes with the mode.
- Badge type is **pinned** to label-large (14/500/20). Before this it set no `font-size` and inherited — the same component rendered at 16px in a tile and 14px in a table, which Figma could not have mirrored.

## Next tasks (suggested)
0. **Push + deploy the local commits** (see the uncommitted-state warning at the top). Nothing after `e8eb075` is live.
1. **Diagnose the mobile issue above** — live user feedback, still undiagnosed. Get a screenshot first; don't assume the cause.
2. **Figma: remap `ActionInsightList`'s `watch` tone.** Code now uses `--color-warning`; Figma may still imply gold. Small, but it's live drift.
3. **Figma consolidation (the pending polish):** fold `Surface` into the main `KPI Card` set → one set with `Size × Trend × Surface` (18 variants). On toned surfaces the chart is always the dark tonal treatment (trend still sets the arrow/delta direction). Then delete the separate `KPI Card Tone` set. Build via the `figma-console` bridge (`figma_execute`) — reuse the tone build logic already in this project's history.
4. **Consider connecting Vercel to GitHub** so `main` auto-deploys. The user already *believes* this is how it works (it isn't — see [docs/02](02-architecture.md)), which makes "pushed but forgot to deploy" a standing trap. Wiring it up would make the mental model true.
5. **Narrow the GitHub PAT.** It currently carries `admin:org`, `user`, `write:packages`, `codespace`, `project` and repo `admin` when it only needs `repo`. Blast radius is the whole org if it leaks.
6. **Publish the npm package** to a registry (for engineers building real apps) — optional; the connector-served code covers non-technical use.
7. **Phase 2 — per-team KPIs:** only after the boss signs off on the look. Add teams to `content/kpis.json` with `confirmed:true`; `get_team_kpis` returns them automatically.

## Verification habits that caught real bugs (worth copying)

The visual work in this project is easy to get wrong and easy to *believe* is right. What actually worked:

- **Read computed styles, not screenshots.** `getComputedStyle` in the demo caught the squashed icons (8.6 × 17.5, not "small"), the three different Badge font sizes, and the `DataTable` selector collision. A screenshot would have shown none of them clearly.
- **Assert on both themes programmatically.** Toggle `data-theme` and diff — that's how the gold-surface bug was proven (`rgb(12,1,0)` in light vs `rgb(242,220,172)` in dark from the *same* CSS).
- **Diff Figma against `tokens.json` by reading Figma back.** Writing the same value twice isn't proof.
- **Verify the live connector, not the local file.** `design-system-mcp/` content is only live after a CLI deploy. There's a working script pattern in the session history: POST JSON-RPC to `/mcp`, `initialize`, then `tools/call`, and regex the returned text.
  - ⚠️ **JSON-RPC ids must be an integer or string.** A `Math.random()` id gets rejected with `Parse error: Invalid JSON-RPC message`, and if your code reads `result.content[0].text` with a fallback it will silently report the error text as tool output — i.e. a green deploy looks like a total failure. This cost real time; use `++counter`.

## Map of the repo (quick)
- `design-system/` — the code package (tokens pipeline + React components + `dist/`).
- `design-system-mcp/` — the connector (src + editable `content/` + `CONNECT.md`); deployed to Vercel.
- `demo/` — a Vite app that consumes the package like a coworker (a toned hero card is wired in the signal-KPIs row as a live example).
- `docs/` + `AGENTS.md` — this documentation.
- Figma file `RoiwgeonsmbhJV9sCyFUZk` — design source of truth.

**Run the demo to verify anything visual:** `cd demo && npm run dev` → `http://localhost:5173` (NOT the static `index.html` — it's an empty `#root`). The demo aliases `@lsm/design-system` to `../design-system/dist`, so **run `npm run build` in `design-system/` after changing the package** or the demo serves stale code. HMR often fails across a `dist` rebuild — hard-reload.

**The demo is also the regression suite.** It renders every component, both `ActionInsightList` variants, all five `Badge` tones, and both themes. When `rail` was *not* rendered there, it silently rotted (its chips drifted and its rank lost its radius). **If you add a variant, render it in the demo** — unexercised code is where the bugs hide.

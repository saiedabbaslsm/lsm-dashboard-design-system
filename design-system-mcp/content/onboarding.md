# Little Star Media — Design System (start here)

You are building something for Little Star Media — a **report, dashboard, or web app**. There is a company-wide design system. Use it so everything shares one look and feel, and so decisions are made against the right metrics. This works for non-technical users (marketing, commercial, managers) as well as engineers — you do the technical work, they just describe what they want.

## Always do this
1. **Get the look.** Call `get_stylesheet` — it returns the REAL compiled CSS (tokens for light+dark, the type scale, and every component's styles). Everything you build must use it, so it looks identical to the design system.
2. **Follow the rules.** Call `get_design_rules` (never hardcode colors/sizes — use tokens `var(--color-*)` and type classes `.text-*`) and, before building anything not already a component, `get_visual_language` (the personality).
3. **Load Roboto** (the system font): add `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`.
4. **Use the components.** Call `list_components` to see what exists, and `get_component_code` for any one — it returns the real `.tsx` + `.css`. Mirror its markup and `ds-` class names.
5. **Light/dark:** support both by toggling `data-theme="light"` / `data-theme="dark"` on the root element. All tokens retheme automatically.
6. **KPIs:** call `get_team_kpis`. (Phase 1: teams use their own KPIs — just present a few core metrics as KPI cards, supporting charts below. Don't crowd the top.)

## Then pick the delivery for what they asked

### A) A one-off report or dashboard page (most common)
Produce a **self-contained HTML file**: put the `get_stylesheet` CSS in a `<style>` tag, add the Roboto link, and write the body using the component markup + `ds-` classes (translate the JSX from `get_component_code` into HTML — the class names are the same). No install, no build, no dependencies. Open it in a browser and it looks exactly like the system. Ideal when someone pastes data and asks for a report.

### B) A real web app to deploy (e.g. on Vercel, with live APIs)
Scaffold a React app (Vite or Next). You install everything the environment needs (Node, etc.) as part of the work — the user is not technical. Two ways to use the components:
- **Simplest / most reliable:** drop the component source from `get_component_code` into the project (e.g. `src/lib/ds/`), import `get_stylesheet` as a global CSS file, and use the components locally. No package registry needed.
- Wire the live data/APIs the user describes, then deploy (e.g. to Vercel).

### C) Something the system doesn't have yet
Call `get_visual_language`, then build it from tokens + type classes + existing components so it still looks like the family (flat, calm, one gold accent, bordered not shadowed, minimal charts). Reuse existing components rather than reinventing.

## The golden rule
Whatever you build — an HTML report or a deployed app — it must look like it came from the same design system: same gold accent, same type, same KPI cards and charts. The `get_stylesheet` CSS + component markup guarantee that. Never hardcode a color, font size, or radius.

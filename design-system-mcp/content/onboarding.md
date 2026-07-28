# Little Star Media — Design System (start here)

You are building something for Little Star Media — a **report, dashboard, or web app**. There is a company-wide design system. Use it so everything shares one look and feel, and so decisions are made against the right metrics. This works for non-technical users (marketing, commercial, managers) as well as engineers — you do the technical work, they just describe what they want.

## ⚠ Must include in EVERY dashboard (these get skipped — don't)
1. **Lucide icons** — every KPI card has a top-right icon, and use Lucide wherever an icon fits. HTML report: `<script src="https://unpkg.com/lucide@latest"></script>`, place `<i data-lucide="NAME"></i>`, then call `lucide.createIcons()`. React app: `lucide-react`.
2. **Light/dark toggle** — a *visible* toggle button in the header, wired to `data-theme` on `<html>`. Verify both modes render correctly.

`get_stylesheet` returns paste-ready snippets for both — use them. Don't deliver a dashboard without icons and a working theme toggle.

## Scope — what this system is (and isn't)
This system is for **reports, dashboards, data apps, and data-driven slide decks** (internal analytics, performance reviews, CRM decks). **A performance deck is a report that happens to live in slides — it IS in scope** and gets the full discipline (tables, semantic colour, comparisons). See delivery route **D** below. Data lives in HTML, apps, AND PowerPoint/PDF — the medium changes, the discipline doesn't.

Only **social media assets, print, and marketing creative** are out of scope:
- **Keep it on-brand:** you MAY use the brand colours and fonts (from `get_stylesheet` or `get_brand_values`) so it still reads as Little Star Media.
- **Don't force the dashboard rules onto it.** Social/marketing is a different medium — bold, high-contrast, platform-sized, gradients welcome (`--gradient-*` tokens). Don't apply KPI cards / hairline borders / the 60/30/10 balance to a social post — that would make weak creative.
- **Be honest:** there's no dedicated social/brand playbook yet. Match the palette and typography, design genuinely good creative for the medium, and say plainly that full system rules cover data (dashboards/reports/decks), not social.

## Always do this
1. **Get the look.** Call `get_stylesheet` — it returns the REAL compiled CSS (tokens for light+dark, the type scale, and every component's styles). Everything you build must use it, so it looks identical to the design system.
2. **Follow the rules.** Call `get_design_rules` (never hardcode colors/sizes — use tokens `var(--color-*)` and type classes `.text-*`) and, before building anything not already a component, `get_visual_language` (the personality).
3. **Load Roboto** (the system font): add `<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`.
4. **Use the components.** Call `list_components` to see what exists, and `get_component_code` for any one — it returns the real `.tsx` + `.css`. Mirror its markup and `ds-` class names.
5. **Light/dark:** support both by toggling `data-theme="light"` / `data-theme="dark"` on the root element. All tokens retheme automatically.
6. **Icons & charts (common mistakes):** give **every KPI card a top-right Lucide icon** (HTML: load Lucide via CDN — `<script src="https://unpkg.com/lucide@latest"></script>`, `<i data-lucide="NAME"></i>`, then `lucide.createIcons()`; React: `lucide-react`). **Multi-line charts (e.g. actual vs target) are plain lines with NO area fill** — the soft area fill is only for a single-series line. See `get_design_rules`.
7. **KPIs:** call `get_team_kpis`. (Phase 1: teams use their own KPIs — just present a few core metrics as KPI cards, supporting charts below. Don't crowd the top.)

## Then pick the delivery for what they asked

### A) A one-off report or dashboard page (most common)
Produce a **self-contained HTML file**: put the `get_stylesheet` CSS in a `<style>` tag, add the Roboto link, and write the body using the component markup + `ds-` classes (translate the JSX from `get_component_code` into HTML — the class names are the same). No install, no build, no dependencies. Open it in a browser and it looks exactly like the system. Ideal when someone pastes data and asks for a report.

> **If it's a long report, navigation is not optional.** A real complaint from a coworker: "page after page of content with no way to get around it." Count your top-level sections — 4–7 gets a contents block of jump links, 8+ gets a sticky sidebar, and anything over ~3 screens opens with a 3–5 bullet summary. Cap body text with `class="ds-prose"`. Full rule: `get_design_rules` → **Structure & navigation**. (A single-screen dashboard needs none of this.)

### B) A real web app to deploy (e.g. on Vercel, with live APIs)
Scaffold a React app (Vite or Next). You install everything the environment needs (Node, etc.) as part of the work — the user is not technical. Two ways to use the components:
- **Simplest / most reliable:** drop the component source from `get_component_code` into the project (e.g. `src/lib/ds/`), import `get_stylesheet` as a global CSS file, and use the components locally. No package registry needed.
- Wire the live data/APIs the user describes, then deploy (e.g. to Vercel).

### C) Something the system doesn't have yet
Call `get_visual_language`, then build it from tokens + type classes + existing components so it still looks like the family (flat and bordered not shadowed, gold as the 10% accent, colour used to encode meaning per 60/30/10). Reuse existing components rather than reinventing.

### D) A slide deck (PowerPoint, Google Slides, Keynote, PDF export)
A data/performance deck is a **report in slide form** — apply the full discipline (tables, semantic colour, comparisons), NOT the social/marketing treatment.

**Critical: a real `.pptx` / `.pdf` has NO CSS.** `get_stylesheet` is useless for a slide file — colours there are RGB fills painted on shapes, not stylesheet rules. **Call `get_brand_values`** for the palette as raw hex to use as fills, plus the slide table + comparison recipe.

- **Complementary tools:** Claude's PowerPoint capability (the `pptx` skill) builds the *file*; this connector supplies the *brand*. Use both — the skill doesn't know our colours, and we don't write `.pptx` bytes.
- **Tables are the main surface in decks — don't leave them grey.** Banded rows, a gold header, right-aligned numbers. Full recipe: `get_design_rules` → **Slides & decks**.
- **Comparisons (this month vs last, A vs B) must show direction with colour** — the single most common deck miss. Better = success green, worse = error red, per the metric (remember "fewer is better" metrics like losses/cost/complaints invert it). See the same rule section.
- A `.pptx` has no theme toggle — the deck carries both modes deliberately: **light content slides, gold or dark statement pages** (cover/dividers/verdicts). Palettes + rhythm: `get_brand_values`.

## The golden rule
Whatever you build — an HTML report or a deployed app — it must look like it came from the same design system: same gold accent, same type, same KPI cards and charts. The `get_stylesheet` CSS + component markup guarantee that. Never hardcode a color, font size, or radius.

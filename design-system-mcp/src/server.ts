import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readText, readJson } from './content.js';

type Kpis = Record<string, any>;

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const json = (v: unknown) => text(JSON.stringify(v, null, 2));

// Prepended to every get_stylesheet response so the two most-skipped requirements
// (Lucide icons + a light/dark toggle) are impossible to miss — with paste-ready snippets.
const REQUIRED_HEADER = `/* ==============================================================
   LSM DESIGN SYSTEM — REQUIRED in every dashboard/report (do NOT skip):

   1) LUCIDE ICONS — every KPI card gets a top-right icon, and use Lucide wherever
      an icon fits. For an HTML report, load Lucide once before </body>:
        <script src="https://unpkg.com/lucide@latest"></script>
      place icons with:   <i data-lucide="trending-up"></i>
      then run once:       <script>lucide.createIcons();</script>
      (React app: use the lucide-react package instead.)
      Metric → icon: revenue=dollar-sign, ROAS/growth=trending-up, CAC/cost=user-plus,
      conversion=target, users=users, orders=shopping-cart, spend=wallet.

      SIZE THEM — lucide.createIcons() emits 24x24 by default, so icons come out
      inconsistent unless you pin them. Always include this CSS:
        svg.lucide { width:16px; height:16px; flex:none; stroke-width:2; vertical-align:middle; }
      and override per context if needed (e.g. KPI card icons 18px). Icons in one
      list MUST all be the same size — mismatched check/x icons are a common bug.
      If you wrap an icon in a flex row (icon + label), the WRAPPER needs flex:none
      too, or the label squashes the icon to half width — it looks "too small" but
      is actually distorted. (Components with ds- classes already size their own
      icons; the rule above is for icons you place yourself.)

   2) LIGHT/DARK TOGGLE — put a visible toggle button in the header, wired to
      data-theme on <html>. Paste-ready:
        <button id="ds-theme-toggle" aria-label="Toggle theme" style="display:inline-flex;
          align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;
          border:1px solid var(--color-outline-variant);background:var(--color-surface-container-lowest);
          color:var(--color-on-surface-variant);cursor:pointer;"><i data-lucide="moon"></i></button>
        <script>(function(){var r=document.documentElement;r.dataset.theme=r.dataset.theme||'light';
          document.getElementById('ds-theme-toggle').addEventListener('click',function(){
          r.dataset.theme=r.dataset.theme==='dark'?'light':'dark';});})();</script>
      Verify BOTH modes look right (tokens re-theme automatically).

   3) GOLD SURFACES ALWAYS TAKE DARK TEXT — use class ds-surface-brand (or
      ds-surface-gradient) for any gold/hero card. Do NOT hand-pick colours:
      --color-on-surface is near-black in light so a gold card LOOKS fine, then
      flips to cream in dark mode and becomes unreadable. The classes below pin
      text to --color-on-primary-fixed (#111 in both modes). ALWAYS check dark mode.

   4) NEVER SIZE A PILL WITH VERTICAL PADDING — this is the most-repeated mistake.
      \`padding: 3px 8px\` on a chip/pill/badge always looks cramped. Set an explicit
      height, zero vertical padding, and centre. Copy this for ANY inline pill:
        display:inline-flex; align-items:center; gap:7px;
        height:28px; padding:0 12px;   /* horizontal ONLY */
        border-radius:8px;
      Heights: badge/status pill 28px · chip (clickable) 32px · button 32/40/48px
      · text field 52px. Cards/panels: 16-24px internal padding, never under 12px.
      Status pills use class .ds-badge (below) with data-tone="danger|warning|success|
      info|neutral" — prefer that over hand-rolling. Status pills have NO border.

   5) BEFORE YOU BUILD, COUNT THE SECTIONS — anything long needs a way to get
      around it. 1-3 sections: nothing, headings are enough. 4-7: a contents
      block of jump links at the top. 8+: a sticky sidebar + back-to-top.
      Give every section a stable id and a clean H1>H2>H3 hierarchy (the
      contents block is built from them). Long reports open with a 3-5 bullet
      summary. Cap body text at 65-75 chars (class ds-prose) — NOT tables or
      charts. Never add navigation to a single-screen dashboard.
      And never render a blank box: no data shows "No data" + why (class
      ds-empty / ds-no-data), never 0 or NaN. Detail: get_design_rules.

   Also load Roboto: <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
   Then put ALL the CSS below into a <style> tag (or a .css file).
   ============================================================== */

`;

export function buildServer(): McpServer {
  const server = new McpServer({ name: 'lsm-design-system', version: '0.1.0' });

  server.registerTool(
    'get_onboarding',
    {
      title: 'Design system — start here',
      description:
        'Read this FIRST for ANY Little Star Media build — an HTML report, a dashboard, or a deployed web app. Covers the mandatory steps and delivery. Non-negotiables: every dashboard uses Lucide icons (KPI cards get a top-right icon) and includes a light/dark toggle.',
    },
    async () => text(readText('onboarding.md'))
  );

  server.registerTool(
    'get_design_rules',
    {
      title: 'Design rules',
      description:
        'The rules that keep dashboards on-system: token usage (never hardcode colors/sizes), typography classes, color usage, and how to build components not yet in the package.',
    },
    async () => text(readText('design-rules.md'))
  );

  server.registerTool(
    'get_visual_language',
    {
      title: 'Visual language',
      description:
        'The design PERSONALITY — flatness, restraint, shape/radius language, spacing, data-viz style, icons, states. Read this when building a component or pattern that is NOT already in the package, so it still feels like the system (this is about visual style, not just tokens).',
    },
    async () => text(readText('visual-language.md'))
  );

  server.registerTool(
    'list_components',
    {
      title: 'List components',
      description:
        'The design-system components with their props/usage. For each, you can fetch the real source with get_component_code, and the stylesheet with get_stylesheet.',
    },
    async () => json(readJson('components.json'))
  );

  server.registerTool(
    'get_stylesheet',
    {
      title: 'Get the design-system stylesheet',
      description:
        'Returns the REAL compiled CSS (tokens light+dark, type scale, all components) PLUS the two things EVERY dashboard MUST include, with paste-ready snippets: (1) Lucide icons on KPI cards, (2) a light/dark toggle. Embed the CSS in a <style> tag (HTML) or .css file (app). Load Roboto.',
    },
    async () => ({ content: [{ type: 'text' as const, text: REQUIRED_HEADER + readText('stylesheet.css') }] })
  );

  server.registerTool(
    'get_component_code',
    {
      title: 'Get a component’s real source',
      description:
        'Returns the REAL source (.tsx + .css) for one component. For an HTML report, mirror its markup/`ds-` classes; for a React app, use the code directly. Pass a name like "KpiCard", "kpi-card", or "kpi card".',
      inputSchema: { name: z.string().describe('Component name, e.g. "KpiCard" (see list_components).') },
    },
    async ({ name }) => {
      const kebab = name.trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[\s_]+/g, '-').toLowerCase();
      let tsx = '';
      let css = '';
      try { tsx = readText(`components-src/${kebab}.tsx`); } catch { /* none */ }
      try { css = readText(`components-src/${kebab}.css`); } catch { /* none */ }
      if (!tsx && !css) {
        const { components } = readJson<{ components: string[] }>('components-src/index.json');
        return text(`No component "${name}". Available: ${components.join(', ')}.`);
      }
      return text(
        `Component: ${kebab}\n\n=== ${kebab}.tsx ===\n${tsx || '(none)'}\n\n=== ${kebab}.css ===\n${css || '(none)'}`
      );
    }
  );

  server.registerTool(
    'list_teams',
    {
      title: 'List teams',
      description: 'Team names that have approved core KPIs (pass one to get_team_kpis).',
    },
    async () => {
      const kpis = readJson<Kpis>('kpis.json');
      const teams = Object.keys(kpis).filter((k) => !k.startsWith('_'));
      return text(
        teams.length
          ? teams.join(', ')
          : 'No per-team KPIs defined yet (Phase 1). Teams use their own — call get_team_kpis for presentation guidance.'
      );
    }
  );

  server.registerTool(
    'get_team_kpis',
    {
      title: 'Get a team’s approved core KPIs',
      description:
        'The sanctioned core KPIs a team must lead its dashboards with. Call BEFORE designing a dashboard so it surfaces the right metrics.',
      inputSchema: { team: z.string().describe('Team name, e.g. "marketing" (see list_teams).') },
    },
    async ({ team }) => {
      const kpis = readJson<Kpis>('kpis.json');
      const key = team.trim().toLowerCase();
      const teams = Object.keys(kpis).filter((k) => !k.startsWith('_'));
      // Phase 2: return a team's approved list when defined.
      if (teams.includes(key)) return json({ team: key, ...kpis[key] });
      // Phase 1: no per-team mandates — return generic presentation guidance.
      return text(`${kpis._status}\n\n${kpis._guidance}`);
    }
  );

  return server;
}

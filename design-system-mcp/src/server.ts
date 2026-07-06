import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readText, readJson } from './content.js';

type Kpis = Record<string, any>;

const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const json = (v: unknown) => text(JSON.stringify(v, null, 2));

export function buildServer(): McpServer {
  const server = new McpServer({ name: 'lsm-design-system', version: '0.1.0' });

  server.registerTool(
    'get_onboarding',
    {
      title: 'Design system — start here',
      description:
        'Read this FIRST for ANY Little Star Media build — an HTML report, a dashboard, or a deployed web app. Explains the mandatory steps (get_stylesheet, get_design_rules, components) and how to deliver for each kind of request.',
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
        'Returns the REAL compiled CSS — tokens (light+dark), the M3 type scale, and every component style. Embed this (a <style> tag for an HTML report, or a .css file for an app) so components render IDENTICALLY to the design system. Requires loading the Roboto font.',
    },
    async () => ({ content: [{ type: 'text' as const, text: readText('stylesheet.css') }] })
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

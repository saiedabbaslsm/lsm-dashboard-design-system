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
        'Read this FIRST when building or editing a Little Star Media dashboard. Explains the design system, how to install it, and the mandatory steps (follow design rules, check the team KPIs).',
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
        'The design-system package: install command, and the available/planned React components with their props and usage.',
    },
    async () => json(readJson('components.json'))
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

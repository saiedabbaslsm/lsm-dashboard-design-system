import { useEffect, useState } from 'react';
import {
  ActionInsightList,
  Badge,
  Button,
  BarChart,
  type BarChartBarSeries,
  type BarChartLineSeries,
  Checkbox,
  Chip,
  DataTable,
  type DataTableColumn,
  KpiCard,
  LineChart as DsLineChart,
  type LineChartSeries,
  SourceFlowMap,
  Switch,
  TextField,
  type ActionInsightItem,
} from '@lsm/design-system';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarClock,
  Download,
  Eye,
  Gauge,
  LineChart as LineChartIcon,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react';
import { ChartPanel, type Metric } from './ChartPanel';
import { Dropdown } from './widgets';

const campaignCols: DataTableColumn[] = [
  { key: 'name', label: 'Partner' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
  { key: 'pipeline', label: 'Pipeline', numeric: true },
  { key: 'sla', label: 'SLA', numeric: true },
  {
    key: 'quality',
    label: 'Quality',
    numeric: true,
    tone: (v) => (parseFloat(String(v)) >= 90 ? 'success' : parseFloat(String(v)) < 80 ? 'error' : undefined),
  },
];
const campaignRows = [
  { name: 'Northstar Casino', status: <Badge tone="success">Green</Badge>, owner: 'Maya', pipeline: '£142k', sla: '4h', quality: '94%' },
  { name: 'Royal Leads', status: <Badge tone="warning">Amber</Badge>, owner: 'Jonas', pipeline: '£118k', sla: '6h', quality: '91%' },
  { name: 'Playline Media', status: <Badge tone="danger">Red</Badge>, owner: 'Amir', pipeline: '£86k', sla: '11h', quality: '83%' },
  { name: 'Bingo Direct', status: <Badge tone="info">Informational</Badge>, owner: 'Nadia', pipeline: '£64k', sla: '18h', quality: '78%' },
  { name: 'Slots Hub', status: <Badge tone="neutral">Round table</Badge>, owner: 'Lina', pipeline: '£42k', sla: '22h', quality: '74%' },
];

// deterministic bounded series so charts always read well (trend is shown by the delta/color)
function series(seed: number, phase: number): number[] {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  return Array.from({ length: 90 }, (_, i) => Math.round(58 + Math.sin(i / 7 + phase) * 16 + (rnd() - 0.5) * 12));
}

const metrics: (Metric & { icon: JSX.Element })[] = [
  { id: 'revenue', label: 'Revenue protected', value: '£428k', delta: '+8.2%', trend: 'up', full: series(7, 0), icon: <ShieldCheck size={18} /> },
  { id: 'partners', label: 'Active partners', value: '38', delta: '+4', trend: 'up', full: series(19, 1.5), icon: <Users size={18} /> },
  { id: 'approvals', label: 'Pending approvals', value: '17', delta: '-6', trend: 'down', full: series(31, 3), icon: <CalendarClock size={18} /> },
  { id: 'quality', label: 'Lead quality', value: '88%', delta: '+3.1%', trend: 'up', full: series(53, 4.5), icon: <Gauge size={18} /> },
];

const forecastLabels = Array.from({ length: 12 }, (_, index) => `W${index + 1}`);
const forecastSeries: LineChartSeries[] = [
  { id: 'actual', label: 'Actual', data: [52, 57, 61, 58, 66, 71, 74, 79, 83, 86, 88, 91], tone: 'success' },
  { id: 'predicted', label: 'Predicted', data: [51, 55, 59, 63, 68, 73, 77, 82, 87, 92, 96, 101], tone: 'primary', stroke: 'dashed' },
  { id: 'target', label: 'Target', data: [56, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88], tone: 'muted', stroke: 'dashed' },
];

const monthlyLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const barSeries: BarChartBarSeries[] = [
  { id: 'spend', label: 'Spend', data: [480, 496, 502, 498, 552, 566, 486, 512, 532, 548, 586, 0], tone: 'primary' },
  { id: 'revenue', label: 'Revenue', data: [1010, 930, 984, 912, 956, 1022, 878, 842, 868, 972, 914, 0], tone: 'muted' },
];
const barLines: BarChartLineSeries[] = [
  { id: 'gross-profit', label: 'Gross profit', data: [500, 408, 454, 384, 376, 428, 362, 318, 312, 398, 304, 0], tone: 'success' },
  { id: 'roas', label: 'ROAS guide', data: [920, 830, 872, 808, 764, 802, 794, 736, 718, 786, 690, 0], tone: 'primary', stroke: 'dashed' },
];

const funnel = [
  { label: 'New', value: 128, tone: 'var(--color-primary)' },
  { label: 'Qualified', value: 94, tone: 'var(--color-success)' },
  { label: 'Review', value: 41, tone: 'var(--color-on-surface-variant)' },
  { label: 'Blocked', value: 13, tone: 'var(--color-error)' },
];

const signalKpis = [
  { label: 'GP this month', value: '£412k', delta: '+3.1%', trend: 'up' as const, icon: <TrendingUp size={18} /> },
  { label: 'GP confidence band', value: '£390-441k', delta: 'Widening', trend: 'flat' as const, icon: <Eye size={18} /> },
  { label: 'GP vs target', value: '94%', delta: '-£25k', trend: 'down' as const, icon: <Target size={18} /> },
  { label: 'Override rate 7D', value: '18%', delta: '+4pts', trend: 'flat' as const, icon: <AlertTriangle size={18} /> },
];

const signalOperators = [
  { name: 'Sky Vegas', detail: 'Positive trend', value: '£3,081/day', strength: 90 },
  { name: 'Ladbrokes Casino', detail: 'Neutral', value: '£885/day', strength: 55 },
  { name: 'Betfair Casino', detail: 'Budget 60%', value: '£342/day', strength: 60 },
  { name: 'BoyleSports', detail: 'Positive slots', value: '£399/day', strength: 70 },
  { name: 'MrQ', detail: 'Offer swap tracking', value: '£182/day', strength: 44 },
];

const signalFlowSources = signalOperators.map(({ name, ...operator }) => ({
  label: name,
  ...operator,
}));

const signalRows: ActionInsightItem[] = [
  {
    title: 'Facebook cost broke band - UK Bingo',
    reason: 'CPM +34% over 10D and widening. Commission held, but margin is compressing.',
    impact: '-£18k',
    verb: 'Fix',
    owner: 'NK / VG',
    tone: 'danger',
  },
  {
    title: 'Sky Vegas EPC dropped below threshold',
    reason: 'Position 1 still holds on commission volume, but EPC degraded 22% over 10D.',
    impact: '-£11k',
    verb: 'Fix',
    owner: 'JS / CS',
    tone: 'danger',
  },
  {
    title: 'Betfair commission positive but budget 60% used',
    reason: 'Strong trend will exhaust the monthly cap before month end unless topped up.',
    impact: '+£8k risk',
    verb: 'Do more',
    owner: 'CS',
    tone: 'watch',
  },
  {
    title: '3 operators paused - no budget',
    reason: 'Manual ranking is keeping dead-weight operators in the running order.',
    impact: 'Structural',
    verb: 'Fix',
    owner: 'JT',
    tone: 'watch',
  },
  {
    title: 'MrQ 300 Spins replacing 200 Spins',
    reason: 'Offer swap is in place. Data is still building, so hold and read next Friday.',
    impact: 'Stable',
    verb: 'Absorb',
    owner: 'JT',
    tone: 'good',
  },
];

function FunnelBars() {
  const max = Math.max(...funnel.map((f) => f.value));
  return (
    <section className="demo-panel">
      <div className="demo-panel__head">
        <div>
          <div className="text-title-medium demo-text-strong">Lead funnel</div>
          <div className="text-body-small demo-text-muted">Novel component built from tokens</div>
        </div>
        <LineChartIcon size={18} className="demo-muted-icon" />
      </div>
      <div className="demo-bars">
        {funnel.map((item) => (
          <div key={item.label} className="demo-bar-row">
            <span className="text-label-large demo-bar-label">{item.label}</span>
            <div className="demo-bar-track">
              <div className="demo-bar-fill" style={{ width: `${(item.value / max) * 100}%`, background: item.tone }} />
            </div>
            <span className="text-label-large demo-bar-value">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActivityFeed() {
  const items = [
    ['Partner review due', 'Royal Leads needs final compliance notes', 'Today'],
    ['Quality spike', 'Northstar Casino rose above 90%', '2h ago'],
    ['Budget guardrail', 'Slots Hub crossed the weekly cap', 'Yesterday'],
  ];
  return (
    <section className="demo-panel">
      <div className="demo-panel__head">
        <div>
          <div className="text-title-medium demo-text-strong">Activity</div>
          <div className="text-body-small demo-text-muted">Novel list pattern</div>
        </div>
        <Bell size={18} className="demo-muted-icon" />
      </div>
      <div className="demo-feed">
        {items.map(([title, body, time]) => (
          <div key={title} className="demo-feed-item">
            <span className="demo-feed-dot" />
            <div>
              <div className="text-label-large demo-text-strong">{title}</div>
              <div className="text-body-small demo-text-muted">{body}</div>
            </div>
            <span className="text-label-small demo-feed-time">{time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SignalDashboardPreview() {
  return (
    <section className="demo-signal">
      <div className="demo-panel__head">
        <div>
          <div className="text-title-medium demo-text-strong">Signal dashboard</div>
          <div className="text-body-small demo-text-muted">Boss concept translated into the current system style</div>
        </div>
        <div className="demo-signal__tools">
          <Chip type="filter" selected>Flow model</Chip>
          <Chip type="filter">Actionable insight</Chip>
          <Button variant="outlined" size="sm" icon={<CalendarClock size={16} />}>16 Jun 2026</Button>
        </div>
      </div>

      <div className="demo-signal__kpis">
        {signalKpis.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            className="demo-signal__kpi"
            size="compact"
            tone={i === 0 ? 'brand' : 'neutral'}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="demo-signal__body">
        <div className="demo-signal-map">
          <div className="demo-panel__head">
            <div>
              <div className="text-title-small demo-text-strong">Sources · option B · preferred</div>
              <div className="text-body-small demo-text-muted">Curved flow map; thicker lines mean stronger daily contribution</div>
            </div>
          </div>
          <SourceFlowMap
            sources={signalFlowSources}
            order={{
              label: 'Running order',
              value: '£4,889',
              caption: 'quality-adjusted commission/day',
              lines: [
                { label: 'Override rate', value: '18%' },
                { label: 'Budget gaps', value: '3 ops' },
              ],
            }}
            goal={{
              label: 'Hit £440k GP',
              value: '94%',
              caption: '£412k achieved · £28k gap',
              progress: 94,
            }}
            badge={<Chip type="assist">Flow thickness = volume</Chip>}
          />
        </div>

        <div className="demo-signal-flow" aria-label="Signal flow preview">
          <div>
            <div className="text-title-small demo-text-strong">Sources · option A · secondary</div>
            <div className="text-body-small demo-text-muted">Structured source cards feeding the running order</div>
          </div>
          <div className="demo-signal-flow__grid">
            <div className="demo-signal-flow__sources">
              {signalOperators.map((operator) => (
                <div key={operator.name} className="demo-signal-source">
                  <div>
                    <div className="text-label-large demo-text-strong">{operator.name}</div>
                    <div className="text-body-small demo-text-muted">{operator.detail}</div>
                  </div>
                  <div className="text-label-large demo-text-strong">{operator.value}</div>
                  <span className="demo-signal-source__bar" style={{ inlineSize: `${operator.strength}%` }} />
                </div>
              ))}
            </div>
            <div className="demo-signal-flow__arrow" aria-hidden="true">
              <ArrowRight size={22} />
            </div>
            <div className="demo-signal-node">
              <div className="text-title-small demo-text-strong">Running order</div>
              <div className="text-headline-small demo-text-strong">£4,889</div>
              <div className="text-body-small demo-text-muted">quality-adjusted commission/day</div>
              <div className="demo-signal-node__line">
                <span>Override rate</span>
                <strong>18%</strong>
              </div>
              <div className="demo-signal-node__line">
                <span>Budget gaps</span>
                <strong>3 ops</strong>
              </div>
            </div>
            <div className="demo-signal-flow__arrow" aria-hidden="true">
              <ArrowRight size={22} />
            </div>
            <div className="demo-signal-goal">
              <div className="text-title-small demo-text-strong">Hit £440k GP</div>
              <div className="demo-signal-goal__ring">
                <span className="text-headline-medium">94%</span>
              </div>
              <div className="text-body-small demo-text-muted">£412k achieved · £28k gap</div>
            </div>
          </div>
        </div>

        <div className="demo-signal-actions demo-signal-actions--alt">
          <div className="demo-panel__head">
            <div>
              <div className="text-title-small demo-text-strong">Actionable insight · option B · preferred</div>
              <div className="text-body-small demo-text-muted">Default ranked impact-tile pattern without the color rail</div>
            </div>
          </div>
          <ActionInsightList items={signalRows} />
        </div>

        <div className="demo-signal-actions">
          <div className="demo-panel__head">
            <div>
              <div className="text-title-small demo-text-strong">Actionable insight · option A</div>
              <div className="text-body-small demo-text-muted">Ranked action cards with a status edge</div>
            </div>
          </div>
          <div className="demo-action-stack">
            {signalRows.map((row, index) => (
              <article key={row.title} className="demo-action-card" data-tone={row.tone}>
                <div className="demo-action-card__rank text-label-large">{index + 1}</div>
                <div className="demo-action-card__body">
                  <div className="demo-action-card__topline">
                    <div className="text-label-large demo-action-card__impact">{row.impact}</div>
                    <div className="demo-action-card__meta">
                      <span className="text-label-large">{row.verb}</span>
                      <span className="text-label-large">{row.owner}</span>
                    </div>
                  </div>
                  <div className="text-title-small demo-text-strong">{row.title}</div>
                  <div className="text-body-small demo-text-muted">{row.reason}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [sel, setSel] = useState<number | null>(0);
  const [groupBy, setGroupBy] = useState('Partner');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="demo-shell">
      <div className="demo-header">
        <div>
          <h1 className="text-headline-small demo-title">Partner operations</h1>
          <p className="text-body-medium demo-subtitle">Last 28 days · compliance, revenue, and delivery</p>
        </div>
        <div className="demo-actions">
          <label className="demo-theme-toggle text-body-medium">
            <Switch
              checked={theme === 'dark'}
              onChange={(event) => setTheme(event.currentTarget.checked ? 'dark' : 'light')}
              aria-label="Use dark mode"
            />
            Dark mode
          </label>
          <Button variant="outlined" icon={<RefreshCw size={18} />}>Refresh</Button>
          <Button variant="outlined" icon={<Download size={18} />}>Export</Button>
          <Button variant="filled" icon={<Plus size={18} />}>Add partner</Button>
        </div>
      </div>

      <div className="demo-toolbar">
        <Chip type="filter" selected>Last 28 days</Chip>
        <Chip type="filter">Priority accounts</Chip>
        <Chip type="filter">Open risks</Chip>
        <Chip type="assist" leadingIcon={<Sparkles size={16} />}>Suggest view</Chip>
        <div className="demo-toolbar__spacer" />
        <TextField variant="outlined" placeholder="Search partners" leadingIcon={<Search size={18} />} aria-label="Search partners" />
        <Dropdown label="Group by:" value={groupBy} options={['Partner', 'Owner', 'Region', 'Risk level']} onChange={setGroupBy} />
      </div>

      <section className="demo-control-strip">
        <div>
          <div className="text-label-large demo-text-strong">Automation</div>
          <div className="text-body-small demo-text-muted">Alert on compliance risk and missed partner SLAs</div>
        </div>
        <label className="demo-switch-row text-body-medium">
          <Switch defaultChecked aria-label="Risk alerts enabled" />
          Risk alerts
        </label>
        <Checkbox label="Include archived partners" />
      </section>

      <SignalDashboardPreview />

      <section className="demo-feature-kpi">
        <div className="demo-feature-kpi__summary">
          <div className="demo-feature-kpi__label">
            <ShieldCheck size={18} />
            <span className="text-title-small">Revenue protected</span>
          </div>
          <div className="text-display-small-emphasized demo-feature-kpi__value">£428k</div>
          <div className="demo-feature-kpi__delta">
            <span className="text-label-large">+8.2%</span>
            <span className="text-body-medium">vs last month</span>
          </div>
          <p className="text-body-medium demo-feature-kpi__copy">
            Main KPI with actual performance, predicted run-rate, and target in one chart.
          </p>
        </div>
        <div className="demo-feature-kpi__chart">
          <DsLineChart series={forecastSeries} labels={forecastLabels} variant="multi" />
        </div>
      </section>

      <section className="demo-kpi-variants">
        <div>
          <div className="text-title-medium demo-text-strong">KPI card variants</div>
          <div className="text-body-small demo-text-muted">Default includes a chart; compact is the no-chart version.</div>
        </div>
        <KpiCard
          className="demo-kpi-variant-card"
          label="Revenue protected"
          value="£428k"
          delta="+8.2%"
          trend="up"
          icon={<ShieldCheck size={18} />}
          data={metrics[0].full.slice(-18)}
        />
        <KpiCard
          className="demo-kpi-variant-card"
          size="compact"
          label="Active partners"
          value="38"
          delta="+4"
          trend="up"
          icon={<Users size={18} />}
        />
      </section>

      <div className="demo-kpi-grid">
        {metrics.slice(1).map((m, i) => (
          <KpiCard
            key={m.id}
            className="demo-kpi-card"
            role="button"
            tabIndex={0}
            aria-pressed={sel === i + 1}
            onClick={() => setSel(i + 1)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSel(i + 1);
              }
            }}
            size="compact"
            label={m.label}
            value={m.value}
            delta={m.delta}
            trend={m.trend}
            selected={sel === i + 1}
            icon={m.icon}
          />
        ))}
      </div>

      {sel !== null ? <ChartPanel metric={metrics[sel]} onClose={() => setSel(null)} /> : null}

      <section className="demo-panel demo-panel--chart">
        <div className="demo-panel__head">
          <div>
            <div className="text-title-medium demo-text-strong">Spend, revenue & gross profit</div>
            <div className="text-body-small demo-text-muted">Vertical bars with line overlays, styled from system tokens</div>
          </div>
          <Dropdown value="Last 12 months" options={['Last 6 months', 'Last 12 months', 'Year to date']} onChange={() => {}} />
        </div>
        <BarChart
          labels={monthlyLabels}
          bars={barSeries}
          lines={barLines}
          referenceLines={[{ label: 'Breakeven', value: 450, tone: 'primary' }]}
          yFormatter={(value) => (value >= 1000 ? `£${(value / 1000).toFixed(1)}M` : `£${Math.round(value)}k`)}
        />
      </section>

      <div className="demo-grid">
        <section className="demo-panel demo-panel--wide">
          <div className="demo-panel__head">
            <div>
              <div className="text-title-medium demo-text-strong">Partner pipeline by {groupBy.toLowerCase()}</div>
              <div className="text-body-small demo-text-muted">Real table component with alternating rows</div>
            </div>
            <Dropdown value="This month" options={['This week', 'This month', 'This quarter']} onChange={() => {}} />
          </div>
          <DataTable columns={campaignCols} rows={campaignRows} />
        </section>

        <div className="demo-side-stack">
          <section className="demo-hero-metric">
            <div className="text-label-large">Most important metric</div>
            <div className="text-display-small-emphasized">£428k</div>
            <div className="text-body-medium">Revenue protected from blocked or non-compliant partner flows.</div>
            <WalletCards size={24} />
          </section>
          <FunnelBars />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

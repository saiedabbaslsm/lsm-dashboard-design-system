import { useState, type CSSProperties } from 'react';
import { LineChart } from '@lsm/design-system';
import { X } from 'lucide-react';

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  full: number[];
}

const trendColor = (t: Metric['trend']) =>
  t === 'up' ? 'var(--color-success)' : t === 'down' ? 'var(--color-error)' : 'var(--color-on-surface-variant)';

const RANGES = { '7d': 7, '28d': 28, '90d': 90 } as const;
type Range = keyof typeof RANGES;

function makeLabels(n: number): string[] {
  if (n <= 7) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, n);
  if (n <= 31) return Array.from({ length: n }, (_, i) => `${i + 1}`);
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return Array.from({ length: n }, (_, i) => m[Math.floor(i / (n / 12)) % 12]);
}

function SegmentedControl({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: 2, padding: 2, background: 'var(--color-surface-container-high)', borderRadius: 8 }}>
      {(Object.keys(RANGES) as Range[]).map((r) => (
        <button
          key={r}
          className="text-label-large"
          onClick={() => onChange(r)}
          style={{
            border: value === r ? '1px solid var(--color-outline-variant)' : '1px solid transparent',
            cursor: 'pointer',
            padding: '5px 12px',
            borderRadius: 6,
            background: value === r ? 'var(--color-surface-container-lowest)' : 'transparent',
            color: value === r ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

const iconBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: 8,
  border: '1px solid var(--color-outline-variant)', background: 'transparent',
  color: 'var(--color-on-surface-variant)', cursor: 'pointer',
};

export function ChartPanel({ metric, onClose }: { metric: Metric; onClose: () => void }) {
  const [range, setRange] = useState<Range>('28d');
  const n = RANGES[range];
  const data = metric.full.slice(-n);
  const labels = makeLabels(n);
  const color = trendColor(metric.trend);
  const tone = metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'muted';
  return (
    <section style={{ background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--demo-radius-card)', padding: 24, marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 12 }}>
        <div>
          <div className="text-title-medium" style={{ color: 'var(--color-on-surface)' }}>{metric.label} over time</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
            <span className="text-headline-medium" style={{ color: 'var(--color-on-surface)' }}>{metric.value}</span>
            <span className="text-label-large" style={{ color }}>{metric.delta} vs last month</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <SegmentedControl value={range} onChange={setRange} />
          <button style={iconBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
      </div>
      <LineChart
        series={[{ id: metric.id, label: metric.label, data, tone }]}
        labels={labels}
        variant="single"
        showLegend={false}
      />
    </section>
  );
}

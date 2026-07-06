import type { HTMLAttributes, ReactNode } from 'react';
import './kpi-card.css';

export type KpiTrend = 'up' | 'down' | 'flat';
export type KpiSize = 'default' | 'compact';

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  /** e.g. "+14.2%" */
  delta?: string;
  /** e.g. "vs last month" */
  caption?: string;
  trend?: KpiTrend;
  size?: KpiSize;
  selected?: boolean;
  /** Optional header icon (top-right). */
  icon?: ReactNode;
  /** Sparkline data — renders a bottom area chart (Default size only). */
  data?: number[];
}

const CHART_W = 340;
const CHART_H = 86;

function TrendIcon({ trend }: { trend: KpiTrend }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      {trend === 'up' && (
        <>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" {...common} />
          <polyline points="16 7 22 7 22 13" {...common} />
        </>
      )}
      {trend === 'down' && (
        <>
          <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" {...common} />
          <polyline points="16 17 22 17 22 11" {...common} />
        </>
      )}
      {trend === 'flat' && <line x1="5" y1="12" x2="19" y2="12" {...common} />}
    </svg>
  );
}

function chartPaths(data: number[]) {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const top = 12;
  const plot = CHART_H - 22;
  const pts = data.map((v, i) => {
    const x = (i / (n - 1)) * CHART_W;
    const y = top + (1 - (v - min) / span) * plot;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const line = 'M ' + pts.join(' L ');
  const area = `${line} L ${CHART_W} ${CHART_H} L 0 ${CHART_H} Z`;
  return { line, area };
}

export function KpiCard({
  label,
  value,
  delta,
  caption = 'vs last month',
  trend = 'flat',
  size = 'default',
  selected = false,
  icon,
  data,
  className,
  ...rest
}: KpiCardProps) {
  const cls = [
    'ds-kpi',
    size === 'compact' ? 'ds-kpi--compact' : '',
    selected ? 'ds-kpi--selected' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const showChart = size === 'default' && data && data.length > 1;
  const paths = showChart ? chartPaths(data!) : null;

  return (
    <div className={cls} data-trend={trend} {...rest}>
      <div className="ds-kpi__header">
        <span className="ds-kpi__label text-title-small">{label}</span>
        {icon ? (
          <span className="ds-kpi__icon" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>

      <span className="ds-kpi__value text-display-small-emphasized">{value}</span>

      {delta ? (
        <div className="ds-kpi__delta">
          <span className="ds-kpi__delta-icon">
            <TrendIcon trend={trend} />
          </span>
          <span className="ds-kpi__delta-value text-label-large">{delta}</span>
          <span className="ds-kpi__caption text-body-medium">{caption}</span>
        </div>
      ) : null}

      {paths ? (
        <svg
          className="ds-kpi__chart"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          height={CHART_H}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={paths.area} fill="currentColor" fillOpacity={0.13} />
          <path
            d={paths.line}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </div>
  );
}

import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './kpi-card.css';

export type KpiTrend = 'up' | 'down' | 'flat';
export type KpiSize = 'default' | 'compact';
export type KpiTone = 'neutral' | 'brand' | 'gradient';
export type KpiDeltaStyle = 'arrow' | 'pill';

export interface KpiCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
  /** e.g. "+14.2%" */
  delta?: string;
  /** e.g. "vs last month" */
  caption?: string;
  trend?: KpiTrend;
  size?: KpiSize;
  /** Surface colour. `brand` = gold, `gradient` = gold gradient. Use for ONE hero card per view (the 10% accent). On toned cards the chart + text go dark to stay legible. */
  tone?: KpiTone;
  selected?: boolean;
  /** Optional header icon (top-right). */
  icon?: ReactNode;
  /** Sparkline data — renders a bottom area chart (Default size only). */
  data?: number[];
  /**
   * `arrow` (default): trend icon + delta text. `pill`: the delta in a tinted pill, no
   * arrow — the pill's colour (from `trend`) plus the figure's sign carry direction.
   * Use `pill` in rows of 5+ cards, where the arrow makes captions wrap.
   */
  deltaStyle?: KpiDeltaStyle;
  /**
   * Dot where the data ends on the sparkline. `true` = the last point; a number = the
   * index of the last SETTLED point (before a still-arriving tail).
   */
  endMarker?: boolean | number;
  /** 3px strip across the top in the verdict colour. Not shown for `flat` or on toned cards. */
  verdictStrip?: boolean;
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

// With an end marker, stop the line short of the card edge so the dot isn't clipped.
const MARKER_INSET = 10;

function chartPaths(data: number[], inset = 0) {
  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const top = 12;
  const plot = CHART_H - 22;
  const pts = data.map((v, i) => {
    const x = (i / (n - 1)) * (CHART_W - inset);
    const y = top + (1 - (v - min) / span) * plot;
    return `${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  const line = 'M ' + pts.join(' L ');
  const area = `${line} L ${CHART_W - inset} ${CHART_H} L 0 ${CHART_H} Z`;
  // Points as % of the chart box, for HTML overlays (the SVG is non-uniformly scaled).
  const pct = data.map((v, i) => ({
    x: ((i / (n - 1)) * (CHART_W - inset) / CHART_W) * 100,
    y: ((top + (1 - (v - min) / span) * plot) / CHART_H) * 100,
  }));
  return { line, area, pct };
}

export function KpiCard({
  label,
  value,
  delta,
  caption = 'vs last month',
  trend = 'flat',
  size = 'default',
  tone = 'neutral',
  selected = false,
  icon,
  data,
  deltaStyle = 'arrow',
  endMarker,
  verdictStrip = false,
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
  const hasMarker = endMarker !== undefined && endMarker !== false;
  const paths = showChart ? chartPaths(data!, hasMarker ? MARKER_INSET : 0) : null;
  const gradId = `ds-kpi-area-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const markerIndex =
    paths && hasMarker
      ? Math.max(0, Math.min(data!.length - 1, endMarker === true ? data!.length - 1 : endMarker))
      : null;
  const marker = markerIndex !== null ? paths!.pct[markerIndex] : null;
  const showStrip = verdictStrip && trend !== 'flat' && tone === 'neutral';

  return (
    <div className={cls} data-trend={trend} data-tone={tone} {...rest}>
      {showStrip ? <span className="ds-kpi__strip" aria-hidden="true" /> : null}
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
        <div className="ds-kpi__delta" data-style={deltaStyle}>
          {deltaStyle === 'pill' ? (
            <span className="ds-kpi__delta-pill">{delta}</span>
          ) : (
            <>
              <span className="ds-kpi__delta-icon">
                <TrendIcon trend={trend} />
              </span>
              <span className="ds-kpi__delta-value text-label-large">{delta}</span>
            </>
          )}
          <span className="ds-kpi__caption text-body-medium">{caption}</span>
        </div>
      ) : null}

      {paths ? (
        <div className="ds-kpi__chart-wrap">
        <svg
          className="ds-kpi__chart"
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          height={CHART_H}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Area as a fade (24% -> 0), not a flat slab. Per-card id so cards never share a gradient. */}
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity={0.24} />
              <stop offset="1" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={paths.area} fill={`url(#${gradId})`} />
          <path
            d={paths.line}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {marker ? (
          <span className="ds-kpi__marker" style={{ left: `${marker.x}%`, top: `${marker.y}%` }} aria-hidden="true" />
        ) : null}
        </div>
      ) : null}
    </div>
  );
}

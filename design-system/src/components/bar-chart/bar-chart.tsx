import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import './bar-chart.css';

export type BarChartTone = 'primary' | 'success' | 'error' | 'muted' | 'secondary';
export type BarChartStroke = 'solid' | 'dashed';

export interface BarChartBarSeries {
  id: string;
  label: string;
  data: number[];
  tone?: BarChartTone;
}

export interface BarChartLineSeries {
  id: string;
  label: string;
  data: number[];
  tone?: BarChartTone;
  stroke?: BarChartStroke;
}

export interface BarChartReferenceLine {
  label?: string;
  value: number;
  tone?: BarChartTone;
}

export interface BarChartProps {
  bars: BarChartBarSeries[];
  labels: string[];
  lines?: BarChartLineSeries[];
  referenceLines?: BarChartReferenceLine[];
  yFormatter?: (value: number) => string;
  showLegend?: boolean;
  className?: string;
}

const W = 760;
const H = 320;
const PAD_L = 58;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 42;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const toneVar = (tone: BarChartTone = 'primary') => {
  if (tone === 'success') return 'var(--color-success)';
  if (tone === 'error') return 'var(--color-error)';
  if (tone === 'muted') return 'color-mix(in srgb, var(--color-on-surface) 42%, var(--color-surface))';
  if (tone === 'secondary') return 'color-mix(in srgb, var(--color-on-surface) 64%, var(--color-surface))';
  return 'var(--color-primary)';
};

const defaultFormatter = (value: number) => String(Math.round(value));

export function BarChart({
  bars,
  labels,
  lines = [],
  referenceLines = [],
  yFormatter = defaultFormatter,
  showLegend = true,
  className,
}: BarChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [highlight, setHighlight] = useState<number | null>(null);
  const usableBars = bars.filter((item) => item.data.length > 0);
  const usableLines = lines.filter((item) => item.data.length > 0);
  const allValues = [
    ...usableBars.flatMap((item) => item.data),
    ...usableLines.flatMap((item) => item.data),
    ...referenceLines.map((item) => item.value),
    0,
  ];
  const max = Math.max(...allValues);
  const min = Math.min(0, ...allValues);
  const span = max - min || 1;
  const points = Math.max(labels.length, ...usableBars.map((item) => item.data.length), ...usableLines.map((item) => item.data.length));
  const groupW = PLOT_W / Math.max(points, 1);
  const barGap = 4;
  const barW = Math.max(4, (groupW * 0.68 - barGap * Math.max(usableBars.length - 1, 0)) / Math.max(usableBars.length, 1));
  const grid = [0, 0.5, 1].map((fraction) => min + span * fraction);
  const cls = ['ds-bar-chart', className].filter(Boolean).join(' ');

  const xCenter = (index: number) => PAD_L + groupW * index + groupW / 2;
  const yFor = (value: number) => PAD_T + (1 - (value - min) / span) * PLOT_H;

  const onMove = (event: MouseEvent<SVGSVGElement>) => {
    const svg = ref.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * W;
    const next = Math.floor((mx - PAD_L) / groupW);
    setHighlight(Math.max(0, Math.min(points - 1, next)));
  };

  if (!usableBars.length) return null;

  return (
    <div className={cls}>
      {showLegend ? (
        <div className="ds-bar-chart__legend">
          {usableBars.map((item) => (
            <span
              key={item.id}
              className="ds-bar-chart__legend-item text-label-large"
              style={{ '--ds-chart-series': toneVar(item.tone) } as CSSProperties}
            >
              <span className="ds-bar-chart__legend-bar" />
              {item.label}
            </span>
          ))}
          {usableLines.map((item) => (
            <span
              key={item.id}
              className="ds-bar-chart__legend-item text-label-large"
              style={{ '--ds-chart-series': toneVar(item.tone) } as CSSProperties}
            >
              <span className="ds-bar-chart__legend-line" data-stroke={item.stroke ?? 'solid'} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="ds-bar-chart__plot-wrap">
        <svg
          ref={ref}
          className="ds-bar-chart__plot"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={[...usableBars, ...usableLines].map((item) => item.label).join(', ')}
          onMouseMove={onMove}
          onMouseLeave={() => setHighlight(null)}
        >
          {grid.map((value) => (
            <g key={value}>
              <line className="ds-bar-chart__grid" x1={PAD_L} y1={yFor(value)} x2={W - PAD_R} y2={yFor(value)} />
              <text className="ds-bar-chart__axis text-label-small" x={PAD_L - 10} y={yFor(value) + 4} textAnchor="end">
                {yFormatter(value)}
              </text>
            </g>
          ))}

          {referenceLines.map((item) => (
            <g key={`${item.label ?? 'reference'}-${item.value}`} style={{ '--ds-chart-series': toneVar(item.tone ?? 'primary') } as CSSProperties}>
              <line className="ds-bar-chart__reference" x1={PAD_L} y1={yFor(item.value)} x2={W - PAD_R} y2={yFor(item.value)} />
              {item.label ? (
                <text className="ds-bar-chart__axis text-label-small" x={W - PAD_R} y={yFor(item.value) - 6} textAnchor="end">
                  {item.label}
                </text>
              ) : null}
            </g>
          ))}

          {usableBars.map((item, seriesIndex) => {
            const color = toneVar(item.tone ?? (seriesIndex === 0 ? 'primary' : 'muted'));
            return (
              <g key={item.id} style={{ '--ds-chart-series': color } as CSSProperties}>
                {item.data.map((value, index) => {
                  const x = PAD_L + groupW * index + (groupW - (barW * usableBars.length + barGap * (usableBars.length - 1))) / 2 + seriesIndex * (barW + barGap);
                  const y = yFor(Math.max(value, 0));
                  const height = Math.max(0, yFor(0) - y);
                  return <rect key={`${item.id}-${index}`} className="ds-bar-chart__bar" x={x} y={y} width={barW} height={height} rx={3} />;
                })}
              </g>
            );
          })}

          {usableLines.map((item, seriesIndex) => {
            const color = toneVar(item.tone ?? (seriesIndex === 0 ? 'success' : 'muted'));
            const path = item.data
              .map((value, index) => `${index ? 'L' : 'M'} ${xCenter(index).toFixed(1)} ${yFor(value).toFixed(1)}`)
              .join(' ');
            return (
              <g key={item.id} style={{ '--ds-chart-series': color } as CSSProperties}>
                <path className="ds-bar-chart__line" data-stroke={item.stroke ?? 'solid'} d={path} />
                {item.data.map((value, index) => (
                  <circle key={`${item.id}-${index}`} className="ds-bar-chart__point" cx={xCenter(index)} cy={yFor(value)} r={3} />
                ))}
              </g>
            );
          })}

          {labels.map((label, index) =>
            index % Math.max(1, Math.ceil(labels.length / 6)) === 0 ? (
              <text key={label} className="ds-bar-chart__axis text-label-small" x={xCenter(index)} y={H - 12} textAnchor="middle">
                {label}
              </text>
            ) : null
          )}

          {highlight !== null ? <line className="ds-bar-chart__guide" x1={xCenter(highlight)} y1={PAD_T} x2={xCenter(highlight)} y2={PAD_T + PLOT_H} /> : null}
        </svg>

        {highlight !== null ? (
          <div className="ds-bar-chart__tooltip text-body-small" style={{ left: `${(xCenter(highlight) / W) * 100}%` }}>
            <div className="ds-bar-chart__tooltip-label">{labels[highlight]}</div>
            {[...usableBars, ...usableLines].map((item) => (
              <div key={item.id} className="ds-bar-chart__tooltip-row">
                <span>{item.label}</span>
                <strong>{yFormatter(item.data[Math.min(highlight, item.data.length - 1)])}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

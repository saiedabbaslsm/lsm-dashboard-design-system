import { useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import './line-chart.css';

export type LineChartTone = 'primary' | 'success' | 'error' | 'muted' | 'secondary';
export type LineChartStroke = 'solid' | 'dashed';

export interface LineChartSeries {
  id: string;
  label: string;
  data: number[];
  tone?: LineChartTone;
  stroke?: LineChartStroke;
}

export interface LineChartProps {
  series: LineChartSeries[];
  labels?: string[];
  variant?: 'single' | 'multi';
  showLegend?: boolean;
  showArea?: boolean;
  className?: string;
}

const W = 680;
const H = 260;
const PAD_L = 44;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 28;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const toneVar = (tone: LineChartTone = 'primary') => {
  if (tone === 'success') return 'var(--color-success)';
  if (tone === 'error') return 'var(--color-error)';
  if (tone === 'muted') return 'var(--color-on-surface-variant)';
  if (tone === 'secondary') return 'var(--color-secondary)';
  return 'var(--color-primary)';
};

function pathFor(data: number[], min: number, span: number) {
  const lastIndex = Math.max(data.length - 1, 1);
  const x = (i: number) => PAD_L + (i / lastIndex) * PLOT_W;
  const y = (v: number) => PAD_T + (1 - (v - min) / span) * PLOT_H;
  const line = data
    .map((value, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(value).toFixed(1)}`)
    .join(' ');
  const area = `${line} L ${x(data.length - 1).toFixed(1)} ${PAD_T + PLOT_H} L ${x(0).toFixed(1)} ${PAD_T + PLOT_H} Z`;
  return { line, area, x, y };
}

export function LineChart({
  series,
  labels,
  variant = series.length > 1 ? 'multi' : 'single',
  showLegend = variant === 'multi',
  showArea = variant === 'single',
  className,
}: LineChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [highlight, setHighlight] = useState<number | null>(null);
  const usableSeries = series.filter((item) => item.data.length > 0);
  if (!usableSeries.length) return null;

  const allValues = usableSeries.flatMap((item) => item.data);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;
  const maxPoints = Math.max(...usableSeries.map((item) => item.data.length));
  const grid = [0, 0.5, 1].map((fraction) => min + span * fraction);
  const xFor = (index: number) => PAD_L + (index / Math.max(maxPoints - 1, 1)) * PLOT_W;
  const safeLabels = labels ?? Array.from({ length: maxPoints }, (_, index) => String(index + 1));
  const every = Math.max(1, Math.ceil(safeLabels.length / 6));
  const cls = ['ds-chart', className].filter(Boolean).join(' ');

  const onMove = (event: MouseEvent<SVGSVGElement>) => {
    const svg = ref.current;
    if (!svg || maxPoints <= 1) return;
    const rect = svg.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * W;
    const next = Math.round(((mx - PAD_L) / PLOT_W) * (maxPoints - 1));
    setHighlight(Math.max(0, Math.min(maxPoints - 1, next)));
  };

  return (
    <div className={cls}>
      {showLegend ? (
        <div className="ds-chart__legend">
          {usableSeries.map((item) => (
            <span
              key={item.id}
              className="ds-chart__legend-item text-label-large"
              style={{ '--ds-chart-line': toneVar(item.tone) } as CSSProperties}
            >
              <span className="ds-chart__legend-swatch" data-stroke={item.stroke ?? 'solid'} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="ds-chart__plot-wrap">
        <svg
          ref={ref}
          className="ds-chart__plot"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={usableSeries.map((item) => item.label).join(', ')}
          onMouseMove={onMove}
          onMouseLeave={() => setHighlight(null)}
        >
          {grid.map((value) => {
            const y = PAD_T + (1 - (value - min) / span) * PLOT_H;
            return (
              <g key={value}>
                <line className="ds-chart__grid" x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} />
                <text className="ds-chart__axis text-label-small" x={PAD_L - 8} y={y + 4} textAnchor="end">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {usableSeries.map((item, index) => {
            const paths = pathFor(item.data, min, span);
            const color = toneVar(item.tone ?? (index === 0 ? 'primary' : index === 1 ? 'success' : 'muted'));
            return (
              <g key={item.id} style={{ '--ds-chart-line': color } as CSSProperties}>
                {showArea && index === 0 ? <path className="ds-chart__area" d={paths.area} /> : null}
                <path className="ds-chart__line" data-stroke={item.stroke ?? 'solid'} d={paths.line} />
              </g>
            );
          })}

          {safeLabels.map((label, index) =>
            index % every === 0 ? (
              <text key={label + index} className="ds-chart__axis text-label-small" x={xFor(index)} y={H - 8} textAnchor="middle">
                {label}
              </text>
            ) : null
          )}

          {highlight !== null ? (
            <g>
              <line className="ds-chart__guide" x1={xFor(highlight)} y1={PAD_T} x2={xFor(highlight)} y2={PAD_T + PLOT_H} />
              {usableSeries.map((item, index) => {
                const value = item.data[Math.min(highlight, item.data.length - 1)];
                const paths = pathFor(item.data, min, span);
                const color = toneVar(item.tone ?? (index === 0 ? 'primary' : index === 1 ? 'success' : 'muted'));
                return (
                  <circle
                    key={item.id}
                    className="ds-chart__point"
                    style={{ '--ds-chart-line': color } as CSSProperties}
                    cx={xFor(Math.min(highlight, item.data.length - 1))}
                    cy={paths.y(value)}
                    r={3.5}
                  />
                );
              })}
            </g>
          ) : null}
        </svg>

        {highlight !== null ? (
          <div className="ds-chart__tooltip text-body-small" style={{ left: `${(xFor(highlight) / W) * 100}%` }}>
            <div className="ds-chart__tooltip-label">{safeLabels[highlight]}</div>
            {usableSeries.map((item) => (
              <div key={item.id} className="ds-chart__tooltip-row">
                <span>{item.label}</span>
                <strong>{item.data[Math.min(highlight, item.data.length - 1)]}</strong>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

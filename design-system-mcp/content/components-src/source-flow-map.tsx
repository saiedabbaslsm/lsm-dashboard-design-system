import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import './source-flow-map.css';

export interface SourceFlowItem {
  id?: string;
  label: string;
  detail?: string;
  value: string;
  /** 0-100. Controls connector thickness. */
  strength: number;
}

export interface SourceFlowNodeLine {
  label: string;
  value: string;
}

export interface SourceFlowNode {
  label: string;
  value: string;
  caption?: string;
  lines?: SourceFlowNodeLine[];
}

export interface SourceFlowGoal {
  label: string;
  value: string;
  caption?: string;
  progress?: number;
}

export interface SourceFlowMapProps extends HTMLAttributes<HTMLDivElement> {
  sources: SourceFlowItem[];
  order: SourceFlowNode;
  goal: SourceFlowGoal;
  badge?: ReactNode;
}

export function SourceFlowMap({
  sources,
  order,
  goal,
  badge,
  className,
  ...rest
}: SourceFlowMapProps) {
  const cls = ['ds-source-flow', className].filter(Boolean).join(' ');
  const progress = Math.max(0, Math.min(goal.progress ?? 0, 100));

  return (
    <div className={cls} {...rest}>
      {badge ? <div className="ds-source-flow__badge">{badge}</div> : null}
      <svg
        className="ds-source-flow__wires"
        viewBox="0 0 920 360"
        role="img"
        aria-label="Source flow map"
      >
        {sources.map((source, index) => {
          const y = 48 + index * 66;
          const strokeWidth = 2 + (Math.max(0, Math.min(source.strength, 100)) / 100) * 10;
          return (
            <path
              key={source.id ?? source.label}
              className="ds-source-flow__wire"
              d={`M 178 ${y} C 318 ${y}, 294 180, 430 180`}
              style={{ strokeWidth }}
            />
          );
        })}
        <path
          className="ds-source-flow__wire ds-source-flow__wire--primary"
          d="M 548 180 C 650 180, 646 180, 742 180"
        />
      </svg>

      <div className="ds-source-flow__sources">
        {sources.map((source) => (
          <div key={source.id ?? source.label} className="ds-source-flow__source">
            <div>
              <div className="ds-source-flow__label text-label-large">{source.label}</div>
              {source.detail ? <div className="ds-source-flow__muted text-body-small">{source.detail}</div> : null}
            </div>
            <span className="ds-source-flow__value text-label-large">{source.value}</span>
          </div>
        ))}
      </div>

      <div className="ds-source-flow__node ds-source-flow__node--order">
        <div className="ds-source-flow__label text-title-small">{order.label}</div>
        <div className="ds-source-flow__metric text-headline-small">{order.value}</div>
        {order.caption ? <div className="ds-source-flow__muted text-body-small">{order.caption}</div> : null}
        {order.lines?.map((line) => (
          <div key={line.label} className="ds-source-flow__line text-body-small">
            <span>{line.label}</span>
            <strong>{line.value}</strong>
          </div>
        ))}
      </div>

      <div className="ds-source-flow__node ds-source-flow__node--goal">
        <div className="ds-source-flow__label text-title-small">{goal.label}</div>
        <div
          className="ds-source-flow__ring"
          style={{ '--ds-source-flow-progress': `${progress}%` } as CSSProperties}
        >
          <span className="text-headline-medium">{goal.value}</span>
        </div>
        {goal.caption ? <div className="ds-source-flow__muted text-body-small">{goal.caption}</div> : null}
      </div>
    </div>
  );
}

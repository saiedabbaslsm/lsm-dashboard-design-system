import type { HTMLAttributes } from 'react';
import './action-insight-list.css';

export type ActionInsightTone = 'danger' | 'watch' | 'good' | 'neutral';
export type ActionInsightVariant = 'tiles' | 'rail';

export interface ActionInsightItem {
  id?: string;
  title: string;
  reason: string;
  impact: string;
  verb: string;
  owner: string;
  tone?: ActionInsightTone;
}

export interface ActionInsightListProps extends HTMLAttributes<HTMLDivElement> {
  items: ActionInsightItem[];
  variant?: ActionInsightVariant;
}

export function ActionInsightList({
  items,
  variant = 'tiles',
  className,
  ...rest
}: ActionInsightListProps) {
  const cls = ['ds-action-insights', `ds-action-insights--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {items.map((item, index) => {
        const tone = item.tone ?? 'neutral';
        const key = item.id ?? item.title;

        if (variant === 'rail') {
          return (
            <article key={key} className="ds-action-insight ds-action-insight--rail" data-tone={tone}>
              <div className="ds-action-insight__rank text-label-large">{index + 1}</div>
              <div className="ds-action-insight__body">
                <div className="ds-action-insight__topline">
                  <div className="ds-action-insight__impact text-label-large">{item.impact}</div>
                  <div className="ds-action-insight__chips">
                    <span className="text-label-large">{item.verb}</span>
                    <span className="text-label-large">{item.owner}</span>
                  </div>
                </div>
                <div className="ds-action-insight__title text-title-small">{item.title}</div>
                <div className="ds-action-insight__reason text-body-small">{item.reason}</div>
              </div>
            </article>
          );
        }

        return (
          <article key={key} className="ds-action-insight ds-action-insight--tile" data-tone={tone}>
            <div className="ds-action-insight__score">
              <span className="text-label-large">{index + 1}</span>
              <strong className="text-title-small">{item.impact}</strong>
            </div>
            <div className="ds-action-insight__body">
              <div className="ds-action-insight__title text-title-small">{item.title}</div>
              <div className="ds-action-insight__chips">
                <span className="text-label-large">{item.verb}</span>
                <span className="text-label-large">{item.owner}</span>
              </div>
              <div className="ds-action-insight__reason text-body-small">{item.reason}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

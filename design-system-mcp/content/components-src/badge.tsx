import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

export type BadgeTone = 'neutral' | 'danger' | 'warning' | 'success' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Hide the leading dot. Only do this when the label alone carries the status. */
  dot?: boolean;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  dot = true,
  className,
  children,
  ...rest
}: BadgeProps) {
  const cls = ['ds-badge', className].filter(Boolean).join(' ');
  return (
    <span className={cls} data-tone={tone} {...rest}>
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

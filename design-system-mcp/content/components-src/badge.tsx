import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

export type BadgeTone = 'neutral' | 'danger' | 'warning' | 'success' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Hide the leading dot. Only do this when the label alone carries the status. */
  dot?: boolean;
  /** Leading Lucide icon. Replaces the dot — a badge shows one or the other. */
  icon?: ReactNode;
  children: ReactNode;
}

export function Badge({
  tone = 'neutral',
  dot = true,
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  const cls = ['ds-badge', className].filter(Boolean).join(' ');
  return (
    <span className={cls} data-tone={tone} {...rest}>
      {icon ? (
        <span className="ds-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : (
        dot && <span className="ds-badge__dot" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}

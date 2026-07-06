import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

export type ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'secondary'
  | 'outlined'
  | 'text'
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading icon (e.g. a Lucide icon element). */
  icon?: ReactNode;
}

export function Button({
  variant = 'filled',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const cls = ['ds-btn', `ds-btn--${variant}`, `ds-btn--${size}`, className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} {...rest}>
      {icon ? (
        <span className="ds-btn__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

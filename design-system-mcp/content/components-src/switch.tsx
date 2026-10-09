import type { InputHTMLAttributes, ReactNode } from 'react';
import './switch.css';

export type SwitchSize = 'default' | 'compact';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Visible label after the track. A setting should always say what it sets. */
  label?: ReactNode;
  /** `default` 52×32 (forms, settings pages) · `compact` 40×24 (toolbars, section headers). */
  size?: SwitchSize;
}

export function Switch({ disabled, className, label, size = 'default', ...rest }: SwitchProps) {
  const cls = ['ds-switch', className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-size={size} data-disabled={disabled || undefined}>
      <input type="checkbox" role="switch" className="ds-switch__input" disabled={disabled} {...rest} />
      <span className="ds-switch__track">
        <span className="ds-switch__thumb" />
      </span>
      {label ? <span className="ds-switch__label">{label}</span> : null}
    </label>
  );
}

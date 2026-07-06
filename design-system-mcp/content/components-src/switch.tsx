import type { InputHTMLAttributes } from 'react';
import './switch.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export function Switch({ disabled, className, ...rest }: SwitchProps) {
  const cls = ['ds-switch', className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-disabled={disabled || undefined}>
      <input type="checkbox" role="switch" className="ds-switch__input" disabled={disabled} {...rest} />
      <span className="ds-switch__track">
        <span className="ds-switch__thumb" />
      </span>
    </label>
  );
}

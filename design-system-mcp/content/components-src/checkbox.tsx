import { useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import './checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export function Checkbox({ label, indeterminate = false, disabled, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const cls = ['ds-checkbox', className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-disabled={disabled || undefined}>
      <input ref={ref} type="checkbox" className="ds-checkbox__input" disabled={disabled} {...rest} />
      <span className="ds-checkbox__box" aria-hidden="true">
        <svg className="ds-checkbox__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg className="ds-checkbox__minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </span>
      {label ? <span className="ds-checkbox__label text-body-large">{label}</span> : null}
    </label>
  );
}

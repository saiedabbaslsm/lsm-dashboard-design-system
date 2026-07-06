import type { InputHTMLAttributes, ReactNode } from 'react';
import './text-field.css';

export type TextFieldVariant = 'filled' | 'outlined';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  variant?: TextFieldVariant;
  error?: boolean;
  leadingIcon?: ReactNode;
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function TextField({
  label,
  helperText,
  variant = 'outlined',
  error = false,
  leadingIcon,
  disabled,
  className,
  ...rest
}: TextFieldProps) {
  const cls = ['ds-field', `ds-field--${variant}`, className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-error={error || undefined} data-disabled={disabled || undefined}>
      {label ? <span className="ds-field__label text-label-large">{label}</span> : null}
      <div className="ds-field__box">
        {leadingIcon ? (
          <span className="ds-field__lead" aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <input className="ds-field__input text-body-large" disabled={disabled} aria-invalid={error || undefined} {...rest} />
        {error ? (
          <span className="ds-field__alert" aria-hidden="true">
            <AlertIcon />
          </span>
        ) : null}
      </div>
      {helperText ? <span className="ds-field__helper text-body-small">{helperText}</span> : null}
    </label>
  );
}

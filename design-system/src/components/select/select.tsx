import { useRef } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import './select.css';

export type SelectSize = 'sm' | 'md';

export interface SelectOption<V extends string = string> {
  value: V;
  label?: string;
  disabled?: boolean;
}

export interface SelectProps<V extends string = string>
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'size'> {
  options: (V | SelectOption<V>)[];
  value: V;
  onChange?: (value: V) => void;
  /** Visible prefix inside the field, e.g. "Supplier:". Also names the control. */
  label?: ReactNode;
  /** 32px (toolbars, default) or 40px (forms, next to a md Button). */
  size?: SelectSize;
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * Filter dropdown — narrows which data is included. Built on the native
 * <select>: keyboard + screen-reader support and the phone's own picker for
 * free, and an HTML report can mirror it with no script.
 * For a view switch use SegmentedControl; for multi-select use `Chip type="filter"`.
 */
export function Select<V extends string = string>({
  options,
  value,
  onChange,
  label,
  size = 'sm',
  disabled,
  className,
  ...rest
}: SelectProps<V>) {
  const ref = useRef<HTMLSelectElement>(null);
  const cls = ['ds-select', className].filter(Boolean).join(' ');
  return (
    <label className={cls} data-size={size} data-disabled={disabled || undefined}>
      {label ? (
        // Clicking the prefix opens the picker, not just focuses the field.
        <span className="ds-select__label" onMouseDown={(e) => { e.preventDefault(); ref.current?.focus(); ref.current?.showPicker?.(); }}>
          {label}
        </span>
      ) : null}
      <select
        ref={ref}
        className="ds-select__input"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.currentTarget.value as V)}
        {...rest}
      >
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o } : o;
          return (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label ?? opt.value}
            </option>
          );
        })}
      </select>
      <span className="ds-select__chevron" aria-hidden="true">
        <ChevronDown />
      </span>
    </label>
  );
}

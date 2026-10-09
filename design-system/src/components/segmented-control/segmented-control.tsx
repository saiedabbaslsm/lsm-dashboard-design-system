import { useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './segmented-control.css';

export interface SegmentedControlOption<V extends string = string> {
  value: V;
  label: ReactNode;
  /** Optional leading icon (e.g. a lucide-react element). */
  icon?: ReactNode;
  /** Render this segment as a link (URL-held views). The selected one gets aria-current. */
  href?: string;
  disabled?: boolean;
}

export interface SegmentedControlProps<V extends string = string> {
  options: SegmentedControlOption<V>[];
  value: V;
  onChange?: (value: V) => void;
  /** Visible label outside the track, e.g. "Group by". Also names the group. */
  label?: ReactNode;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
  className?: string;
}

/**
 * Single-choice view switch: ONE way of showing the same data ("Week / Month").
 * One outlined track with flat segments and 1px dividers — not a row of buttons.
 * For filters use a select; for multi-select use `Chip type="filter"`.
 */
export function SegmentedControl<V extends string = string>({
  options,
  value,
  onChange,
  label,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<V>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isLinks = options.some((o) => o.href);
  const cls = ['ds-segmented', className].filter(Boolean).join(' ');
  const labelId = useId();

  // Radio-group keyboard model: arrows move AND select (links keep normal tab order).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isLinks) return;
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const enabled = options.filter((o) => !o.disabled);
    const i = enabled.findIndex((o) => o.value === value);
    const next = enabled[(i + step + enabled.length) % enabled.length];
    onChange?.(next.value);
    const el = trackRef.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`);
    el?.focus();
  };

  return (
    <div className={cls}>
      {label ? (
        <span className="ds-segmented__label" id={labelId}>
          {label}
        </span>
      ) : null}
      <div
        ref={trackRef}
        className="ds-segmented__track"
        role={isLinks ? 'group' : 'radiogroup'}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : ariaLabel}
        onKeyDown={onKeyDown}
      >
        {options.map((o) => {
          const selected = o.value === value;
          const inner = (
            <>
              {o.icon ? (
                <span className="ds-segmented__icon" aria-hidden="true">
                  {o.icon}
                </span>
              ) : null}
              <span>{o.label}</span>
            </>
          );
          if (o.href) {
            return (
              <a
                key={o.value}
                className="ds-segmented__item"
                href={o.disabled ? undefined : o.href}
                data-value={o.value}
                data-selected={selected}
                aria-current={selected ? 'page' : undefined}
                aria-disabled={o.disabled || undefined}
                onClick={o.disabled ? (e) => e.preventDefault() : () => onChange?.(o.value)}
              >
                {inner}
              </a>
            );
          }
          return (
            <button
              key={o.value}
              type="button"
              className="ds-segmented__item"
              role="radio"
              data-value={o.value}
              data-selected={selected}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              disabled={o.disabled}
              onClick={() => onChange?.(o.value)}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}

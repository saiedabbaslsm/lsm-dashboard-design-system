import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import './chip.css';

export type ChipType = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ChipType;
  selected?: boolean;
  leadingIcon?: ReactNode;
  /** For `input` chips: shows a trailing remove (×) button and calls this. */
  onRemove?: (e: MouseEvent<HTMLSpanElement>) => void;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Chip({
  type = 'assist',
  selected = false,
  leadingIcon,
  onRemove,
  children,
  className,
  ...rest
}: ChipProps) {
  const lead = selected ? <CheckIcon /> : leadingIcon;
  const cls = ['ds-chip', className].filter(Boolean).join(' ');
  return (
    <button className={cls} data-type={type} data-selected={selected} {...rest}>
      {lead ? (
        <span className="ds-chip__lead" aria-hidden="true">
          {lead}
        </span>
      ) : null}
      <span className="text-label-large">{children}</span>
      {type === 'input' ? (
        <span className="ds-chip__trail" role="button" aria-label="Remove" onClick={onRemove}>
          <XIcon />
        </span>
      ) : null}
    </button>
  );
}

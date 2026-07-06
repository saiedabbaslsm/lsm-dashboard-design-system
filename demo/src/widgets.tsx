import { useState, type CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';

// NOVEL — Dropdown/select menu. Table and charts live in @lsm/design-system.

const trigger: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 14px',
  borderRadius: 8, border: '1px solid var(--color-outline)', background: 'var(--color-surface-container-lowest)',
  color: 'var(--color-on-surface)', cursor: 'pointer',
};

export function Dropdown({ label, value, options, onChange }: { label?: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button className="text-label-large" style={trigger} onClick={() => setOpen((o) => !o)}>
        {label ? <span style={{ color: 'var(--color-on-surface-variant)' }}>{label}</span> : null}
        {value}
        <ChevronDown size={16} style={{ color: 'var(--color-on-surface-variant)' }} />
      </button>
      {open ? (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 200, zIndex: 20,
              background: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)',
              borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', gap: 2,
            }}
          >
            {options.map((o) => (
              <button
                key={o}
                className="dd-item text-body-medium"
                onClick={() => { onChange(o); setOpen(false); }}
                style={{
                  textAlign: 'left', border: 'none', cursor: 'pointer', padding: '8px 10px', borderRadius: 6,
                  background: o === value ? 'var(--color-surface-container-high)' : 'transparent',
                  color: 'var(--color-on-surface)',
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

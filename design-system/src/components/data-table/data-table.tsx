import type { ReactNode } from 'react';
import './data-table.css';

export type DataTableTone = 'default' | 'muted' | 'success' | 'error' | 'primary';

export interface DataTableColumn<Row extends Record<string, ReactNode> = Record<string, ReactNode>> {
  key: keyof Row & string;
  label: string;
  numeric?: boolean;
  tone?: (value: Row[keyof Row], row: Row) => DataTableTone | undefined;
}

export interface DataTableProps<Row extends Record<string, ReactNode> = Record<string, ReactNode>> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  className?: string;
}

export function DataTable<Row extends Record<string, ReactNode>>({
  columns,
  rows,
  className,
}: DataTableProps<Row>) {
  const cls = ['ds-table', className].filter(Boolean).join(' ');
  return (
    <div className="ds-table-wrap">
      <table className={cls}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-label-large"
                data-align={column.numeric ? 'end' : 'start'}
                scope="col"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const value = row[column.key];
                const tone = column.tone?.(value, row) ?? 'default';
                return (
                  <td
                    key={column.key}
                    className="text-body-medium"
                    data-align={column.numeric ? 'end' : 'start'}
                    data-tone={tone}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

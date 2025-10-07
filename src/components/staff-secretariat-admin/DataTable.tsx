// components/DataTable.tsx
import { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export default function DataTable({ columns, data, onRowClick }: DataTableProps) {
  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200" style={{ backgroundColor: '#101C50' }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${getAlignmentClass(column.align)} py-3 px-4 text-sm font-semibold text-white`}
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`py-4 px-4 ${getAlignmentClass(column.align)}`}>
                    {column.render ? column.render(row[column.key], row) : (
                      <span className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {row[column.key]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((row, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => (
              <div key={column.key} className="mb-2 last:mb-0">
                <p className="text-xs text-gray-500 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  {column.label}
                </p>
                {column.render ? column.render(row[column.key], row) : (
                  <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {row[column.key]}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

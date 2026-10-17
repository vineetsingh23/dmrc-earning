import type { ReactNode } from 'react';
import { collectLeafColumns, columnDepth, isColumnGroup, type ColumnNode } from '../lib/earningColumns';






const headerCellClass = 'border border-white px-2 py-1 text-center text-xs font-semibold';
// each top-level group gets one colour, and its sub-headers share it
const headerColorClasses = ['bg-blue-100', 'bg-violet-100', 'bg-green-100', 'bg-amber-100'];

function buildHeaderRows(columns: ColumnNode[]): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from({ length: headerLevelCount }, () => []);

  function addHeaders(nodes: ColumnNode[], levelIndex: number, parentColorIndex: number) {
    nodes.forEach((node, nodeIndex) => {
      const colorIndex = levelIndex === 0 ? nodeIndex % headerColorClasses.length : parentColorIndex;
      const headerClass = `${headerCellClass} ${headerColorClasses[colorIndex]}`;
      const headerKey = `${levelIndex}-${nodeIndex}-${node.label}`;
      if (isColumnGroup(node)) {
        headerRows[levelIndex].push(
          <th key={headerKey} colSpan={collectLeafColumns(node).length} className={headerClass}>{node.label}</th>);
        addHeaders(node.children, levelIndex + 1, colorIndex);
      } else {
        headerRows[levelIndex].push(
          <th key={headerKey} rowSpan={headerLevelCount - levelIndex} className={headerClass}>{node.label}</th>);
      }
    });
  }
  addHeaders(columns, 0, 0);
  return headerRows;
}

interface EarningSheetTableProps {
  columns: ColumnNode[];
  rowCount: number;
  readEntryValue: (rowIndex: number, fieldKey: string) => string;
  writeEntryValue: (rowIndex: number, fieldKey: string, newValue: string) => void;
}

export default function EarningSheetTable({ columns, rowCount, readEntryValue, writeEntryValue }: EarningSheetTableProps) {
  const leafColumns = columns.flatMap(collectLeafColumns);
  return (
    <div className="overflow-auto rounded-xl border border-slate-300 bg-white">
      <table className="w-full border-collapse">
        <thead>
          {buildHeaderRows(columns).map((headerRow, headerRowIndex) => <tr key={headerRowIndex}>{headerRow}</tr>)}
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-100">
              {leafColumns.map(column => (
                <td key={column.fieldKey} className="border border-slate-200 p-0">
                  <input
                    value={readEntryValue(rowIndex, column.fieldKey)}
                    onChange={event => writeEntryValue(rowIndex, column.fieldKey, event.target.value)}
                    inputMode={column.kind === 'number' ? 'decimal' : 'text'}
                    className={`w-full min-w-[70px] bg-transparent p-1.5 text-sm outline-none focus:bg-blue-50 ${column.kind === 'number' ? 'text-right' : 'text-left'}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
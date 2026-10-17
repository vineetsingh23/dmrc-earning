import type { ReactNode } from 'react';
import { collectLeafColumns, columnDepth, isColumnGroup, type ColumnNode } from '../lib/earningColumns';
import type { RegisterRow } from '../lib/registerTypes';

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

interface EarningSheetTableProps { columns: ColumnNode[]; rows: RegisterRow[] }

export default function EarningSheetTable({ columns, rows }: EarningSheetTableProps) {
  const leafColumns = columns.flatMap(collectLeafColumns);
  return (
    <div className="overflow-auto rounded-xl border border-slate-300 bg-white">
      <table className="w-full border-collapse">
        <thead>
          {buildHeaderRows(columns).map((headerRow, headerRowIndex) => <tr key={headerRowIndex}>{headerRow}</tr>)}
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-100">
              {leafColumns.map(column => (
                <td key={column.fieldKey} className={`border border-slate-200 px-2 py-1 text-sm ${column.kind === 'number' ? 'text-right' : 'text-left'}`}>
                  {row[column.fieldKey] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
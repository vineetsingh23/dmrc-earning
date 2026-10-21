import type { ReactNode } from 'react';
import { collectLeafColumns, columnDepth, isColumnGroup, parseNumber, type ColumnLeaf, type ColumnNode } from '../lib/earningColumns';
import { formatCellValue, formatRupees } from '../lib/earningCalculations';
import type { RegisterRow } from '../lib/registerTypes';

export interface SheetStyle {
  headerCellClass:string;
  headerColorClasses:string[];
  bodyCellClass:string;
  footerCellClass:string;
}

export const defaultSheetStyle: SheetStyle = {
  headerCellClass: 'border border-white px-2 py-1 text-center text-xs font-semibold',
  headerColorClasses: ['bg-blue-100', 'bg-violet-100', 'bg-green-100','bg-teal-100', 'bg-amber-100'],
  bodyCellClass: 'border border-slate-200 px-2 py-1 text-right text-sm',
  footerCellClass: 'border border-slate-100 bg-blue-100 px-2 py-1 text-right text-sm font-semibold'
}

// turns the nested column list into rows of <th> cells (one row per header level)
function buildHeaderRows(columns: ColumnNode[],sheetStyle: SheetStyle): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from({ length: headerLevelCount }, () => []);

  function addHeaders(nodes: ColumnNode[], levelIndex: number, parentColorIndex: number) {
    nodes.forEach((node, nodeIndex) => {
      const colorIndex = levelIndex === 0 ? nodeIndex % sheetStyle.headerColorClasses.length : parentColorIndex;
      const headerClass = `${sheetStyle.bodyCellClass} ${sheetStyle.headerColorClasses[colorIndex]}`;
      const headerKey = `${levelIndex}-${nodeIndex}-${node.label}`;
      if (isColumnGroup(node)) {
        headerRows[levelIndex].push(
          <th key={headerKey} colSpan={collectLeafColumns(node).length} className={headerClass}>{node.label}</th>,
        );
        addHeaders(node.children, levelIndex + 1, colorIndex);
      } else {
        headerRows[levelIndex].push(
          <th key={headerKey} rowSpan={headerLevelCount - levelIndex} className={headerClass}>{node.label}</th>,
        );
      }
    });
  }

  addHeaders(columns, 0, 0);
  return headerRows;
}

interface EarningSheetTableProps {
  columns: ColumnNode[];
  rowCount: number;
  readRow: (rowIndex: number) => RegisterRow;
  readEntryValue?: (rowIndex: number, fieldKey: string) => string;
  writeEntryValue?: (rowIndex: number, fieldKey: string, newValue: string) => void;
  showTotalRow?: boolean;
  sheetStyle?: SheetStyle;
}

export default function EarningSheetTable({ columns, rowCount, readRow, readEntryValue, writeEntryValue,showTotalRow = true, sheetStyle =defaultSheetStyle }: EarningSheetTableProps) {
  const leafColumns = columns.flatMap(collectLeafColumns);
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) => readRow(rowIndex));
  const isEditable = Boolean(readEntryValue && writeEntryValue)

  // total of one column over all rows (calculated columns add up their formula results)
  const totalOfColumn = (column: ColumnLeaf) =>
    allRows.reduce((runningTotal, row) => runningTotal + (column.kind === 'calculated' ? column.formula!(row) : parseNumber(row[column.fieldKey])), 0);

  return (
    <div className="overflow-auto rounded-xl border border-slate-300 bg-white">
      <table className="w-full border-collapse">
        <thead>
          {buildHeaderRows(columns,sheetStyle).map((headerRow, headerRowIndex) => (
            <tr key={headerRowIndex}>{headerRow}</tr>
          ))}
        </thead>

        <tbody>
          {allRows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-100">
              {leafColumns.map(column => {
              if (column.kind === 'calculated') {
                  return (
                    <td key={column.fieldKey} className={sheetStyle.bodyCellClass}>
                    {formatRupees(column.formula!(row))}
                  </td>
                  );
              }
                
              if (isEditable){
                  return (
                  <td key={column.fieldKey} className="border border-slate-200 p-0">
                    <input
                      value={readEntryValue!(rowIndex, column.fieldKey)}
                      onChange={event => writeEntryValue!(rowIndex, column.fieldKey, event.target.value)}
                      inputMode={column.kind === 'number' ? 'decimal' : 'text'}
                      className={`w-full min-w-[70px] bg-transparent p-1.5 text-sm outline-none focus:bg-blue-50 ${
                        column.kind === 'number' ? 'text-right' : 'text-left'
                      }`}
                    />
                  </td>
                )
              } 

              return (
                <td>
                  {column.kind === 'number' ? formatCellValue(column,parseNumber(row[column.fieldKey])):row[column.fieldKey]?? ''}
                </td>
              );  
              })}
            </tr>
          ))}
        </tbody>
          {showTotalRow && (
        <tfoot>
          <tr className="bg-blue-100 font-bold">
            {leafColumns.map((column, columnIndex) => (
              <td key={column.fieldKey} className={sheetStyle.footerCellClass}>
                {columnIndex === 0 ? 'Total' : column.kind === 'text' ? '' : formatCellValue(column, totalOfColumn(column))}
              </td>
            ))}
          </tr>
        </tfoot>
      )}
      </table>
      
    </div>
  );
}
import { useMemo, useRef, type CSSProperties, type ReactNode } from 'react';
import { collectLeafColumns, columnDepth, isColumnGroup, parseNumber, type ColumnLeaf, type ColumnNode } from '../../lib/earningColumns';
import { formatCellValue, formatRupees } from '../../lib/earningCalculations';
import type { RegisterRow } from '../../lib/registerTypes';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import EditableSheetCell from '../editableSheetCell';
import { frozenCellStyle, frozenColumnWidthsRem } from '../sheetFrozenColumns';
import {
  tableCellClass,
  tableCellLeftClass,
  tableHeaderCellClass,
  tableRowClass,
  tableTotalCellClass,
  tableTotalRowClass,
} from '../../globalStyles';

export interface SheetStyle {
  headerCellClass: string;          // padding, text alignment and font of every header cell
  headerColorClasses: string[];     // one colour per top-level header group; sub-headers share it
  bodyCellClass: string;            // read-only value cells and calculated cells
  footerCellClass: string;          // cells of the total row
}

export const defaultSheetStyle: SheetStyle = {
  headerCellClass: tableHeaderCellClass,
  headerColorClasses: [''],
  bodyCellClass: tableCellClass,
  footerCellClass: tableTotalCellClass,
};

// how many columns at the start of the list are plain columns (not groups); only those can be frozen
const leadingPlainColumnCount = (columns: ColumnNode[]) => {
  const firstGroupIndex = columns.findIndex(isColumnGroup);
  return firstGroupIndex === -1 ? columns.length : firstGroupIndex;
};

// turns the nested column list into rows of <th> cells (one row per header level)
function buildHeaderRows(columns: ColumnNode[], sheetStyle: SheetStyle, frozenDataColumnCount: number): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from({ length: headerLevelCount }, () => []);
  let leafColumnCounter = 0;

  function addHeaders(nodes: ColumnNode[], levelIndex: number, parentColorIndex: number) {
    nodes.forEach((node, nodeIndex) => {
      const colorIndex = levelIndex === 0 ? nodeIndex % sheetStyle.headerColorClasses.length : parentColorIndex;
      const headerClass = `${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]}`;
      const headerKey = `${levelIndex}-${nodeIndex}-${node.label}`;
      if (isColumnGroup(node)) {
        headerRows[levelIndex].push(
          <th key={headerKey} colSpan={collectLeafColumns(node).length} className={headerClass}>{node.label}</th>,
        );
        addHeaders(node.children, levelIndex + 1, colorIndex);
      } else {
        // a frozen header cell sticks to the left as well as to the top; it sits above the other header cells
        const style: CSSProperties | undefined = leafColumnCounter < frozenDataColumnCount ? frozenCellStyle(1 + leafColumnCounter, 40) : undefined;
        headerRows[levelIndex].push(
          <th key={headerKey} rowSpan={headerLevelCount - levelIndex} className={headerClass} style={style}>{node.label}</th>,
        );
        leafColumnCounter++;
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
  gridName?: string;                // name of this table for the keyboard handler: 'shift', 'tvm' ...
  // give both of these for an editable sheet; leave them out for a read-only sheet
  readEntryValue?: (rowIndex: number, fieldKey: string) => string;
  writeEntryValue?: (rowIndex: number, fieldKey: string, newValue: string) => void;
  showTotalRow?: boolean;           // default true
  sheetStyle?: SheetStyle;          // default: the look of the Shift and TVM sheets
  frozenDataColumnCount?: number;   // data columns kept in place when scrolling sideways, after the # column (default 1, at most 2)
}

export default function EarningSheetTable({
  columns, rowCount, readRow, gridName = 'sheet', readEntryValue, writeEntryValue, showTotalRow = true,
  sheetStyle = defaultSheetStyle, frozenDataColumnCount = 1,
}: EarningSheetTableProps) {
  const leafColumns = useMemo(() => columns.flatMap(collectLeafColumns), [columns]);
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) => readRow(rowIndex));
  const isEditable = Boolean(readEntryValue && writeEntryValue);

  const writeValueReference = useRef(writeEntryValue);
  writeValueReference.current = writeEntryValue;

  // a column can only be frozen when it is a plain column at the very start of the list
  const effectiveFrozenCount = Math.min(frozenDataColumnCount, leadingPlainColumnCount(columns), frozenColumnWidthsRem.length - 1);
  const frozenStyleOfLeaf = (leafIndex: number, zIndex: number): CSSProperties | undefined =>
    leafIndex < effectiveFrozenCount ? frozenCellStyle(1 + leafIndex, zIndex) : undefined;

  // column number among the typed columns (not calculated, not mirrored), used by the arrow keys
  const typedColumnIndexByFieldKey = new Map(
    leafColumns.filter(column => column.kind !== 'calculated' && column.kind !== 'mirror').map((column, typedColumnIndex) => [column.fieldKey, typedColumnIndex]),
  );

  // total of one column over all rows
  const totalOfColumn = (column: ColumnLeaf) =>
    allRows.reduce((runningTotal, row) => {
      if (column.kind === 'calculated') return runningTotal + column.formula!(row);
      if (column.kind === 'mirror') return runningTotal + parseNumber(row[column.sourceFieldKey!]);
      return runningTotal + parseNumber(row[column.fieldKey]);
    }, 0);

  return (
    <div onKeyDown={handleSheetKeyDown} tabIndex={isEditable ? undefined : 0} className="w-full max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-slate-300 bg-card dark:border-slate-700">
      <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-slate-600 dark:text-sky-400">
        <thead>
          {buildHeaderRows(columns, sheetStyle, effectiveFrozenCount).map((headerRow, headerRowIndex) => (
            <tr key={headerRowIndex}>
              {headerRowIndex === 0 && (
                <th rowSpan={Math.max(...columns.map(columnDepth))} className={`${tableHeaderCellClass} min-w-[3rem] text-center`} style={frozenCellStyle(0, 50)}>#</th>
              )}
              {headerRow}
            </tr>
          ))}
        </thead>

        <tbody>
          {allRows.map((row, rowIndex) => (
            <tr key={rowIndex} className={tableRowClass}>
              <td className={`${tableCellLeftClass} text-center`} style={frozenCellStyle(0, 5)}>{rowIndex + 1}</td>
              {leafColumns.map((column, leafIndex) => {
                const frozenStyle = frozenStyleOfLeaf(leafIndex, 5);
                if (column.kind === 'calculated') {
                  return (
                    <td key={column.fieldKey} className={`${sheetStyle.bodyCellClass} sheet-cell-calculated`} style={frozenStyle}>
                      {formatRupees(column.formula!(row))}
                    </td>
                  );
                }
                if (column.kind === 'mirror') {
                  // looks like a typed number cell, but is read-only and follows another column
                  return (
                    <td key={column.fieldKey} className={`${tableCellClass} min-w-[70px] text-nowrap text-right text-sm sheet-input-cell`} style={frozenStyle}>
                      {row[column.sourceFieldKey!] ?? ''}
                    </td>
                  );
                }
                if (isEditable) {
                  return (
                    <EditableSheetCell
                      key={column.fieldKey} gridName={gridName} rowIndex={rowIndex} columnIndex={typedColumnIndexByFieldKey.get(column.fieldKey) ?? 0}
                      fieldKey={column.fieldKey} isNumeric={column.kind === 'number'} value={readEntryValue!(rowIndex, column.fieldKey)} isAmount
                      frozenIndex={leafIndex < effectiveFrozenCount ? 1 + leafIndex : undefined} writeValueReference={writeValueReference}
                    />
                  );
                }
                // read-only: just show the value
                return (
                  <td key={column.fieldKey} className={`${tableCellClass} text-nowrap`} style={frozenStyle}>
                    {column.kind === 'number' ? formatCellValue(column, parseNumber(row[column.fieldKey])) : row[column.fieldKey] ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

        {showTotalRow && (
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td className={`${sheetStyle.footerCellClass} !text-left`} style={frozenCellStyle(0, 5)}>Total</td>
              {leafColumns.map((column, leafIndex) => (
                <td key={column.fieldKey} className={sheetStyle.footerCellClass} style={frozenStyleOfLeaf(leafIndex, 5)}>
                  {column.kind === 'text' ? '' : formatCellValue(column, totalOfColumn(column))}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
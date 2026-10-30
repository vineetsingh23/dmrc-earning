import { useLayoutEffect, useRef, type ReactNode } from "react";
import EditableSheetCell from "../editableSheetCell";

import {
  collectLeafColumns,
  columnDepth,
  isColumnGroup,
  parseNumber,
  type ColumnLeaf,
  type ColumnNode,
} from "../../lib/earningColumns";
import { formatCellValue, formatRupees } from "../../lib/earningCalculations";
import type { RegisterRow } from "../../lib/registerTypes";
import {
  tableCalculatedCellClass,
  tableCellClass,
  tableHeaderCellClass,
  tableMirrorCellClass,
  tableHeaderGroupClasses,
  // tableInputClass,
  tableRowClass,
  tableTotalCellClass,
  tableWrapperClass,
  sheetTableClass,
} from "../../globalStyles";
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";

export interface SheetStyle {
  headerCellClass: string; // padding, text alignment and font of every header cell
  headerColorClasses: string[]; // one colour per top-level header group; sub-headers share it
  bodyCellClass: string; // read-only value cells and calculated cells
  footerCellClass: string;
  // cells of the total row
}

const defaultSheetStyle: SheetStyle = {
  headerCellClass: tableHeaderCellClass,
  headerColorClasses: tableHeaderGroupClasses,
  bodyCellClass: tableCellClass,
  footerCellClass: tableTotalCellClass,
};

// turns the nested column list into rows of <th> cells (one row per header level)
function buildHeaderRows(
  columns: ColumnNode[],
  sheetStyle: SheetStyle,
): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from(
    { length: headerLevelCount },
    () => [],
  );

  function addHeaders(
    nodes: ColumnNode[],
    levelIndex: number,
    parentColorIndex: number,
    parentKey: string,
  ) {
    nodes.forEach((node, nodeIndex) => {
      const colorIndex =
        levelIndex === 0
          ? nodeIndex % sheetStyle.headerColorClasses.length
          : parentColorIndex;
      const headerClass = `${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]}`;
      const headerKey = `${parentKey}-${levelIndex}-${nodeIndex}-${node.label}`;
      if (isColumnGroup(node)) {
        headerRows[levelIndex].push(
          <th
            key={headerKey}
            colSpan={collectLeafColumns(node).length}
            className={headerClass}
          >
            {node.label}
          </th>,
        );
        addHeaders(node.children, levelIndex + 1, colorIndex, headerKey);
      } else {
        headerRows[levelIndex].push(
          <th
            key={headerKey}
            rowSpan={headerLevelCount - levelIndex}
            className={headerClass}
          >
            {node.label}
          </th>,
        );
      }
    });
  }

  addHeaders(columns, 0, 0, 'root');
  return headerRows;
}

interface EarningSheetTableProps {
  columns: ColumnNode[];
  rowCount: number;
  readRow: (rowIndex: number) => RegisterRow;
  // give both of these for an editable sheet; leave them out for a read-only sheet
  readEntryValue?: (rowIndex: number, fieldKey: string) => string;
  writeEntryValue?: (
    rowIndex: number,
    fieldKey: string,
    newValue: string,
  ) => void;
  showTotalRow?: boolean; // default true
  sheetStyle?: SheetStyle;
  gridName?: string; // default: the look of the Shift and TVM sheets
}

export default function EarningSheetTable({
  columns,
  rowCount,
  readRow,
  readEntryValue,
  writeEntryValue,
  showTotalRow = true,
  sheetStyle = defaultSheetStyle,
  gridName = "sheet",
}: EarningSheetTableProps) {
  const leafColumns = columns.flatMap(collectLeafColumns);
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) =>
    readRow(rowIndex),
  );
  const isEditable = Boolean(readEntryValue && writeEntryValue);
  const typedColumnIndexByFieldKey = new Map(
    leafColumns
      .filter(
        (column) => column.kind !== "calculated" && column.kind !== "mirror",
      )
      .map((column, typedColumnIndex) => [column.fieldKey, typedColumnIndex]),
  );
  // total of one column over all rows (calculated columns add up their formula results)
  const totalOfColumn = (column: ColumnLeaf) =>
    allRows.reduce((runningTotal, row) => {
      if (column.kind === "calculated")
        return runningTotal + column.formula!(row);
      if (column.kind === "mirror")
        return runningTotal + parseNumber(row[column.sourceFieldKey!]);
      return runningTotal + parseNumber(row[column.fieldKey]);
    }, 0);
  //     runningTotal + (column.kind === 'calculated' ? column.formula!(row) : parseNumber(row[column.fieldKey])), 0);
  const writeValueReference = useRef(writeEntryValue);
  useLayoutEffect(() => {
    writeValueReference.current = writeEntryValue;
  }, [writeEntryValue]);

  return (
    <div
      className={tableWrapperClass}
      onKeyDown={handleSheetKeyDown}
      tabIndex={isEditable ? undefined : 0}
    >
      <table className={sheetTableClass}>
        <thead>
          {buildHeaderRows(columns, sheetStyle).map(
            (headerRow, headerRowIndex) => (
              <tr key={headerRowIndex}>{headerRow}</tr>
            ),
          )}
        </thead>

        <tbody>
          {allRows.map((row, rowIndex) => (
            <tr key={rowIndex} className={tableRowClass}>
              {leafColumns.map((column) => {
                if (column.kind === "calculated") {
                  return (
                    <td
                      key={column.fieldKey}
                      className={`${sheetStyle.bodyCellClass} ${tableCalculatedCellClass}`}
                    >
                      {formatRupees(column.formula!(row))}
                    </td>
                  );
                }
                if (column.kind === "mirror") {
                  // looks like a typed number cell, but is read-only and follows another column
                  return (
                    <td key={column.fieldKey} className={tableMirrorCellClass}>
                      <div className="min-w-[70px] p-1.5 text-right text-sm">
                        {row[column.sourceFieldKey!] ?? ""}
                      </div>
                    </td>
                  );
                }
                if (isEditable) {
                  return (
                    <EditableSheetCell
                      key={column.fieldKey}
                      gridName={gridName}
                      rowIndex={rowIndex}
                      columnIndex={
                        typedColumnIndexByFieldKey.get(column.fieldKey) ?? 0
                      }
                      fieldKey={column.fieldKey}
                      isNumeric={column.kind === "number"}
                      value={readEntryValue!(rowIndex, column.fieldKey)}
                      writeValueReference={writeValueReference}
                    />
                  );
                }
                // read-only: just show the value
                return (
                  <td key={column.fieldKey} className={tableCellClass}>
                    {column.kind === "number"
                      ? formatCellValue(
                          column,
                          parseNumber(row[column.fieldKey]),
                        )
                      : (row[column.fieldKey] ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

        {showTotalRow && (
          <tfoot>
            <tr>
              {leafColumns.map((column, columnIndex) => (
                <td key={column.fieldKey} className={tableTotalCellClass}>
                  {columnIndex === 0
                    ? "Total"
                    : column.kind === "text"
                      ? ""
                      : formatCellValue(column, totalOfColumn(column))}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

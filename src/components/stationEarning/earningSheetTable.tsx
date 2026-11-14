import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
  tableClass,
   tableMirrorCellClass,
  tableHeaderGroupClasses,
  // tableInputClass,
  tableRowClass,

  tableWrapperClass,
  tableHeaderRowClass,
  tableTotalRowClass,
  tableHeaderCellClass,
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
  headerCellClass: tableHeaderRowClass,
  headerColorClasses: tableHeaderGroupClasses,
  bodyCellClass: tableCellClass,
  footerCellClass: tableTotalRowClass,
};

const firstColumnWidth = 64;
const inputWidthCanvas =
  typeof document === "undefined"
    ? undefined
    : document.createElement("canvas").getContext("2d");
if (inputWidthCanvas) {
  inputWidthCanvas.font =
    '14px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

function measureInputTextWidth(text: string) {
  return inputWidthCanvas?.measureText(text).width ?? text.length * 9;
}

function measureEditableValueWidth(value: unknown) {
  return Math.ceil(measureInputTextWidth(String(value ?? "")) + 24);
}

const widestDigitWidth = Math.max(
  ...Array.from("0123456789", (digit) => measureInputTextWidth(digit)),
);
const minimumEditableColumnWidth = Math.ceil(widestDigitWidth * 6 + 24);

const compactColumnWidths: Record<string, number> = {
  employeeNumber: 96,
  shiftStartTime: 112,
  shiftEndTime: 112,
  shiftNumber: 64,
  qrFreeExit: 60,
  cscSaleSv2Sv6Quantity: 64,
  cscSaleT1T3Quantity: 64,
  cscSaleAmount: 72,
  cscRefundSv2Quantity: 64,
  cscRefundT1T3Quantity: 64,
  cscRefundAmount: 72,
  eibAmount: 72,
  posAtCcc: 76,
  staticQrAtCcc: 76,
  upiAtTomCc: 76,
  penaltyThroughHhtPurse: 76,
  parkingThroughHhtPurse: 76,
  surchargeThroughPurseAfc: 76,
  surchargeThroughPurseNcmc: 76,
  outstandingCurrentAfc: 76,
  outstandingCurrentMisc: 76,
  tvmMutilatedFakeNotes: 76,
  outstandingPaidAfc: 76,
  outstandingPaidMisc: 76,
};

function getSheetColumnWidth(
  column: ColumnLeaf,
  columnIndex: number,
  uniformColumnWidth?: number,
) {
  if (uniformColumnWidth !== undefined) return uniformColumnWidth;
  if (columnIndex === 0) return firstColumnWidth;
  const compactWidth = compactColumnWidths[column.fieldKey];
  if (compactWidth !== undefined) return compactWidth;
  if (column.label === "Qty") return 70;
  if (column.label.startsWith("Amt")) return 90;
  if (column.kind === "text") return 140;
  return 100;
}

// return column freeze properties based on index
function getColumnFreezeProps(
  columnIndex: number,
  columnOffsets: number[],
  frozenColumnCount: number,
  columnWidth: number,
) {
  const isFrozen = columnIndex < frozenColumnCount;
  const style = isFrozen ? { left: columnOffsets[columnIndex] ?? 0 } : {};

  if (columnIndex === 0) {
    return {
      isFrozen,
      className: isFrozen ? "sticky" : "",
      style: {
        ...style,
        width: columnWidth,
        minWidth: columnWidth,
        maxWidth: columnWidth,
      },
    };
  }

  return {
    isFrozen,
    className: isFrozen ? "sticky" : "",
    style: isFrozen
      ? {
          ...style,
          width: columnWidth,
          minWidth: columnWidth,
          maxWidth: columnWidth,
        }
      : style,
  };
}

// turns the nested column list into rows of <th> cells (one row per header level)
function buildHeaderRows(
  columns: ColumnNode[],
  sheetStyle: SheetStyle,
  isEarningGrid: boolean,
  headerRowOffsets: number[],
  columnOffsets: number[],
  frozenColumnCount: number,
  columnWidths: number[],
): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from(
    { length: headerLevelCount },
    () => [],
  );

  let leafIndexCounter = 0;
  const earningHeaderStyle = isEarningGrid
    ? "border border-border bg-table-header text-foreground"
    : "";

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

      const headerKey = `${parentKey}-${levelIndex}-${nodeIndex}-${node.label}`;
      const top = headerRowOffsets[levelIndex] ?? 0;
      if (isColumnGroup(node)) {
        const groupLeafCount = collectLeafColumns(node).length;
        const currentLeafStart = leafIndexCounter;

        const isFrozen =
          frozenColumnCount > 0 &&
          currentLeafStart + groupLeafCount <= frozenColumnCount;
        const freezeBoundaryClass =
          frozenColumnCount > 0 &&
          currentLeafStart + groupLeafCount === frozenColumnCount
            ? "sheet-freeze-boundary"
            : "";
        let zIndex = "z-20";

        if (isFrozen) zIndex = "z-30";

        const headerClass = `sticky ${zIndex} ${isFrozen ? "sheet-frozen-header" : ""} ${freezeBoundaryClass} ${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]} whitespace-normal break-normal text-center !px-1 !py-2 !text-xs !leading-tight !font-bold ${earningHeaderStyle}`;
        headerRows[levelIndex].push(
          <th
            key={headerKey}
            colSpan={groupLeafCount}
            className={headerClass}
            style={{
              top,
              ...(isFrozen ? { left: columnOffsets[currentLeafStart] ?? 0 } : {}),
            }}
          >
            {node.label}
          </th>,
        );

        addHeaders(node.children, levelIndex + 1, colorIndex, headerKey);
      } else {
        const leafIndex = leafIndexCounter++;
        const columnWidth = columnWidths[leafIndex];
        const freeze = getColumnFreezeProps(
          leafIndex,
          columnOffsets,
          frozenColumnCount,
          columnWidth,
        );
        const zIndex = freeze.isFrozen ? "z-30" : "z-20";
        const calculatedHeaderClass =
          node.kind === "calculated" ? "calculated-header" : "";
        const freezeBoundaryClass =
          frozenColumnCount > 0 && leafIndex === frozenColumnCount - 1
            ? "sheet-freeze-boundary"
            : "";
        const freezeSeamClass =
          frozenColumnCount > 0 && leafIndex === frozenColumnCount - 1
            ? "sheet-freeze-seam"
            : "";
        const headerClass = `sticky ${zIndex} ${freeze.className} ${freeze.isFrozen ? "sheet-frozen-header" : ""} ${freezeBoundaryClass} ${freezeSeamClass} ${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]} whitespace-normal break-normal text-center !px-1 !py-2 !text-xs !leading-tight !font-bold ${calculatedHeaderClass} ${earningHeaderStyle}`;
        headerRows[levelIndex].push(
          <th
            key={headerKey}
            rowSpan={headerLevelCount - levelIndex}
            className={headerClass}
            style={{ ...freeze.style, top, width: columnWidth }}
          >
            {node.label}
          </th>,
        );
      }
    });
  }

  addHeaders(columns, 0, 0, "root");
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
  onAddRow?: () => void;
  frozenColumnCount?: number;
  uniformColumnWidth?: number;
  mergeFooterLabel?: boolean;
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
  onAddRow,
  frozenColumnCount = 2,
  uniformColumnWidth,
  mergeFooterLabel = true,
  showTotalRow = true,
  sheetStyle = defaultSheetStyle,
  gridName = "sheet",
}: EarningSheetTableProps) {
  const isShiftGrid = gridName === "shift";
  const isFinalGrid = gridName === "final";
  const isEarningGrid =
    isShiftGrid || gridName === "tvm" || isFinalGrid;
  const leafColumns = columns.flatMap(collectLeafColumns);
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) =>
    readRow(rowIndex),
  );
  const columnWidths = leafColumns.map((column, columnIndex) => {
    const baseWidth = getSheetColumnWidth(
      column,
      columnIndex,
      uniformColumnWidth,
    );
    if (uniformColumnWidth !== undefined) return baseWidth;

    if (
      isShiftGrid &&
      (column.kind === "text" || column.kind === "number")
    ) {
      const longestValueLength = allRows.reduce((longest, row) => {
        const value = row[column.fieldKey];
        return Math.max(longest, measureEditableValueWidth(value));
      }, 0);

      return Math.max(
        baseWidth,
        minimumEditableColumnWidth,
        longestValueLength,
      );
    }

    if (columnIndex >= 6) return baseWidth;

    const longestValueLength = allRows.reduce((longest, row) => {
      const value = row[column.fieldKey];
      return Math.max(longest, value == null ? 0 : String(value).length);
    }, 0);

    return Math.max(baseWidth, longestValueLength * 9 + 24);
  });
  const getColumnWidth = (columnIndex: number) => columnWidths[columnIndex];
  const isEditable = Boolean(readEntryValue && writeEntryValue);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [headerRowHeights, setHeaderRowHeights] = useState<number[]>([]);
  const [columnOffsets, setColumnOffsets] = useState([0, 64, 204]);
  const headerRowOffsets = headerRowHeights.reduce<number[]>(
    (offsets, height) => {
      offsets.push(offsets[offsets.length - 1] + height);
      return offsets;
    },
    [0],
  );
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
  const totalLabelWidth = leafColumns
    .slice(0, Math.min(2, leafColumns.length))
    .reduce(
      (width, _, index) => width + columnWidths[index],
      0,
    );
  //     runningTotal + (column.kind === 'calculated' ? column.formula!(row) : parseNumber(row[column.fieldKey])), 0);
  const writeValueReference = useRef(writeEntryValue);
  useLayoutEffect(() => {
    writeValueReference.current = writeEntryValue;
  }, [writeEntryValue]);

  useEffect(() => {
    const rootOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderRowHeights = () => {
      const heights = Array.from(header.rows, (row) =>
        row.getBoundingClientRect().height,
      );
      setHeaderRowHeights((current) =>
        heights.length === current.length &&
        heights.every((height, index) => Math.abs(height - current[index]) < 0.5)
          ? current
          : heights,
      );
    };

    updateHeaderRowHeights();
    const observer = new ResizeObserver(updateHeaderRowHeights);
    observer.observe(header);
    Array.from(header.rows).forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, [columns]);

  useLayoutEffect(() => {
    const firstRow = tableRef.current?.tBodies[0]?.rows[0];
    if (
      frozenColumnCount === 0 ||
      !firstRow ||
      firstRow.cells.length < frozenColumnCount
    ) {
      return;
    }

    const updateColumnOffsets = () => {
      const widths = Array.from(firstRow.cells)
        .slice(0, frozenColumnCount)
        .map((cell) => cell.getBoundingClientRect().width);
      const offsets = widths.reduce<number[]>(
        (currentOffsets, width) => [
          ...currentOffsets,
          currentOffsets[currentOffsets.length - 1] + width,
        ],
        [0],
      );

      setColumnOffsets((current) =>
        offsets.length === current.length &&
        offsets.every(
          (offset, index) =>
            Math.abs(offset - (current[index] ?? 0)) < 0.5,
        )
          ? current
          : offsets,
      );
    };

    updateColumnOffsets();
    const observer = new ResizeObserver(updateColumnOffsets);
    Array.from(firstRow.cells)
      .slice(0, frozenColumnCount)
      .forEach((cell) => observer.observe(cell));

    return () => observer.disconnect();
  }, [columns, rowCount, frozenColumnCount]);

  return (
    <>
      {onAddRow && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onAddRow}
            className={`rounded-xl border border-table-border bg-table px-3 py-1 text-sm font-medium transition hover:-translate-y-0.5 hover:table-hover  ${
              isShiftGrid
                ? "shadow-sm hover:table-hover"
                : ""
            }`}
          >
            + Add row
          </button>
        </div>
      )}
      <div
        className={`${tableWrapperClass} snap-x scroll-p-6 scrollbar-thumb-table-header mr-6 scrollbar-track-table-header/10 ${
          isShiftGrid
            ? "overflow-auto! rounded-xl"
            : isFinalGrid
              ? "overflow-auto!"
            : ""
        }`}
        style={
          gridName === "shift"
            ? { height: "calc(100dvh - 180px)" }
            : onAddRow
              ? { height: "calc(100dvh - 170px)" }
              : undefined
        }
        onKeyDown={handleSheetKeyDown}
        tabIndex={isEditable ? undefined : 0}
      >
        <table
          ref={tableRef}
          className={`sheet-sticky-table ${tableClass} ${
            isShiftGrid || isFinalGrid ? "!w-max" : ""
          }`}
        >
          <colgroup>
            {leafColumns.map((column, columnIndex) => (
              <col
                key={column.fieldKey}
                style={{
                  width: getColumnWidth(columnIndex),
                }}
              />
            ))}
          </colgroup>
          <thead ref={headerRef} className="sheet-sticky-header">
          
            {buildHeaderRows(
              columns,
              sheetStyle,
              isEarningGrid,
              headerRowOffsets,
              columnOffsets,
              frozenColumnCount,
              columnWidths,
            ).map(
              (headerRow, headerRowIndex) => (
                <tr key={headerRowIndex} className={`${tableHeaderCellClass} font-bold!`}>
                  {headerRow}
                </tr>
              ),
            )}
          </thead>

          <tbody>
            
            {allRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${tableRowClass} ${
                  isShiftGrid
                    ? "even:bg-table-row-alt hover:bg-table-row-hove"
                    : ""
                }`}
              >
                {leafColumns.map((column, colIndex) => {
                  const columnWidth = getColumnWidth(colIndex);
                  const freeze = getColumnFreezeProps(
                    colIndex,
                    columnOffsets,
                    frozenColumnCount,
                    columnWidth,
                  );
                  const stickyClass = [
                    freeze.isFrozen
                      ? `${freeze.className} z-10 sheet-frozen-cell ${
                          rowIndex % 2 === 1 ? "sheet-frozen-cell-even" : ""
                        }`
                      : "",
                    frozenColumnCount > 0 &&
                    colIndex === frozenColumnCount - 1
                      ? "sheet-freeze-boundary sheet-freeze-seam"
                      : "",
                  ].join(" ");
                  if (column.kind === "calculated") {
                    return (
                      <td 
                        key={column.fieldKey} 
                        className={`
                          ${sheetStyle.bodyCellClass} 
                          ${tableCalculatedCellClass}
                          ${stickyClass}`} 
                          style={{ ...freeze.style, width: columnWidth }}>

                        {formatRupees(column.formula!(row))}
                      </td>
                    );
                  }
                  if (column.kind === "mirror") {
                    // looks like a typed number cell, but is read-only and follows another column
                    return (
                      <td
                        key={column.fieldKey}
                        className={`${tableMirrorCellClass} ${stickyClass}`}
                        style={{ ...freeze.style, width: columnWidth }}
                      >
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
                        isTime={
                          column.fieldKey === "shiftStartTime" ||
                          column.fieldKey === "shiftEndTime"
                        }
                        value={readEntryValue!(rowIndex, column.fieldKey)}
                        writeValueReference={writeValueReference}
                        extraClass={stickyClass}
                        style={{ ...freeze.style, width: columnWidth }}
                      />
                    );
                  }
                  // read-only: just show the value
                  return (
                    <td key={column.fieldKey} 
                        className={`${tableCellClass} ${stickyClass}`}
                        style={{ ...freeze.style, width: columnWidth }}
                    >
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
                {leafColumns.map((column, columnIndex) => {
                  if (mergeFooterLabel && columnIndex > 0 && columnIndex < 2) {
                    return null;
                  }

                  const freeze = getColumnFreezeProps(
                    columnIndex,
                    columnOffsets,
                    frozenColumnCount,
                    getColumnWidth(columnIndex),
                  );
                  const zIndex = freeze.isFrozen ? 50 : 40;
                  const isTotalLabel = columnIndex === 0;
                  const footerStickyClass = `sticky ${freeze.className} ${sheetStyle.footerCellClass} border border-border px-2 py-3 font-semibold ${column.kind === "calculated" ? tableCalculatedCellClass : ""} ${isTotalLabel ? "!text-center" : ""}`;
                  const freezeBoundaryClass =
                    (isTotalLabel && mergeFooterLabel) ||
                    (frozenColumnCount > 0 &&
                      columnIndex === frozenColumnCount - 1)
                      ? "sheet-freeze-boundary"
                      : "";
                  const footerStyle = isTotalLabel && mergeFooterLabel
                    ? {
                        ...freeze.style,
                        width: totalLabelWidth,
                        minWidth: totalLabelWidth,
                        maxWidth: totalLabelWidth,
                      }
                    : freeze.style;

                  return (
                    <td
                      key={column.fieldKey}
                      colSpan={
                        isTotalLabel && mergeFooterLabel
                          ? Math.min(2, leafColumns.length)
                          : undefined
                      }
                      className={`${footerStickyClass} ${freezeBoundaryClass}`}
                      style={{
                        ...footerStyle,
                        width: isTotalLabel && mergeFooterLabel
                          ? columnOffsets[2]
                          : getColumnWidth(columnIndex),
                        position: "sticky",
                        bottom: 0,
                        zIndex,
                        borderTop: "2px solid var(--sheet-border)",
                        boxShadow: `${freezeBoundaryClass ? "inset -2px 0 0 var(--border), " : ""}0 -2px 6px rgb(0 0 0 / 0.15)`,
                      }}
                    >
                      {isTotalLabel ? "Total" : column.kind === "text"
                        ? "" : formatCellValue(column, totalOfColumn(column))}
                    </td>
                  )
                })

                }
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </>
  );
}

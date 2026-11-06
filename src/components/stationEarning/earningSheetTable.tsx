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

const firstColumnWidth = 64;

const compactColumnWidths: Record<string, number> = {
  employeeNumber: 96,
  shiftStartTime: 88,
  shiftEndTime: 88,
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
  if (column.label === "Qty") return 49;
  if (column.label.startsWith("Amt")) return 70;
  if (column.kind === "text") return 140;
  return 100;
}

// return column freeze properties based on index
function getColumnFreezeProps(
  columnIndex: number,
  columnOffsets: number[],
  frozenColumnCount: number,
) {
  const isFrozen = columnIndex < frozenColumnCount;
  const style = isFrozen ? { left: columnOffsets[columnIndex] ?? 0 } : {};

  if (columnIndex === 0) {
    return {
      isFrozen,
      className: "sticky",
      style: {
        ...style,
        width: firstColumnWidth,
        minWidth: firstColumnWidth,
        maxWidth: firstColumnWidth,
      },
    };
  }

  return { isFrozen, className: isFrozen ? "sticky" : "", style };
}

// turns the nested column list into rows of <th> cells (one row per header level)
function buildHeaderRows(
  columns: ColumnNode[],
  sheetStyle: SheetStyle,
  headerRowOffsets: number[],
  columnOffsets: number[],
  frozenColumnCount: number,
  uniformColumnWidth?: number,
): ReactNode[][] {
  const headerLevelCount = Math.max(...columns.map(columnDepth));
  const headerRows: ReactNode[][] = Array.from(
    { length: headerLevelCount },
    () => [],
  );

  let leafIndexCounter = 0;

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

        const headerClass = `sticky ${zIndex} ${freezeBoundaryClass} ${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]} whitespace-normal break-normal text-center !px-1 !py-2 !text-xs !leading-tight`;
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
        const freeze = getColumnFreezeProps(
          leafIndex,
          columnOffsets,
          frozenColumnCount,
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
        const columnWidth = getSheetColumnWidth(
          node,
          leafIndex,
          uniformColumnWidth,
        );
        const headerClass = `sticky ${zIndex} ${freeze.className} ${freezeBoundaryClass} ${freezeSeamClass} ${sheetStyle.headerCellClass} ${sheetStyle.headerColorClasses[colorIndex]} whitespace-normal break-normal text-center !px-1 !py-2 !text-xs !leading-tight ${calculatedHeaderClass}`;
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
  frozenColumnCount = 3,
  uniformColumnWidth,
  mergeFooterLabel = true,
  showTotalRow = true,
  sheetStyle = defaultSheetStyle,
  gridName = "sheet",
}: EarningSheetTableProps) {
  const leafColumns = columns.flatMap(collectLeafColumns);
  const allRows = Array.from({ length: rowCount }, (_, rowIndex) =>
    readRow(rowIndex),
  );
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
    .slice(0, Math.min(3, leafColumns.length))
    .reduce(
      (width, column, index) =>
        width + getSheetColumnWidth(column, index, uniformColumnWidth),
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
    if (!firstRow || firstRow.cells.length < 3) return;

    const updateColumnOffsets = () => {
      const widths = Array.from(firstRow.cells)
        .slice(0, 3)
        .map((cell) => cell.getBoundingClientRect().width);
      const offsets = [
        0,
        widths[0],
        widths[0] + widths[1],
        widths[0] + widths[1] + widths[2],
      ];

      setColumnOffsets((current) =>
        offsets.every((offset, index) => Math.abs(offset - (current[index] ?? 0)) < 0.5)
          ? current
          : offsets,
      );
    };

    updateColumnOffsets();
    const observer = new ResizeObserver(updateColumnOffsets);
    Array.from(firstRow.cells)
      .slice(0, 3)
      .forEach((cell) => observer.observe(cell));

    return () => observer.disconnect();
  }, [columns, rowCount]);

  return (
    <>
      {onAddRow && (
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onAddRow}
            className="rounded-xl border border-bd bg-card px-3 py-1 text-sm font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac"
          >
            + Add row
          </button>
        </div>
      )}
      <div
        className={tableWrapperClass}
        style={onAddRow ? { height: "calc(100dvh - 170px)" } : undefined}
        onKeyDown={handleSheetKeyDown}
        tabIndex={isEditable ? undefined : 0}
      >
        <table ref={tableRef} className={sheetTableClass}>
          <colgroup>
            {leafColumns.map((column, columnIndex) => (
              <col
                key={column.fieldKey}
                style={{
                  width: getSheetColumnWidth(column, columnIndex, uniformColumnWidth),
                }}
              />
            ))}
          </colgroup>
          <thead ref={headerRef}>
          
            {buildHeaderRows(
              columns,
              sheetStyle,
              headerRowOffsets,
              columnOffsets,
              frozenColumnCount,
              uniformColumnWidth,
            ).map(
              (headerRow, headerRowIndex) => (
                <tr key={headerRowIndex}>{headerRow}</tr>
              ),
            )}
          </thead>

          <tbody>
            
            {allRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={tableRowClass} >
                {leafColumns.map((column, colIndex) => {
                    const freeze = getColumnFreezeProps(
                      colIndex,
                      columnOffsets,
                      frozenColumnCount,
                    );
                  const stickyClass = [
                    freeze.isFrozen
                      ? `${freeze.className} z-10 bg-white dark:bg-slate-900`
                      : "",
                    frozenColumnCount > 0 &&
                    colIndex === frozenColumnCount - 1
                      ? "sheet-freeze-boundary sheet-freeze-seam"
                      : "",
                  ].join(" ");
                  const columnWidth = getSheetColumnWidth(
                    column,
                    colIndex,
                    uniformColumnWidth,
                  );

                  if (column.kind === "calculated") {
                    return (
                      <td 
                        key={column.fieldKey} 
                        className={`
                          ${sheetStyle.bodyCellClass} 
                          ${tableCalculatedCellClass} calculated-cell
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
                        inputWidth={columnWidth - 12}
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
                  if (mergeFooterLabel && columnIndex > 0 && columnIndex < 3) {
                    return null;
                  }

                  const freeze = getColumnFreezeProps(
                    columnIndex,
                    columnOffsets,
                    frozenColumnCount,
                  );
                  const zIndex = freeze.isFrozen ? 50 : 40;
                  const isTotalLabel = columnIndex === 0;
                  const footerStickyClass = `sticky ${freeze.className} ${sheetStyle.footerCellClass} ${isTotalLabel ? "!text-center" : ""}`;
                  const freezeBoundaryClass =
                    (isTotalLabel && mergeFooterLabel) ||
                    (frozenColumnCount > 0 &&
                      columnIndex === frozenColumnCount - 1)
                      ? "sheet-freeze-boundary"
                      : "";
                  const footerStyle = isTotalLabel && mergeFooterLabel
                    ? { ...freeze.style, width: totalLabelWidth }
                    : freeze.style;

                  return (
                    <td
                      key={column.fieldKey}
                      colSpan={
                        isTotalLabel && mergeFooterLabel
                          ? Math.min(3, leafColumns.length)
                          : undefined
                      }
                      className={`${footerStickyClass} ${freezeBoundaryClass}`}
                      style={{
                        ...footerStyle,
                        width: isTotalLabel && mergeFooterLabel
                          ? columnOffsets[3]
                          : getSheetColumnWidth(
                              column,
                              columnIndex,
                              uniformColumnWidth,
                            ),
                        position: "sticky",
                        bottom: 0,
                        zIndex,
                        borderTop: "2px solid var(--sheet-border)",
                        boxShadow: "0 -2px 6px rgb(0 0 0 / 0.15)",
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

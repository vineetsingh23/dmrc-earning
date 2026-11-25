import type { DetailListKind } from "../../lib/registerTypes";
import { penaltySections } from "../../lib/businessRules";
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";
import { Trash2 } from "lucide-react";
import {
  tableCellClass,
  tableHeaderCellClass,
  tableHeaderRowClass,
  tableInputClass,
  tableRowClass,
  tableWrapperClass,
  tableClass,
  cardClass,
  cardHeaderClass,
  cardHeadingClass,
  tableTotalCellClass,
  tableTotalRowClass,
  tableCellLeftClass,
  primaryButtonClass,
} from "../../globalStyles";

interface DetailListCardProps {
  title: string;
  listKind: DetailListKind;
  columnTitles: string[];
  listRows: string[][];
  onAddRow: () => void;
  onDeleteRow: (rowIndex: number) => void;
  onCellChange: (
    rowIndex: number,
    columnIndex: number,
    newValue: string,
  ) => void;
}

const detailListRowCount = 3;
const detailListInputClass = `${tableInputClass} !h-[44px]`;
const expandablePenaltyColumns = new Set([0, 5, 6, 7]);
const penaltyTextCanvas =
  typeof document === "undefined"
    ? undefined
    : document.createElement("canvas").getContext("2d");
if (penaltyTextCanvas) {
  penaltyTextCanvas.font =
    '14px Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
}

const penaltyTypes = [
  { field: "manualPenaltyAmount", label: "Manual Penalty" },
  { field: "hhtPenaltyCashAmount", label: "Cash by HHT" },
  { field: "hhtPenaltyPurseAmount", label: "Penalty by Purse" },
];

function expandablePenaltyColumnWidth(columnIndex: number, rows: string[][]) {
  if (!expandablePenaltyColumns.has(columnIndex)) return undefined;

  const contentWidth = rows.reduce((widest, row) => {
    const lineWidths = (row[columnIndex] ?? "")
      .split(/\r?\n/)
      .map(
        (line) =>
          penaltyTextCanvas?.measureText(line).width ?? line.length * 8,
      );
    return Math.max(widest, ...lineWidths);
  }, 0);

  return Math.max(120, Math.ceil(contentWidth + 24));
}

function formatPenaltyDateTime(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 12) return value;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const hours = Number(digits.slice(8, 10));
  const minutes = Number(digits.slice(10, 12));
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    hours > 23 ||
    minutes > 59
  )
    return value;

  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)} & ${digits.slice(8, 10)}:${digits.slice(10, 12)}`;
}

function penaltyColumnClass(columnIndex: number) {
  if (columnIndex === 0) return "w-[120px]";
  if (columnIndex === 1) return "w-[120px]";
  if (columnIndex === 2) return "w-[120px]";
  if (columnIndex === 3) return "w-[210px]";
  if (columnIndex === 4) return "w-[140px]";
  if (columnIndex === 5) return "w-[120px]";
  if (columnIndex === 6) return "w-[120px]";
  if (columnIndex === 7) return "w-[120px]";
  if (columnIndex === 8) return "w-[70px]";

  return "";
}

export default function DetailListCard({
  title,
  listKind,
  columnTitles,
  listRows,
  onCellChange,
  onAddRow,
  onDeleteRow,
}: DetailListCardProps) {
  const penaltySectionColumnIndex = 2;
  const penaltyDetailColumnIndex = 3;
  const penaltyAmountColumnIndex = 8;
  const penaltyTypeColumnIndex = 4;
  const penaltyDateTimeColumnIndex = 1;
  const isAmountColumn = (columnIndex: number) =>
    listKind === "penaltyDetails"
      ? columnIndex === penaltyAmountColumnIndex
      : columnIndex === columnTitles.length - 1;
  const columnTextAlignmentClass = (columnIndex: number) =>
    isAmountColumn(columnIndex) ? "!text-right" : "!text-center";
  const showActionColumn = listRows.length > detailListRowCount;
  const penaltySectionsUnique = [
    ...new Map(penaltySections.map((rule) => [rule.section, rule])).values(),
  ];
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className={cardHeaderClass}>
        <h2 className={cardHeadingClass}>{title}</h2>

        <button type="button" onClick={onAddRow} className={primaryButtonClass}>
          + Add row
        </button>
      </div>
      <div className={tableWrapperClass}>
        <table
          className={`${tableClass} ${listKind === "penaltyDetails" ? "min-w-[1335px] table-fixed" : ""}`}
        >
          <thead>
            <tr className={tableHeaderRowClass}>
              {showActionColumn && (
                <th
                  className={`${tableHeaderCellClass} w-[56px] min-w-[56px] whitespace-nowrap`}
                >
                  Action
                </th>
              )}
              {columnTitles.map((columnTitle, columnIndex) => (
                <th
                  key={columnTitle}
                  className={`${tableHeaderCellClass} ${listKind === "penaltyDetails" ? penaltyColumnClass(columnIndex) : ""} whitespace-normal break-words`}
                  style={
                    listKind === "penaltyDetails"
                      ? {
                          width: expandablePenaltyColumnWidth(
                            columnIndex,
                            listRows,
                          ),
                        }
                      : undefined
                  }
                >
                  {columnTitle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(
              { length: Math.max(detailListRowCount, listRows.length) },
              (_, rowIndex) => (
                <tr key={rowIndex} className={tableRowClass}>
                  {showActionColumn && (
                    <td
                      className={`${tableCellClass} align-middle text-center`}
                    >
                      {rowIndex >= detailListRowCount && (
                        <button
                          type="button"
                          onClick={() => onDeleteRow(rowIndex)}
                          aria-label={`Delete added row ${rowIndex - detailListRowCount + 1}`}
                          title="Delete added row"
                          className="inline-flex size-5 items-center justify-center rounded-md text-danger-text transition hover:bg-danger/10"
                        >
                          <Trash2 className="size-5" aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  )}
                  {columnTitles.map((columnTitle, columnIndex) => (
                    <td
                      key={columnTitle}
                      className={`${tableCellClass} p-0 align-middle whitespace-normal wrap-break-word ${listKind === "penaltyDetails" ? penaltyColumnClass(columnIndex) : ""}`}
                      style={
                        listKind === "penaltyDetails"
                          ? {
                              width: expandablePenaltyColumnWidth(
                                columnIndex,
                                listRows,
                              ),
                            }
                          : undefined
                      }
                    >
                      {listKind === "penaltyDetails" &&
                      columnIndex === penaltySectionColumnIndex ? (
                        <select
                          data-grid={listKind}
                          data-row={rowIndex}
                          data-column={columnIndex}
                          value={listRows[rowIndex]?.[columnIndex] ?? ""}
                          onChange={(event) => {
                            const selectedSection = event.target.value;
                            const matchingRule = penaltySections.find(
                              (rule) => rule.section === selectedSection,
                            );
                            onCellChange(
                              rowIndex,
                              penaltySectionColumnIndex,
                              selectedSection,
                            );
                            onCellChange(
                              rowIndex,
                              penaltyDetailColumnIndex,
                              matchingRule?.penaltyDetail ?? "",
                            );
                            onCellChange(
                              rowIndex,
                              penaltyAmountColumnIndex,
                              matchingRule
                                ? String(matchingRule.penaltyAmount)
                                : "",
                            );
                          }}
                          className={`${detailListInputClass} w-full min-w-0 whitespace-normal wrap-break-words ${columnTextAlignmentClass(columnIndex)}`}
                        >
                          <option value="">Select section</option>
                          {penaltySectionsUnique.map((penaltySection) => (
                            <option
                              key={penaltySection.section}
                              value={penaltySection.section}
                            >
                              {penaltySection.section}
                            </option>
                          ))}
                        </select>
                      ) : listKind === "penaltyDetails" &&
                        columnIndex === penaltyDetailColumnIndex ? (
                        <select
                          data-grid={listKind}
                          data-row={rowIndex}
                          data-column={columnIndex}
                          value={listRows[rowIndex]?.[columnIndex] ?? ""}
                          onChange={(event) => {
                            const selectedDetail = event.target.value;
                            const matchingRule = penaltySections.find(
                              (rule) =>
                                rule.section ===
                                  listRows[rowIndex]?.[
                                    penaltySectionColumnIndex
                                  ] && rule.penaltyDetail === selectedDetail,
                            );
                            onCellChange(
                              rowIndex,
                              penaltyDetailColumnIndex,
                              selectedDetail,
                            );
                            onCellChange(
                              rowIndex,
                              penaltyAmountColumnIndex,
                              matchingRule
                                ? String(matchingRule.penaltyAmount)
                                : "",
                            );
                          }}
                          className={`${detailListInputClass} w-full min-w-0 whitespace-normal wrap-break-word ${columnTextAlignmentClass(columnIndex)}`}
                        >
                          <option value="">Select penalty detail</option>
                          {penaltySections
                            .filter(
                              (rule) =>
                                rule.section ===
                                listRows[rowIndex]?.[penaltySectionColumnIndex],
                            )
                            .map((rule) => (
                              <option
                                key={rule.penaltyDetail}
                                value={rule.penaltyDetail}
                              >
                                {rule.penaltyDetail}
                              </option>
                            ))}
                        </select>
                      ) : listKind === "penaltyDetails" &&
                        columnIndex === penaltyAmountColumnIndex ? (
                        <input
                          data-grid={listKind}
                          data-row={rowIndex}
                          data-column={columnIndex}
                          value={listRows[rowIndex]?.[columnIndex] ?? ""}
                          readOnly
                          className={`${detailListInputClass} w-full min-w-0 !text-right`}
                        />
                      ) : listKind === "penaltyDetails" &&
                        columnIndex === penaltyTypeColumnIndex ? (
                        <select
                          data-grid={listKind}
                          data-row={rowIndex}
                          data-column={columnIndex}
                          value={listRows[rowIndex]?.[columnIndex] ?? ""}
                          onChange={(event) =>
                            onCellChange(
                              rowIndex,
                              columnIndex,
                              event.target.value,
                            )
                          }
                          className={`${detailListInputClass} w-full min-w-0 whitespace-normal wrap-break-word ${columnTextAlignmentClass(columnIndex)}`}
                        >
                          <option value="">Select type</option>
                          {penaltyTypes.map((type) => (
                            <option key={type.field} value={type.field}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          data-grid={listKind}
                          data-row={rowIndex}
                          data-column={columnIndex}
                          value={
                            listKind === "penaltyDetails" &&
                            columnIndex === penaltyDateTimeColumnIndex
                              ? formatPenaltyDateTime(
                                  listRows[rowIndex]?.[columnIndex] ?? "",
                                )
                              : (listRows[rowIndex]?.[columnIndex] ?? "")
                          }
                          placeholder={
                            listKind === "penaltyDetails" &&
                            columnIndex === penaltyDateTimeColumnIndex
                              ? "DD-MM-YYYY HH:MM"
                              : ""
                          }
                          onFocus={(event) => event.target.select()}
                          onBlur={(event) => {
                            if (
                              listKind === "penaltyDetails" &&
                              columnIndex === penaltyDateTimeColumnIndex
                            ) {
                              onCellChange(
                                rowIndex,
                                columnIndex,
                                formatPenaltyDateTime(event.target.value),
                              );
                            }
                          }}
                          onChange={(event) =>
                            onCellChange(
                              rowIndex,
                              columnIndex,
                              event.target.value,
                            )
                          }
                          className={`${detailListInputClass} w-full min-w-0 ${columnTextAlignmentClass(columnIndex)}`}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ),
            )}
          </tbody>
          {listKind === "penaltyDetails" && (
            <tfoot>
              <tr className={tableTotalRowClass}>
                {showActionColumn && (
                  <td className={`${tableTotalCellClass} w-[56px] min-w-[56px]`} />
                )}
                <td
                  colSpan={penaltyAmountColumnIndex}
                  className={`${tableCellLeftClass} font-bold text-left`}
                >
                  Total
                </td>
                <td
                  className={`${tableTotalCellClass} font-bold text-right px-2`}
                >
                  {listRows
                    .reduce((total, row) => {
                      const amount = Number(
                        (row[penaltyAmountColumnIndex] ?? "").replace(/,/g, ""),
                      );
                      return total + (Number.isFinite(amount) ? amount : 0);
                    }, 0)
                    .toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <div className="mt-2 flex items-center justify-between px-6 py-3 text-xs">
        <span className="text-table-text">
          {listKind === "penaltyDetails" ? (
            <span>
              Every Penalty will be added in final earning simultaneouly
            </span>
          ) : (
            ""
          )}
        </span>
      </div>
    </div>
  );
}

import { formatRupees } from "../../lib/earningCalculations";
import { parseNumber } from "../../lib/earningColumns";
import {
  entryCountsOnDate,
  miscColumnIndex,
  runningTotalsOfRows,
  type MiscKind,
} from "../../lib/miscEntries";
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";
import {
  cardButtonClass,
  cardClass,
  cardHeaderClass,
  cardHeadingClass,
  tableCellClass,
  tableCellLeftClass,
  tableClass,
  tableHeaderCellClass,
  tableHeaderRowClass,
  tableInputClass,
  tableRowClass,
  tableTotalCellClass,
  tableTotalRowClass,
  tableWrapperClass,
} from "../../globalStyles";
import { PlusIcon } from "lucide-react";

interface MiscEntryCardProps {
  title: string;
  kind: MiscKind;
  rows: string[][]; // every entry of the ledger: date, name, amount, remark
  rowCount: number;
  selectedDate: string;
  countedTotal: number; // the part counted in cash possession on the selected date
  onCellChange: (
    rowIndex: number,
    columnIndex: number,
    newValue: string,
  ) => void;
  onAddRow: () => void;
}

export default function MiscEntryCard({
  title,
  kind,
  rows,
  rowCount,
  selectedDate,
  countedTotal,
  onCellChange,
  onAddRow,
}: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, rowCount);
  const amountTotal = rows.reduce(
    (total, row) => total + parseNumber(row?.[miscColumnIndex.amount]),
    0,
  );

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (
    rowIndex: number,
    columnIndex: number,
    isNumber = false,
  ) => (
    <td className={`${tableCellClass} min-w-0 py-0 text-left`}>
      {columnIndex === miscColumnIndex.name ||
      columnIndex === miscColumnIndex.remark ? (
        <textarea
          ref={(element) => {
            if (!element) return;
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
          }}
          data-grid={kind}
          data-row={rowIndex}
          data-column={columnIndex}
          value={rows[rowIndex]?.[columnIndex] ?? ""}
          rows={1}
          cols={1}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            event.currentTarget.style.height = "auto";
            event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
            onCellChange(rowIndex, columnIndex, event.target.value);
          }}
          className={`${tableInputClass} min-w-0 resize-none overflow-hidden`}
        />
      ) : (
        <input
          data-grid={kind}
          data-row={rowIndex}
          data-column={columnIndex}
          value={rows[rowIndex]?.[columnIndex] ?? ""}
          inputMode={isNumber ? "decimal" : "text"}
          onFocus={(event) => event.target.select()}
          onChange={(event) =>
            onCellChange(rowIndex, columnIndex, event.target.value)
          }
          className={`${tableInputClass} min-w-0 ${isNumber ? "text-right" : ""}`}
        />
      )}
    </td>
  );

  const headers = [
    "Date",
    "Equipment or Person Name",
    "Amount",
    "Total Amount",
    "Remarks",
  ];

  return (
    <div className={`${cardClass}`} onKeyDown={handleSheetKeyDown}>
      {/* DMRC Corporate Branding Accent Top Bar */}
      {/* <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-blue-900 rounded-2xl"></div> */}

      {/* Card Header */}
      <div className={cardHeaderClass}>
        <h2 className={cardHeadingClass}>
          <span className="h-2 w-2 rounded-full bg-danger mr-3"></span>
          {title}
        </h2>
        <button type="button" onClick={onAddRow} className={cardButtonClass}>
          <PlusIcon size={18} className="inline-block" /> Add row
        </button>
      </div>

      {/* Table Section */}
      <div className={`${tableWrapperClass} overflow-hidden`}>
        <table className={`${tableClass} w-full min-w-0 table-fixed`}>
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[27%]" />
            <col className="w-[16%]" />
            <col className="w-[20%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead className={tableHeaderRowClass}>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className={`${tableHeaderCellClass} whitespace-normal wrap-break-word`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const isCounted = entryCountsOnDate(rows[rowIndex], selectedDate);
              return (
                <tr
                  key={rowIndex}
                  className={`${tableRowClass}${isCounted ? "" : "bg-inp opacity-50"}`}
                >
                  {typedCell(rowIndex, miscColumnIndex.date)}
                  {typedCell(rowIndex, miscColumnIndex.name)}
                  {typedCell(rowIndex, miscColumnIndex.amount, true)}
                  <td className={`${tableCellClass} min-w-0 break-all`}>
                    {runningTotals[rowIndex] === null
                      ? "—"
                      : formatRupees(runningTotals[rowIndex])}
                  </td>
                  {typedCell(rowIndex, miscColumnIndex.remark)}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td
                className={`${tableCellLeftClass} min-w-0 whitespace-normal wrap-break-words font-bold!`}
                colSpan={2}
              >
                Total
              </td>
              <td className={tableTotalCellClass}>
                {formatRupees(amountTotal)}
              </td>
              <td className={tableTotalCellClass}>
                {formatRupees(amountTotal)}
              </td>
              <td className={tableTotalCellClass} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Info Notice */}
      <div className="mt-2 flex items-center justify-between border-t border-bd bg-inp/70 px-6 py-3 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-bold">
          {kind === "miscDebit" ? (
            <span>
              Counted in cash possession up to this date (deposited as extra) :{" "}
              <span className="font-bold">{formatRupees(countedTotal)}</span>
            </span>
          ) : (
            `Counted in cash possession up to this date (as loss to SCR) : ${formatRupees(countedTotal)}`
          )}
        </span>
      </div>
    </div>
  );
}

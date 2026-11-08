import { CircleCheck } from "lucide-react";
import { Redo2, Undo2 } from "lucide-react";
import {
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
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";
import {
  formatRupees,
  looseCoinsKey,
  coinRows,
  noteRows,
} from "../../lib/earningCalculations";
import type { CashCountHistory } from "../../lib/registerTypes";

interface CashInPossessionCardProps {
  cashCountsInHand: Record<string, number>;
  looseCoinAmount?: number;
  denominationTotalAmount: number;
  totalCashInHand: number;
  miscDebitTotal: number;
  miscCreditTotal: number;
  imprestAndAdvanceIssuedTotal: number;
  cashCountsSource: "saved" | "carried" | "none";
  countHistory: CashCountHistory | undefined;
  onCountChange: (countKey: string, typedValue: string) => void;
  onBack: () => void;
  onNext: () => void;
}
interface CountRow {
  countKey: string;
  label: string;
  unitValue: number;
  isRupeeAmount: boolean;
}
const countRows: CountRow[] = [
  ...noteRows.map((row) => ({
    countKey: row.key,
    label: row.label,
    unitValue: Number(row.value),
    isRupeeAmount: false,
  })),
  {
    countKey: looseCoinsKey,
    label: "Loose coins (amount ₹)",
    unitValue: 1,
    isRupeeAmount: true,
  },
  ...coinRows.map((row) => ({
    countKey: row.key,
    label: row.label,
    unitValue: Number(row.value),
    isRupeeAmount: false,
  })),
];
const labelOfCountKey = (countKey: string) =>
  countRows.find((row) => row.countKey === countKey)?.label ?? countKey;
const timeOf = (milliseconds: number) =>
  new Date(milliseconds).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function CashInPossessionCard({
  cashCountsInHand,
  denominationTotalAmount,
  totalCashInHand,
  cashCountsSource,
  miscCreditTotal,
  miscDebitTotal,
  countHistory,
  onBack,
  onNext,
  imprestAndAdvanceIssuedTotal,
  onCountChange,
}: CashInPossessionCardProps) {
  const cardTotalAmount =
    denominationTotalAmount +
    imprestAndAdvanceIssuedTotal +
    miscCreditTotal -
    miscDebitTotal;
  const changes = countHistory?.changes ?? [];
  const position = countHistory?.position ?? 0;
  const lastAppliedChange = position > 0 ? changes[position - 1] : undefined;
  const canGoBack = position > 0,
    canGoNext = position < changes.length;
  const cashDifference =
    Math.round((cardTotalAmount - totalCashInHand) * 100) / 100;
  const matchesCashInHand = cashDifference === 0;

  //  const countInputClass = 'w-20 rounded border border-bd bg-inp px-1.5 py-0.5 text-right outline-hidden focus:ring-2 focus:ring-ac';
  const stepButtonClass =
    "flex items-center gap-1 rounded-lg border border-bd bg-card px-2.5 py-1 text-sm font-medium transition hover:border-ac hover:text-ac disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      className={`${cardClass} card ${cashDifference === 0 ? "" : "border-red-400 bg-errorCard"}`}
      onKeyDown={handleSheetKeyDown}
    >
      <div className={cardHeaderClass}>
        <div className="max-w-xs">
          <h2 className={cardHeadingClass}>Cash in possession</h2>

          <p className="mb-2 text-xs dark:text-slate-400 text-slate-700">
            {cashCountsSource === "saved" && "Counts saved for this date."}
            {cashCountsSource === "carried" &&
              "Counts carried over from the last counted date. Update them if the cash in your drawer is different."}
            {cashCountsSource === "none" &&
              "No counts yet. Enter the notes and coins you hold."}
          </p>
        </div>
        <div className="flex w-40 px-2 py-2 justify-between items-center h-12 border-2 rounded-md border-slate-300 dark:border-slate-600 shadow-md bg-linear-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-800">
          <span
            className={`${cashDifference === 0 ? "" : "text-red-500"} text-center font-medium w-1/2`}
          >
            {formatRupees(Number(cashDifference))}
          </span>
          <div className="flex justify-end transition-colors duration-150 relative">
            <CircleCheck
              size={30}
              className={`${cashDifference === 0 ? "fill-green-500" : "fill-red-500 animate-ping"}`}
              stroke="white"
              strokeWidth={1}
            />
          </div>
        </div>
      </div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={stepButtonClass}
          disabled={!canGoBack}
          onClick={onBack}
          title="Undo the last change"
        >
          <Undo2 className="size-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          className={stepButtonClass}
          disabled={!canGoNext}
          onClick={onNext}
          title="Apply the change again"
        >
          Next
          <Redo2 className="size-4" aria-hidden="true" />
        </button>
        <span role="status" className="text-xs text-mu">
          {changes.length === 0 && "No changes to review yet."}
          {changes.length > 0 &&
            lastAppliedChange &&
            `Step ${position} of ${changes.length}: ${labelOfCountKey(lastAppliedChange.countKey)} ${lastAppliedChange.from} → ${lastAppliedChange.to} at ${timeOf(lastAppliedChange.at)}`}
          {changes.length > 0 &&
            !lastAppliedChange &&
            `Back at the start. Next brings back ${changes.length} change${changes.length === 1 ? "" : "s"}.`}
        </span>
      </div>
            <div className={tableWrapperClass}>

      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>Denominations</th>
            <th className={tableHeaderCellClass}>Count</th>
            <th className={tableHeaderCellClass}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {countRows.map((countRow, rowIndex) => (
            <tr
            key={countRow.countKey}
              className={`${tableRowClass} ${cashDifference === 0 ? "" : "even:bg-errorCard"}`}
            >
              <td
                className={`${tableCellLeftClass} ${lastAppliedChange?.countKey === countRow.countKey ? "font-bold text-ac" : ""}`}
              >
                {lastAppliedChange?.countKey === countRow.countKey ? "● " : ""}
                {countRow.label}
              </td>
              <td className={tableCellClass}>
                <input
                  data-grid="cashCounts"
                  data-row={rowIndex}
                  data-column={0}
                  value={cashCountsInHand[countRow.countKey] || ""}
                  placeholder="0"
                  inputMode={countRow.isRupeeAmount ? "decimal" : "numeric"}
                  onFocus={(event) => event.target.select()}
                  onChange={(event) =>
                    onCountChange(countRow.countKey, event.target.value)
                  }
                  className={`${tableInputClass} text-right font-mono`}
                />
              </td>
              <td className={tableCellClass}>
                {formatRupees(
                  Number(countRow.unitValue) *
                    (cashCountsInHand[countRow.countKey] ?? 0),
                )}
              </td>
            </tr>
          ))}

          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Imprest Issued</td>
            <td className={tableCellClass}>-</td>
            <td className={tableCellClass}>
              {formatRupees(imprestAndAdvanceIssuedTotal)}
            </td>
          </tr>
          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Misc Debit Total</td>
            <td className={tableCellClass}>-</td>
            <td className={tableCellClass}>{formatRupees(miscDebitTotal)}</td>
          </tr>
          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Misc Credit Total</td>
            <td className={tableCellClass}>-</td>
            <td className={tableCellClass}>{formatRupees(miscCreditTotal)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableTotalCellClass} !text-left`} colSpan={2}>
              Total
            </td>
            <td className={tableTotalCellClass}>
              {formatRupees(cardTotalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
      </div>

      <small
        className={`cash-status ${matchesCashInHand ? "cash-status-success" : "cash-status-error"}`}
        role="status"
        aria-live="polite"
        >
        <i
          className={`fi ${matchesCashInHand ? "fi-rr-check" : "fi-rr-exclamation"} cash-status-icon`}
          aria-hidden="true"
        />
        {matchesCashInHand
          ? "Cash in possession matches total cash in hand"
          : `Cash in possession ${cashDifference > 0 ? "exceeds" : "is below"} total cash in hand by ${formatRupees(Math.abs(cashDifference))}`}
      </small>
    </div>
  );
}

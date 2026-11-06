import { CircleCheck } from 'lucide-react';
import {
  cardClass,
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
} from '../../globalStyles';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import {formatRupees,looseCoinsKey,coinRows, noteRows } from '../../lib/earningCalculations';

interface CashInPossessionCardProps {
  cashCountsInHand: Record<string, number>;
  looseCoinAmount?:number;
  denominationTotalAmount: number;
  totalCashInHand: number;
  miscDebitTotal:number;
  miscCreditTotal:number;
  imprestAndAdvanceIssuedTotal:number;
  cashCountsSource: 'saved' | 'carried' | 'none';

  onCountChange: (countKey: string, typedValue: string) => void;

}
interface CountRow { countKey: string; label: string; unitValue: number; isRupeeAmount: boolean }
const countRows: CountRow[] = [
  ...noteRows.map(row => ({ countKey: row.key, label: row.label, unitValue: Number(row.value), isRupeeAmount: false })),
  { countKey: looseCoinsKey, label: 'Loose coins (amount ₹)', unitValue: 1, isRupeeAmount: true },
  ...coinRows.map(row => ({ countKey: row.key, label: row.label, unitValue: Number(row.value), isRupeeAmount: false })),
];


export default function CashInPossessionCard({ 
                                        cashCountsInHand, 
                                        denominationTotalAmount, 
                                        totalCashInHand,
                                        cashCountsSource,
                                        miscCreditTotal,
                                        miscDebitTotal,
                                        imprestAndAdvanceIssuedTotal,
                                        onCountChange }: CashInPossessionCardProps) {
  const cardTotalAmount = denominationTotalAmount + imprestAndAdvanceIssuedTotal + miscCreditTotal - miscDebitTotal;
  const cashDifference = Math.round((cardTotalAmount - totalCashInHand) * 100) / 100;
  const matchesCashInHand = cashDifference === 0;
  return (
    <div className={`${cardClass} ${cashDifference === 0 ? '' : 'border-red-400 bg-errorCard'}`} onKeyDown={handleSheetKeyDown}>

         <div className="flex gap-4 w-full justify-between">
        <div className="max-w-xs">
          <h2 className={cardHeadingClass}>Cash in possession</h2>

          <p className="mb-2 text-xs text-mu">
            {cashCountsSource === "saved" && "Counts saved for this date."}
            {cashCountsSource === "carried" &&
              "Counts carried over from the last counted date. Update them if the cash in your drawer is different."}
            {cashCountsSource === "none" &&
              "No counts yet. Enter the notes and coins you hold."}
          </p>
        </div>
        <div className="flex w-30 justify-between items-center h-8 border-2 rounded-2xl border-slate-300 dark:border-slate-600 shadow-md bg-linear-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-800">
          <span className={`${cashDifference === 0 ? '' : 'text-red-500'} text-center font-medium w-1/2`}>
            {formatRupees(Number(cashDifference))}
          </span>
          <div className="flex justify-end transition-colors duration-150 ">
            <CircleCheck
              size={30}
              className={`${cashDifference === 0 ? "fill-green-500" : "fill-red-500 animate-ping inset-1.5 duration-200"}`}
              stroke="white"
              strokeWidth={1}
            />
          </div>
        </div>
      </div>


      <p className="mb-2 text-xs text-mu">
  {cashCountsSource === 'saved' && 'Counts saved for this date.'}
  {cashCountsSource === 'carried' && 'Counts carried over from the last counted date. Update them if the cash in your drawer is different.'}
  {cashCountsSource === 'none' && 'No counts yet. Enter the notes and coins you hold.'}
</p>
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
            <tr key={countRow.countKey} className={`${tableRowClass} ${cashDifference === 0 ? '' : 'even:bg-errorCard'}`}>
              <td className={tableCellLeftClass}>{countRow.label}</td>
              <td className={tableCellClass}>
                <input 
                    data-grid="cashCounts" 
                    data-row={rowIndex} 
                    data-column={0}
                    value={cashCountsInHand[countRow.countKey] || ''} 
                    placeholder="0" 
                    inputMode={countRow.isRupeeAmount ? 'decimal' : 'numeric'}
                    onFocus={event =>  event.target.select()}
                    onChange={event => onCountChange(countRow.countKey, event.target.value)}
                    className={`${tableInputClass} text-right`}
                  />
              </td>
              <td className={tableCellClass}>{formatRupees(Number(countRow.unitValue) * (cashCountsInHand[countRow.countKey] ?? 0))}</td>
            </tr>
          ))}

          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Imprest Issued</td>
            <td className={tableCellClass}>-</td>
            <td className={tableCellClass}>{formatRupees(imprestAndAdvanceIssuedTotal)}</td>

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
            <td className={`${tableTotalCellClass} !text-left`} colSpan={2}>Total</td>
            <td className={tableTotalCellClass}>{formatRupees(cardTotalAmount)}</td>
          </tr>
        </tfoot>
      </table>
     
      <small className={`cash-status ${matchesCashInHand ? 'cash-status-success' : 'cash-status-error'}`} role="status" aria-live="polite">
        <i className={`fi ${matchesCashInHand ? 'fi-rr-check' : 'fi-rr-exclamation'} cash-status-icon`} aria-hidden="true" />
        {matchesCashInHand
          ? 'Cash in possession matches total cash in hand'
          : `Cash in possession ${cashDifference > 0 ? 'exceeds' : 'is below'} total cash in hand by ${formatRupees(Math.abs(cashDifference))}`}
      </small>
    </div>
  );
}
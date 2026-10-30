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
import { allDenominationRows, formatRupees,looseCoinsKey, type DenominationRow } from '../../lib/earningCalculations';

interface CashInPossessionCardProps {
  cashCountsInHand: Record<string, number>;
  looseCoinAmount:number;
  denominationTotalAmount: number;
  totalCashInHand: number;
  imprestAndAdvanceIssuedTotal:number;
  cashCountsSource: 'saved' | 'carried' | 'none';

  onCountChange: (countKey: string, typedValue: string) => void;
}

export default function CashInPossessionCard({ 
                                        cashCountsInHand, 
                                        denominationTotalAmount, 
                                        totalCashInHand,
                                        looseCoinAmount, 
                                        cashCountsSource,
                                        imprestAndAdvanceIssuedTotal,
                                        onCountChange }: CashInPossessionCardProps) {
  const cardTotalAmount = denominationTotalAmount + imprestAndAdvanceIssuedTotal
  const cashDifference = Math.round((cardTotalAmount - totalCashInHand) * 100) / 100;
  const matchesCashInHand = cashDifference === 0;
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>

      <h2 className={cardHeadingClass}>Cash in possession</h2>

      <p className="mb-2 text-xs text-mu">
  {cashCountsSource === 'saved' && 'Counts saved for this date.'}
  {cashCountsSource === 'carried' && 'Counts carried over from the last counted date. Update them if the cash in your drawer is different.'}
  {cashCountsSource === 'none' && 'No counts yet. Enter the notes and coins you hold.'}
</p>
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>Note / coin</th>
            <th className={tableHeaderCellClass}>Count</th>
            <th className={tableHeaderCellClass}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {allDenominationRows.map((row:DenominationRow, rowIndex) => (
            <tr key={row.key} className={tableRowClass}>
              <td className={tableCellLeftClass}>{row.label}</td>
              <td className={tableCellClass}>
                <input data-grid="cashPossession" data-row={rowIndex} data-column={0}
                  value={cashCountsInHand[row.key] || ''} placeholder="0" inputMode="numeric"
                  onChange={event => onCountChange(row.key, event.target.value)}
                  className={`${tableInputClass} text-right`}
                  />
              </td>
              <td className={tableCellClass}>{formatRupees(Number(row.value) * (cashCountsInHand[row.key] ?? 0))}</td>
            </tr>
          ))}
          {/* loose coins typed as rupee amount */}
          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Loose Coins</td>
            <td className={tableCellClass}>
              <input 
                  value={looseCoinAmount || ''} 
                  placeholder='0' 
                  inputMode='decimal'
                  onChange={event => onCountChange(looseCoinsKey, event.target.value)}
                  className={`${tableInputClass} text-right`}
                  />
            </td>
            <td className={tableCellClass}>{formatRupees(looseCoinAmount)}</td>

          </tr>
           {/* loose coins typed as rupee amount */}
          <tr className={tableRowClass}>
            <td className={tableCellLeftClass}>Imprest Issued</td>
            <td className={tableCellClass}>-</td>
            <td className={tableCellClass}>{formatRupees(imprestAndAdvanceIssuedTotal)}</td>

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
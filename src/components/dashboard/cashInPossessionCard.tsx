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
import { allDenominationRows, formatRupees,looseCoinsKey, type DenominationRow } from '../../lib/earningCalculations';

interface CashInPossessionCardProps {
  cashCountsInHand: Record<string, number>;
  looseCoinAmount:number;
  denominationTotalAmount: number;
  totalCashInHand: number;
  imprestAndAdvanceIssuedTotal:number;

  onCountChange: (countKey: string, typedValue: string) => void;
}

export default function CashInPossessionCard({ 
                                        cashCountsInHand, 
                                        denominationTotalAmount, 
                                        totalCashInHand,
                                        looseCoinAmount, 
                                        imprestAndAdvanceIssuedTotal,
                                        onCountChange }: CashInPossessionCardProps) {
  const cardTotalAmount = denominationTotalAmount + imprestAndAdvanceIssuedTotal
  const matchesCashInHand = cardTotalAmount === totalCashInHand;
  return (
    <div className={cardClass}>

      <h2 className={cardHeadingClass}>Cash in possession</h2>
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>Note / coin</th>
            <th className={tableHeaderCellClass}>Count</th>
            <th className={tableHeaderCellClass}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {allDenominationRows.map((row:DenominationRow) => (
            <tr key={row.key} className={tableRowClass}>
              <td className={tableCellLeftClass}>{row.label}</td>
              <td className={tableCellClass}>
                <input value={cashCountsInHand[row.key] || ''} placeholder="0" inputMode="numeric"
                  onChange={event => onCountChange(row.key, event.target.value)}
                  className={`${tableInputClass} w-20 text-right`}
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
                  className={`${tableInputClass} w-20 text-right`}
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
     
      <small className={matchesCashInHand ? 'text-green-600 font-semibold py-4' : 'text-red-600 font-semibold py-4'}>
        {matchesCashInHand ? '✓ Matches total cash in hand' : `Differs from cash in hand by ${formatRupees(totalCashInHand-cardTotalAmount)}`}
      </small>
    </div>
  );
}
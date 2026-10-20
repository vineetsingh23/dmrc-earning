import { cardClass } from '../../globalStyles';
import { allDenominationRows, formatRupees,looseCoinsKey, type DenominationRow } from '../../lib/earningCalculations';

interface CashInPossessionCardProps {
  cashCountsInHand: Record<string, number>;
  looseCoinAmount:number;
  denominationTotalAmount: number;
  totalCashInHand: number;
  onCountChange: (countKey: string, typedValue: string) => void;
}

export default function CashInPossessionCard({ 
                                        cashCountsInHand, 
                                        denominationTotalAmount, 
                                        totalCashInHand,
                                        looseCoinAmount, 
                                        onCountChange }: CashInPossessionCardProps) {
  const matchesCashInHand = denominationTotalAmount === totalCashInHand;
  const cellClass = 'border border-slate-200 px-2 py-1 text-right text-sm';
  const countInputClass ='w-20 rounded border border-slate-300 px-1.5 py-0.5 text-right outline-none focus:ring-2 focus:ring-blue-400';
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm max-w-sm">
      <div className={cardClass}>

      <h2 className="mb-2 font-semibold">Cash in possession</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100 text-xs"><th className="px-2 py-1">Note / coin</th><th className="px-2 py-1">Count</th><th className="px-2 py-1">Amount</th></tr>
        </thead>
        <tbody>
          {allDenominationRows.map((row:DenominationRow) => (
            <tr key={row.key} className="even:bg-slate-100">
              <td className={`${cellClass} !text-left`}>{row.label}</td>
              <td className={cellClass}>
                <input value={cashCountsInHand[row.key] || ''} placeholder="0" inputMode="numeric"
                  onChange={event => onCountChange(row.key, event.target.value)}
                  className={countInputClass} 
                  />
              </td>
              <td className={cellClass}>{formatRupees(row.value * (cashCountsInHand[row.key] ?? 0))}</td>
            </tr>
          ))}
          {/* loose coins typed as rupee amount */}
          <tr className='even:bg-slate-100'>
            <td className={`${cellClass} !text-left`}>Loose Coins (amount )</td>
            <td className={cellClass}>
              <input 
                  value={looseCoinAmount || ''} 
                  placeholder='0' 
                  inputMode='decimal'
                  onChange={event => onCountChange(looseCoinsKey, event.target.value)}
                  className={countInputClass}
                  />
            </td>
            <td className={cellClass}>{formatRupees(looseCoinAmount)}</td>

          </tr>
        </tbody>
        <tfoot>
          <tr className="bg-blue-100 font-bold">
            <td className={`${cellClass} !text-left`} colSpan={2}>Total</td>
            <td className={cellClass}>{formatRupees(denominationTotalAmount)}</td>
          </tr>
        </tfoot>
      </table>
     
     </div>
      <small className={matchesCashInHand ? 'text-green-600 font-semibold py-4' : 'text-red-600 font-semibold py-4'}>
        {matchesCashInHand ? '✓ Matches total cash in hand' : `Differs from cash in hand by ${formatRupees(denominationTotalAmount - totalCashInHand)}`}
      </small>
     
    </div>
  );
}
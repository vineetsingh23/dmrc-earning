import type { BankTransfer } from '../../lib/registerTypes';
import type { useBankNoteDraft } from '../../hooks/useBankNoteDraft';
import { bankNoteValues } from '../../lib/businessRules';
import { formatRupees } from '../../lib/earningCalculations';
import {
  cardClass,
  cardHeadingClass,
  secondaryButtonClass,
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

export interface CashToBankCardProps { existingTransfer: BankTransfer | undefined; amountDueToBank: number; noteDraft: ReturnType<typeof useBankNoteDraft> }

export default function CashToBankCard({ existingTransfer, amountDueToBank, noteDraft }: CashToBankCardProps) {
  const { noteCountsToSend, noteTotalToSend, notesExceedingStock, inputValueFor, changeNoteCount, resetToSuggestedCounts } = noteDraft;
  const matchesAmountDue = noteTotalToSend === amountDueToBank && notesExceedingStock.length === 0;
  return (
    // <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className={cardClass}>
        <div className='flex justify-between items-center'>

        <h2 className={cardHeadingClass}>Cash to bank</h2>
        {!existingTransfer && (
          <button className={`${secondaryButtonClass} my-1 max-w-40 text-sm`} onClick={resetToSuggestedCounts}>Auto calculate</button>
        )}
        </div>
    
      <table className={tableClass}>
        <thead><tr className={tableHeaderRowClass}>
          <th className={tableHeaderCellClass}>Note</th>
          <th className={tableHeaderCellClass}>Count</th>
          <th className={tableHeaderCellClass}>Amount</th>
        </tr></thead>
        <tbody>
          {bankNoteValues.map(noteValue => (
            <tr key={noteValue} className={tableRowClass}>
              <td className={tableCellLeftClass}>₹{noteValue} note</td>
              <td className={tableCellClass}>
                {existingTransfer
                  ? noteCountsToSend[noteValue] ?? 0
                  : <input value={inputValueFor(noteValue)} inputMode="numeric" onChange={event => changeNoteCount(noteValue, event.target.value)}
                      className={`${tableInputClass} w-20 text-right`} />}
              </td>
              <td className={tableCellClass}>{formatRupees(noteValue * (noteCountsToSend[noteValue] ?? 0))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableTotalCellClass} !text-left`} colSpan={2}>Total {existingTransfer ? 'sent' : 'entered'}</td>
            <td className={tableTotalCellClass}>{formatRupees(existingTransfer ? existingTransfer.amount : noteTotalToSend)}</td>
          </tr>
        </tfoot>
      </table>
      
      {existingTransfer ? (
        <small className='text-green-600 font-semibold my-2'>✓ Sent · slip {existingTransfer.slipNumber}</small>
      ) : (
        <small className={matchesAmountDue ? 'text-green-600 font-semibold my-2' : 'text-red-600 font-semibold my-2'}>
          {notesExceedingStock.length
            ? `Count is more than cash in hand for ₹${notesExceedingStock.join(', ₹')}`
            : noteTotalToSend === amountDueToBank
              ? `✓ Matches amount due ${formatRupees(amountDueToBank)}`
              : `Enter notes totalling ${formatRupees(amountDueToBank)} (entered ${formatRupees(noteTotalToSend)})`}
        </small>
      )}
      </div>
   
  );
}
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
  tableWrapperClass,
} from '../../globalStyles';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { CheckCheck, CircleCheckIcon, CircleLetterX} from 'lucide-react';

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
          <button className={`${secondaryButtonClass} my-2 max-w-40 text-sm`} onClick={resetToSuggestedCounts}>Auto calculate</button>
        )}
        </div>
        <div className={tableWrapperClass}>

    
      <table className={tableClass} onKeyDown={handleSheetKeyDown}>
        <thead><tr className={tableHeaderRowClass}>
          <th className={tableHeaderCellClass}>Note</th>
          <th className={tableHeaderCellClass}>Count</th>
          <th className={tableHeaderCellClass}>Amount</th>
        </tr></thead>
        <tbody>
          {bankNoteValues.map((noteValue,rowIndex) => (
            <tr key={noteValue} className={tableRowClass}>
              <td className={tableCellLeftClass}>₹{noteValue} note</td>
              <td className={tableCellClass}>
                {existingTransfer
                  ? noteCountsToSend[noteValue] ?? 0
                  : <input data-grid="cashToBank" data-row={rowIndex} data-column={0} 
                  value={inputValueFor(noteValue)} inputMode="numeric" onChange={event => changeNoteCount(noteValue, event.target.value)}
                  className={`${tableInputClass} text-right max-w-10`} />}
              </td>
              <td className={tableCellClass}>{formatRupees(noteValue * (noteCountsToSend[noteValue] ?? 0))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableCellLeftClass} font-bold!`} colSpan={2}>Total {existingTransfer ? 'Sent' : 'Entered'}</td>
            <td className={tableTotalCellClass}>{formatRupees(existingTransfer ? existingTransfer.amount : noteTotalToSend)}</td>
          </tr>
        </tfoot>
      </table>
      </div>
      
      {existingTransfer ? (
        <small className='cash-status-success' role="status" aria-live="polite">
          <span className="bank-success-icon" aria-hidden="true"><CheckCheck /></span>
          Successfully sent to bank · Slip No. - {existingTransfer.slipNumber}
        </small>
      ) : (
        <small className={`cash-status ${matchesAmountDue ? 'cash-status-success' : 'cash-status-error'}`} role="status" aria-live="polite">
       {matchesAmountDue ? (
    <CircleCheckIcon className='size-8'/>
  ) : (
    <CircleLetterX className='size-7 stroke-2'/>
  )}
        {notesExceedingStock.length
          ? `Count exceeds cash in hand for ₹${notesExceedingStock.join(', ₹')}`
          :matchesAmountDue
            ? `Cash count matches amount due: ${formatRupees(amountDueToBank)}`
            :noteTotalToSend < amountDueToBank
            ? `Total Due ${formatRupees(amountDueToBank)} (Entered ${formatRupees(noteTotalToSend)}) Short ${formatRupees(amountDueToBank - noteTotalToSend)}`
            : `Total Due ${formatRupees(amountDueToBank)} (Entered ${formatRupees(noteTotalToSend)}) Excess ${formatRupees(noteTotalToSend-amountDueToBank)}`}
      </small>
      )}
      </div>
   
  );
}
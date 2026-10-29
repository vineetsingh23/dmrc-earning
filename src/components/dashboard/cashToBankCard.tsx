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
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';

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
        <small className='cash-status cash-status-success' role="status" aria-live="polite">
          <span className="bank-success-icon" aria-hidden="true"><i className="fi fi-rr-check" /></span>
          Successfully sent to bank · Slip {existingTransfer.slipNumber}
        </small>
      ) : (
      <small className={`cash-status ${matchesAmountDue ? 'cash-status-success' : 'cash-status-error'}`} role="status" aria-live="polite">
        <i className={`fi ${matchesAmountDue ? 'fi-rr-check' : 'fi-rr-exclamation'} cash-status-icon`} aria-hidden="true" />
        {notesExceedingStock.length
          ? `Count exceeds cash in hand for ₹${notesExceedingStock.join(', ₹')}`
          : matchesAmountDue
            ? `Cash count matches amount due: ${formatRupees(amountDueToBank)}`
            : `Enter notes totaling ${formatRupees(amountDueToBank)} (currently ${formatRupees(noteTotalToSend)})`}
      </small>
      )}
      </div>
   
  );
}
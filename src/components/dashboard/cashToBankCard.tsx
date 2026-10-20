import type { BankTransfer } from '../../lib/registerTypes';
import type { useBankNoteDraft } from '../../hooks/useBankNoteDraft';
import { bankNoteValues } from '../../lib/businessRules';
import { formatRupees } from '../../lib/earningCalculations';

export interface CashToBankCardProps { existingTransfer: BankTransfer | undefined; amountDueToBank: number; noteDraft: ReturnType<typeof useBankNoteDraft> }

export default function CashToBankCard({ existingTransfer, amountDueToBank, noteDraft }: CashToBankCardProps) {
  const { noteCountsToSend, noteTotalToSend, notesExceedingStock, inputValueFor, changeNoteCount, resetToSuggestedCounts } = noteDraft;
  const matchesAmountDue = noteTotalToSend === amountDueToBank && notesExceedingStock.length === 0;
  const cellClass = 'border border-slate-200 px-2 py-1 text-right text-sm';
  return (
    // <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
      <div className="mb-2 flex justify-between flex-col mt-2">
        <h2 className="font-semibold">Cash to bank</h2>
        {!existingTransfer && (
          <button className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600" onClick={resetToSuggestedCounts}>Auto calculate</button>
        )}
    
      <table className="w-full border-collapse">
        <thead><tr className="bg-blue-100 text-xs"><th className="px-2 py-1">Note</th><th className="px-2 py-1">Count</th><th className="px-2 py-1">Amount</th></tr></thead>
        <tbody>
          {bankNoteValues.map(noteValue => (
            <tr key={noteValue} className="even:bg-slate-100">
              <td className={`${cellClass} !text-left`}>₹{noteValue} note</td>
              <td className={cellClass}>
                {existingTransfer
                  ? noteCountsToSend[noteValue] ?? 0
                  : <input value={inputValueFor(noteValue)} inputMode="numeric" onChange={event => changeNoteCount(noteValue, event.target.value)}
                      className="w-20 rounded border border-slate-300 px-1.5 py-0.5 text-right outline-none focus:ring-2 focus:ring-blue-400" />}
              </td>
              <td className={cellClass}>{formatRupees(noteValue * (noteCountsToSend[noteValue] ?? 0))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-100 font-bold">
            <td className={`${cellClass} !text-left`} colSpan={2}>Total {existingTransfer ? 'sent' : 'entered'}</td>
            <td className={cellClass}>{formatRupees(existingTransfer ? existingTransfer.amount : noteTotalToSend)}</td>
          </tr>
        </tfoot>
      </table>
      {existingTransfer ? (
        <small className="text-green-600">✓ Sent · slip {existingTransfer.slipNumber}</small>
      ) : (
        <small className={matchesAmountDue ? 'text-green-600' : 'text-red-600'}>
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
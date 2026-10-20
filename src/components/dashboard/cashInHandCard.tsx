import type { BankTransfer } from '../../lib/registerTypes';
import { formatRupees } from '../../lib/earningCalculations';
import CashToBankCard from './cashToBankCard';
import { useBankNoteDraft } from '../../hooks/useBankNoteDraft';



interface CashInHandCardProps {
  totalCashInHand: number; previousDaysCash: number; currentDayEarning: number;
  imprestAndAdvanceIssuedTotal: number; advanceReceivedTotal: number; amountDueToBank: number;
  existingTransfer: BankTransfer | undefined; canSendToBank: boolean; onSendToBankClick: () => void;
  noteDraft: ReturnType<typeof useBankNoteDraft>
 
}

export default function CashInHandCard({
  totalCashInHand, previousDaysCash, currentDayEarning, imprestAndAdvanceIssuedTotal, advanceReceivedTotal,
  amountDueToBank, existingTransfer, canSendToBank, onSendToBankClick, noteDraft,
}: CashInHandCardProps) {
  const rowClass = 'flex justify-between border-b border-dashed border-slate-300 py-1';
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition duration-300 hover:shadow-xl max-w-sm">
      <div className='border border-slate-200 rounded-2xl p-2 shadow-md'>

      <small className="block text-slate-500">Total cash in hand (unsent previous days + current day + TOM amounts)</small>
      <div className="text-[26px] font-bold text-blue-600">{formatRupees(totalCashInHand)}</div>
      <div className={rowClass}><span>Previous days cash not yet sent</span><b>{formatRupees(previousDaysCash)}</b></div>
      <div className={rowClass}><span>Current day earning</span><b>{formatRupees(currentDayEarning)}</b></div>
      <div className={rowClass}><span>Imprest and advance issued to TOMs</span><b>{formatRupees(imprestAndAdvanceIssuedTotal)}</b></div>
      <div className={rowClass}><span>Advance received from TOMs</span><b>{formatRupees(advanceReceivedTotal)}</b></div>
      <div className={rowClass}><span>Sent to bank{existingTransfer ? ` · slip ${existingTransfer.slipNumber}` : ''}</span><b>{formatRupees(existingTransfer ? existingTransfer.amount : 0)}</b></div>
      <div className={rowClass}><span>Due to bank (rounded down to ₹100)</span><b>{formatRupees(amountDueToBank)}</b></div>

      </div>
      <div className="py-2">
        <button disabled={!canSendToBank} onClick={onSendToBankClick}
          className="rounded-xl bg-blue-600 px-3.5 py-1.5 font-medium text-white transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50">
          🏦 Send {formatRupees(amountDueToBank)} to bank
        </button>
      </div>
      <CashToBankCard existingTransfer={existingTransfer} noteDraft={noteDraft} amountDueToBank={amountDueToBank}/> 
    </div>
  );
}
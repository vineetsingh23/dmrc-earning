import type { BankTransfer } from '../../lib/registerTypes';
import { formatRupees } from '../../lib/earningCalculations';
import CashToBankCard from './cashToBankCard';
import { useBankNoteDraft } from '../../hooks/useBankNoteDraft';
import { cardClass, primaryButtonClass, summaryRowClass } from '../../globalStyles';
import { cashInHandOfDate, cashFromPreviousDays } from '../../lib/earningCalculations';



interface CashInHandCardProps {
  totalCashInHand: ReturnType<typeof cashInHandOfDate>; 
  previousDaysCash: ReturnType<typeof cashFromPreviousDays>; 
  currentDayEarning: number;
  advanceReceivedTotal: number; 
  amountDueToBank: number;
  existingTransfer: BankTransfer | undefined; 
  canSendToBank: boolean; onSendToBankClick: () => void;
  noteDraft: ReturnType<typeof useBankNoteDraft>
  
 
}

export default function CashInHandCard({
  totalCashInHand, previousDaysCash, currentDayEarning,advanceReceivedTotal,
  amountDueToBank, existingTransfer, canSendToBank, onSendToBankClick, noteDraft
}: CashInHandCardProps) {

  
  return (
    <div className={cardClass}>

      <small className="block text-slate-500">Total cash in hand (unsent previous days + current day + TOM amounts)</small>
      <div className="text-[26px] font-bold text-blue-600">{formatRupees(totalCashInHand)}</div>
      <div className='px-1 py-2'>

      <div className={summaryRowClass}><span>Previous days cash not yet sent</span><b>{formatRupees(previousDaysCash)}</b></div>
      <div className={summaryRowClass}><span>Current day earning</span><b>{formatRupees(currentDayEarning)}</b></div>
      <div className={summaryRowClass}><span>Advance received from TOMs</span><b>{formatRupees(advanceReceivedTotal)}</b></div>
      </div>
      <hr className='border-2 border-blue-300 my-2'/>
      <div className='py-2'>

      <div className={summaryRowClass}><span>Sent to bank{existingTransfer ? ` · slip ${existingTransfer.slipNumber}` : ''}</span><b>{formatRupees(existingTransfer ? existingTransfer.amount : 0)}</b></div>
      <div className={summaryRowClass}><span>Due to bank (rounded down to ₹100)</span><b>{formatRupees(amountDueToBank)}</b></div>
      </div>

      <div className="py-2">
        <button disabled={!canSendToBank} onClick={onSendToBankClick}
          className={primaryButtonClass}>
          🏦 Send {formatRupees(amountDueToBank)} to bank
        </button>
      </div>
      <CashToBankCard existingTransfer={existingTransfer} noteDraft={noteDraft} amountDueToBank={amountDueToBank}/> 
    </div>
  );
}
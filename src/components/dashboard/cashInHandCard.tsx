import type { BankTransfer } from '../../lib/registerTypes';
import { formatRupees } from '../../lib/earningCalculations';
import CashToBankCard from './cashToBankCard';
import { useBankNoteDraft } from '../../hooks/useBankNoteDraft';
import { cardClass, primaryButtonClass, summaryRowClass } from '../../globalStyles';
import { cashInHandOfDate, cashFromPreviousDays } from '../../lib/earningCalculations';
import { CircleCheck, Landmark } from 'lucide-react';



interface CashInHandCardProps {
  totalCashInHand: ReturnType<typeof cashInHandOfDate>; 
  previousDaysCash: ReturnType<typeof cashFromPreviousDays>; 
  osTotalPaidAmount:number
  currentDayEarning: number;
  advanceReceivedTotal: number; 
  amountDueToBank: number;
  existingTransfer: BankTransfer | undefined; 
  canSendToBank: boolean; onSendToBankClick: () => void;
  noteDraft: ReturnType<typeof useBankNoteDraft>
  
 
}

export default function CashInHandCard({
  totalCashInHand, previousDaysCash, currentDayEarning,advanceReceivedTotal,
  amountDueToBank, existingTransfer, canSendToBank, onSendToBankClick, noteDraft,osTotalPaidAmount
}: CashInHandCardProps) {

  
  return (
    <div className={cardClass}>

      <small className="block text-tx">Total cash in hand (unsent previous days + current day + TOM amounts)</small>
      <div className="text-[26px] font-bold tracking-tight text-ac">{formatRupees(totalCashInHand)}</div>
      <div className='px-1 py-2'>

      <div className={summaryRowClass}><span>Previous days cash not yet sent</span><b>{formatRupees(previousDaysCash)}</b></div>
      <div className={summaryRowClass}><span>Current day earning</span><b>{formatRupees(currentDayEarning)}</b></div>
      <div className={summaryRowClass}><span>Advance received from TOMs</span><b>{formatRupees(advanceReceivedTotal)}</b></div>
      <div className={summaryRowClass}><span>AFC+Misc Paid Amount</span><b>{formatRupees(osTotalPaidAmount)}</b></div>

      </div>
      <hr className='my-2 border-tx'/>
      <div className='py-2'>

      <div className={summaryRowClass}><span>Sent to bank{existingTransfer ?( <>{`. Slip No.  ${existingTransfer.slipNumber} ` }<CircleCheck size={20} className='inline-block ml-2 text-green-500 align-top'/></>): ''}</span><b>{formatRupees(existingTransfer ? existingTransfer.amount : 0)}</b></div>
      <div className={summaryRowClass}><span>Due to bank (rounded down to ₹100)</span><b>{formatRupees(amountDueToBank)}</b></div>
      </div>

      <div className="py-2 font-bold tracking-wide">
        <button disabled={!canSendToBank} onClick={onSendToBankClick}
          className={primaryButtonClass}>
            <span><Landmark/></span> <span>

          Send {formatRupees(amountDueToBank)} to bank
            </span>
        </button>
      </div>
      <CashToBankCard existingTransfer={existingTransfer} noteDraft={noteDraft} amountDueToBank={amountDueToBank}/> 
    </div>
  );
}
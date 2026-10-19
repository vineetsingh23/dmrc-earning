import type { BankTransfer } from '../../lib/registerTypes';
import { formatRupees } from '../../lib/earningCalculations';

interface CashInHandCardProps {
  totalCashInHand: number; previousDayEarning: number; currentDayEarning: number; amountDueToBank: number;
  existingTransfer: BankTransfer | undefined; canSendToBank: boolean; onSendToBankClick: () => void;
}

export default function CashInHandCard({ totalCashInHand, previousDayEarning, currentDayEarning, amountDueToBank, existingTransfer, canSendToBank, onSendToBankClick }: CashInHandCardProps) {
  const rowClass = 'flex justify-between border-b border-dashed border-slate-300 py-1';
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <small className="block text-slate-500">Total cash in hand (previous day + current day)</small>
      <div className="text-[26px] font-bold text-blue-600">{formatRupees(totalCashInHand)}</div>
      <div className={rowClass}><span>Previous day earning</span><b>{formatRupees(previousDayEarning)}</b></div>
      <div className={rowClass}><span>Current day earning</span><b>{formatRupees(currentDayEarning)}</b></div>
      <div className={rowClass}><span>Sent to bank{existingTransfer ? ` · slip ${existingTransfer.slipNumber}` : ''}</span><b>{formatRupees(existingTransfer ? existingTransfer.amount : 0)}</b></div>
      <div className={rowClass}><span>Due to bank (rounded down to ₹100)</span><b>{formatRupees(amountDueToBank)}</b></div>
      <div className="py-2">
        <button disabled={!canSendToBank} onClick={onSendToBankClick}
          className="rounded-xl bg-blue-600 px-3.5 py-1.5 font-medium text-white transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50">
          🏦 Send {formatRupees(amountDueToBank)} to bank
        </button>
      </div>
    </div>
  );
}
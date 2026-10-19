import { formatRupees } from '../../lib/earningCalculations';

interface CashInHandCardProps { totalCashInHand: number; previousDayEarning: number; currentDayEarning: number }

export default function CashInHandCard({ totalCashInHand, previousDayEarning, currentDayEarning }: CashInHandCardProps) {
  const rowClass = 'flex justify-between border-b border-dashed border-slate-300 py-1';
  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <small className="block text-slate-500">Total cash in hand (previous day + current day)</small>
      <div className="text-[26px] font-bold text-blue-600">{formatRupees(totalCashInHand)}</div>
      <div className={rowClass}><span>Previous day earning</span><b>{formatRupees(previousDayEarning)}</b></div>
      <div className={rowClass}><span>Current day earning</span><b>{formatRupees(currentDayEarning)}</b></div>
    </div>
  );
}
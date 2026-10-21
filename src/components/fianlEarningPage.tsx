import { useMemo } from 'react';
import EarningSheetTable, { type SheetStyle } from './earningSheetTable';
import type { RegisterState } from '../lib/registerTypes';
import { finalEarningColumns } from '../lib/earningColumns';
import { sumRowsByField } from '../lib/earningCalculations';

interface FinalEarningPageProps { registerState: RegisterState; date: string }

// roomier cells, centred text, a strong colour for each header group
const finalEarningSheetStyle: SheetStyle = {
  headerCellClass: 'border border-white px-4 py-3 text-center text-sm font-bold text-white',
  headerColorClasses: ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-teal-600'],
  bodyCellClass: 'border border-slate-700 bg-slate-800 px-4 py-6 text-center text-sm font-bold text-white',
  footerCellClass: '',
};

// one row of totals: Shift Entry and TVM Earning of the selected date, side by side under shared headers
export default function FinalEarningPage({ registerState, date }: FinalEarningPageProps) {
  const finalRow = useMemo(() => ({
    finalRowLabel: 'Total',
    ...sumRowsByField(Object.values(registerState.shiftEntries[date] ?? {})),
    ...sumRowsByField(Object.values(registerState.tvmEntries?.[date] ?? {})),
  }), [registerState, date]);

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-blue-600">Final Earning</h2>
      <EarningSheetTable columns={finalEarningColumns} rowCount={1} readRow={() => finalRow}
        showTotalRow={false} sheetStyle={finalEarningSheetStyle} />
      <p className="text-sm text-slate-500">Read-only. Totals of Shift Entry and TVM Earning for the selected date.</p>
    </div>
  );
}
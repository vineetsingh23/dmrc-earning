import { useMemo } from 'react';
import EarningSheetTable, { type SheetStyle } from './earningSheetTable';
import type { RegisterState } from '../../lib/registerTypes';
import { finalEarningColumns } from '../../lib/finalEarningColumns';
import { sumRowsByField } from '../../lib/earningCalculations';
import {
  pageHeadingClass,
  tableCellClass,
  tableHeaderCellClass,
  tableHeaderGroupClasses,
} from '../../globalStyles';

interface FinalEarningPageProps { registerState: RegisterState; date: string }

// roomier cells, centred text, a strong colour for each header group
const finalEarningSheetStyle: SheetStyle = {
  headerCellClass: `${tableHeaderCellClass} px-4 py-3 text-sm font-bold`,
  headerColorClasses: tableHeaderGroupClasses,
  bodyCellClass: `${tableCellClass} bg-slate-50 px-4 py-6 text-center font-bold dark:bg-slate-800`,
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
      <h2 className={pageHeadingClass}>Final Earning</h2>
      <EarningSheetTable columns={finalEarningColumns} rowCount={1} readRow={() => finalRow}
        showTotalRow={false} sheetStyle={finalEarningSheetStyle} />
      <p className="text-sm text-slate-500">Read-only. Totals of Shift Entry and TVM Earning for the selected date.</p>
    </div>
  );
}
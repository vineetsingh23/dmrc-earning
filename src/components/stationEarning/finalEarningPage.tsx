import { useMemo } from 'react';
import EarningSheetTable, { type SheetStyle } from './earningSheetTable';
import type { RegisterState } from '../../lib/registerTypes';
import { finalEarningColumns } from '../../lib/finalEarningColumns';
import { sumRowsByField } from '../../lib/earningCalculations';
import {
  tableCellClass,
  tableHeaderCellClass,
} from '../../globalStyles';
import { useDashboardFigures } from '../../hooks/useDashboardFigures';

interface FinalEarningPageProps { registerState: RegisterState; date: string }

// Roomier cells and centered text while preserving the shared table palette.
const finalEarningSheetStyle: SheetStyle = {
  headerCellClass: `${tableHeaderCellClass} px-4 py-3 text-sm font-bold`,
  headerColorClasses: [''],
  bodyCellClass: `${tableCellClass} px-4 py-6 text-center font-bold`,
  footerCellClass: '',
};

// one row of totals: Shift Entry and TVM Earning of the selected date, side by side under shared headers
export default function FinalEarningPage({ registerState, date }: FinalEarningPageProps) {
    // inside the component
const figures = useDashboardFigures(registerState, date);
const sentToBankToday = figures.existingTransfer?.amount ?? 0;
  const finalRow = useMemo(() => ({
    finalRowLabel: 'Total',
    ...sumRowsByField(Object.values(registerState.shiftEntries[date] ?? {})),
    ...sumRowsByField(Object.values(registerState.tvmEntries?.[date] ?? {})),
      previousDayCashOnHand: String(figures.previousDaysCash + sentToBankToday),
  totalCashToBank: String(sentToBankToday),
  bankSlipNumber: figures.existingTransfer?.slipNumber ?? '',
  todayCashOnHand: String(figures.totalCashInHand), 
  }), [registerState, date,figures, sentToBankToday]);



  return (
    <div className="space-y-3">
      <header className="page-intro">
        <p className="page-eyebrow">Revenue summary</p>
        <h1 className="page-title">Final earning</h1>
        <p className="page-description">Read-only totals from shift and TVM earnings for the selected date.</p>
      </header>
      <EarningSheetTable columns={finalEarningColumns} gridName="final" frozenColumnCount={0} rowCount={1} readRow={() => finalRow}
        showTotalRow={false} sheetStyle={finalEarningSheetStyle} />
      <p className="text-sm text-mu">Read-only totals for the selected date.</p>
    </div>
  );
}
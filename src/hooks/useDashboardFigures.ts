import { useMemo } from 'react';
import { addDays, allDenominationRows, breakIntoDenominations, cashInHandOfDate, totalEarningOfDate } from '../lib/earningCalculations';
import type { RegisterState } from '../lib/registerTypes';

export function useDashboardFigures(registerState: RegisterState, date: string) {
  return useMemo(() => {
    const totalCashInHand = cashInHandOfDate(registerState, date);
    const cashCountsInHand = registerState.cashCounts[date] ?? breakIntoDenominations(Math.max(0, totalCashInHand));
    const denominationTotalAmount = allDenominationRows.reduce((total, row) => total + row.value * (cashCountsInHand[row.key] ?? 0), 0);
    return {
      currentDayEarning: totalEarningOfDate(registerState, date),
      previousDayEarning: totalEarningOfDate(registerState, addDays(date, -1)),
      totalCashInHand, cashCountsInHand, denominationTotalAmount,
    };
  }, [registerState, date]);
}
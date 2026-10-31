import { useMemo } from 'react';
import type { RegisterState } from '../lib/registerTypes';
import { bankRoundingAmount } from '../lib/businessRules';
import { miscTotalTillDate } from '../lib/miscEntries';
import {
  advanceReceivedTotalForDate, allDenominationRows, breakIntoDenominations, cashFromPreviousDays,
  cashWithTomOperatorsForDate, imprestIssuedTotalForDate, latestEarlierCashCounts, looseCoinsKey, totalEarningOfDate, totalOutStandingAmount, type DenominationRow,
} from '../lib/earningCalculations';

// every number shown on the dashboard for one date
export function useDashboardFigures(registerState: RegisterState, date: string) {
  return useMemo(() => {
    const existingTransfer = registerState.bankTransfers?.[date];
    const currentDayEarning = totalEarningOfDate(registerState, date);
    const advanceReceivedTotal = advanceReceivedTotalForDate(registerState,date);
    // earlier days' cash minus what was sent to the bank today: only the remaining amount is shown
    const previousDaysCash = cashFromPreviousDays(registerState, date) - (existingTransfer ? existingTransfer.amount : 0);
    const totalCashInHand = previousDaysCash + Math.round(currentDayEarning) + advanceReceivedTotal;

    const cashWithTomOperators = cashWithTomOperatorsForDate(registerState, date);
    const expectedCashInPossession = totalCashInHand - cashWithTomOperators;
    const amountDueToBank = Math.floor(Math.max(0, previousDaysCash) / bankRoundingAmount) * bankRoundingAmount;

    const osTotalPaidAmount = totalOutStandingAmount(registerState,date)

    // Counts are never calculated: they only change when the user types them.
    //  1. counts saved for this date (typed, or left by a bank transfer)
    //  2. otherwise the counts of the latest earlier date that has counts: cash not sent to the bank stays in possession
    //  3. otherwise zero
    const savedCounts = registerState.cashCounts?.[date];
    const carriedCounts = savedCounts ? undefined : latestEarlierCashCounts(registerState, date);
    const cashCountsInHand: Record<string, number> = savedCounts ?? carriedCounts ?? breakIntoDenominations(0);
    const cashCountsSource: 'saved' | 'carried' | 'none' = savedCounts ? 'saved' : carriedCounts ? 'carried' : 'none';

    const looseCoinsAmount = cashCountsInHand[looseCoinsKey] ?? 0;
    const denominationTotalAmount =
      allDenominationRows.reduce((total: number, row: DenominationRow) => total + Number(row.value) * (cashCountsInHand[row.key] ?? 0), 0) + looseCoinsAmount;

    return {
      currentDayEarning,
      imprestAndAdvanceIssuedTotal: imprestIssuedTotalForDate(registerState, date),
      advanceReceivedTotal,
      previousDaysCash, existingTransfer, totalCashInHand, cashWithTomOperators, expectedCashInPossession,
      amountDueToBank, cashCountsInHand, cashCountsSource, looseCoinsAmount, denominationTotalAmount,osTotalPaidAmount,
      miscDebitTotal: miscTotalTillDate(registerState, date, 'miscDebit'),
      miscCreditTotal: miscTotalTillDate(registerState, date, 'miscCredit'),
    };
  }, [registerState, date]);
}
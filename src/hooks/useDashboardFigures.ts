import { useMemo } from "react";
import type { RegisterState } from "../lib/registerTypes";
import { bankRoundingAmount } from "../lib/businessRules";
import { allDenominationRows,
        breakIntoDenominations,
        cashFromPreviousDays,
        cashInHandOfDate,
        totalEarningOfDate
 } from "../lib/earningCalculations";

 // every number shown on the dashboard for one date

 export function useDashboardFigures(registerState: RegisterState, date: string) {
    return useMemo(() => {
        const existingTransfer = registerState.bankTransfers?.[date];
        const previousDaysCash = cashFromPreviousDays(registerState,date);
        const cashBeforeBankTransfer = cashInHandOfDate(registerState,date);
        const totalCashInHand = cashBeforeBankTransfer - ( existingTransfer ? existingTransfer.amount : 0);
        
            // only cash of earlier days can be sent, rounded down to 100
        const amountDueToBank =Math.floor(Math.max(0,previousDaysCash) / bankRoundingAmount) * bankRoundingAmount;
        const cashCountsInHand = registerState.cashCounts?.[date] ?? breakIntoDenominations(Math.max(0,totalCashInHand));
        const denominationTotalAmount = allDenominationRows.reduce((total, row) => total +row.value * (cashCountsInHand[row.key] ?? 0), 0);
        return {
            currentDayEarning: totalEarningOfDate(registerState,date),
            previousDaysCash,
            existingTransfer,
            totalCashInHand,amountDueToBank,
            cashCountsInHand,
            denominationTotalAmount,
        };
    },[registerState, date])
 }
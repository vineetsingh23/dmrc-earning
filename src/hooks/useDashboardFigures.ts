import { useMemo } from "react";
import type { RegisterState } from "../lib/registerTypes";
import { bankRoundingAmount } from "../lib/businessRules";
import { allDenominationRows,
        advanceReceivedTotalForDate,
        cashWithTomOperatorsForDate,
        imprestIssuedTotalForDate,
        breakIntoDenominations,
        cashFromPreviousDays,
        cashInHandOfDate,
        totalEarningOfDate,
        looseCoinsKey,
        type DenominationRow,
 } from "../lib/earningCalculations";

 // every number shown on the dashboard for one date

 export function useDashboardFigures(registerState: RegisterState, date: string) {
    return useMemo(() => {
        const existingTransfer = registerState.bankTransfers?.[date];
        const previousDaysCash = cashFromPreviousDays(registerState,date)-(existingTransfer ? existingTransfer.amount : 0);
        const currentDayEarning = totalEarningOfDate(registerState,date) ;
        const totalEarning = cashFromPreviousDays(registerState,date) + totalEarningOfDate(registerState,date)
        // const cashBeforeBankTransfer = cashInHandOfDate(registerState,date);
        const cashWithTomOperators = cashWithTomOperatorsForDate(registerState,date);
        const advanceReceivedFromTomOperators = advanceReceivedTotalForDate(registerState,date)
        const totalCashInHand = previousDaysCash +Math.round(currentDayEarning) + advanceReceivedFromTomOperators

        const amountDueToBank =Math.floor(Math.max(0,previousDaysCash) / bankRoundingAmount) * bankRoundingAmount;
        const cashCountsInHand:Record<string, number> = registerState.cashCounts?.[date] ?? breakIntoDenominations(Math.max(0,totalCashInHand));
        const looseCoinsAmount =cashCountsInHand[looseCoinsKey] ?? 0;
        const denominationTotalAmount= allDenominationRows.reduce((total:number, row:DenominationRow) => 
            total + row.value * (cashCountsInHand[row.key] ?? 0), 0) +looseCoinsAmount + cashWithTomOperators;
            // loose coins
        return {
            currentDayEarning : totalEarningOfDate(registerState,date),
            totalEarning,
            imprestAndAdvanceIssuedTotal:imprestIssuedTotalForDate(registerState, date),
            advanceReceivedTotal: advanceReceivedTotalForDate(registerState, date),
            previousDaysCash,
            existingTransfer,
            totalCashInHand,amountDueToBank,
            cashCountsInHand,
            looseCoinsAmount,
            denominationTotalAmount,
        };
    },[registerState, date])
 }
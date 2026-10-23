import { useMemo } from "react";
import type { RegisterState } from "../lib/registerTypes";
import { bankRoundingAmount } from "../lib/businessRules";
import { allDenominationRows,
        advanceReceivedTotalForDate,
        imprestIssuedTotalForDate,
        breakIntoDenominations,
        cashFromPreviousDays,
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
        const advanceReceivedTotal = advanceReceivedTotalForDate(registerState,date);
        const totalCashInHand = previousDaysCash + Math.round(currentDayEarning) + advanceReceivedTotal;

        const amountDueToBank =Math.floor(Math.max(0,previousDaysCash) / bankRoundingAmount) * bankRoundingAmount;
        const cashCountsInHand:Record<string, number> = registerState.cashCounts?.[date] ?? breakIntoDenominations(0);
        const looseCoinsAmount =cashCountsInHand[looseCoinsKey] ?? 0;
        const denominationTotalAmount= allDenominationRows.reduce((total:number, row:DenominationRow) => 
            total + Number(row.value) * (cashCountsInHand[row.key] ?? 0), 0) +looseCoinsAmount;
            // loose coins
        return {
            currentDayEarning : totalEarningOfDate(registerState,date),
            imprestAndAdvanceIssuedTotal:imprestIssuedTotalForDate(registerState, date),
            advanceReceivedTotal,
            previousDaysCash,
            existingTransfer,
            totalCashInHand,amountDueToBank,
            cashCountsInHand,
            looseCoinsAmount,
            denominationTotalAmount,
        };
    },[registerState, date])
 }
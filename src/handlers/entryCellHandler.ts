import type { RegisterRow } from "../lib/registerTypes";
import { parseNumber } from "../lib/earningColumns";

type EntriesByDate = Record<string,Record<number,RegisterRow>>;

const surchargePurseOffsets: Record<string, string> = {
    surchargePurseQuantity: "surchargeCashQuantity",
    surchargePurseAmount: "surchargeCashAmount",
    ncmcPurseQuantity: "ncmcCashQuantity",
    ncmcPurseAmount: "ncmcCashAmount",
};

export function updateEntryCell(
    entriesByDate:EntriesByDate,
    date:string,
    rowIndex:number,
    fieldKey:string,
    newValue:string
    ) {
        const entriesOfDate = (entriesByDate[date] ??= {});
        const row = (entriesOfDate[rowIndex] ??= {});
        const offsetFieldKey = surchargePurseOffsets[fieldKey];

        if (offsetFieldKey) {
            const change = parseNumber(newValue) - parseNumber(row[fieldKey]);
            if (change !== 0) {
                const adjustedCash = parseNumber(row[offsetFieldKey]) - change;
                row[offsetFieldKey] = String(
                    fieldKey.endsWith("Amount") ? Number(adjustedCash.toFixed(2)) : adjustedCash,
                );
            }
        }

        row[fieldKey] = newValue;
}
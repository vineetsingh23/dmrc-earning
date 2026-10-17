import type { RegisterRow } from "../lib/registerTypes";

type EntriesByDate = Record<string,Record<number,RegisterRow>>;

export function updateEntryCell(
    entriesByDate:EntriesByDate,
    date:string,
    rowIndex:number,
    fieldKey:string,
    newValue:string
    ) {
        const entriesOfDate = (entriesByDate[date] ??= {});
        (entriesOfDate[rowIndex] ??= {})[fieldKey] = newValue;
}
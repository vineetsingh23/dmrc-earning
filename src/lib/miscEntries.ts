import { createEmptyRegisterState, type MiscKind, type RegisterState } from './registerTypes';
import { parseNumber } from './earningColumns';

export type { MiscKind };

// a stored row is [date, equipment or person name, amount, remark]; the Total Amount column is calculated, so it is not stored
export const miscColumnIndex = { date: 0, name: 1, amount: 2, remark: 3 } as const;

export const dayMonthYear = (isoDate: string) => `${isoDate.slice(8, 10)}-${isoDate.slice(5, 7)}-${isoDate.slice(0, 4)}`;

// '19-10-2026' (also 19/10/2026 or 19.10.2026) -> '2026-10-19'; undefined when the text is not a date
export function isoDateOfText(dateText: string): string | undefined {
  const parts = /^\s*(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\s*$/.exec(dateText);
  if (!parts) return undefined;
  return `${parts[3]}-${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
}

export const miscRowsOf = (state: RegisterState, kind: MiscKind): string[][] => state.miscEntries?.[kind] ?? [];

export const miscRowCountOf = (state: RegisterState, kind: MiscKind) =>
  Math.max(state.miscRowCounts?.[kind] ?? createEmptyRegisterState().miscRowCounts![kind], miscRowsOf(state, kind).length);

// an entry counts from its own date onward; an entry with an empty or unreadable date always counts
export function entryCountsOnDate(row: string[] | undefined, selectedDate: string): boolean {
  const entryDate = isoDateOfText(row?.[miscColumnIndex.date] ?? '');
  return !entryDate || entryDate <= selectedDate;
}

export const miscTotalOfAllRows = (state: RegisterState, kind: MiscKind) =>
  miscRowsOf(state, kind).reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

// the part of the ledger that is counted in the cash possession card on the selected date
export const miscTotalTillDate = (state: RegisterState, selectedDate: string, kind: MiscKind) =>
  miscRowsOf(state, kind).reduce((total, row) => total + (entryCountsOnDate(row, selectedDate) ? parseNumber(row?.[miscColumnIndex.amount]) : 0), 0);

// total amount shown in each row: the running total down the card (blank rows stay blank)
export function runningTotalsOfRows(rows: string[][], rowCount: number): (number | null)[] {
  let runningTotal = 0;
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = rows[rowIndex];
    const isBlank = !row || [miscColumnIndex.name, miscColumnIndex.amount, miscColumnIndex.remark].every(columnIndex => !(row[columnIndex] ?? '').trim());
    if (isBlank) return null;
    runningTotal += parseNumber(row[miscColumnIndex.amount]);
    return runningTotal;
  });
}
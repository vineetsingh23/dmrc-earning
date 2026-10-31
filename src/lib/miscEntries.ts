import type { RegisterState } from './registerTypes';
import { parseNumber } from './earningColumns';

export type MiscKind = 'miscDebit' | 'miscCredit';

// a stored row is [date, equipment or person name, amount, remark]; the Total Amount column is calculated, so it is not stored
export const miscColumnIndex = { date: 0, name: 1, amount: 2, remark: 3 } as const;

export const dayMonthYear = (isoDate: string) => `${isoDate.slice(8, 10)}-${isoDate.slice(5, 7)}-${isoDate.slice(0, 4)}`;

const rowsOf = (state: RegisterState, date: string, kind: MiscKind): string[][] => state.detailLists?.[date]?.[kind] ?? [];

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

export const miscTotalOfDate = (state: RegisterState, date: string, kind: MiscKind) =>
  rowsOf(state, date, kind).reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

// cash that left the drawer (debit) or came in (credit) stays so on the later dates, so the possession check counts every date up to the selected one
export const miscTotalTillDate = (state: RegisterState, date: string, kind: MiscKind) =>
  Object.keys(state.detailLists ?? {}).filter(savedDate => savedDate <= date)
    .reduce((total, savedDate) => total + miscTotalOfDate(state, savedDate, kind), 0);
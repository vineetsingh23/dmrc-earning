import { parseNumber, type ColumnLeaf } from './earningColumns';
import type { RegisterState } from './registerTypes';
import { totalEarningSample } from './earningColumns';
export const formatRupees = (amount: unknown) => '₹' + Math.round(parseNumber(amount)).toLocaleString('en-IN');

// quantity columns show plain numbers, amounts show rupees
export const formatCellValue = (column: ColumnLeaf, value: number) =>
  /Qty/.test(column.label) ? String(value) : formatRupees(value);

// date helpers { dates are text like "2026-10-16"}
export const addDays = (isoDate:string, dayCount:number) => {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() +dayCount);
  return new Date(date.getTime() -date.getTimezoneOffset() * 60000).toISOString().slice(0,10);
}



// total earning of one day = sum of the Total Earning formula over every row of that date
export const totalEarningOfDate = (state: RegisterState, date: string) =>
  Object.values(state.shiftEntries[date] ?? {}).reduce((total, row) => total + totalEarningSample(row), 0);

// cash in hand = previous day earning + current day earning
export const cashInHandOfDate = (state: RegisterState, date: string) =>
  Math.round(totalEarningOfDate(state, addDays(date, -1)) + totalEarningOfDate(state, date));

export interface DenominationRow { key: string; value: number; label: string }

export const noteRows: DenominationRow[] = [500, 200, 100, 50, 20, 10].map(value => ({ key: String(value), value, label: `₹${value} note` }));
export const coinRows: DenominationRow[] = [20, 10, 5, 2, 1].map(value => ({ key: `coin${value}`, value, label: `₹${value} coin` }));
export const allDenominationRows: DenominationRow[] = [...noteRows, ...coinRows];

// splits an amount into notes and coins, largest first
export const breakIntoDenominations = (amount: number): Record<string, number> => {
  const counts: Record<string, number> = {};
  allDenominationRows.forEach(row => { counts[row.key] = 0; });
  let remaining = amount;
  [500, 200, 100, 50, 20, 10, 5, 2, 1].forEach(value => {
    const key = value >= 10 ? String(value) : `coin${value}`;   // ₹5, ₹2 and ₹1 are coins
    counts[key] = Math.floor(remaining / value);
    remaining -= counts[key] * value;
  });
  return counts;
};
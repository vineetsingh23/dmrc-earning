import { parseNumber, type ColumnLeaf } from './earningColumns';
import type { RegisterState } from './registerTypes';
import { totalEarningSample } from './earningColumns';
export const formatRupees = (amount: unknown) => '₹' + Math.round(parseNumber(amount)).toLocaleString('en-IN');
import { tomOperators } from './businessRules';
import { tvmFinalTotal } from './earningColumns';

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
// export const cashInHandOfDate = (state: RegisterState, date: string) =>
//   Math.round(totalEarningOfDate(state, addDays(date, -1)) + totalEarningOfDate(state, date));

// all dates that have earning or a bank transfer
const datesWithData = (state:RegisterState) =>
[...new Set([...Object.keys(state.shiftEntries), ...Object.keys(state.bankTransfers ?? {})])];

// cash from earlier days that was not yet sent to bank (current day is not included)
export const cashFromPreviousDays = (state: RegisterState, date: string) => {
  const earlierDates = datesWithData(state).filter(entryDate => entryDate < date);
  const totalEarned = earlierDates.reduce((total, entryDate)=> total + totalEarningOfDate(state,entryDate), 0);
  const totalSendToBank = earlierDates.reduce((total, entryDate) => total + (state.bankTransfers?.[entryDate]?.amount ?? 0), 0);
  return Math.round(totalEarned - totalSendToBank);
}

// cash in hand before any transfer of this date : unsent earlier cash + current day earning
export const cashInHandOfDate = (state: RegisterState, date: string) =>
  cashFromPreviousDays(state, date) + Math.round(totalEarningOfDate(state,date))
  + imprestIssuedTotalForDate(state, date) + advanceReceivedTotalForDate(state,date);


export interface DenominationRow { key: string; value: number | string; label: string }

export const noteRows: DenominationRow[] = [500, 200, 100, 50, 20, 10].map(value => ({ key: String(value), value, label: `₹${value} note` }));
export const coinRows: DenominationRow[] = [20, 10, 5, 2, 1].map(value => ({ key: `coin${value}`, value, label: `₹${value} coin` }));
export const allDenominationRows: DenominationRow[] = [...noteRows, ...coinRows];
export const looseCoinsKey = 'looseCoins';

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

export const imprestIssuedTotalForDate =(state: RegisterState, date: string) =>
  tomOperators.reduce((total, tomOperator, rowIndex) =>
    total + tomOperator.imprestAmount + parseNumber(state.detailLists?.[date]?.imprestIssue?.[rowIndex]?.[2]),0);

export const advanceReceivedTotalForDate =(state: RegisterState, date: string) =>
  tomOperators.reduce((total, _tomOperator, rowIndex) =>
    total + parseNumber(state.detailLists?.[date]?.advanceReceived?.[rowIndex]?.[1]),0);


export const tvmFinalTotalOfDate = (state: RegisterState, date: string) =>
  Object.values(state.tvmEntries?.[date] ?? {}).reduce((total, row) => total + tvmFinalTotal(row), 0);
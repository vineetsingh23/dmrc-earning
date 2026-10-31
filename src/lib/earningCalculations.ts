import { parseNumber, type ColumnLeaf, tvmTotal } from './earningColumns';
import type { RegisterRow, RegisterState } from './registerTypes';
import { cashDepositedByOperator, cashlessTotal, osTotalPaidAmount, totalEarning } from './shiftEntrycolumns';
export const formatRupees = (amount: unknown) => '₹\u00A0\u00A0' + Math.round(parseNumber(amount)).toLocaleString('en-IN');
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
     // earning of one day in cash: cash deposited by the shift operators + TVM final total
     export const totalEarningOfDate = (state: RegisterState, date: string) =>
       Object.values(state.shiftEntries[date] ?? {}).reduce((total, row) => total + cashDepositedByOperator(row), 0)
       + tvmFinalTotalOfDate(state, date);

    export const highestEarningSoFar = (state: RegisterState, date: string) =>Math.max(totalEarningOfDate(state,date),0)

// all dates that have earning or a bank transfer
const datesWithData = (state:RegisterState) =>
[...new Set([...Object.keys(state.shiftEntries),...Object.keys(state.tvmEntries), ...Object.keys(state.bankTransfers ?? {})])];

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
  + advanceReceivedTotalForDate(state,date);
  
export const cashWithTomOperatorsForDate =(state: RegisterState, date: string) =>
   imprestIssuedTotalForDate(state, date)

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

export const sumRowsByField =(rows: RegisterRow[]): RegisterRow => {
  const totals : Record<string, number> ={};
  rows.forEach(row => Object.entries(row).forEach(([fieldKey, typedValue]) => { 
    totals[fieldKey] = (totals[fieldKey] ?? 0) + parseNumber(typedValue);
  }));
  return Object.fromEntries(Object.entries(totals).map(([fieldKey, total])=>[fieldKey,String(total)]))
}





// merge with the type import you already have

const shiftRowsOfDate = (state: RegisterState, date: string): RegisterRow[] => Object.values(state.shiftEntries[date] ?? {});
const tvmRowsOfDate = (state: RegisterState, date: string): RegisterRow[] => Object.values(state.tvmEntries?.[date] ?? {});
const sumOverRows = (rows: RegisterRow[], valueOfRow: (row: RegisterRow) => number) => rows.reduce((total, row) => total + valueOfRow(row), 0);

// total earning (Z) of the shift sheet plus the TVM total
export const dailyEarningOfDate = (state: RegisterState, date: string) =>
  sumOverRows(shiftRowsOfDate(state, date), totalEarning) + sumOverRows(tvmRowsOfDate(state, date), tvmTotal);

// cashless: shift cashless details plus TVM payments by POS and UPI
export const dailyCashlessOfDate = (state: RegisterState, date: string) =>
  sumOverRows(shiftRowsOfDate(state, date), cashlessTotal)
  + sumOverRows(tvmRowsOfDate(state, date), row => parseNumber(row.tvmPaymentByPos) + parseNumber(row.tvmPaymentByUpi));

export interface DailyCashlessStatistics {
  afcEarning: number;
  upiTotal: number;
  posTotal: number;
  tom8081Upi: number;
  tom5051Upi: number;
  tvmUpi: number;
}

export const dailyCashlessStatisticsOfDate = (state: RegisterState, date: string): DailyCashlessStatistics => {
  const statistics: DailyCashlessStatistics = {
    afcEarning: 0,
    upiTotal: 0,
    posTotal: 0,
    tom8081Upi: 0,
    tom5051Upi: 0,
    tvmUpi: 0,
  };

  shiftRowsOfDate(state, date).forEach(row => {
    const tomUpi = parseNumber(row.upiAtTomCc);
    const tvmUpi = parseNumber(row.upiAtTvm);
    const pos = ['posAtCcc', 'posAtTvm', 'posAtRctm', 'posAtScvm']
      .reduce((total, field) => total + parseNumber(row[field]), 0);

    statistics.afcEarning += totalEarning(row);
    statistics.upiTotal += tomUpi + tvmUpi;
    statistics.posTotal += pos;
    statistics.tvmUpi += tvmUpi;

    const tomNumber = row.cccNumber?.match(/(?:^|\D)(80|81|50|51)(?:\D|$)/)?.[1];
    if (tomNumber === '80' || tomNumber === '81') statistics.tom8081Upi += tomUpi;
    if (tomNumber === '50' || tomNumber === '51') statistics.tom5051Upi += tomUpi;
  });

  tvmRowsOfDate(state, date).forEach(row => {
    const upi = parseNumber(row.tvmPaymentByUpi);
    statistics.upiTotal += upi;
    statistics.tvmUpi += upi;
    statistics.posTotal += parseNumber(row.tvmPaymentByPos);
  });

  return statistics;
};

export const tvmQrSaleOfDate = (state: RegisterState, date: string) =>
  sumOverRows(tvmRowsOfDate(state, date), row => parseNumber(row.tvmQrSaleAmount));
export const tvmAddValueOfDate = (state: RegisterState, date: string) =>
  sumOverRows(tvmRowsOfDate(state, date), row => parseNumber(row.tvmAddValueAmount));

// QR sale amount of the shift sheet plus TVM
export const dailyQrSaleOfDate = (state: RegisterState, date: string) =>
  sumOverRows(shiftRowsOfDate(state, date), row => parseNumber(row.qrSaleAmount)) + tvmQrSaleOfDate(state, date);

// every date that has shift or TVM entries, up to and including the given date, oldest first
export const datesWithEntriesUpTo = (state: RegisterState, lastDate: string) =>
  [...new Set([...Object.keys(state.shiftEntries), ...Object.keys(state.tvmEntries ?? {})])].filter(entryDate => entryDate <= lastDate).sort();


// the counts of the most recent earlier date that has saved counts
export const latestEarlierCashCounts = (state: RegisterState, date: string): Record<string, number> | undefined => {
  const earlierDates = Object.keys(state.cashCounts ?? {}).filter(savedDate => savedDate < date).sort();
  const latestDate = earlierDates[earlierDates.length - 1];
  return latestDate ? state.cashCounts[latestDate] : undefined;
};

// value of notes, coins and loose coins together
export const countsTotalAmount = (counts: Record<string, number>) =>
  allDenominationRows.reduce((total, row) => total + Number(row.value) * (counts[row.key] ?? 0), 0) + (counts[looseCoinsKey] ?? 0);

// carried counts, plus notes and coins for any extra cash (for example today's earning); counted cash is never removed
export const carryForwardCashCounts = (carriedCounts: Record<string, number>, expectedTotalAmount: number): Record<string, number> => {
  const result = { ...carriedCounts };
  const missingAmount = Math.round(expectedTotalAmount - countsTotalAmount(carriedCounts));
  if (missingAmount <= 0) return result;
  Object.entries(breakIntoDenominations(missingAmount)).forEach(([countKey, extraCount]) => {
    result[countKey] = (result[countKey] ?? 0) + extraCount;
  });
  return result;
};

export const totalOutStandingAmount = (state: RegisterState, date: string) =>
  sumOverRows(shiftRowsOfDate(state, date), osTotalPaidAmount);
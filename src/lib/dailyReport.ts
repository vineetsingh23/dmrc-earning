import type { RegisterRow, RegisterState } from './registerTypes';
import { parseNumber, sumOfFields, tvmTotal } from './earningColumns';
import { afcCollectionTotal } from './shiftEntrycolumns';

// ---- fields typed by the user, once for each date ----
export type ReportFieldKind = 'number' | 'text' | 'yesNo';
export interface ReportFieldDefinition { fieldKey: string; label: string; kind: ReportFieldKind; defaultValue?: string }

export const reportFields: ReportFieldDefinition[] = [
  { fieldKey: 'stationLabel', label: 'Station (as written in the report)', kind: 'text' },   // empty = the station name
  { fieldKey: 'footfall', label: 'Footfall', kind: 'number' },
  { fieldKey: 'ridership', label: 'Ridership', kind: 'number' },
  { fieldKey: 'cscStock', label: 'CSC stock', kind: 'number' },
  { fieldKey: 'ncmcSale', label: 'NCMC sale', kind: 'number' },
  { fieldKey: 'contractorTomOperators', label: 'Contractor hours: TOM operators', kind: 'number' },
  { fieldKey: 'contractorCfaGuard', label: 'Contractor hours: CFA guard', kind: 'number' },
  { fieldKey: 'hkManpowerShortfall', label: 'Shortfall in HK manpower', kind: 'number' },
  { fieldKey: 'trackCleaning', label: 'Track cleaning', kind: 'yesNo', defaultValue: 'NO' },
  { fieldKey: 'spb', label: 'SPB', kind: 'yesNo', defaultValue: 'NO' },
  { fieldKey: 'equipmentFailure', label: 'Equipment failure', kind: 'text' },
  { fieldKey: 'lostAndFoundItems', label: 'Lost & found items', kind: 'number', defaultValue: '0' },
  { fieldKey: 'majorFailure', label: 'Major failure', kind: 'text', defaultValue: 'Nil' },
  { fieldKey: 'latestDevelopment', label: 'Latest development (if any)', kind: 'text', defaultValue: 'NO' },
  { fieldKey: 'cctvAnalyzedPreviousDay', label: 'CCTV analyzed (previous day)', kind: 'yesNo', defaultValue: 'YES' },
  { fieldKey: 'cctvSpecialObservation', label: 'Special observation through CCTV by SM', kind: 'text', defaultValue: 'No' },
];

// which register fields make up the report figures; change them here if your report counts differently
const posFieldKeys = 'posAtCcc posAtTvm posAtRctm posAtScvm';
const tomCcUpiFieldKeys = 'upiAtTomCc';
const penaltyQuantityFieldKeys = 'manualPenaltyQuantity hhtPenaltyCashQuantity hhtPenaltyPurseQuantity';
const penaltyAmountFieldKeys = 'manualPenaltyAmount hhtPenaltyCashAmount hhtPenaltyPurseAmount';

// percentages are cut (not rounded) to 2 decimals, like in the existing report: 20.2257 is written as 20.22
export const percentOf = (part: number, whole: number) => (whole > 0 ? Math.floor((part / whole) * 10000) / 100 : 0);

const sumRows = (rows: RegisterRow[], valueOfRow: (row: RegisterRow) => number) => rows.reduce((total, row) => total + valueOfRow(row), 0);
const hasAnyValue = (row: RegisterRow) => Object.values(row).some(value => String(value ?? '').trim() !== '');

// every number of the report that comes from the sheets of one date
export function buildDailyReportFigures(state: RegisterState, date: string) {
  const shiftRows = Object.values(state.shiftEntries[date] ?? {});
  const tvmRows = Object.values(state.tvmEntries?.[date] ?? {});

  const afcEarning = sumRows(shiftRows, afcCollectionTotal) + sumRows(tvmRows, tvmTotal);
  const tvmAndRctmSale = sumRows(tvmRows, tvmTotal);
  const tvmQrSaleQuantity = sumRows(tvmRows, row => parseNumber(row.tvmQrSaleQuantity));
  const tvmQrSaleAmount = sumRows(tvmRows, row => parseNumber(row.tvmQrSaleAmount));
  const shiftQrSaleQuantity = sumRows(shiftRows, row => parseNumber(row.qrSaleQuantity));
  const shiftQrSaleAmount = sumRows(shiftRows, row => parseNumber(row.qrSaleAmount));

  const tvmRctmCashlessPercent = percentOf(tvmAndRctmSale, afcEarning);
  const tomCcUpiPercent = percentOf(sumRows(shiftRows, row => sumOfFields(row, tomCcUpiFieldKeys)), afcEarning);
  const posPercent = percentOf(sumRows(shiftRows, row => sumOfFields(row, posFieldKeys)), afcEarning);
  // station cashless % = the three parts together, worked out from the exact values before cutting
  const stationCashlessPercent = percentOf(
    tvmAndRctmSale + sumRows(shiftRows, row => sumOfFields(row, tomCcUpiFieldKeys) + sumOfFields(row, posFieldKeys)), afcEarning);

  return {
    afcEarning, stationCashlessPercent, tvmRctmCashlessPercent, tomCcUpiPercent, posPercent,
    cscSaleQuantity: sumRows(shiftRows, row => sumOfFields(row, 'cscSaleSv2Sv6Quantity cscSaleT1T3Quantity')),
    ncmcAddValueQuantity: sumRows(shiftRows, row => parseNumber(row.addValueNcmcTomQuantity)) + sumRows(tvmRows, row => parseNumber(row.tvmNcmcAddValueQuantity)),
    ncmcAddValueAmount: sumRows(shiftRows, row => parseNumber(row.addValueNcmcTomAmount)) + sumRows(tvmRows, row => parseNumber(row.tvmNcmcAddValueAmount)),
    tvmCount: tvmRows.filter(hasAnyValue).length,
    tvmQrSaleQuantity, tvmQrSaleAmount, tvmAndRctmSale,
    stationQrSaleQuantity: shiftQrSaleQuantity + tvmQrSaleQuantity,        // station QR sale = TOM / CCC QR sale + TVM QR sale
    stationQrSaleAmount: shiftQrSaleAmount + tvmQrSaleAmount,
    penaltyQuantity: sumRows(shiftRows, row => sumOfFields(row, penaltyQuantityFieldKeys)),
    penaltyAmount: sumRows(shiftRows, row => sumOfFields(row, penaltyAmountFieldKeys)),
  };
}
export type DailyReportFigures = ReturnType<typeof buildDailyReportFigures>;

// typed value of a field for a date; an empty field uses its default (for the station label: the station name)
export function reportFieldValue(state: RegisterState, date: string, field: ReportFieldDefinition, stationName: string): string {
  const typedValue = (state.reportFields?.[date]?.[field.fieldKey] ?? '').trim();
  if (typedValue) return typedValue;
  return field.fieldKey === 'stationLabel' ? stationName : field.defaultValue ?? '';
}

const wholeNumber = (value: number) => String(Math.round(value));
const quantityAndAmount = (quantity: number, amount: number) => `${wholeNumber(quantity)}/${wholeNumber(amount)}`;
const twoDigits = (value: number) => String(Math.round(value)).padStart(2, '0');
const dayMonthYear = (isoDate: string) => `${isoDate.slice(8, 10)}-${isoDate.slice(5, 7)}-${isoDate.slice(0, 4)}`;

// the WhatsApp message, in the layout of the daily report
export function buildWhatsAppMessage(state: RegisterState, date: string, stationName: string): string {
  const figures = buildDailyReportFigures(state, date);
  const value = (fieldKey: string) => reportFieldValue(state, date, reportFields.find(field => field.fieldKey === fieldKey)!, stationName);
  const reportDate = dayMonthYear(date);
  return [
    `Station : ${value('stationLabel')}`,
    `Date :${reportDate}`,
    `(1).Footfall : ${value('footfall')}`,
    `    Ridership : ${value('ridership')}`,
    `(2).AFC Earning: ${wholeNumber(figures.afcEarning)}`,
    `(3).Station Cashless%: ${figures.stationCashlessPercent.toFixed(2)}%`,
    `(4).TVM/RCTM Cashless%: ${figures.tvmRctmCashlessPercent.toFixed(2)}%`,
    `(5).TOM/CC UPI % :${figures.tomCcUpiPercent.toFixed(2)}%`,
    `(6).POS % : ${figures.posPercent.toFixed(2)}%`,
    `(7).CSC stock: ${value('cscStock')}`,
    `(8).CSC Sale : ${twoDigits(figures.cscSaleQuantity)}`,
    `(9).NCMC Sale: ${value('ncmcSale')}`,
    `(10).Total NCMC add Value (Qty/Amt) : ${quantityAndAmount(figures.ncmcAddValueQuantity, figures.ncmcAddValueAmount)}`,
    `(11).No of TVMs : ${figures.tvmCount}`,
    `(12).TVM QR Sale (Qty/Amt): ${quantityAndAmount(figures.tvmQrSaleQuantity, figures.tvmQrSaleAmount)}`,
    `(13).TVM+RCTM Sale: ${wholeNumber(figures.tvmAndRctmSale)}`,
    `(14).QR Sale Station (Qty/Amt): ${quantityAndAmount(figures.stationQrSaleQuantity, figures.stationQrSaleAmount)}`,
    `(15).Penalty (Qty/Amt) : ${figures.penaltyQuantity || figures.penaltyAmount ? quantityAndAmount(figures.penaltyQuantity, figures.penaltyAmount) : '0'}`,
    `(16).Contractor Hours:-`,
    `Tom Operators : ${value('contractorTomOperators')}`,
    `CFA Guard : ${value('contractorCfaGuard')}`,
    `(17).Shortfall in HK Manpower :${value('hkManpowerShortfall')}`,
    `(18).Track Cleaning (Yes/No) : ${value('trackCleaning')}`,
    `(19).SPB (Yes/No) : ${value('spb')}`,
    `(20).Equipment Failure :  ${value('equipmentFailure')}`,
    `(21).Lost & Found Item : ${value('lostAndFoundItems')}`,
    `(22).Major Failure : ${value('majorFailure')}`,
    `(23).Latest Development (If any): ${value('latestDevelopment')}`,
    `(24).Whether CCTV  analyzed (Previous day) : ${value('cctvAnalyzedPreviousDay')}`,
    `(25).Special observation, if any, of (${reportDate}) through CCTV by SM : ${value('cctvSpecialObservation')}`,
  ].join('\n');
}

// opens WhatsApp with the message ready to send; the user picks the chat or group and presses send
export const whatsAppLink = (message: string) => `https://wa.me/?text=${encodeURIComponent(message)}`;
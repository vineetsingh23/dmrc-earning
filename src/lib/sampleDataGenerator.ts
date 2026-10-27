import type { RegisterRow, RegisterState } from './registerTypes';
import type { StationFacilities } from './earningColumns';
import { penaltySections, tomOperators } from './businessRules';

const randomBetween = (minimum: number, maximum: number) => minimum + Math.floor(Math.random() * (maximum - minimum + 1));
const asText = (value: number) => String(value);
const padTwoDigits = (value: number) => String(value).padStart(2, '0');

// every date of the month that contains the given date, e.g. '2026-10-16' -> '2026-10-01' ... '2026-10-31'
export function datesOfMonth(dateInMonth: string): string[] {
  const [year, month] = dateInMonth.split('-').map(Number);
  const dayCount = new Date(year, month, 0).getDate();
  return Array.from({ length: dayCount }, (_, dayIndex) => `${dateInMonth.slice(0, 7)}-${padTwoDigits(dayIndex + 1)}`);
}

function createSampleShiftRow(rowIndex: number, facilities: StationFacilities): RegisterRow {
  const qrQuantity = randomBetween(20, 60), addValueQuantity = randomBetween(5, 25);
  const row: RegisterRow = {
    cccNumber: `CCC ${rowIndex + 1}`, operatorName: `Operator ${rowIndex + 1}`, shiftNumber: asText(1 + (rowIndex % 3)),
    qrSaleQuantity: asText(qrQuantity), qrSaleAmount: asText(qrQuantity * 30),
    paidExitQrQuantity: asText(randomBetween(0, 5)), paidExitQrAmount: asText(randomBetween(0, 5) * 30),
    qrRefundAmount: asText(randomBetween(0, 2) * 30),
    cscSaleAmount: asText(randomBetween(0, 4) * 100),
    addValueSv2TomQuantity: asText(addValueQuantity), addValueSv2TomAmount: asText(addValueQuantity * 200),
    addValueCancelAmount: asText(randomBetween(0, 3) * 50),
    surchargeCashQuantity: asText(randomBetween(0, 5)), surchargeCashAmount: asText(randomBetween(0, 5) * 10),
    manualPenaltyAmount: asText(randomBetween(0, 3) * 50), miscEarningAmount: asText(randomBetween(0, 2) * 50),
    posAtCcc: asText(randomBetween(0, 6) * 100), upiAtTomCc: asText(randomBetween(0, 8) * 100),
    outsourceEarningAmount: asText(randomBetween(0, 2) * 100), outstandingCurrentAfc: asText(randomBetween(0, 2) * 50),
  };
  // columns that a station without these facilities does not show must stay empty
  if (facilities.hasSv4Recharge) { row.sv4TopUpQuantity = asText(randomBetween(0, 4)); row.sv4TopUpAmount = asText(randomBetween(0, 4) * 100); }
  if (facilities.hasParking) row.parkingManualCash = asText(randomBetween(0, 5) * 20);
  return row;
}

function createSampleTvmRow(rowIndex: number): RegisterRow {
  const qrQuantity = randomBetween(5, 30), addValueQuantity = randomBetween(3, 15), ncmcQuantity = randomBetween(0, 8), rctmQuantity = randomBetween(0, 6);
  return {
    tvmNumber: `TVM ${rowIndex + 1}`,
    tvmQrSaleQuantity: asText(qrQuantity), tvmQrSaleAmount: asText(qrQuantity * 30),
    tvmAddValueQuantity: asText(addValueQuantity), tvmAddValueAmount: asText(addValueQuantity * 200),
    tvmNcmcAddValueQuantity: asText(ncmcQuantity), tvmNcmcAddValueAmount: asText(ncmcQuantity * 150),
    tvmRctmAddValueQuantity: asText(rctmQuantity), tvmRctmAddValueAmount: asText(rctmQuantity * 100),
    tvmPaymentByPos: asText(randomBetween(0, 3) * 100), tvmPaymentByUpi: asText(randomBetween(0, 6) * 100), tvmOutstandingCurrent: asText(randomBetween(0, 2) * 50),
  };
}

// fills the whole month with random data, to try the app, the statistics and the histogram
export function fillMonthWithSampleData(registerState: RegisterState, dateInMonth: string, facilities: StationFacilities): void {
  registerState.tvmEntries ??= {};
  registerState.detailLists ??= {};
  datesOfMonth(dateInMonth).forEach(date => {
    registerState.shiftEntries[date] = {};
    registerState.tvmEntries[date] = {};
    for (let rowIndex = 0; rowIndex < registerState.shiftRowCount; rowIndex++) registerState.shiftEntries[date][rowIndex] = createSampleShiftRow(rowIndex, facilities);
    for (let rowIndex = 0; rowIndex < registerState.tvmRowCount; rowIndex++) registerState.tvmEntries[date][rowIndex] = createSampleTvmRow(rowIndex);

    registerState.detailLists[date] = {
      outsourceEarning: [['Parking contractor', asText(randomBetween(2, 8) * 100)], ['Advertising stall', asText(randomBetween(1, 4) * 100)]],
      miscEarning: [['Locker fee', asText(randomBetween(1, 5) * 50)]],
      penaltyDetails: Array.from({ length: randomBetween(1, 3) }, (_, penaltyIndex) => [
        `PN-${date.slice(8)}-${penaltyIndex + 1}`,
        `${date.slice(8)}-${date.slice(5, 7)}-${date.slice(0, 4)} ${padTwoDigits(randomBetween(6, 22))}:${padTwoDigits(randomBetween(0, 5) * 10)}`,
        penaltySections[randomBetween(0, penaltySections.length - 1)], `Passenger ${penaltyIndex + 1}`,
        `98${randomBetween(10000000, 99999999)}`, `Sector ${randomBetween(1, 90)}, Noida`, asText(randomBetween(1, 4) * 50),
      ]),
      // rows follow the order of tomOperators: [tomNumber, imprest issued, advance issued]
      imprestIssue: tomOperators.map(tomOperator => [tomOperator.tomNumber, asText(tomOperator.imprestAmount), asText(randomBetween(0, 4) * 100)]),
      // [tomNumber, advance received]
      advanceReceived: tomOperators.map(tomOperator => [tomOperator.tomNumber, asText(randomBetween(0, 4) * 100)]),
    };
    // counts typed earlier and any bank transfer of these dates would no longer match the new numbers
    delete registerState.cashCounts[date];
    delete registerState.bankTransfers[date];
  });
}
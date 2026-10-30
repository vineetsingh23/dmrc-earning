import type { RegisterRow } from './registerTypes';
import { calculatedColumn, columnGroup,mirrorColumn, numberColumn, sumOfFields, textColumn, type ColumnLeaf, type ColumnNode } from './earningColumns';

// a Qty column and an Amt column; the amount code is the letter printed on the register
export const quantityAmountColumns = (quantityKey: string, amountKey: string, amountCode: string): ColumnLeaf[] =>
  [numberColumn(quantityKey, 'Qty'), numberColumn(amountKey, `Amt (${amountCode})`)];

// ---- formulas ----
// QR sale + paid exit + CSC sale, minus QR refund, CSC sale cancel and CSC refund
export const ticketSaleNet = (row: RegisterRow) =>
  sumOfFields(row, 'qrSaleAmount paidExitQrAmount cscSaleAmount') - sumOfFields(row, 'qrRefundAmount cscSaleCancelAmount cscRefundAmount');
// add value on cards, minus add value cancel
export const addValueNet = (row: RegisterRow) =>
  sumOfFields(row, 'addValueSv2TomAmount addValueNcmcTomAmount') - sumOfFields(row, 'addValueCancelAmount');
export const surchargeTotal = (row: RegisterRow) =>
  sumOfFields(row, 'surchargeCashAmount surchargePurseAmount ncmcCashAmount ncmcPurseAmount');
export const penaltyTotal = (row: RegisterRow) =>
  sumOfFields(row, 'manualPenaltyAmount hhtPenaltyCashAmount hhtPenaltyPurseAmount');


export const cashlessTotal = (row: RegisterRow) =>
  sumOfFields(row, 'posAtCcc posAtTvm staticQrAtCcc posAtRctm posAtScvm upiAtTvm upiAtTomCc hhtPenaltyPurseAmount');

// export const cscPurse = (row: RegisterRow) => sumOfFields(row,'surchargePurseAmount')

// Total Collection by AFC System (X)
export const afcCollectionTotal = (row: RegisterRow) => ticketSaleNet(row) + addValueNet(row) + surchargeTotal(row);

// Total Earning (Z): AFC collection + other earnings, minus manual refunds
export const totalEarning = (row: RegisterRow) =>
  afcCollectionTotal(row)
  + sumOfFields(row, 'eibAmount sv4TopUpAmount miscEarningAmount parkingManualCash parkingHhtCash manualPenaltyAmount hhtPenaltyCashAmount hhtPenaltyPurseAmount hhtParkingPurseAmount')
  - sumOfFields(row, 'readableCscRefundAmount tourCardRefundAmount securityDepositRefundAmount manualQrRefundAmount');

// Total Cash Deposited by Operator
export const cashDepositedByOperator = (row: RegisterRow) =>
  totalEarning(row) - cashlessTotal(row)
  - sumOfFields(row, 'surchargePurseAmount hhtParkingPurseAmount ncmcPurseAmount outstandingCurrentAfc outstandingCurrentMisc ')
  + sumOfFields(row, 'outsourceEarningAmount outstandingPaidAfc outstandingPaidMisc');

  // surcharge paid by purse is typed once, in the Surcharge head; the cashless Surcharge Adjustment columns only show it
// export const surchargeThroughPurseAfc = (row: RegisterRow) => sumOfFields(row, 'surchargePurseAmount');
// export const surchargeThroughPurseNcmc = (row: RegisterRow) => sumOfFields(row, 'ncmcPurseAmount');

// ---- columns, in the order of the printed register ----
export const shiftEntryColumns: ColumnNode[] = [
  textColumn('cccNumber', 'CCC/TOM No.'), textColumn('operatorName', 'Name of Operator'), textColumn('employeeNumber', 'Employee No.'),
  textColumn('shiftStartTime', 'Start of Shift Time'), textColumn('shiftEndTime', 'End of Shift Time'), textColumn('shiftNumber', 'Shift No.'),

  columnGroup('QR Tickets',
    columnGroup('QR Tickets Sale', numberColumn('freeExitQuantity', 'Free Exit Qty'), ...quantityAmountColumns('qrSaleQuantity', 'qrSaleAmount', 'a')),
    columnGroup('Paid Exit QR', ...quantityAmountColumns('paidExitQrQuantity', 'paidExitQrAmount', 'b')),
    columnGroup('QR Refund', ...quantityAmountColumns('qrRefundQuantity', 'qrRefundAmount', 'd'))),

  columnGroup('Contactless Smart Card (CSC)',
    columnGroup('CSC Sale (TOM/CCC)', numberColumn('cscSaleSv2Sv6Quantity', 'SV-2 & SV-6 Qty'), numberColumn('cscSaleT1T3Quantity', 'T-1 & T-3 Qty'), numberColumn('cscSaleAmount', 'Total Amt (e)')),
    columnGroup('CSC Sale Cancel', ...quantityAmountColumns('cscSaleCancelQuantity', 'cscSaleCancelAmount', 'f')),
    columnGroup('CSC Refund', numberColumn('cscRefundSv2Quantity', 'SV-2 Qty'), numberColumn('cscRefundT1T3Quantity', 'T-1 & T-3 Qty'), numberColumn('cscRefundAmount', 'Amt (g)')),
    columnGroup('Add Value',
      columnGroup('SV2 TOM', ...quantityAmountColumns('addValueSv2TomQuantity', 'addValueSv2TomAmount', 'h1')),
      columnGroup('NCMC TOM', ...quantityAmountColumns('addValueNcmcTomQuantity', 'addValueNcmcTomAmount', 'h2'))),
    columnGroup('Add Value Cancel', ...quantityAmountColumns('addValueCancelQuantity', 'addValueCancelAmount', 'i'))),

  columnGroup('Surcharge (CCC)',
    columnGroup('By Cash/Cashless (other than Purse)', ...quantityAmountColumns('surchargeCashQuantity', 'surchargeCashAmount', 'j')),
    columnGroup('By Purse using AFC System', ...quantityAmountColumns('surchargePurseQuantity', 'surchargePurseAmount', 'k')),
    columnGroup('NCMC through Cash/POS/QR', ...quantityAmountColumns('ncmcCashQuantity', 'ncmcCashAmount', 'NC1')),
    columnGroup('NCMC through Purse', ...quantityAmountColumns('ncmcPurseQuantity', 'ncmcPurseAmount', 'NC2'))),

  calculatedColumn('afcCollectionTotal', 'Total Collection by AFC System (X)', afcCollectionTotal),
  numberColumn('eibAmount', 'E.I.B. (n)'),
  columnGroup('Top-up in SV-4 Cards (o)', ...quantityAmountColumns('sv4TopUpQuantity', 'sv4TopUpAmount', 'o')),
  
  columnGroup('Manual Refunds',  
    columnGroup('Refund Readable CSC (CR)', ...quantityAmountColumns('readableCscRefundQuantity', 'readableCscRefundAmount', 'r')),
    columnGroup('Manual Refund of Tour Card', ...quantityAmountColumns('tourCardRefundQuantity', 'tourCardRefundAmount', 's1')),
    columnGroup('Manual Refund of Security Deposit Against OK URC', ...quantityAmountColumns('securityDepositRefundQuantity', 'securityDepositRefundAmount', 's2'))),

  columnGroup('Penalty',
    columnGroup('Manual Receipt Penalty', ...quantityAmountColumns('manualPenaltyQuantity', 'manualPenaltyAmount', 't')),
    columnGroup('HHT Penalty (Cash)', ...quantityAmountColumns('hhtPenaltyCashQuantity', 'hhtPenaltyCashAmount', 'u')),
    columnGroup('HHT Penalty (Purse)', ...quantityAmountColumns('hhtPenaltyPurseQuantity', 'hhtPenaltyPurseAmount', 'v'))),

  numberColumn('miscEarningAmount', 'Miscellaneous Earning (w)'),
  columnGroup('Manual Refund (if any) QR', ...quantityAmountColumns('manualQrRefundQuantity', 'manualQrRefundAmount', 'x')),
  
  columnGroup('Parking (Y)', 
    numberColumn('parkingManualCash', 'Manual Cash (y1)'), 
    numberColumn('parkingHhtCash', 'HHT Cash (y2)'), 
    numberColumn('hhtParkingPurseAmount', 'HHT Purse (y3)')),

  calculatedColumn('totalEarning', 'Total Earning (Z)', totalEarning),

  columnGroup('Cashless Details (CD)',
    numberColumn('posAtCcc', 'POS at CCC (aa1)'), 
    numberColumn('staticQrAtCcc', 'Static QR at CCC (ac)'),
   
    numberColumn('upiAtTomCc', 'UPI at TOM/CC (aa2)'), 
    mirrorColumn('penaltyThroughHhtPurse', 'HHT Penalty Purse (af)','hhtPenaltyPurseAmount'), 
    mirrorColumn('parkingThroughHhtPurse', 'HHT Parking Purse (y3)','hhtParkingPurseAmount'),

  columnGroup('Surcharge Adjustment',
      mirrorColumn('surchargeThroughPurseAfc', 'Through Purse by AFC at CCC (ag)', 'surchargePurseAmount'),
      mirrorColumn('surchargeThroughPurseNcmc', 'Through purse in NCMC by AFC at CCC (ah)', 'ncmcPurseAmount'))),
    // columnGroup('Surcharge Adjustment', numberColumn('surchargeThroughPurseAfc', 'Through Purse by AFC at CCC (ag)'), numberColumn('surchargeThroughPurseNcmc', 'Through purse in NCMC by AFC at CCC (ah)'))),

  numberColumn('outsourceEarningAmount', 'Outsource Earning (OE)'),
  columnGroup('Outstanding Details',
    columnGroup('Current', numberColumn('outstandingCurrentAfc', 'AFC (aj)'), numberColumn('outstandingCurrentMisc', 'Misc (ak)'), numberColumn('tvmMutilatedFakeNotes', 'TVM Mutilated/Fake Notes')),
    columnGroup('Paid', numberColumn('outstandingPaidAfc', 'AFC (al)'), numberColumn('outstandingPaidMisc', 'Misc (am)'))),

  calculatedColumn('cashDepositedByOperator', 'Total Cash Deposited by Operator', cashDepositedByOperator),
];
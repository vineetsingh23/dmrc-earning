import type { RegisterRow } from './registerTypes';
import { calculatedColumn, columnGroup, numberColumn, sumOfFields, textColumn, type ColumnNode } from './earningColumns';
import { afcCollectionTotal } from './shiftEntrycolumns';
import { quantityAmountColumns,totalEarning, cashDepositedByOperator } from './shiftEntrycolumns';

// total AFC earning of the day = AFC collection of the shift sheet + every TVM sale and add value amount
// (the final row holds the totals of both sheets, so the shift formula works on it unchanged)
export const totalAfcEarning = (row: RegisterRow) =>
  afcCollectionTotal(row) + sumOfFields(row, 'tvmQrSaleAmount tvmAddValueAmount tvmNcmcAddValueAmount tvmRctmAddValueAmount');

export const finalEarningColumns: ColumnNode[] = [
  textColumn('finalRowLabel', 'Particulars'),
  columnGroup('QR Sale',
    columnGroup('QR Free Exit',numberColumn('qrFreeExit', 'Qry')),
    columnGroup('TOM QR Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('TVM QR Sale', numberColumn('tvmQrSaleQuantity', 'Qty'), numberColumn('tvmQrSaleAmount', 'Amt')),
    columnGroup('Paid Exit QR', numberColumn('paidExitQrQuantity', 'Qty'), numberColumn('paidExitQrAmount', 'Amt')),
    columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt'))),

  columnGroup('CSC Sale and Add Value',  
    columnGroup('CSC Sale', numberColumn('sv2SaleQuantity', 'SV2 Qty'), numberColumn('t1&t3SaleQuantity', 'T&T3 Qty'), numberColumn('totalSv2&T1&T3Amount', 'Total CSC Amount')),
  columnGroup('Add Value CSC',
    columnGroup('TOM', numberColumn('addValueSv2TomQuantity', 'Qty'), numberColumn('addValueSv2TomAmount', 'Amt')),
    columnGroup('TVM', numberColumn('tvmAddValueQuantity', 'Qty'), numberColumn('tvmAddValueAmount', 'Amt'))),
  
  columnGroup('Add Value NCMC',
    columnGroup('Add Value NCMC TOM', numberColumn('addValueNcmcTomQuantity', 'Qty'), numberColumn('addValueNcmcTomAmount', 'Amt')),
    columnGroup('Add Value NCMC TVM', numberColumn('tvmNcmcAddValueQuantity', 'Qty'), numberColumn('tvmNcmcAddValueAmount', 'Amt')),
    columnGroup('RCTM Add Value',  numberColumn('RctmAddValueQuantity', 'Qty'), numberColumn('RctmAddValueAmount', 'Amt')),
    columnGroup('Add Value Cancel', numberColumn('addValueCancelQuantity', 'Qty'), numberColumn('addValueCancelAmount', 'Amt')))),

  columnGroup('Surcharge',
    columnGroup('Surcharge by Cash/Cashless', numberColumn('surchargeByCashQuantity','Qty'), numberColumn('surchargeByCashAmount','Amt')),
    columnGroup('SV2 Surcharge by Purse', numberColumn('surchargeByPurseQuantity','Qty'), numberColumn('surchargeByPurseAmount','Amt')),
    columnGroup('NCMC Surcharge by Cash/Cashless', numberColumn('surchargeNcmcQuantity','Qty'), numberColumn('surchargeNcmcAmount','Amt')),
    columnGroup('NCMC Surcharge by Purse', numberColumn('surchargeNcmcByPurseQuantity','Qty'), numberColumn('surchargeNcmcByPurseAmount','Amt'))),
  
  calculatedColumn('totalAfcEarning', 'Total AFC earning', totalAfcEarning),

  columnGroup('Other Earning Details',
    columnGroup('EIB', numberColumn('eib','Amt')),

  columnGroup('Top-up in SV-4 Cards (o)', ...quantityAmountColumns('sv4TopUpQuantity', 'sv4TopUpAmount', 'o')),
  
    columnGroup('Refund Readable CSC (CR)', ...quantityAmountColumns('readableCscRefundQuantity', 'readableCscRefundAmount', 'r')),
    columnGroup('Manual Refund of Tour Card', ...quantityAmountColumns('tourCardRefundQuantity', 'tourCardRefundAmount', 's1')),
    columnGroup('Manual Refund of Security Deposit', ...quantityAmountColumns('securityDepositRefundQuantity', 'securityDepositRefundAmount', 's2')),
  
    columnGroup('Penalty',
      columnGroup('Manual Receipt Penalty', ...quantityAmountColumns('manualPenaltyQuantity', 'manualPenaltyAmount', 't')),
      columnGroup('HHT Penalty (Cash)', ...quantityAmountColumns('hhtPenaltyCashQuantity', 'hhtPenaltyCashAmount', 'u')),
      columnGroup('HHT Penalty (Purse)', ...quantityAmountColumns('hhtPenaltyPurseQuantity', 'hhtPenaltyPurseAmount', 'v'))),
  
    numberColumn('miscEarningAmount', 'Miscellaneous Earning (w)'),
    columnGroup('Manual Refund (if any) QR', ...quantityAmountColumns('manualQrRefundQuantity', 'manualQrRefundAmount', 'x')),
    columnGroup('Parking (Y)', numberColumn('parkingManualCash', 'Manual Cash (y1)'), numberColumn('parkingHhtCash', 'HHT Cash (y2)'), numberColumn('parkingHhtPurse', 'HHT Purse (y3)'))),
  
    calculatedColumn('totalEarning', 'Total Earning (Z)', totalEarning),
  
    columnGroup('Cashless Details (CD)',
      numberColumn('posAtCcc', 'POS at CCC (aa1)'), numberColumn('posAtTvm', 'POS at TVM (ab1)'), numberColumn('staticQrAtCcc', 'Static QR at CCC (ac)'),
      numberColumn('posAtRctm', 'POS at RCTM (ad)'), numberColumn('posAtScvm', 'POS at SCVM (ae)'), numberColumn('upiAtTvm', 'UPI at TVM (ab2)'),
      numberColumn('upiAtTomCc', 'UPI at TOM/CC (aa2)'), numberColumn('hhtPenaltyPurseCashless', 'HHT Penalty Purse (af)'), numberColumn('hhtParkingPurse', 'HHT Parking Purse (w4)'),
      columnGroup('Surcharge Adjustment', numberColumn('surchargeThroughPurseAfc', 'Through Purse by AFC at CCC (ag)'), numberColumn('surchargeThroughPurseNcmc', 'Through purse in NCMC by AFC at CCC (ah)'))),
  
    numberColumn('outsourceEarningAmount', 'Outsource Earning (OE)'),
    columnGroup('Outstanding Details',
      columnGroup('Current', numberColumn('outstandingCurrentAfc', 'AFC (aj)'), numberColumn('outstandingCurrentMisc', 'Misc (ak)'), numberColumn('tvmMutilatedFakeNotes', 'TVM Mutilated/Fake Notes')),
      columnGroup('Paid', numberColumn('outstandingPaidAfc', 'AFC (al)'), numberColumn('outstandingPaidMisc', 'Misc (am)'))),
  
  calculatedColumn('cashDepositedByOperator', 'Total Cash Deposited by Operator', cashDepositedByOperator),

  columnGroup('Cash position',
    numberColumn('previousDayCashOnHand', 'Previous day cash on hand'),
    numberColumn('totalCashToBank', 'Total cash to bank'),
    textColumn('bankSlipNumber', 'Bank slip no.'),
    numberColumn('todayCashOnHand', "Today's cash on hand")),
  
  
];

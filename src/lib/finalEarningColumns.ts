import type { RegisterRow } from './registerTypes';
import { calculatedColumn, columnGroup, numberColumn, sumOfFields, textColumn, type ColumnNode } from './earningColumns';
import { afcCollectionTotal, surchargeTotal } from './shiftEntrycolumns';

// total AFC earning of the day = AFC collection of the shift sheet + every TVM sale and add value amount
// (the final row holds the totals of both sheets, so the shift formula works on it unchanged)
export const totalAfcEarning = (row: RegisterRow) =>
  afcCollectionTotal(row) + sumOfFields(row, 'tvmQrSaleAmount tvmAddValueAmount tvmNcmcAddValueAmount tvmRctmAddValueAmount');

export const finalEarningColumns: ColumnNode[] = [
  textColumn('finalRowLabel', 'Particulars'),
  columnGroup('QR Sale',
    columnGroup('Shift QR Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('TVM QR Sale', numberColumn('tvmQrSaleQuantity', 'Qty'), numberColumn('tvmQrSaleAmount', 'Amt'))),
  columnGroup('Paid Exit QR', numberColumn('paidExitQrQuantity', 'Qty'), numberColumn('paidExitQrAmount', 'Amt')),
  columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt')),
  columnGroup('CSC Sale / Refund', numberColumn('cscSaleAmount', 'Sale Amt'), numberColumn('cscSaleCancelAmount', 'Cancel Amt'), numberColumn('cscRefundAmount', 'Refund Amt')),
  columnGroup('Add Value CSC',
    columnGroup('Shift SV2 TOM', numberColumn('addValueSv2TomQuantity', 'Qty'), numberColumn('addValueSv2TomAmount', 'Amt')),
    columnGroup('TVM', numberColumn('tvmAddValueQuantity', 'Qty'), numberColumn('tvmAddValueAmount', 'Amt'))),
  columnGroup('Add Value NCMC',
    columnGroup('Shift NCMC TOM', numberColumn('addValueNcmcTomQuantity', 'Qty'), numberColumn('addValueNcmcTomAmount', 'Amt')),
    columnGroup('TVM', numberColumn('tvmNcmcAddValueQuantity', 'Qty'), numberColumn('tvmNcmcAddValueAmount', 'Amt'))),
  columnGroup('RCTM Add Value', columnGroup('TVM', numberColumn('tvmRctmAddValueQuantity', 'Qty'), numberColumn('tvmRctmAddValueAmount', 'Amt'))),
  columnGroup('Add Value Cancel', numberColumn('addValueCancelQuantity', 'Qty'), numberColumn('addValueCancelAmount', 'Amt')),
  calculatedColumn('surchargeTotal', 'Surcharge', surchargeTotal),
  calculatedColumn('totalAfcEarning', 'Total AFC earning', totalAfcEarning),
];
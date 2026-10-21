import type { RegisterRow } from './registerTypes';

// "1,200" -> 1200, "" -> 0, "abc" -> 0
export const parseNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

// adds several fields of one row, e.g. sumOfFields(row, 'qrSaleAmount addValueAmount')
const sumOfFields = (row: RegisterRow, fieldKeys: string): number =>
  fieldKeys.split(' ').reduce((total, fieldKey) => total + parseNumber(row[fieldKey]), 0);

export interface ColumnLeaf {
  fieldKey: string;
  label: string;
  kind: 'text' | 'number' | 'calculated';
  formula?: (row: RegisterRow) => number;   // only calculated columns have one
}
export interface ColumnGroup { label: string; children: ColumnNode[] }
export type ColumnNode = ColumnLeaf | ColumnGroup;

export const isColumnGroup = (node: ColumnNode): node is ColumnGroup => 'children' in node;

// how many header rows a node needs: a plain column = 1, a group = 1 + its deepest child
export const columnDepth = (node: ColumnNode): number =>
  isColumnGroup(node) ? 1 + Math.max(...node.children.map(columnDepth)) : 1;

// the real data columns under a node
export const collectLeafColumns = (node: ColumnNode): ColumnLeaf[] =>
  isColumnGroup(node) ? node.children.flatMap(collectLeafColumns) : [node];

export const textColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'text' });
export const numberColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'number' });
export const calculatedColumn = (fieldKey: string, label: string, formula: (row: RegisterRow) => number): ColumnLeaf =>
  ({ fieldKey, label, kind: 'calculated', formula });
export const columnGroup = (label: string, ...children: ColumnNode[]): ColumnGroup => ({ label, children });

// formulas for the sample sheet
export const qrNetAmount = (row: RegisterRow) => 
  sumOfFields(row, 'qrSaleAmount qrPaidExitAmount') 
- sumOfFields(row, 'qrRefundAmount')

export const cardNetAmount = (row:RegisterRow) =>
  sumOfFields(row, 'sv2&TourTotalAmount addValueAmount ncmcAddValueAmount')
   - sumOfFields(row, 'tourRefundAmount')
export const surchargeAmount = (row: RegisterRow) => 
  sumOfFields(row,'surCashAmt surPurseAmt surNcmcPurseAmt')

export const totalEarningSample = (row: RegisterRow) => qrNetAmount(row) + cardNetAmount(row) + surchargeAmount(row);

export const sampleColumns: ColumnNode[] = [
  textColumn('operatorName', 'Name of Operator'),
  columnGroup('QR Tickets',
     columnGroup('QR Free Exit', numberColumn('qrFreeExitQuantity', 'Qty')),
    columnGroup('QR Tickets Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('QR Paid Exit', numberColumn('qrPaidExitQuantity', 'Qty'), numberColumn('qrPaidExitAmount', 'Amt')),
    columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt'))),
  columnGroup('Card Sale',
    columnGroup('SV2 Sale', numberColumn('sv2SaleQuantity', 'Qty')),
    columnGroup('T1 & T2 Sale', numberColumn('t1&t2Quantity', 'Qty'), numberColumn('sv2&TourTotalAmount', 'Amt')),
    columnGroup('T1 & T2 Refund', numberColumn('tourRefundQuantity', 'Qty'), numberColumn('tourRefundAmount', 'Amt')),
    columnGroup('Add Value', numberColumn('addValueQuantity', 'Qty'), numberColumn('addValueAmount', 'Amt')),
    columnGroup('NCMC Add Value', numberColumn('ncmcAddValueQuantity', 'Qty'), numberColumn('ncmcAddValueAmount', 'Amt'))),
  columnGroup('Surcharge',
    columnGroup('Surcharge By Cash/Cashless', numberColumn('surCashQty', 'Qty'), numberColumn('surCashAmt', 'Amt')),
    columnGroup('Surcharge By Purse', numberColumn('surPurseQty', 'Qty'), numberColumn('surPurseAmt', 'Amt')),
    columnGroup('NCMC Surcharge By Cash/Cashless', numberColumn('surNcmcCashQty', 'Qty'), numberColumn('surNcmcCashAmt', 'Amt')),
    columnGroup('Surcharge By NCMC Purse', numberColumn('surNcmcPurseQty', 'Qty'), numberColumn('surNcmcPurseAmt', 'Amt')),
  ),
   
  
  // calculatedColumn('qrNetAmount', 'QR net amount', qrNetAmount),
  calculatedColumn('totalEarning', 'Total AFC Earning', totalEarningSample),
];


// ---- TVM (ticket vending machine) earning sheet ----
// total = all four amounts; final total = total minus POS, UPI and outstanding (cash left in the machine)
export const tvmTotal = (row: RegisterRow) =>
  sumOfFields(row, 'tvmQrSaleAmount tvmAddValueAmount tvmNcmcAddValueAmount tvmRctmAddValueAmount');
export const tvmFinalTotal = (row: RegisterRow) =>
  tvmTotal(row) - sumOfFields(row, 'tvmPaymentByPos tvmPaymentByUpi tvmOutstandingCurrent');

export const tvmEarningColumns: ColumnNode[] = [
  textColumn('tvmNumber', 'TVM No.'),
  columnGroup('QR Sales', numberColumn('tvmQrSaleQuantity', 'Qty'), numberColumn('tvmQrSaleAmount', 'Amount')),
  columnGroup('Add Value', numberColumn('tvmAddValueQuantity', 'Qty'), numberColumn('tvmAddValueAmount', 'Amount')),
  columnGroup('Add Value NCMC', numberColumn('tvmNcmcAddValueQuantity', 'Qty'), numberColumn('tvmNcmcAddValueAmount', 'Amount')),
  columnGroup('RCTM Add Value', numberColumn('tvmRctmAddValueQuantity', 'Qty'), numberColumn('tvmRctmAddValueAmount', 'Amount')),
  calculatedColumn('tvmTotal', 'Total', tvmTotal),
  columnGroup('Cashless Transaction', numberColumn('tvmPaymentByPos', 'Payment by POS'), numberColumn('tvmPaymentByUpi', 'Payment by UPI')),
  numberColumn('tvmOutstandingCurrent', 'Outstanding (current)'),
  calculatedColumn('tvmFinalTotal', 'Final Total', tvmFinalTotal),
];

export const totalAfcEarning =(row: RegisterRow) => 
  sumOfFields(row,'tvmFinalTotal totalEarning')

export const finalEarningColumns:ColumnNode[] = [
  textColumn('finalRowLabel','Grand Total'),
 
  columnGroup('QR Tickets',
     columnGroup('QR Free Exit', numberColumn('qrFreeExitQuantity', 'Qty')),
    columnGroup('QR Tickets Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('QR Tickets Sale (TVM) ', numberColumn('tvmQrSaleQuantity', 'Qty'), numberColumn('tvmQrSaleAmount', 'Amt')),
    columnGroup('QR Paid Exit', numberColumn('qrPaidExitQuantity', 'Qty'), numberColumn('qrPaidExitAmount', 'Amt')),
    columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt'))),
  columnGroup('Card Sale',
    columnGroup('SV2 Sale', numberColumn('sv2SaleQuantity', 'Qty')),
    columnGroup('T1 & T2 Sale', numberColumn('t1&t2Quantity', 'Qty'), numberColumn('sv2&TourTotalAmount', 'Amt')),
    columnGroup('T1 & T2 Refund', numberColumn('tourRefundQuantity', 'Qty'), numberColumn('tourRefundAmount', 'Amt')),
    columnGroup('Add Value', numberColumn('addValueQuantity', 'Qty'), numberColumn('addValueAmount', 'Amt')),
    columnGroup('NCMC Add Value', numberColumn('ncmcAddValueQuantity', 'Qty'), numberColumn('ncmcAddValueAmount', 'Amt'))),
  columnGroup('Surcharge',
    columnGroup('Surcharge By Cash/Cashless', numberColumn('surCashQty', 'Qty'), numberColumn('surCashAmt', 'Amt')),
    columnGroup('Surcharge By Purse', numberColumn('surPurseQty', 'Qty'), numberColumn('surPurseAmt', 'Amt')),
    columnGroup('NCMC Surcharge By Cash/Cashless', numberColumn('surNcmcCashQty', 'Qty'), numberColumn('surNcmcCashAmt', 'Amt')),
    columnGroup('Surcharge By NCMC Purse', numberColumn('surNcmcPurseQty', 'Qty'), numberColumn('surNcmcPurseAmt', 'Amt')),
  ),
   

]
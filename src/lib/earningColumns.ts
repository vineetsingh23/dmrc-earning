import type { RegisterRow } from "./registerTypes";

export const parseNumber = (value:unknown):number => {
    const parsed = parseFloat (String(value ?? '').replace(/[^0-9.\-]/g,''));
    return Number.isNaN(parsed) ? 0 :parsed;
}

const sumOfFields = (row:RegisterRow,fieldKeys:string):number => 
    fieldKeys.split(' ').reduce((total,fieldKey) => total + parseNumber(row[fieldKey]),0);

export const ticketSaleNet = (row:RegisterRow) =>
    sumOfFields(row, 'qr paidExit')
    -sumOfFields (row, 'qrRefund');

export const cscSaleNet = (row:RegisterRow) =>
    sumOfFields(row, 'cscSale t1t2Sale addValueSv2 addValueNcmc ')
    -sumOfFields(row, 'cscRefund');

export const surNet = (row:RegisterRow) =>
    sumOfFields(row, 'surCash surNcmc surPurseSv2 surPurseNcmc')

export const afcCollectionTotal =(row:RegisterRow) => ticketSaleNet(row) + cscSaleNet(row) + surNet(row);

export const manualRefund = (row:RegisterRow) => sumOfFields(row, 'okMr okTour okUrc qrMr');

export const penalty = (row:RegisterRow) => sumOfFields(row, 'penaltyManual penaltyHht penaltyCash')

export const miscEarning = (row:RegisterRow) => sumOfFields(row, 'eib sv4  miscEarning parkingCash parkingHht parkingPurse')


export const totalEarning = (row:RegisterRow) =>
     afcCollectionTotal(row) - manualRefund(row) 
    + penalty(row) + miscEarning(row)



export const cashlessEarning = (row:RegisterRow) =>
    sumOfFields(row, 'hdfcPos tomUpi PenaltyHht parkingHht parkingPurse surPurseSv2 surPurseNcmc');

export const outstanding = (row:RegisterRow) => sumOfFields(row, 'afcPaid miscPaid') - sumOfFields(row, 'afc misc tvm')

export const totalCashDeposited =(row:RegisterRow) =>
    totalEarning(row) - cashlessEarning(row) + outstanding(row)


// Defining table structure

export interface ColumnLeaf {fieldKey:string; label:string; kind:'text' | 'number'}
export interface ColumnGroup { label: string; children: ColumnNode[] }
export type ColumnNode = ColumnLeaf | ColumnGroup;

export const isColumnGroup = (node: ColumnNode): node is ColumnGroup => 'children' in node;

// how many header rows this node needs: a plain column = 1, a group = 1 + its deepest child
export const columnDepth = (node: ColumnNode): number =>
  isColumnGroup(node) ? 1 + Math.max(...node.children.map(columnDepth)) : 1;

// the real data columns under a node (groups only hold other columns)
export const collectLeafColumns = (node: ColumnNode): ColumnLeaf[] =>
  isColumnGroup(node) ? node.children.flatMap(collectLeafColumns) : [node];

export const textColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'text' });
export const numberColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'number' });
export const columnGroup = (label: string, ...children: ColumnNode[]): ColumnGroup => ({ label, children });

export const sampleColumns: ColumnNode[] = [
  textColumn('operatorName', 'Name of Operator'),
  columnGroup('QR Tickets',
    columnGroup('QR Tickets Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt'))),
  columnGroup('Card Sales',
    columnGroup( 'SV2',numberColumn('sv2Quantity','Qty'),numberColumn('sv2Amount','Amt')),
    columnGroup( 'Tour',numberColumn('tourQuantity','Qty'),numberColumn('tourAmount','Amt')),
    columnGroup( 'Tour Refund',numberColumn('tourRefundQuantity','Qty'),numberColumn('tourRefundAmount','Amt'))),
columnGroup('Add Value',
    columnGroup('SV2',numberColumn('sv2Quantity','Qty'),numberColumn('sv2AddValueAmount','Amt')),
)

    // ) numberColumn('addValueQuantity', 'Qty'), numberColumn('addValueAmount', 'Amt')),
];
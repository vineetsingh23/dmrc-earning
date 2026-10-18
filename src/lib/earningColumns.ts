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
export const qrNetAmount = (row: RegisterRow) => sumOfFields(row, 'qrSaleAmount') - sumOfFields(row, 'qrRefundAmount');
export const totalEarningSample = (row: RegisterRow) => qrNetAmount(row) + sumOfFields(row, 'addValueAmount');

export const sampleColumns: ColumnNode[] = [
  textColumn('operatorName', 'Name of Operator'),
  columnGroup('QR Tickets',
    columnGroup('QR Tickets Sale', numberColumn('qrSaleQuantity', 'Qty'), numberColumn('qrSaleAmount', 'Amt')),
    columnGroup('QR Refund', numberColumn('qrRefundQuantity', 'Qty'), numberColumn('qrRefundAmount', 'Amt'))),
  columnGroup('Add Value', numberColumn('addValueQuantity', 'Qty'), numberColumn('addValueAmount', 'Amt')),
  calculatedColumn('qrNetAmount', 'QR net amount', qrNetAmount),
  calculatedColumn('totalEarning', 'Total Earning', totalEarningSample),
];
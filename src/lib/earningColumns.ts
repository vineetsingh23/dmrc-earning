import type { RegisterRow } from './registerTypes';

// "1,200" -> 1200, "" -> 0, "abc" -> 0
export const parseNumber = (value: unknown): number => {
  const parsed = parseFloat(String(value ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
};

// adds several fields of one row, e.g. sumOfFields(row, 'qrSaleAmount addValueAmount')
export const sumOfFields = (row: RegisterRow, fieldKeys: string): number =>
  fieldKeys.split(' ').reduce((total, fieldKey) => total + parseNumber(row[fieldKey]), 0);

export interface ColumnLeaf {
  fieldKey: string;
  label: string;
  kind: 'text' | 'number' | 'calculated' | 'mirror';
  formula?: (row: RegisterRow) => number;   // only calculated columns have one
  sourceFieldKey?: string;
}
export interface ColumnGroup { label: string; children: ColumnNode[] }
export type ColumnNode = ColumnLeaf | ColumnGroup;

export const isColumnGroup = (node: ColumnNode): node is ColumnGroup => 'children' in node;

// how many header rows a node needs: a plain column = 1, a group = 1 + its deepest child
export const columnDepth = (node: ColumnNode): number =>
  isColumnGroup(node) ? 1 + Math.max(...node.children.map(columnDepth)) : 1;
// a read-only cell that shows the value typed in another column of the same row
export const mirrorColumn = (fieldKey: string, label: string, sourceFieldKey: string): ColumnLeaf =>
  ({ fieldKey, label, kind: 'mirror', sourceFieldKey });

// the real data columns under a node
export const collectLeafColumns = (node: ColumnNode): ColumnLeaf[] =>
  isColumnGroup(node) ? node.children.flatMap(collectLeafColumns) : [node];

export const textColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'text' });
export const numberColumn = (fieldKey: string, label: string): ColumnLeaf => ({ fieldKey, label, kind: 'number' });
export const calculatedColumn = (fieldKey: string, label: string, formula: (row: RegisterRow) => number): ColumnLeaf =>
  ({ fieldKey, label, kind: 'calculated', formula });
export const columnGroup = (label: string, ...children: ColumnNode[]): ColumnGroup => ({ label, children });
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


export interface StationFacilities { hasSv4Recharge: boolean; hasParking: boolean }

// stations without SV-4 recharge or parking do not show those columns
export const filterByFacilities = (columns: ColumnNode[], facilities: StationFacilities): ColumnNode[] => {
  const hiddenLabels = [
    ...(facilities.hasSv4Recharge ? [] : ['Top-up in SV-4 Cards (o)']),
    ...(facilities.hasParking ? [] : ['Parking (Y)', 'HHT Parking Purse (w4)']),
  ];
  const keepVisible = (nodes: ColumnNode[]): ColumnNode[] =>
    nodes
      .filter(node => !hiddenLabels.includes(node.label))
      .map(node => (isColumnGroup(node) ? { ...node, children: keepVisible(node.children) } : node));
  return keepVisible(columns);
};


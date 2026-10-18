import { parseNumber, type ColumnLeaf } from './earningColumns';

export const formatRupees = (amount: unknown) => '₹' + Math.round(parseNumber(amount)).toLocaleString('en-IN');

// quantity columns show plain numbers, amounts show rupees
export const formatCellValue = (column: ColumnLeaf, value: number) =>
  /Qty/.test(column.label) ? String(value) : formatRupees(value);
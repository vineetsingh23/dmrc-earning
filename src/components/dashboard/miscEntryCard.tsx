import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { tableCellClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass } from '../../globalStyles';

interface MiscEntryCardProps {
  title: string;
  kind: MiscKind;
  rows: string[][];                 // [rowIndex][columnIndex] as stored: date, name, amount, remark
  tillDateTotal: number;
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
}

const miscRowCount = 12;


export default function MiscEntryCard({ title, kind, rows, tillDateTotal, onCellChange }: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, miscRowCount);
  const amountTotal = rows.reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (rowIndex: number, columnIndex: number, minWidthClass: string, isNumber = false) => (
    <td className={tableRowClass}>
      <input
        data-grid={kind} data-row={rowIndex} data-column={columnIndex}
        value={rows[rowIndex]?.[columnIndex] ?? ''} inputMode={isNumber ? 'decimal' : 'text'}
        onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
        className={`${tableInputClass} ${minWidthClass} ${isNumber ? 'text-right' : ''}`}
      />
    </td>
  );

  return (
    <div className="overflow-auto rounded-2xl border border-bd bg-card p-4 shadow-sm" onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">{title}</h2>
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>Date</th>
            <th className={tableHeaderCellClass}>Equipment or Person name</th>
            <th className={tableHeaderCellClass}>Amount</th>
            <th className={tableHeaderCellClass}>Total Amount</th>
            <th className={tableHeaderCellClass}>Remark</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: miscRowCount }, (_, rowIndex) => (
            <tr key={rowIndex} className={tableRowClass}>
              {typedCell(rowIndex, miscColumnIndex.date, 'min-w-[95px]')}
              {typedCell(rowIndex, miscColumnIndex.name, 'min-w-[150px]')}
              {typedCell(rowIndex, miscColumnIndex.amount, 'min-w-[80px]', true)}
              <td className={tableCellClass}>
                {runningTotals[rowIndex] === null ? '' : formatRupees(runningTotals[rowIndex])}
              </td>
              {typedCell(rowIndex, miscColumnIndex.remark, 'min-w-[150px]')}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={tableTotalCellClass} colSpan={2}>Total</td>
            <td className={tableTotalCellClass}>{formatRupees(amountTotal)}</td>
            <td className={tableTotalCellClass}>{formatRupees(amountTotal)}</td>
            <td className={tableTotalCellClass}>-</td>
            <td className="border border-bl font-bold" />
          </tr>
        </tfoot>
      </table>
      <small className="mt-1 block text-mu">Till this date: {formatRupees(tillDateTotal)} (counted in cash possession)</small>
    </div>
  );
}
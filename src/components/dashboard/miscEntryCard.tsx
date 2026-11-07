import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { entryCountsOnDate, miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';

interface MiscEntryCardProps {
  title: string;
  kind: MiscKind;
  rows: string[][];                 // every entry of the ledger: date, name, amount, remark
  rowCount: number;
  selectedDate: string;
  countedTotal: number;             // the part counted in cash possession on the selected date
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
  onAddRow: () => void;
}



export default function MiscEntryCard({ title, kind, rows, rowCount, selectedDate, countedTotal, onCellChange, onAddRow }: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, rowCount);
  const amountTotal = rows.reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (rowIndex: number, columnIndex: number, minWidthClass: string, isNumber = false) => (
    <td className="border border-bl p-0">
      <input
        data-grid={kind} data-row={rowIndex} data-column={columnIndex}
        value={rows[rowIndex]?.[columnIndex] ?? ''} inputMode={isNumber ? 'decimal' : 'text'}
        onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
        className={`input-cells ${minWidthClass} ${isNumber ? 'text-right' : ''}`}
      />
    </td>
  );

  return (
        <div className="card" onKeyDown={handleSheetKeyDown}>
    <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <button type="button" onClick={onAddRow}
          className="button-outline">+ Add row</button>
      </div>
      <table className="table">
        <thead className='table-header'>
          <tr className='table-header-row'>
            <th className='table-header-cells'>Date</th>
            <th className='table-header-cells'>Equipment or Person name</th>
            <th className='table-header-cells'>Amount</th>
            <th className='table-header-cells'>Total Amount</th>
            <th className='table-header-cells'>Remark</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            // an entry dated after the selected date is shown dimmed and is not counted in cash possession yet
            <tr key={rowIndex} className={`${miscColumnIndex.amount ? 'table-rows' : ''} ${entryCountsOnDate(rows[rowIndex], selectedDate) ? '' : 'opacity-50'}`}>
              {typedCell(rowIndex, miscColumnIndex.date, 'table-cells min-w-25')}
              {typedCell(rowIndex, miscColumnIndex.name, 'table-cells min-w-50')}
              {typedCell(rowIndex, miscColumnIndex.amount, 'table-cells min-w-30', true)}
              <td className={`${runningTotals[rowIndex]=== null ? 'table-cells' : ''} total-cells`}>
                {runningTotals[rowIndex] === null ? '' : formatRupees(runningTotals[rowIndex])}
              </td>
              {typedCell(rowIndex, miscColumnIndex.remark, 'table-cells min-w-35')}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="table-footer">
            <td className="footer-cells text-center" colSpan={2}>Total</td>
            <td className="footer-cells">{formatRupees(amountTotal)}</td>
            <td className="footer-cells">{formatRupees(amountTotal)}</td>
            <td className="footer-cells" />
          </tr>
        </tfoot>
      </table>
      <small className="mt-1 block text-mu">Counted in cash possession up to this date: {formatRupees(countedTotal)}</small>
    </div>
  );
}
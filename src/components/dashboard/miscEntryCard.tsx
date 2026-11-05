import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { entryCountsOnDate, miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass,cardHeadingClass,tableCellLeftClass,tableClass, tableHeaderCellClass,tableHeaderRowClass, tableTotalCellClass, tableTotalRowClass } from '../../globalStyles';

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

const inputClass = 'w-full bg-transparent  text-sm outline-hidden focus:bg-card focus:ring-2 focus:ring-ac';

export default function MiscEntryCard({ title, kind, rows, rowCount, selectedDate, countedTotal, onCellChange, onAddRow }: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, rowCount);
  const amountTotal = rows.reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (rowIndex: number, columnIndex: number, minWidthClass: string, isNumber = false) => (
    <td className="table-rows">
      <input
        data-grid={kind} data-row={rowIndex} data-column={columnIndex}
        value={rows[rowIndex]?.[columnIndex] ?? ''} inputMode={isNumber ? 'decimal' : 'text'}
        onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
        className={`table-input-cell ${minWidthClass} ${isNumber ? 'text-right' : ''}`}
      />
    </td>
  );
  const headers = ['Date', 'Equipment or Person Name', 'Amount' , 'Total Amount',' Remarks']
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className={cardHeadingClass}>{title}</h2>
        <button type="button" onClick={onAddRow}
          className="rounded-md border border-slate-300 bg-linear-to-bl from-slate-200 to-pink-200 px-3 py-1 text-xs font-medium transition hover:-translate-y-0.5 hover:border-green-300 hover:text-green-600">+ Add row</button>
      </div>
      <table className='table'>
        <thead>
          <tr className='table-header'>
          {headers.map((header)=> (

              <th key={header} className='table-header-cell'>{header}</th>
            ))}
            </tr>
      
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            // an entry dated after the selected date is shown dimmed and is not counted in cash possession yet
            <tr key={rowIndex} className={`table-rows even:bg-slate-200 hover:bg-slate-300/50 ${entryCountsOnDate(rows[rowIndex], selectedDate) ? '' : 'opacity-20'}`}>
              {typedCell(rowIndex, miscColumnIndex.date, 'min-w-20')}
              {typedCell(rowIndex, miscColumnIndex.name, 'min-w-40')}
              {typedCell(rowIndex, miscColumnIndex.amount, 'min-w-20', true)}
              <td className="table-cells">
                {runningTotals[rowIndex] === null ? '' : formatRupees(runningTotals[rowIndex])}
              </td>
              {typedCell(rowIndex, miscColumnIndex.remark, 'min-w-[150px]')}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className='table-footer'>
            <td className='table-footer-cell' colSpan={2}>Total</td>
            <td className='table-footer-cell'>{formatRupees(amountTotal)}</td>
            <td className='table-footer-cell'>{formatRupees(amountTotal)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <small className="mt-1 block text-mu">Counted in cash possession up to this date: {formatRupees(countedTotal)}</small>
    </div>
  );
}
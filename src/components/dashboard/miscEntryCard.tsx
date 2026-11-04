import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { entryCountsOnDate, miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass,cardHeadingClass,tableClass, tableHeaderCellClass,tableHeaderRowClass } from '../../globalStyles';

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

const inputClass = 'w-full bg-transparent p-1.5 text-sm outline-hidden focus:bg-card focus:ring-2 focus:ring-ac';

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
        className={`${inputClass} ${minWidthClass} ${isNumber ? 'text-right' : ''}`}
      />
    </td>
  );
  const headers = ['Date', 'Equipment or Person Name', 'Amount' , 'Total Amount',' Remarks']
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className={cardHeadingClass}>{title}</h2>
        <button type="button" onClick={onAddRow}
          className="rounded-xl border border-bd bg-card px-3 py-1 text-sm font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac">+ Add row</button>
      </div>
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
          {headers.map((header)=> (

              <th key={header} className={tableHeaderCellClass}>{header}</th>
            ))}
            </tr>
      
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            // an entry dated after the selected date is shown dimmed and is not counted in cash possession yet
            <tr key={rowIndex} className={`even:bg-tz ${entryCountsOnDate(rows[rowIndex], selectedDate) ? '' : 'opacity-20'}`}>
              {typedCell(rowIndex, miscColumnIndex.date, 'min-w-[95px]')}
              {typedCell(rowIndex, miscColumnIndex.name, 'min-w-[150px]')}
              {typedCell(rowIndex, miscColumnIndex.amount, 'min-w-[80px]', true)}
              <td className="border border-bl px-2 py-1 text-right text-xs">
                {runningTotals[rowIndex] === null ? '' : formatRupees(runningTotals[rowIndex])}
              </td>
              {typedCell(rowIndex, miscColumnIndex.remark, 'min-w-[150px]')}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-ca font-bold">
            <td className="border border-bl px-2 py-4 text-sm" colSpan={2}>Total</td>
            <td className="border border-bl px-2 py-4 text-right text-sm">{formatRupees(amountTotal)}</td>
            <td className="border border-bl px-2 py-4 text-right text-sm">{formatRupees(amountTotal)}</td>
            <td className="border border-bl" />
          </tr>
        </tfoot>
      </table>
      <small className="mt-1 block text-mu">Counted in cash possession up to this date: {formatRupees(countedTotal)}</small>
    </div>
  );
}
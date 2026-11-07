import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { entryCountsOnDate, miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass, cardHeadingClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableTotalCellClass, tableTotalRowClass } from '../../globalStyles';

interface MiscEntryCardProps {
  title: string;
  kind: MiscKind;
  rows: string[][];               // every entry of the ledger: date, name, amount, remark
  rowCount: number;
  selectedDate: string;
  countedTotal: number;           // the part counted in cash possession on the selected date
  onCellChange: (rowIndex: number, columnIndex: number, newValue: string) => void;
  onAddRow: () => void;
}

<<<<<<< HEAD
=======


>>>>>>> b54df80c2023db7c1c8b88aa2cd01de86adeb075
export default function MiscEntryCard({ title, kind, rows, rowCount, selectedDate, countedTotal, onCellChange, onAddRow }: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, rowCount);
  const amountTotal = rows.reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (rowIndex: number, columnIndex: number, minWidthClass: string, isNumber = false) => (
    <td className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
      <input
        data-grid={kind} data-row={rowIndex} data-column={columnIndex}
        value={rows[rowIndex]?.[columnIndex] ?? ''} inputMode={isNumber ? 'decimal' : 'text'}
        onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
<<<<<<< HEAD
        className={`w-full rounded bg-transparent px-1.5 py-1 text-sm text-tx outline-none transition-all placeholder:text-mu focus:bg-card focus:ring-2 focus:ring-ac ${minWidthClass} ${isNumber ? 'text-right font-mono' : ''}`}
=======
        className={`input-cells ${minWidthClass} ${isNumber ? 'text-right' : ''}`}
>>>>>>> b54df80c2023db7c1c8b88aa2cd01de86adeb075
      />
    </td>
  );

  const headers = ['Date', 'Equipment or Person Name', 'Amount', 'Total Amount', 'Remarks'];

  return (
<<<<<<< HEAD
    <div className={`${cardClass} relative overflow-hidden`} onKeyDown={handleSheetKeyDown}>

      {/* DMRC Corporate Branding Accent Top Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-blue-900"></div>

      {/* Card Header */}
      <div className="mb-4 flex items-center justify-between border-b border-bd bg-inp/70 px-6 pb-2 pt-5">
        <h2 className={`${cardHeadingClass} text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2`}>
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          {title}
        </h2>
        <button
          type="button"
          onClick={onAddRow}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:shadow"
        >
          <span className="text-sm font-bold text-red-600 dark:text-red-400">+</span> Add row
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto px-2 pb-2">
        <table className={tableClass || 'w-full text-left border-collapse text-sm'}>
          <thead>
            <tr className={tableHeaderRowClass || 'bg-ac2 text-white uppercase tracking-wider text-xs'}>
              {headers.map((header) => (
                <th key={header} className={tableHeaderCellClass || 'bg-ac2 px-4 py-3 font-semibold text-white text-nowrap'}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const isCounted = entryCountsOnDate(rows[rowIndex], selectedDate);
              return (
                <tr
                  key={rowIndex}
                  className={`transition-colors even:bg-table-row-alt hover:bg-table-hover ${isCounted ? '' : 'bg-inp opacity-50'}`}
                >
                  {typedCell(rowIndex, miscColumnIndex.date, 'min-w-28')}
                  {typedCell(rowIndex, miscColumnIndex.name, 'min-w-44')}
                  {typedCell(rowIndex, miscColumnIndex.amount, 'min-w-24', true)}
                  <td className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 text-right font-mono">
                    {runningTotals[rowIndex] === null ? '—' : formatRupees(runningTotals[rowIndex])}
                  </td>
                  {typedCell(rowIndex, miscColumnIndex.remark, 'min-w-[150px]')}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass || 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-semibold border-t-2 border-slate-200 dark:border-slate-800'}>
              <td className={tableTotalCellClass || 'px-4 py-3'} colSpan={2}>Total</td>
              <td className={`${tableTotalCellClass || 'px-4 py-3'} text-right font-mono`}>{formatRupees(amountTotal)}</td>
              <td className={`${tableTotalCellClass || 'px-4 py-3'} text-right font-mono`}>{formatRupees(amountTotal)}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer Info Notice */}
      <div className="mt-2 flex items-center justify-between border-t border-bd bg-inp/70 px-6 py-3 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Counted in cash possession up to this date: <span className="font-mono font-semibold text-tx">{formatRupees(countedTotal)}</span>
        </span>
      </div>

=======
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
>>>>>>> b54df80c2023db7c1c8b88aa2cd01de86adeb075
    </div>
  );
}
import { formatRupees } from '../../lib/earningCalculations';
import { parseNumber } from '../../lib/earningColumns';
import { entryCountsOnDate, miscColumnIndex, runningTotalsOfRows, type MiscKind } from '../../lib/miscEntries';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardButtonClass, cardClass, cardHeaderClass, cardHeadingClass, tableCellClass, tableClass, tableHeaderCellClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass, tableWrapperClass } from '../../globalStyles';

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

export default function MiscEntryCard({ title, kind, rows, rowCount, selectedDate, countedTotal, onCellChange, onAddRow }: MiscEntryCardProps) {
  const runningTotals = runningTotalsOfRows(rows, rowCount);
  const amountTotal = rows.reduce((total, row) => total + parseNumber(row?.[miscColumnIndex.amount]), 0);

  // one typed cell; the data-* labels are what the arrow keys use to find the next cell
  const typedCell = (rowIndex: number, columnIndex: number, minWidthClass: string, isNumber = false) => (
    <td className={`${tableCellClass} ${minWidthClass} px-3 py-2 text-left`}>
      <input
        data-grid={kind} data-row={rowIndex} data-column={columnIndex}
        value={rows[rowIndex]?.[columnIndex] ?? ''} inputMode={isNumber ? 'decimal' : 'text'}
        onFocus={event => event.target.select()} onChange={event => onCellChange(rowIndex, columnIndex, event.target.value)}
        className={`${tableInputClass} ${isNumber ? 'text-right font-mono' : ''}`}
      />
    </td>
  );

  const headers = ['Date', 'Equipment or Person Name', 'Amount', 'Total Amount', 'Remarks'];

  return (
    <div className={`${cardClass}`} onKeyDown={handleSheetKeyDown}>

      {/* DMRC Corporate Branding Accent Top Bar */}
      {/* <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-blue-900 rounded-2xl"></div> */}

      {/* Card Header */}
      <div className={cardHeaderClass}>
        <h2 className={cardHeadingClass}>
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          {title}
        </h2>
        <button
          type="button"
          onClick={onAddRow}
          className={cardButtonClass}
        >
          <span className="text-sm font-bold text-red-600 dark:text-red-400">+</span> Add row
        </button>
      </div>

      {/* Table Section */}
      <div className={tableWrapperClass}>
        <table className={tableClass}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className={tableHeaderCellClass}>
                  
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const isCounted = entryCountsOnDate(rows[rowIndex], selectedDate);
              return (
                <tr
                  key={rowIndex}
                  className={`${tableRowClass}${isCounted ? '' : 'bg-inp opacity-50'}`}
                >
                  {typedCell(rowIndex, miscColumnIndex.date, 'min-w-28')}
                  {typedCell(rowIndex, miscColumnIndex.name, 'min-w-44')}
                  {typedCell(rowIndex, miscColumnIndex.amount, 'min-w-24', true)}
                  <td className={tableCellClass}>
                    {runningTotals[rowIndex] === null ? '—' : formatRupees(runningTotals[rowIndex])}
                  </td>
                  {typedCell(rowIndex, miscColumnIndex.remark, 'min-w-[150px]')}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td className={tableTotalCellClass || 'px-4 py-3'} colSpan={2}>Total</td>
              <td className={`${tableTotalCellClass || 'px-4 py-3'} text-right font-mono`}>{formatRupees(amountTotal)}</td>
              <td className={`${tableTotalCellClass || 'px-4 py-3'} text-right font-mono`}>{formatRupees(amountTotal)}</td>
              <td className={tableTotalCellClass}/>
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

    </div>
  );
}
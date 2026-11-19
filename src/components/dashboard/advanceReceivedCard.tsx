import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass,cardHeaderClass,cardHeadingClass,primaryButtonClass,tableCellClass, tableCellLeftClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass, tableWrapperClass } from '../../globalStyles';

interface AdvanceReceivedCardProps {
  listRows: string[][];                                           // [rowIndex][columnIndex]; advance received is column 1
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
  onTomNumberChange: (rowIndex: number, typedValue: string) => void;
  onAddRow: () => void;
}
const advanceColumnIndex = 1;

// advance received back from each TOM operator
export default function AdvanceReceivedCard({ listRows, onAdvanceChange, onTomNumberChange, onAddRow }: AdvanceReceivedCardProps) {
  const totalAdvanceReceived = listRows.reduce((total, row) => total + parseNumber(row[advanceColumnIndex]), 0);
  const rowCount = Math.max(tomOperators.length, listRows.length);

  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className={cardHeaderClass}>

      <h2 className={cardHeadingClass}>Advance received from each TOM</h2>
      </div>
    
        <div className={tableWrapperClass}>

      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>TOM No.</th>
            <th className={tableHeaderCellClass}>Advance received</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => {
            const tomOperator = tomOperators[rowIndex];
            const rowLabel = tomOperator?.tomNumber
              ?? listRows[rowIndex]?.[0]
              ?? `Additional ${rowIndex - tomOperators.length + 1}`;
            return (
              <tr key={tomOperator?.tomNumber ?? `additional-${rowIndex}`} className={tableRowClass}>
                <td className={`${tableCellLeftClass} text-center! min-w-40`}>
                  {tomOperator ? rowLabel : (
                    <input data-grid="advanceReceived" data-row={rowIndex} data-column={0}
                      value={listRows[rowIndex]?.[0] ?? rowLabel} placeholder="TOM No."
                      onFocus={event => event.target.select()} onChange={event => onTomNumberChange(rowIndex, event.target.value)}
                      className={`${tableInputClass} min-w-20 !px-0 !py-0 !text-center !text-xs !font-medium`} />
                  )}
                </td>
                <td className={tableCellClass}>
                  <input data-grid="advanceReceived" data-row={rowIndex} data-column={tomOperator ? 0 : 1}
                    value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                    onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                    className={`${tableInputClass} min-w-20 text-right`} />
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableCellLeftClass} font-bold!`}>Total</td>
            <td className={tableTotalCellClass}>{formatRupees(totalAdvanceReceived)}</td></tr>
        </tfoot>
      </table>
                  </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={onAddRow} className={primaryButtonClass}>+ Add row</button>
      </div>
      </div>

  );
}
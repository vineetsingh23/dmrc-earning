import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass,tableCellClass, tableCellLeftClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass } from '../../globalStyles';

interface AdvanceReceivedCardProps {
  listRows: string[][];                                           // [rowIndex][columnIndex]; advance received is column 1
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
}
const advanceColumnIndex = 1;

// advance received back from each TOM operator
export default function AdvanceReceivedCard({ listRows, onAdvanceChange }: AdvanceReceivedCardProps) {
  const totalAdvanceReceived = tomOperators.reduce((total, _tomOperator, rowIndex) => total + parseNumber(listRows[rowIndex]?.[advanceColumnIndex]), 0);

  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">Advance received from each TOM</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={tableHeaderCellClass}>TOM No.</th>
            <th className={tableHeaderCellClass}>Advance received</th>
          </tr>
        </thead>
        <tbody className={tableClass}>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className={tableRowClass}>
              <td className={`${tableCellLeftClass} text-center! min-w-40`}>{tomOperator.tomNumber}</td>
              <td className={tableCellClass}>
                <input data-grid="advanceReceived" data-row={rowIndex} data-column={0}
                  value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                  onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                  className={`${tableInputClass} min-w-20 text-right`} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableTotalCellClass} text-left!`}>Total</td>
            <td className={tableTotalCellClass}>{formatRupees(totalAdvanceReceived)}</td></tr>
        </tfoot>
      </table>
    </div>
  );
}
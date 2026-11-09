import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass,cardHeaderClass,cardHeadingClass,tableCellClass, tableCellLeftClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass } from '../../globalStyles';

interface ImprestIssueCardProps {
  listRows: string[][];                                           // [rowIndex][columnIndex]; advance issued is column 2
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
}
const advanceColumnIndex = 2;

// imprest issued to each TOM: fixed imprest, advance issued typed, total issued = imprest + advance
export default function ImprestIssueCard({ listRows, onAdvanceChange }: ImprestIssueCardProps) {
  const advanceOfRow = (rowIndex: number) => parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
  const totalImprestAmount = tomOperators.reduce((total, tomOperator) => total + tomOperator.imprestAmount, 0);
  const totalAdvanceAmount = tomOperators.reduce((total, _tomOperator, rowIndex) => total + advanceOfRow(rowIndex), 0);
  // const cellClass = 'border border-bl px-2 py-1 text-right text-sm';
  // const headerClass = 'border border-bl bg-ca px-2 py-1 text-xs';
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <h2 className={cardHeadingClass}>Imprest & advance issued to each TOM</h2>
      <div className="overflow-x-auto">
      <table className={tableClass}>
        <thead>
          <tr className={tableHeaderRowClass}>
            <th className={`${tableHeaderCellClass} min-w-20`}>TOM No.</th><th className={`${tableHeaderCellClass} min-w-40`}>Imprest</th>
            <th className={tableHeaderCellClass}>Advance</th><th className={tableHeaderCellClass}>Total</th>
          </tr>
        </thead>
        <tbody>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className={tableRowClass}>
              <td className={tableCellLeftClass}>{tomOperator.tomNumber}</td>
              <td className={tableCellClass}>{formatRupees(tomOperator.imprestAmount)}</td>
              <td className={tableCellClass}>
                <input data-grid="imprestIssue" data-row={rowIndex} data-column={0}
                  value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                  onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                  className={`${tableInputClass} min-w-20 text-right!`} />
              </td>
              <td className={tableCellClass}>{formatRupees(tomOperator.imprestAmount + advanceOfRow(rowIndex))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={tableTotalRowClass}>
            <td className={`${tableCellLeftClass}`}>Total</td>
            <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount)}</td>
            <td className={tableTotalCellClass}>{formatRupees(totalAdvanceAmount)}</td>
            <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount + totalAdvanceAmount)}</td>
          </tr>
        </tfoot>
      </table>
      </div>
    </div>
  );
}
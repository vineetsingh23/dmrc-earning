import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';

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
  const cellClass = 'border border-bl px-2 py-1 text-right text-sm';
  const headerClass = 'border border-bl bg-ca px-2 py-1 text-xs';
  return (
    <div className="rounded-2xl border border-bd bg-card p-4 shadow-sm" onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">Imprest issue to each TOM</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={headerClass}>TOM No.</th><th className={headerClass}>Imprest issued</th>
            <th className={headerClass}>Advance issued</th><th className={headerClass}>Total issued amount</th>
          </tr>
        </thead>
        <tbody>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className="even:bg-tz">
              <td className={`${cellClass} text-left!`}>{tomOperator.tomNumber}</td>
              <td className={cellClass}>{formatRupees(tomOperator.imprestAmount)}</td>
              <td className={cellClass}>
                <input data-grid="imprestIssue" data-row={rowIndex} data-column={0}
                  value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                  onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                  className="w-20 rounded border border-bd bg-inp px-1.5 py-0.5 text-right outline-hidden focus:ring-2 focus:ring-ac" />
              </td>
              <td className={cellClass}>{formatRupees(tomOperator.imprestAmount + advanceOfRow(rowIndex))}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-ca font-bold">
            <td className={`${cellClass} text-left!`}>Total</td>
            <td className={cellClass}>{formatRupees(totalImprestAmount)}</td>
            <td className={cellClass}>{formatRupees(totalAdvanceAmount)}</td>
            <td className={cellClass}>{formatRupees(totalImprestAmount + totalAdvanceAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
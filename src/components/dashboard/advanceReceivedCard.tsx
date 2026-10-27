import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';

interface AdvanceReceivedCardProps {
  listRows: string[][];                                           // [rowIndex][columnIndex]; advance received is column 1
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
}
const advanceColumnIndex = 1;

// advance received back from each TOM operator
export default function AdvanceReceivedCard({ listRows, onAdvanceChange }: AdvanceReceivedCardProps) {
  const totalAdvanceReceived = tomOperators.reduce((total, _tomOperator, rowIndex) => total + parseNumber(listRows[rowIndex]?.[advanceColumnIndex]), 0);
  const cellClass = 'border border-bl px-2 py-1 text-right text-sm';
  const headerClass = 'border border-bl bg-ca px-2 py-1 text-xs';
  return (
    <div className="rounded-2xl border border-bd bg-card p-4 shadow-sm" onKeyDown={handleSheetKeyDown}>
      <h2 className="mb-2 font-semibold">Advance received from each TOM</h2>
      <table className="w-full border-collapse">
        <thead><tr><th className={headerClass}>TOM No.</th><th className={headerClass}>Advance received</th></tr></thead>
        <tbody>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className="even:bg-tz">
              <td className={`${cellClass} text-left!`}>{tomOperator.tomNumber}</td>
              <td className={cellClass}>
                <input data-grid="advanceReceived" data-row={rowIndex} data-column={0}
                  value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                  onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                  className="w-24 rounded border border-bd bg-inp px-1.5 py-0.5 text-right outline-hidden focus:ring-2 focus:ring-ac" />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-ca font-bold"><td className={`${cellClass} text-left!`}>Total</td><td className={cellClass}>{formatRupees(totalAdvanceReceived)}</td></tr>
        </tfoot>
      </table>
    </div>
  );
}
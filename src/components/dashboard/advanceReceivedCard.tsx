import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass, cardHeaderClass, cardHeadingClass, primaryButtonClass, tableCellClass, tableCellLeftClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass, tableWrapperClass } from '../../globalStyles';

interface AdvanceReceivedCardProps {
  listRows: string[][];
  onTomNumberChange: (rowIndex: number, typedValue: string) => void;
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
  onAddRow: () => void;
}
const advanceColumnIndex = 1;

// advance received back from each TOM operator
export default function AdvanceReceivedCard({
  listRows,
  onTomNumberChange,
  onAdvanceChange,
  onAddRow,
}: AdvanceReceivedCardProps) {
  const rowCount = Math.max(tomOperators.length, listRows.length);
  const totalAdvanceReceived = listRows.reduce(
    (total, row) => total + parseNumber(row[advanceColumnIndex]),
    0,
  );

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
              const operator = tomOperators[rowIndex];
              return (
                <tr key={operator?.tomNumber ?? `added-${rowIndex}`} className={tableRowClass}>
                  <td className={`${tableCellLeftClass} text-center! min-w-40`}>
                    {operator ? (
                      operator.tomNumber
                    ) : (
                      <input
                        aria-label={`TOM number for added advance received row ${rowIndex - tomOperators.length + 1}`}
                        value={listRows[rowIndex]?.[0] ?? ''}
                        onChange={event => onTomNumberChange(rowIndex, event.target.value)}
                        className={`${tableInputClass} min-w-20 text-center`}
                      />
                    )}
                  </td>
                  <td className={tableCellClass}>
                    <input
                      data-grid="advanceReceived"
                      data-row={rowIndex}
                      data-column={0}
                      value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''}
                      placeholder="0"
                      inputMode="decimal"
                      onFocus={event => event.target.select()}
                      onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                      className={`${tableInputClass} min-w-20 text-right`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td className={`${tableCellLeftClass} font-bold!`}>Total</td>
              <td className={tableTotalCellClass}>{formatRupees(totalAdvanceReceived)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-2 flex justify-end">
        <button type="button" onClick={onAddRow} className={primaryButtonClass}>
          + Add row
        </button>
      </div>
    </div>
  );
}
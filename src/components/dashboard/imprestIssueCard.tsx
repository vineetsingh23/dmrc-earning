import { tomOperators } from '../../lib/businessRules';
import { parseNumber } from '../../lib/earningColumns';
import { formatRupees } from '../../lib/earningCalculations';
import { handleSheetKeyDown } from '../../handlers/sheetKeyboardHandlers';
import { cardClass, cardHeaderClass, cardHeadingClass, primaryButtonClass, tableCellClass, tableCellLeftClass, tableClass, tableHeaderCellClass, tableHeaderRowClass, tableInputClass, tableRowClass, tableTotalCellClass, tableTotalRowClass, tableWrapperClass } from '../../globalStyles';

interface ImprestIssueCardProps {
  listRows: string[][];
  onTomNumberChange: (rowIndex: number, typedValue: string) => void;
  onImprestChange: (rowIndex: number, typedValue: string) => void;
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
  onAddRow: () => void;
}
const advanceColumnIndex = 2;

export default function ImprestIssueCard({
  listRows,
  onTomNumberChange,
  onImprestChange,
  onAdvanceChange,
  onAddRow,
}: ImprestIssueCardProps) {
  const rowCount = Math.max(tomOperators.length, listRows.length);
  const imprestOfRow = (rowIndex: number) =>
    rowIndex < tomOperators.length
      ? tomOperators[rowIndex].imprestAmount
      : parseNumber(listRows[rowIndex]?.[1]);
  const advanceOfRow = (rowIndex: number) => parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
  const totalImprestAmount = Array.from({ length: rowCount }, (_, rowIndex) => imprestOfRow(rowIndex))
    .reduce((total, amount) => total + amount, 0);
  const totalAdvanceAmount = Array.from({ length: rowCount }, (_, rowIndex) => advanceOfRow(rowIndex))
    .reduce((total, amount) => total + amount, 0);

  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className={cardHeaderClass}>
        <h2 className={cardHeadingClass}>Imprest &amp; advance issued to each TOM</h2>
      </div>

      <div className={tableWrapperClass}>
        <table className={tableClass}>
          <thead>
            <tr className={tableHeaderRowClass}>
              <th className={`${tableHeaderCellClass} min-w-20`}>TOM No.</th>
              <th className={tableHeaderCellClass}>Imprest</th>
              <th className={tableHeaderCellClass}>Advance</th>
              <th className={tableHeaderCellClass}>Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const operator = tomOperators[rowIndex];
              const imprestAmount = imprestOfRow(rowIndex);
              const advanceAmount = advanceOfRow(rowIndex);
              return (
                <tr key={operator?.tomNumber ?? `added-${rowIndex}`} className={tableRowClass}>
                  <td className={tableCellLeftClass}>
                    {operator ? (
                      operator.tomNumber
                    ) : (
                      <input
                        aria-label={`TOM number for added imprest row ${rowIndex - tomOperators.length + 1}`}
                        value={listRows[rowIndex]?.[0] ?? ''}
                        onChange={event => onTomNumberChange(rowIndex, event.target.value)}
                        className={`${tableInputClass} min-w-20 text-center`}
                      />
                    )}
                  </td>
                  <td className={tableCellClass}>
                    {operator ? (
                      formatRupees(imprestAmount)
                    ) : (
                      <input
                        aria-label={`Imprest amount for added row ${rowIndex - tomOperators.length + 1}`}
                        value={listRows[rowIndex]?.[1] ?? ''}
                        placeholder="0"
                        inputMode="decimal"
                        onFocus={event => event.target.select()}
                        onChange={event => onImprestChange(rowIndex, event.target.value)}
                        className={`${tableInputClass} min-w-20 text-right`}
                      />
                    )}
                  </td>
                  <td className={`${tableCellClass} max-w-20`}>
                    <input
                      data-grid="imprestIssue"
                      data-row={rowIndex}
                      data-column={0}
                      value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''}
                      placeholder="0"
                      inputMode="decimal"
                      onFocus={event => event.target.select()}
                      onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                      className={`${tableInputClass} min-w-20 text-right!`}
                    />
                  </td>
                  <td className={tableCellClass}>
                    {formatRupees(imprestAmount + advanceAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td className={`${tableCellLeftClass} font-bold!`}>Total</td>
              <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount)}</td>
              <td className={tableTotalCellClass}>{formatRupees(totalAdvanceAmount)}</td>
              <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount + totalAdvanceAmount)}</td>
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
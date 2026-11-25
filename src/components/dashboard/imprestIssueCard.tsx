import { tomOperators } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";
import { Trash2 } from "lucide-react";
import {
  cardClass,
  cardHeaderClass,
  cardHeadingClass,
  primaryButtonClass,
  tableCellClass,
  tableCellLeftClass,
  tableClass,
  tableHeaderCellClass,
  tableHeaderRowClass,
  tableInputClass,
  tableRowClass,
  tableTotalCellClass,
  tableTotalRowClass,
  tableWrapperClass,
} from "../../globalStyles";

interface ImprestIssueCardProps {
  listRows: string[][]; // [rowIndex][columnIndex]; advance issued is column 2
  onAdvanceChange: (rowIndex: number, typedValue: string) => void;
  onTomNumberChange: (rowIndex: number, typedValue: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowIndex: number) => void;
}
const advanceColumnIndex = 2;

// imprest issued to each TOM: fixed imprest, advance issued typed, total issued = imprest + advance
export default function ImprestIssueCard({
  listRows,
  onAdvanceChange,
  onTomNumberChange,
  onAddRow,
  onDeleteRow,
}: ImprestIssueCardProps) {
  const advanceOfRow = (rowIndex: number) =>
    parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
  const totalImprestAmount = tomOperators.reduce(
    (total, tomOperator) => total + tomOperator.imprestAmount,
    0,
  );
  const additionalRows = listRows.slice(tomOperators.length);
  const totalAdditionalImprest = additionalRows.reduce(
    (total, row) => total + parseNumber(row[1]),
    0,
  );
  const totalAdvanceAmount = listRows.reduce(
    (total, _row, rowIndex) => total + advanceOfRow(rowIndex),
    0,
  );
  const rowCount = Math.max(tomOperators.length, listRows.length);
  // const cellClass = 'border border-bl px-2 py-1 text-right text-sm';
  // const headerClass = 'border border-bl bg-ca px-2 py-1 text-xs';
  return (
    <div className={cardClass} onKeyDown={handleSheetKeyDown}>
      <div className={cardHeaderClass}>
        <h2 className={cardHeadingClass}>
          Imprest & advance issued to each TOM
        </h2>
      </div>

      <div className={tableWrapperClass}>
        <table className={tableClass}>
          <thead>
            <tr className={tableHeaderRowClass}>
              <th className={`${tableHeaderCellClass} min-w-20`}>TOM No.</th>
              <th className={`${tableHeaderCellClass} `}>Imprest</th>
              <th className={tableHeaderCellClass}>Advance</th>
              <th className={tableHeaderCellClass}>Total</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const tomOperator = tomOperators[rowIndex];
              const imprestAmount =
                tomOperator?.imprestAmount ??
                parseNumber(listRows[rowIndex]?.[1]);
              const rowLabel =
                tomOperator?.tomNumber ??
                listRows[rowIndex]?.[0] ??
                `Additional ${rowIndex - tomOperators.length + 1}`;
              return (
                <tr
                  key={tomOperator?.tomNumber ?? `additional-${rowIndex}`}
                  className={tableRowClass}
                >
                  <td className={tableCellLeftClass}>
                    {tomOperator ? (
                      rowLabel
                    ) : (
                      <div className="grid w-full grid-cols-[24px_minmax(0,1fr)_24px] items-center">
                        <button
                          type="button"
                          onClick={() => onDeleteRow(rowIndex)}
                          aria-label={`Delete added row ${rowIndex - tomOperators.length + 1}`}
                          title="Delete added row"
                          className="inline-flex shrink-0 items-center justify-center rounded-md text-danger-text transition hover:bg-danger/10"
                        >
                          <Trash2 className="size-5" aria-hidden="true" />
                        </button>
                        <input
                          data-grid="imprestIssue"
                          data-row={rowIndex}
                          data-column={0}
                          value={listRows[rowIndex]?.[0] ?? rowLabel}
                          placeholder="TOM No."
                          onFocus={(event) => event.target.select()}
                          onChange={(event) =>
                            onTomNumberChange(rowIndex, event.target.value)
                          }
                          className={`${tableInputClass} !w-full !min-w-0 !px-0 !py-0 !text-center !text-xs !font-medium`}
                        />
                      </div>
                    )}
                  </td>
                  <td className={tableCellClass}>
                    {formatRupees(imprestAmount)}
                  </td>
                  <td className={`${tableCellClass} max-w-20`}>
                    <input
                      data-grid="imprestIssue"
                      data-row={rowIndex}
                      data-column={tomOperator ? 0 : 1}
                      value={listRows[rowIndex]?.[advanceColumnIndex] ?? ""}
                      placeholder="0"
                      inputMode="decimal"
                      onFocus={(event) => event.target.select()}
                      onChange={(event) =>
                        onAdvanceChange(rowIndex, event.target.value)
                      }
                      className={`${tableInputClass} min-w-20 !text-center`}
                    />
                  </td>
                  <td className={tableCellClass}>
                    {formatRupees(imprestAmount + advanceOfRow(rowIndex))}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={tableTotalRowClass}>
              <td className={`${tableCellLeftClass} font-bold!`}>Total</td>
              <td className={tableTotalCellClass}>
                {formatRupees(totalImprestAmount + totalAdditionalImprest)}
              </td>
              <td className={tableTotalCellClass}>
                {formatRupees(totalAdvanceAmount)}
              </td>
              <td className={tableTotalCellClass}>
                {formatRupees(
                  totalImprestAmount +
                    totalAdditionalImprest +
                    totalAdvanceAmount,
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={onAddRow} className={primaryButtonClass}>
          + Add row
        </button>
      </div>
    </div>
  );
}

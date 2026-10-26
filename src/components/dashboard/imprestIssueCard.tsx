import { tomOperators } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";
import { handleSheetKeyDown } from "../../handlers/sheetKeyboardHandlers";
import {
    cardClass,
    cardHeadingClass,
    tableCellClass,
    tableCellLeftClass,
    tableClass,
    tableHeaderCellClass,
    tableHeaderRowClass,
    tableInputClass,
    tableRowClass,
    tableTotalCellClass,
    tableTotalRowClass,
} from "../../globalStyles";

interface ImprestIssueCardProps {
    listRows : string[][];
    onAdvanceChange: (rowIndex:number, typedValue:string) => void;
}

const advanceColumnIndex = 2;

export default function ImprestIssueCard({listRows, onAdvanceChange}:ImprestIssueCardProps) {
    const advanceOfRow = (rowIndex:number) => parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
    const totalImprestAmount = tomOperators.reduce((total, tomOperator)=>total + tomOperator.imprestAmount,0)
    const totalAdvanceAmount = tomOperators.reduce((total,_tomOperator, rowIndex)=>total + advanceOfRow(rowIndex),0)

    return(
        <div className ={cardClass} onKeyDown={handleSheetKeyDown}>
            <h2 className={cardHeadingClass}>Imprest Issued to each TOM</h2>
            <table className={tableClass}>
                <thead>
                    <tr className={tableHeaderRowClass}>
                        <th className={tableHeaderCellClass}>TOM No.</th>
                        <th className={tableHeaderCellClass}>Imprest Issued</th>
                        <th className={tableHeaderCellClass}>Advance Issued</th>
                        <th className={tableHeaderCellClass}>Total Issued Amount</th>

                    </tr>
                </thead>
                <tbody>
                    {tomOperators.map((tomOperator, rowIndex)=> (
                        <tr key={tomOperator.tomNumber} className={tableRowClass}>
                            <td className={tableCellLeftClass}>{tomOperator.tomNumber}</td>
                            <td className={tableCellClass}>{formatRupees(tomOperator.imprestAmount)}</td>
                            <td className={tableCellClass}>
                                <input  data-grid ="imprestIssued" data-row={rowIndex} data-column={0}
                                        value={listRows[rowIndex]?.[advanceColumnIndex]?? ''}
                                        placeholder='0'
                                        inputMode='decimal'
                                        onFocus={event =>event.target.select()}
                                        onChange={event =>onAdvanceChange(rowIndex, event.target.value)}
                                        className={`${tableInputClass} w-20 text-right`}
                                />
                            </td>
                            <td className={tableCellClass}>{formatRupees(tomOperator.imprestAmount + advanceOfRow(rowIndex))}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className={tableTotalRowClass}>
                        <td className={`${tableTotalCellClass} !text-left`}>Total</td>
                        <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount)}</td>
                        <td className={tableTotalCellClass}>{formatRupees(totalAdvanceAmount)}</td>
                        <td className={tableTotalCellClass}>{formatRupees(totalImprestAmount + totalAdvanceAmount) }</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )

}
import { tomOperators } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";
import { cardClass } from "../../globalStyles";

interface ImprestIssueCardProps {
    listRows : string[][];
    onAdvanceChange: (rowIndex:number, typedValue:string) => void;
}

const advanceColumnIndex = 2;

export default function ImprestIssueCard({listRows, onAdvanceChange}:ImprestIssueCardProps) {
    const advanceOfRow = (rowIndex:number) => parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
    const totalImprestAmount = tomOperators.reduce((total, tomOperator)=>total + tomOperator.imprestAmount,0)
    const totalAdvanceAmount = tomOperators.reduce((total,_tomOperator, rowIndex)=>total + advanceOfRow(rowIndex),0)

    const cellClass = 'border border-slate-200 px-2 py-1 text-right text-sm';
    const headerClass = 'border border-white px-2 py-1 text-xs';

    return(
        <div className ={cardClass}>
            <h2 className="mb-2 font-semibold">Imprest Issued to each TOM</h2>
            <table>
                <thead>
                    <tr className="bg-blue-100">
                        <th className={headerClass}>TOM No.</th>
                        <th className={headerClass}>Imprest Issued</th>
                        <th className={headerClass}>Advance Issued</th>
                        <th className={headerClass}>Total Issued Amount</th>

                    </tr>
                </thead>
                <tbody>
                    {tomOperators.map((tomOperator, rowIndex)=> (
                        <tr key={tomOperator.tomNumber} className="even:bg-slate-100">
                            <td className={`${cellClass} !text-left`}>{tomOperator.tomNumber}</td>
                            <td className={cellClass}>{formatRupees(tomOperator.imprestAmount)}</td>
                            <td className={cellClass}>
                                <input
                                        value={listRows[rowIndex]?.[advanceColumnIndex]?? ''}
                                        placeholder='0'
                                        inputMode='decimal'
                                        onFocus={event =>event.target.select()}
                                        onChange={event =>onAdvanceChange(rowIndex, event.target.value)}
                                        className='w-20 rounded border border-slate-300 px-1.5 py-0.5 text-right outline-none focus-ring-2 focus:ring-blue-400'
                                />
                            </td>
                            <td className={cellClass}>{formatRupees(tomOperator.imprestAmount + advanceOfRow(rowIndex))}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className='bg-blue-100 font-bold'>
                        <td className={`${cellClass} !text-left`}>Total</td>
                        <td className={cellClass}>{formatRupees(totalImprestAmount)}</td>
                        <td className={cellClass}>{formatRupees(totalAdvanceAmount)}</td>
                        <td className={cellClass}>{formatRupees(totalImprestAmount + totalAdvanceAmount) }</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )

}
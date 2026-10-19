import { imprestAmountPerTom, imprestTomNumbers } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";

interface ImprestIssueCardProps {
    listRows : string[][];
    onAdvanceChange: (rowIndex:number, typedValue:string) => void;
}

const advanceColumnIndex = 2;

export default function ImprestIssueCard({listRows, onAdvanceChange}:ImprestIssueCardProps) {
    const advanceOfRow = (rowIndex:number) => parseNumber(listRows[rowIndex]?.[advanceColumnIndex]);
    const totalImprestAmount = imprestTomNumbers.length * imprestAmountPerTom;
    const totalAdvanceAmount = imprestTomNumbers.reduce((total,_tomNumber, rowIndex)=>total + advanceOfRow(rowIndex),0)

    const cellClass = 'border border-slate-200 px-2 py-1 text-right text-sm';
    const headerClass = 'border border-white px-2 py-1 text-xs0';

    return(
        <div className ="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
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
                    {imprestTomNumbers.map((tomNumber, rowIndex)=> (
                        <tr key={tomNumber} className="even:bg-slate-100">
                            <td className={`${cellClass} !text-left`}>{tomNumber}</td>
                            <td className={cellClass}>{formatRupees(imprestAmountPerTom)}</td>
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
                            <td className={cellClass}>{formatRupees(imprestAmountPerTom + advanceOfRow(rowIndex))}</td>
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
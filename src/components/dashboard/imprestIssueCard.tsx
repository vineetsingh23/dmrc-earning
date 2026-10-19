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
        <div>
            
        </div>
    )

}
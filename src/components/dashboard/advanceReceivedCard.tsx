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

interface AdvanceReceivedCardProps{
    listRows:string[][];
    onAdvanceChange: (rowIndex:number, typedValue:string) => void;

}

const advanceColumnIndex=1;
export default function AdvanceReceivedCard({listRows, onAdvanceChange}:AdvanceReceivedCardProps) {
    const totalAdvanceReceived = tomOperators.reduce((total, _tomNumber, rowIndex)=> 
        total + parseNumber(listRows[rowIndex]?.[advanceColumnIndex]),0);
    return (
        <div className={cardClass} onKeyDown={handleSheetKeyDown}>
            <h2 className={cardHeadingClass}>Advance Received from Each TOM</h2>
            <table className={tableClass}>
                <thead>
                    <tr className={tableHeaderRowClass}>
                        <th className={tableHeaderCellClass}>TOM No.</th>
                        <th className={tableHeaderCellClass}>Advance received</th>
                    </tr>
                </thead>
                 <tbody>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className={tableRowClass}>
              <td className={tableCellLeftClass}>{tomOperator.tomNumber}</td>
              <td className={tableCellClass}>
                <input data-grid="advanceReceived" data-row={rowIndex} data-column={0}
                    value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                    onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                    className={`${tableInputClass} w-24 text-right`} />
              </td>
            </tr>
          ))}
        </tbody>
         <tfoot>
          <tr className={tableTotalRowClass}><td className={tableTotalCellClass + ' !text-left'}>Total</td><td className={tableTotalCellClass}>{formatRupees(totalAdvanceReceived)}</td></tr>
        </tfoot>
            </table>

        </div>
    )
}
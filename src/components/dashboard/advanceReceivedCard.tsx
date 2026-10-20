import { tomOperators } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";

interface AdvanceReceivedCardProps{
    listRows:string[][];
    onAdvanceChange: (rowIndex:number, typedValue:string) => void;

}

const advanceColumnIndex=1;
export default function AdvanceReceivedCard({listRows, onAdvanceChange}:AdvanceReceivedCardProps) {
    const totalAdvanceReceived = tomOperators.reduce((total, _tomNumber, rowIndex)=> 
        total + parseNumber(listRows[rowIndex]?.[advanceColumnIndex]),0);
    const cellClass ='border border-slate-200 px-2 py-1 text-right text-sm';

    return (
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Advance Received from Each TOM</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-100 text-xs">
                        <th className="border border-white px-2 py-1">TOM No.</th>
                        <th className="border border-white px-2 py-1">Advance received</th>
                    </tr>
                </thead>
                 <tbody>
          {tomOperators.map((tomOperator, rowIndex) => (
            <tr key={tomOperator.tomNumber} className="even:bg-slate-100">
              <td className={`${cellClass} !text-left`}>{tomOperator.tomNumber}</td>
              <td className={cellClass}>
                <input value={listRows[rowIndex]?.[advanceColumnIndex] ?? ''} placeholder="0" inputMode="decimal"
                  onFocus={event => event.target.select()} onChange={event => onAdvanceChange(rowIndex, event.target.value)}
                  className="w-24 rounded border border-slate-300 px-1.5 py-0.5 text-right outline-none focus:ring-2 focus:ring-blue-400" />
              </td>
            </tr>
          ))}
        </tbody>
         <tfoot>
          <tr className="bg-blue-100 font-bold"><td className={`${cellClass} !text-left`}>Total</td><td className={cellClass}>{formatRupees(totalAdvanceReceived)}</td></tr>
        </tfoot>
            </table>

        </div>
    )
}
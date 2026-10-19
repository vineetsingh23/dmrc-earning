import { imprestTomNumbers } from "../../lib/businessRules";
import { parseNumber } from "../../lib/earningColumns";
import { formatRupees } from "../../lib/earningCalculations";

interface AdvanceReceivedCardProps{
    listRows:string[][];
    onAdvanceChnage: (rowIndex:number, typedValue:string) => void;

}

const advanceColumnIndex=1;
export default function AdvanceReceivedCard({listRows, onAdvanceChnage}:AdvanceReceivedCardProps) {
    const totalAdvanceReceived = imprestTomNumbers.reduce((total, _tomNumber, rowIndex)=> 
        total + parseNumber(listRows[rowIndex]?.[advanceColumnIndex]),0);
    const cellClass ='border border-slate-200 px-2 py-1 text-right text-sm';

    return (
        <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Advance Received from Each TOM</h2>
            <table className="w-full border-collapse">
                <thead>

                </thead>
            </table>

        </div>
    )
}
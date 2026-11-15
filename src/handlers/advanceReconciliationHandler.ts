import type { RegisterState } from "../lib/registerTypes";
import { tomOperators } from "../lib/businessRules";
import { parseNumber } from "../lib/earningColumns";
import { cashDepositedByOperator } from "../lib/shiftEntrycolumns";
import { effectiveDetailListRows } from "../lib/carriedLists";
import { updateCarriedDetailListCell } from "./carriedListsHandlers";


const getOperatorNumber =(value:unknown):string => {
    const match = String(value ?? "").match(/\d+/);
        return match?.[0] ?? "";
};

export function reconcileOpetatorAdvance(
    state:RegisterState,date:string
):void {
    const shiftRows = state.shiftEntries?.[date] ?? {};
    const advanceRows = effectiveDetailListRows(state,date,"advanceReceived").map((row)=>[...row]);
    Object.entries(shiftRows).forEach(([rowIndex,row])=> {
        if(row.advanceReceivedMached === "true") {
            return;
        }
        const operatorNumber = getOperatorNumber(row.cccNumber);
        if(!operatorNumber) {
            return ;

        }
        const operatorIndex = tomOperators.findIndex((operator) => operator.tomNumber === operatorNumber);
        if(operatorIndex === -1){
            return;
        }
        const advanceAmount = parseNumber(advanceRows[operatorIndex]?.[1]);
        const depositedAmount = cashDepositedByOperator(row);
        if(advanceAmount <=0 || depositedAmount <=0) {
            return;
        }
        const advanceInPaise = Math.round(advanceAmount * 100);
        const depositedPaise =Math.round(depositedAmount * 100);
        if(advanceInPaise !== depositedPaise) {
            return;
        }
        state.shiftEntries[date][Number(rowIndex)].advanceReceivedMached = "true";
        updateCarriedDetailListCell(state,date,"advanceReceived",operatorIndex,1,"");

        advanceRows[operatorIndex][1] = ""
    });
}
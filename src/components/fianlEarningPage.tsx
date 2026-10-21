import { useMemo } from "react";
import EarningSheetTable from "./earningSheetTable";
import type { RegisterState } from "../lib/registerTypes";
import { finalEarningColumns } from "../lib/earningColumns";
import { sumRowsByField } from "../lib/earningCalculations";

interface fianlEarningPageProps {
    registerState: RegisterState;
    date: string;
}

export default function FinalEarningPage ({registerState, date}: fianlEarningPageProps){
    const finalRow = useMemo(() => ( {
        ...sumRowsByField(Object.values(registerState.shiftEntries[date] ?? {})),
        ...sumRowsByField(Object.values(registerState.tvmEntries[date] ?? {}))

    }),[registerState,date])

    return (
        <div>
            <h2>Final Earning</h2>
            <EarningSheetTable columns={finalEarningColumns} rowCount={1} readRow={() => finalRow} showTotalRow = {false}/>
        </div>
    )
}
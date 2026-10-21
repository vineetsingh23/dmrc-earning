import { useMemo } from "react";
import EarningSheetTable,{type SheetStyle} from "./earningSheetTable";
import type { RegisterState } from "../lib/registerTypes";
import { finalEarningColumns } from "../lib/earningColumns";
import { sumRowsByField } from "../lib/earningCalculations";

interface fianlEarningPageProps {
    registerState: RegisterState;
    date: string;
    
}

const finalEarningSheetStyle : SheetStyle = {
    headerCellClass : '',
    headerColorClasses: [''],
    bodyCellClass: '',
    footerCellClass: ''
}

export default function FinalEarningPage ({registerState, date}: fianlEarningPageProps){
    const finalRow = useMemo(() => ( {
        ...sumRowsByField(Object.values(registerState.shiftEntries[date] ?? {})),
        ...sumRowsByField(Object.values(registerState.tvmEntries[date] ?? {}))

    }),[registerState,date])

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-blue-600">Final Earning</h2>
            <EarningSheetTable 
            columns={finalEarningColumns} 
            rowCount={1} readRow={() => finalRow} 
            showTotalRow = {false}
            sheetStyle={finalEarningSheetStyle}
            
            />
        </div>
    )
}
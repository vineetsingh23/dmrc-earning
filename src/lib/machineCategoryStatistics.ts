
import { parseNumber } from "./earningColumns";
import type { RegisterRow, RegisterState} from "./registerTypes";


export type EarningMachineCategory = 'CC' | 'TOM' | 'TVM' | 'RCTM' ;

export interface MachineCategoryEarning {
    qrSale:number;
    addValue:number;
    upi:number;
    pos:number;
}

export type MachineCategoryStatistics = Record<EarningMachineCategory | 'overall', MachineCategoryEarning>;
const emptyCategory = ():MachineCategoryEarning => ( {
    qrSale:0,
    addValue:0,
    upi:0,
    pos:0,
});

export const getTomCcCategory =(machineNumber:unknown):'CC'|'TOM'|null =>{
    const match = String(machineNumber ?? '').match(/\d+/);
    if (!match) return null;

    const number = Number(match[0]);
    return [80,81,82].includes(number) ? 'CC':'TOM';
};

const addValues = (
    target: MachineCategoryEarning,
    values: Partial<MachineCategoryEarning>
) => {
    target.qrSale += values.qrSale ?? 0;
    target.addValue += values.addValue ?? 0;
    target.upi += values.upi ?? 0 ;
    target.pos += values.pos ?? 0;
};

export const MachineCategoryStatisticsOfDate = (state:RegisterState, date: string):MachineCategoryStatistics => {
    const result:MachineCategoryStatistics = {
        CC:emptyCategory(),
        TOM:emptyCategory(),
        TVM:emptyCategory(),
        RCTM:emptyCategory(),
        overall:emptyCategory(),
    }
    const shiftRows: RegisterRow[] = Object.values(state.shiftEntries?.[date] ?? {});
    const tvmRows: RegisterRow[] =Object.values(state.tvmEntries?.[date] ?? {});
    shiftRows.forEach((row)=> {
        const category = getTomCcCategory(row.cccNumber);
        if(category){
            addValues(result[category],{
                qrSale:parseNumber(row.qrSaleAmount),
                addValue:parseNumber(row.addValueSv2TomAmount)+ parseNumber(row.addValueNcmcTomAmount),
                upi: parseNumber(row.upiAtTomCc),
                pos:parseNumber(row.posAtCcc),

            });
        }
        addValues(result.RCTM,{
            pos:parseNumber(row.posAtRctm),
        });
    });
    tvmRows.forEach((row)=> {
        addValues(result.TVM, {
            qrSale:parseNumber(row.tvmQrSaleAmount),
            addValue:parseNumber(row.tvmAddValueAmount)+parseNumber(row.tvmNcmcAddValueAmount),
            upi:parseNumber(row.tvmPaymentByUpi),
            pos:parseNumber(row.tvmPaymentByPos),
        });
        addValues(result.RCTM, {
            addValue:parseNumber(row.tvmRctmAddValueAmount),
        });
    });
    const categories: EarningMachineCategory[]= [
        'CC','TOM','TVM','RCTM',
    ];

    categories.forEach((category) => {
        addValues(result.overall,result[category]);
    });

    return result;
};
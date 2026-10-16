import type { RegisterRow } from "./registerTypes";

export const parseNumber = (value:unknown):number => {
    const parsed = parseFloat (String(value ?? '').replace(/[^0-9.\-]/g,''));
    return Number.isNaN(parsed) ? 0 :parsed;
}

const sumOfFields = (row:RegisterRow,fieldKeys:string):number => 
    fieldKeys.split('').reduce((total,fieldKey) => total + parseNumber(row[fieldKey]),0);

export const ticketSaleNet = (row:RegisterRow) =>
    sumOfFields(row, `qrSaleAmount paidExitQrAmount cscSaleAmount`)
    -sumOfFields (row, `qrRefundAmount cscRefundAmount`);

export const addValueNet = (row:RegisterRow) =>
    sumOfFields(row, `addVlaueSv2TomAmount addValueNcmcTomAmount`)
    -sumOfFields(row, `addValueCandelAmount cscTourRefundAmount`);

export const afcCollectionTotal =(row:RegisterRow) => ticketSaleNet(row) + addValueNet(row);
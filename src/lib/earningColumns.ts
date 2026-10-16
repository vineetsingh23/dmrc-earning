import type { RegisterRow } from "./registerTypes";

export const parseNumber = (value:unknown):number => {
    const parsed = parseFloat (String(value ?? '').replace(/[^0-9.\-]/g,''));
    return Number.isNaN(parsed) ? 0 :parsed;
}

const sumOfFields = (row:RegisterRow,fieldKeys:string):number => 
    fieldKeys.split(' ').reduce((total,fieldKey) => total + parseNumber(row[fieldKey]),0);

export const ticketSaleNet = (row:RegisterRow) =>
    sumOfFields(row, 'qr paidExit')
    -sumOfFields (row, 'qrRefund');

export const cscSaleNet = (row:RegisterRow) =>
    sumOfFields(row, 'cscSale t1t2Sale addValueSv2 addValueNcmc ')
    -sumOfFields(row, 'cscRefund');

export const surNet = (row:RegisterRow) =>
    sumOfFields(row, 'surCash surNcmc surPurseSv2 surPurseNcmc')

export const afcCollectionTotal =(row:RegisterRow) => ticketSaleNet(row) + cscSaleNet(row) + surNet(row);

export const manualRefund = (row:RegisterRow) => sumOfFields(row, 'okMr okTour okUrc qrMr');

export const penalty = (row:RegisterRow) => sumOfFields(row, 'penaltyManual penaltyHht penaltyCash')

export const miscEarning = (row:RegisterRow) => sumOfFields(row, 'eib sv4  miscEarning parkingCash parkingHht parkingPurse')


export const totalEarning = (row:RegisterRow) =>
     afcCollectionTotal(row) - manualRefund(row) 
    + penalty(row) + miscEarning(row)



export const cashlessEarning = (row:RegisterRow) =>
    sumOfFields(row, 'hdfcPos tomUpi PenaltyHht parkingHht parkingPurse surPurseSv2 surPurseNcmc');

export const outstanding = (row:RegisterRow) => sumOfFields(row, 'afcPaid miscPaid') - sumOfFields(row, 'afc misc tvm')

export const totalCashDeposited =(row:RegisterRow) =>
    totalEarning(row) - cashlessEarning(row) + outstanding(row)


import React from 'react'
import {cardClass} from './globalStyles'
import type { RegisterRow } from './lib/registerTypes'
import { ticketSaleNet,
        parseNumber,  
        cscSaleNet,
        surNet,
        afcCollectionTotal,
        manualRefund,
        penalty,
        miscEarning,
        totalEarning,
        cashlessEarning,
        outstanding,
        totalCashDeposited,
        sampleColumns,
      } from './lib/earningColumns';
import EarningSheetTable from './components/tomEarning';


 export default function App() {
  const operatorRow: RegisterRow = {
    operatorName: 'Operator 1', 
    qr: '1200', 
    paidExit: '300',
    qrRefund:'200',
    cscSale: '100', 
    t1t2Sale: '400',
    addValueSv2: '500',
    addValueNcmc: '300',
    cscRefund:'50',
    surCash: '300',
    surNcmc: '122',
    surPurseSv2: '100',
    surPurseNcmc:'150',
    penaltyManual:'200', penaltyHht:'150', penaltyCash:'200',
    eib:'12', sv4:'1500',  miscEarning:'250', 
    parkingCash:'3500', parkingHht:'600', parkingPurse:'1200',
    okMr:'60', okTour:'150', okUrc:'150', qrMr:'30',
    hdfcPos:'1200',tomUpi:'800',afcPaid:'390', miscPaid:'150',afc:'200', misc:'150', tvm:'60',
  };

  const sampleRows: RegisterRow[] = [
  { operatorName: 'Operator 1', qrSaleQuantity: '40', qrSaleAmount: '1200', qrRefundQuantity: '2', qrRefundAmount: '60', addValueQuantity: '10', addValueAmount: '2000',cscRefund:'50' },
  { operatorName: 'Operator 2', qrSaleQuantity: '25', qrSaleAmount: '750' },
];

  return (
    <div className='min-h-screen bg-slate-100 p-6'>
    <h1 className='text-3xl text-blue-600 font-extrabold'>Earning Register</h1>
  {/* <div className='border rounded-md p-6 bg-slate-900 w-full min-h-screen'>

  <div className='grid grid-cols-4 border hover:border-emerald-300 ease-out  hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-200
   gap-4 rounded-2xl px-4 py-2 text-center bg-slate-950 
   hover:text-gray-500
   text-gray-500 hover:bg-emerald-950/30 backdrop-blur-md'>
    <div className='absolute top-0 left-0 h-[2px] w-full rounded-t-2xl bg-linear-to-r  from-transparent via-cyan500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'/>
    <p className={cardClass}>Ticket sale net : <b>{ticketSaleNet(operatorRow)}</b></p>
    <p className={cardClass}>CSC sale net : <b>{cscSaleNet(operatorRow)}</b></p>
    <p className={cardClass}>Surcharge net : <b>{surNet(operatorRow)}</b></p>
    <p className={`${cardClass} font-extrabold uppercase italic`}> AFC Earning: <b>{afcCollectionTotal(operatorRow)}</b></p>
    <p className={cardClass}> MAnual Refund: <b>{manualRefund(operatorRow)}</b></p>
    <p className={cardClass}> Penalty: <b>{penalty(operatorRow)}</b></p>
    <p className={cardClass}> Misc Earning: <b>{miscEarning(operatorRow)}</b></p>
    <p className={`${cardClass} font-extrabold uppercase italic`}> Total Earning: <b>{totalEarning(operatorRow)}</b></p>
    <p className={cardClass}> Cashless Earning: <b>{cashlessEarning(operatorRow)}</b></p>
    <p className={cardClass}> Outstanding: <b>{outstanding(operatorRow)}</b></p>
    <p className={`${cardClass} font-extrabold uppercase italic`}> Total Cash Deposited: <b>{totalCashDeposited(operatorRow)}</b></p>

    </div>
     </div> */}
  
    <EarningSheetTable columns={sampleColumns} rows={sampleRows} />
   

    </div>
  )
}

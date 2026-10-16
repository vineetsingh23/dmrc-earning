import React from 'react'
import { createEmptyRegisterState, type RegisterRow } from './lib/registerTypes'
import { afcCollectionTotal, parseNumber, ticketSaleNet } from './lib/earningColumns';

export default function App() {
  const state = createEmptyRegisterState();

  state.shiftEntries['2026-10-16'] = {0: { nm: 'Operator 1' , a : '1200'}}

  const operatorRow: RegisterRow = {
    operatorName: 'Operator 1', qrSaleAmount: '1200', paidExitQrAmount: '300',
    qrRefundAmount: '100', addValueSv2TomAmount1: '500',addValueCancelAmount: '50',
  }
  return (
    <div className='min-h-screen bg-slate-100 p-6'>
    <h1 className='text-3xl text-blue-600 font-extrabold'>Earning Register</h1>
    <pre className='mt-4 rounded-lg bg-white p-4 text-sm'>{JSON.stringify(state,null,2)}</pre>
    <p>Ticket sale net : <b>{ticketSaleNet(operatorRow)}</b></p>
    <p>AFc collection total :<b>{afcCollectionTotal(operatorRow)} </b> </p>
    <p>"Rs 1,200" read as : <b>{parseNumber('Rs1,200')}</b></p>
    </div>
  )
}

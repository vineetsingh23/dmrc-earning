import React from 'react'
import { createEmptyRegisterState } from './lib/registerTypes'

export default function App() {
  const state = createEmptyRegisterState();

  state.shiftEntries['2026-10-16'] = {0: { nm: 'Operator 1' , a : '1200'}}
  return (
    <div className='min-h-screen bg-slate-100 p-6'>
    <h1 className='text-3xl text-blue-600 font-extrabold'>Earning Register</h1>
    <pre className='mt-4 rounded-lg bg-white p-4 text-sm'>{JSON.stringify(state,null,2)}</pre>
    </div>
  )
}

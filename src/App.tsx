import { useState } from 'react';
import EarningSheetTable from './components/earningSheetTable';
import CashInHandCard from './components/dashboard/cashInHandCard';
import CashInPossessionCard from './components/dashboard/cashInPossessionCard';
import CashToBankCard from './components/dashboard/cashToBankCard';
import SendToBankDialog from './components/dashboard/sentToBankDialog';
import { sampleColumns } from './lib/earningColumns';
import { bankRoundingAmount } from './lib/businessRules';
import { updateEntryCell } from './handlers/entryCellHandler';
import { updateCashCount } from './handlers/cashcountHandlers';
import { recordBankTransfer } from './handlers/cashToBankHandlers';
import { useRegisterData } from './hooks/useRegisterData';
import { useDashboardFigures } from './hooks/useDashboardFigures';
import { useBankNoteDraft } from './hooks/useBankNoteDraft';
import ImprestIssueCard from './components/dashboard/imprestIssueCard';
import AdvanceReceivedCard from './components/dashboard/advanceReceivedCard';
import { updateDetailListCell } from './handlers/detailListHandlers';

export default function App() {
  const { registerState, updateRegisterState, syncStatus } = useRegisterData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const rowsOfSelectedDate = registerState.shiftEntries[selectedDate] ?? {};

  const figures = useDashboardFigures(registerState, selectedDate);
  const noteDraft = useBankNoteDraft(selectedDate, figures.cashCountsInHand, figures.amountDueToBank, figures.existingTransfer);
  // enabled when 100 or more is due and nothing was sent to the bank that day
  const canSendToBank = !figures.existingTransfer && figures.amountDueToBank >= bankRoundingAmount;

  const changeCashCount = (countKey: string, typedValue: string) =>
    updateRegisterState(draftState => updateCashCount(draftState, selectedDate, figures.cashCountsInHand, countKey, typedValue));

  const confirmBankTransfer = (slipNumber: string) => {
    updateRegisterState(draftState => recordBankTransfer(draftState, {
      date: selectedDate, amountToBank: figures.amountDueToBank, slipNumber,
      noteCountsToSend: noteDraft.noteCountsToSend, cashCountsInHand: figures.cashCountsInHand,
    }));
    setIsSendDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-4 text-3xl font-extrabold text-blue-600">Earning Register</h1>
      <input type="date" value={selectedDate} onChange={event => setSelectedDate(event.target.value)}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-2 py-1.5" />
      <span className="mb-4 ml-3 text-sm text-slate-600">
        {syncStatus === 'synced' ? '☁ Synced' : syncStatus === 'saving' ? '☁ Saving…' : syncStatus === 'loading' ? '☁ Loading…' : syncStatus === 'error' ? '⚠ Cloud error' : 'Local only'}
      </span>

      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
        <CashInHandCard 
            totalCashInHand={figures.totalCashInHand} 
            previousDaysCash={figures.previousDaysCash} 
            currentDayEarning={figures.currentDayEarning}
            amountDueToBank={figures.amountDueToBank} 
            existingTransfer={figures.existingTransfer} 
            canSendToBank={canSendToBank}
            imprestAndAdvanceIssuedTotal={figures.imprestAndAdvanceIssuedTotal}
            advanceReceivedTotal={figures.advanceReceivedTotal}
            onSendToBankClick={() => setIsSendDialogOpen(true)} />
        <CashInPossessionCard 
        cashCountsInHand={figures.cashCountsInHand}
        looseCoinAmount={figures.looseCoinsAmount} 
        denominationTotalAmount={figures.denominationTotalAmount}
        totalCashInHand={figures.totalCashInHand} 
        onCountChange={changeCashCount} />
        <CashToBankCard existingTransfer={figures.existingTransfer} amountDueToBank={figures.amountDueToBank} noteDraft={noteDraft} />
      </div>

      <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
  <ImprestIssueCard listRows={registerState.detailLists?.[selectedDate]?.imprestIssue ?? []}
    onAdvanceChange={(rowIndex, typedValue) =>
      updateRegisterState(draftState => updateDetailListCell(draftState, selectedDate, 'imprestIssue', rowIndex, 2, typedValue))} />
  <AdvanceReceivedCard listRows={registerState.detailLists?.[selectedDate]?.advanceReceived ?? []}
    onAdvanceChange={(rowIndex, typedValue) =>
      updateRegisterState(draftState => updateDetailListCell(draftState, selectedDate, 'advanceReceived', rowIndex, 1, typedValue))} />
</div>

      <EarningSheetTable
        columns={sampleColumns}
        rowCount={registerState.shiftRowCount}
        readRow={rowIndex => rowsOfSelectedDate[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => rowsOfSelectedDate[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => updateEntryCell(draftState.shiftEntries, selectedDate, rowIndex, fieldKey, newValue))}
      />

      {isSendDialogOpen && (
        <SendToBankDialog amountDueToBank={figures.amountDueToBank} totalCashInHand={figures.totalCashInHand}
          noteTotalToSend={noteDraft.noteTotalToSend} onClose={() => setIsSendDialogOpen(false)} onConfirm={confirmBankTransfer} />
      )}
    </div>
  );
}
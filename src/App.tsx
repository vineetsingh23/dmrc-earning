import { useState } from 'react';
import EarningSheetTable from './components/earningSheetTable';
import { sampleColumns } from './lib/earningColumns';
import { updateEntryCell } from './handlers/entryCellHandler';
import { useRegisterData } from './hooks/useRegisterData';

export default function App() {
  const { registerState, updateRegisterState, syncStatus } = useRegisterData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const rowsOfSelectedDate = registerState.shiftEntries[selectedDate] ?? {};

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="mb-4 text-3xl font-extrabold text-blue-600">Earning Register</h1>
      <input type="date" value={selectedDate} onChange={event => setSelectedDate(event.target.value)}
        className="mb-4 rounded-lg border border-slate-300 bg-white px-2 py-1.5" />
        <span className="mb-4 ml-3 text-sm text-slate-600">
  {syncStatus === 'synced' ? '☁ Synced' : syncStatus === 'saving' ? '☁ Saving…' : syncStatus === 'loading' ? '☁ Loading…' : syncStatus === 'error' ? '⚠ Cloud error' : 'Local only'}
</span>
      <EarningSheetTable
        columns={sampleColumns}
        rowCount={registerState.shiftRowCount}
        readRow={rowIndex => rowsOfSelectedDate[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => rowsOfSelectedDate[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => updateEntryCell(draftState.shiftEntries, selectedDate, rowIndex, fieldKey, newValue))}
      />
    </div>
  );
}
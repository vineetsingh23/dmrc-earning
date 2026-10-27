import { useRef } from 'react';
import type { RegisterState } from '../../lib/registerTypes';
import type { StationFacilities } from '../../lib/earningColumns';
import { exportBackupAsJson, exportRowsAsCsv, importBackupFromJson } from '../../handlers/dataTransferHandlers';
import { fillMonthWithSampleData } from '../../lib/sampleDataGenerator';

interface BackupToolbarProps {
  stationName: string;
  date: string;
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  facilities: StationFacilities;
}

const buttonClass = 'rounded-xl border border-bd bg-card px-3.5 py-1.5 font-medium transition hover:-translate-y-0.5 hover:border-ac hover:text-ac';

// rows of one date with their row number in front, ready for CSV
const rowsWithRowNumber = (rowsByIndex: Record<number, Record<string, string>> | undefined, date: string) =>
  Object.entries(rowsByIndex ?? {}).map(([rowIndex, row]) => ({ date, row: Number(rowIndex) + 1, ...row }));

export default function BackupToolbar({ stationName, date, registerState, updateRegisterState, facilities }: BackupToolbarProps) {
  const backupFileInput = useRef<HTMLInputElement>(null);

  const loadSampleData = () => {
    if (!confirm(`This replaces every entry of ${date.slice(0, 7)} for ${stationName} with random sample data. Continue?`)) return;
    updateRegisterState(draftState => fillMonthWithSampleData(draftState, date, facilities));
  };

  const restoreBackup = (backupFile: File) =>
    importBackupFromJson(backupFile, backupData => {
      if (!confirm(`Replace the data of ${stationName} with this backup?`)) return;
      updateRegisterState(draftState => { Object.assign(draftState, backupData); });
    });

  return (
    <div>
      <h3 className="mb-2 font-medium text-slate-700 dark:text-slate-200">
        Sample data and import/export
      </h3>
      <div className="flex flex-wrap gap-2">
        <button className={buttonClass} onClick={loadSampleData}>Load sample data (full month)</button>
        <button className={buttonClass} onClick={() => exportBackupAsJson(stationName, registerState)}>⬇ Export backup</button>
        <button className={buttonClass} onClick={() => exportRowsAsCsv(`${stationName}-shift-${date}.csv`, rowsWithRowNumber(registerState.shiftEntries[date], date))}>⬇ Shift CSV</button>
        <button className={buttonClass} onClick={() => exportRowsAsCsv(`${stationName}-tvm-${date}.csv`, rowsWithRowNumber(registerState.tvmEntries?.[date], date))}>⬇ TVM CSV</button>
        <button className={buttonClass} onClick={() => backupFileInput.current?.click()}>⬆ Import backup</button>
        <input ref={backupFileInput} type="file" accept="application/json" hidden onChange={event => {
          const chosenFile = event.target.files?.[0];
          event.target.value = '';   // lets the same file be chosen again
          if (chosenFile) restoreBackup(chosenFile);
        }} />
      </div>
    </div>
  );
}
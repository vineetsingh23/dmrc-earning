import EarningSheetTable from './earningSheetTable';
import type { RegisterState } from '../lib/registerTypes';
import { tvmEarningColumns } from '../lib/earningColumns';
import { updateEntryCell } from '../handlers/entryCellHandlers';

interface TvmEarningPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
}

export default function TvmEarningPage({ registerState, updateRegisterState, date }: TvmEarningPageProps) {
  const tvmRows = registerState.tvmEntries?.[date] ?? {};
  return (
    <>
      <EarningSheetTable
        columns={tvmEarningColumns}
        rowCount={registerState.tvmRowCount}
        readRow={rowIndex => tvmRows[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => tvmRows[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => {
            draftState.tvmEntries ??= {};
            updateEntryCell(draftState.tvmEntries, date, rowIndex, fieldKey, newValue);
          })}
      />
      <button className="mt-3 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 font-medium hover:border-blue-500"
        onClick={() => updateRegisterState(draftState => { draftState.tvmRowCount++; })}>
        + Add row
      </button>
    </>
  );
}
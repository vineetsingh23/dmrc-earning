import EarningSheetTable from './earningSheetTable';
import type { RegisterState } from '../lib/registerTypes';
import { tvmEarningColumns } from '../lib/earningColumns';
import { updateEntryCell } from '../handlers/entryCellHandler';
import { primaryButtonClass } from '../globalStyles';

interface TvmEarningPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
}

export default function TvmEarningPage({ registerState,updateRegisterState, date }: TvmEarningPageProps) {
  const tvmRows = registerState.tvmEntries?.[date] ?? {};
  return (
    <>
    
      <EarningSheetTable
        columns={tvmEarningColumns}
        gridName='tvm'
        rowCount={registerState.tvmRowCount}
        readRow={rowIndex => tvmRows[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => tvmRows[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => {
            draftState.tvmEntries ??= {};
            updateEntryCell(draftState.tvmEntries, date, rowIndex, fieldKey, newValue);
          })}
      />
      <button className={`${primaryButtonClass} mt-3`}
        onClick={() => updateRegisterState(draftState => { draftState.tvmRowCount++; })}>
        + Add row
      </button>
    </>
  );
}
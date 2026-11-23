import EarningSheetTable from './earningSheetTable';
import type { RegisterState } from '../../lib/registerTypes';
import { tvmEarningColumns } from '../../lib/earningColumns';
import { deleteEntryRow, updateEntryCell } from '../../handlers/entryCellHandler';
import { primaryButtonClass } from '../../globalStyles';

interface TvmEarningPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
}

export default function TvmEarningPage({ registerState,updateRegisterState, date }: TvmEarningPageProps) {
  const tvmRows = registerState.tvmEntries?.[date] ?? {};
  return (
    <>
       <div className="flex justify-between mb-4">
                <header className="page-intro">
                 <h1 className="page-info">TVM Earning</h1>
                </header>
      <button className={`${primaryButtonClass}`}
        onClick={() => updateRegisterState(draftState => { draftState.tvmRowCount++; })}>
        + Add row
      </button>
       </div>
      <EarningSheetTable
        columns={tvmEarningColumns}
        gridName='tvm'
        frozenColumnCount={0}
        rowCount={registerState.tvmRowCount}
        minimumAdditionalRowCount={12}
        onDeleteRow={rowIndex =>
          updateRegisterState(draftState => {
            deleteEntryRow(draftState.tvmEntries, date, rowIndex, 12);
            draftState.tvmRowCount = Math.max(12, draftState.tvmRowCount - 1);
          })
        }
        readRow={rowIndex => tvmRows[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => tvmRows[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => {
            draftState.tvmEntries ??= {};
            updateEntryCell(draftState.tvmEntries, date, rowIndex, fieldKey, newValue);
          })}
      />
      
    </>
  );
}

import EarningSheetTable from './earningSheetTable';
import type { RegisterState } from '../../lib/registerTypes';
import { tvmEarningColumns } from '../../lib/earningColumns';
import { updateEntryCell } from '../../handlers/entryCellHandler';
import { pageHeadingClass } from '../../globalStyles';

interface TvmEarningPageProps {
  registerState: RegisterState;
  updateRegisterState: (applyChange: (draftState: RegisterState) => void) => void;
  date: string;
}

export default function TvmEarningPage({ registerState,updateRegisterState, date }: TvmEarningPageProps) {
  const tvmRows = registerState.tvmEntries?.[date] ?? {};
  return (
    <div className="space-y-3">
      <h2 className={pageHeadingClass}>TVM Earning</h2>
      <EarningSheetTable
        columns={tvmEarningColumns}
        gridName='tvm'
        frozenColumnCount={0}
        uniformColumnWidth={100}
        mergeFooterLabel={false}
        rowCount={registerState.tvmRowCount}
        readRow={rowIndex => tvmRows[rowIndex] ?? {}}
        readEntryValue={(rowIndex, fieldKey) => tvmRows[rowIndex]?.[fieldKey] ?? ''}
        writeEntryValue={(rowIndex, fieldKey, newValue) =>
          updateRegisterState(draftState => {
            draftState.tvmEntries ??= {};
            updateEntryCell(draftState.tvmEntries, date, rowIndex, fieldKey, newValue);
          })}
        onAddRow={() =>
          updateRegisterState(draftState => {
            draftState.tvmRowCount += 1;
          })
        }
      />
    </div>
  );
}
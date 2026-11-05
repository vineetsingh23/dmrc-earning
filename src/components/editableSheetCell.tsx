import { memo } from 'react';
import { frozenCellStyle } from './sheetFrozenColumns';
// import { tableInputClass } from '../globalStyles';

type WriteEntryValue = (rowIndex: number, fieldKey: string, newValue: string) => void;

interface EditableSheetCellProps {
  gridName: string; rowIndex: number; columnIndex: number; fieldKey: string; isNumeric: boolean; value: string;
  frozenIndex?: number;   
  isAmount:boolean;                                           // set for a cell in a frozen column
  writeValueReference: { current: WriteEntryValue | undefined };     // always holds the newest write function
}

// one typed cell; React redraws it only when its own value or position changes
const EditableSheetCell = memo(function EditableSheetCell({
  gridName, rowIndex, columnIndex, fieldKey, isNumeric, value, frozenIndex, writeValueReference,
}: EditableSheetCellProps) {
  const tableInputClass = 'bg-blue-100 border-slate-100 border px-1 py-0.5'
  return (
    <td className="" style={frozenIndex === undefined ? undefined : frozenCellStyle(frozenIndex, 5)}>
      <input
        data-grid={gridName} data-row={rowIndex} data-column={columnIndex}
        value={value}
        inputMode={isNumeric ? 'decimal' : 'text'}
        onFocus={event => event.target.select()}
        onChange={event => writeValueReference.current?.(rowIndex, fieldKey, event.target.value)}
        className={`${tableInputClass} ${isNumeric ? 'text-right max-w-17' : 'text-left max-w-25'} `}
      />
    </td>
  );
}, (previous, next) =>
  previous.value === next.value && previous.rowIndex === next.rowIndex && previous.columnIndex === next.columnIndex
  && previous.fieldKey === next.fieldKey && previous.gridName === next.gridName && previous.frozenIndex === next.frozenIndex);

export default EditableSheetCell;
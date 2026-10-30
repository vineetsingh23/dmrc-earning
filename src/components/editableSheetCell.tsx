import { memo } from 'react';
import { tableCellClass, tableInputClass } from '../globalStyles';

type WriteEntryValue = (rowIndex: number, fieldKey: string, newValue: string) => void;

interface EditableSheetCellProps {
  gridName: string; rowIndex: number; columnIndex: number; fieldKey: string; isNumeric: boolean; value: string;
  writeValueReference: { current: WriteEntryValue | undefined };   // always holds the newest write function
}

// one typed cell; React redraws it only when its own value or position changes
const EditableSheetCell = memo(function EditableSheetCell({
  gridName, rowIndex, columnIndex, fieldKey, isNumeric, value, writeValueReference,
}: EditableSheetCellProps) {
  return (
    <td className={tableCellClass}>
      <input
        data-grid={gridName} data-row={rowIndex} data-column={columnIndex}
        value={value} inputMode={isNumeric ? 'decimal' : 'text'}
        onFocus={event => event.target.select()}
        onChange={event => writeValueReference.current?.(rowIndex, fieldKey, event.target.value)}
        className={`${tableInputClass} ${isNumeric ? 'min-w-[70px] text-right' : 'min-w-[110px] text-left'}`}
      />
    </td>
  );
}, (previous, next) =>
  previous.value === next.value && previous.rowIndex === next.rowIndex && previous.columnIndex === next.columnIndex
  && previous.fieldKey === next.fieldKey && previous.gridName === next.gridName);

export default EditableSheetCell;
import { memo, useEffect, useState } from "react";
import { tableCellClass, tableInputClass } from "../globalStyles";

type WriteEntryValue = (
  rowIndex: number,
  fieldKey: string,
  newValue: string,
) => void;

function parseTimeInput(input: string): { complete: boolean; value?: string } {
  const compactTime = /^(\d{2})(\d{2})$/.exec(input);
  const time = compactTime
    ? `${compactTime[1]}:${compactTime[2]}`
    : input;

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { complete: false };
  }

  const [hours, minutes] = time.split(":").map(Number);
  return hours <= 23 && minutes <= 59
    ? { complete: true, value: time }
    : { complete: true };
}

interface EditableSheetCellProps {
  gridName: string;
  rowIndex: number;
  columnIndex: number;
  fieldKey: string;
  isNumeric: boolean;
  isTime?: boolean;
  inputWidth?: number;
  value: string;
  writeValueReference: { current: WriteEntryValue | undefined };
  extraClass?:string;
  style?: React.CSSProperties;
}

// one typed cell; React redraws it only when its own value or position changes
const EditableSheetCell = memo(
  function EditableSheetCell({
    gridName,
    rowIndex,
    columnIndex,
    fieldKey,
    isNumeric,
    isTime = false,
    inputWidth,
    value,
    writeValueReference,
    extraClass= '',
    style,
  }: EditableSheetCellProps) {
    const [timeDraft, setTimeDraft] = useState(value);

    useEffect(() => {
      setTimeDraft(value);
    }, [value]);

    return (
      <td className={`${tableCellClass} ${extraClass}`} style={style}>
        <input
          type="text"
          inputMode={isTime ? "text" : isNumeric ? "decimal" : undefined}
          maxLength={isTime ? 5 : undefined}
          data-grid={gridName}
          data-row={rowIndex}

          data-column={columnIndex}
          value={isTime ? timeDraft : value}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (!isTime) {
              writeValueReference.current?.(rowIndex, fieldKey, inputValue);
              return;
            }

            setTimeDraft(inputValue);
            const parsedTime = parseTimeInput(inputValue);
            const isPartialTime = /^\d{0,4}$/.test(inputValue) ||
              /^\d{0,2}:\d{0,2}$/.test(inputValue);

            if (parsedTime.value) {
              event.currentTarget.setCustomValidity("");
              setTimeDraft(parsedTime.value);
              writeValueReference.current?.(
                rowIndex,
                fieldKey,
                parsedTime.value,
              );
            } else if (inputValue === "" || (!parsedTime.complete && isPartialTime)) {
              event.currentTarget.setCustomValidity("");
              if (inputValue === "") {
                writeValueReference.current?.(rowIndex, fieldKey, "");
              }
            } else {
              event.currentTarget.setCustomValidity(
                "Enter a valid 24-hour time from 00:00 to 23:59.",
              );
              event.currentTarget.reportValidity();
            }
          }}
          onBlur={(event) => {
            if (!isTime || timeDraft === "") return;
            const parsedTime = parseTimeInput(timeDraft);
            if (!parsedTime.value) {
              event.currentTarget.setCustomValidity(
                "Enter a valid 24-hour time from 00:00 to 23:59.",
              );
              event.currentTarget.reportValidity();
            } else {
              event.currentTarget.setCustomValidity("");
            }
          }}
          className={`${tableInputClass} ${isNumeric ? "text-right" : "text-left"}`}
          style={{ width: inputWidth ?? (isNumeric ? 100: 120), minWidth:0}}
        />
      </td>
    );
  },
  (previous, next) =>
    previous.value === next.value &&
    previous.rowIndex === next.rowIndex &&
    previous.columnIndex === next.columnIndex &&
    previous.fieldKey === next.fieldKey &&
    previous.gridName === next.gridName &&
    previous.isTime === next.isTime &&
    previous.inputWidth === next.inputWidth &&
    previous.extraClass === next.extraClass

);

export default EditableSheetCell;

import type { RegisterState } from "../lib/registerTypes";
import {
  dayMonthYear,
  miscColumnIndex,
  type MiscKind,
} from "../lib/miscEntries";
import { updateDetailListCell } from "./detailListHandlers";

// writes one typed value of a misc debit / credit row; the first value typed in a row also fills its date with the selected date
export function updateMiscEntryCell(
  state: RegisterState,
  date: string,
  kind: MiscKind,
  rowIndex: number,
  columnIndex: number,
  newValue: string,
) {
  updateDetailListCell(state, date, kind, rowIndex, columnIndex, newValue);
  const row = state.detailLists[date]?.[kind]?.[rowIndex];
  if (!row) return;
  const dateIsEmpty = !(row[miscColumnIndex.date] ?? "").trim();
  if (columnIndex !== miscColumnIndex.date && newValue.trim() && dateIsEmpty)
    row[miscColumnIndex.date] = dayMonthYear(date);
}

import { createEmptyRegisterState, type MiscKind, type RegisterState } from '../lib/registerTypes';
import { dayMonthYear, miscColumnIndex, miscRowCountOf } from '../lib/miscEntries';

// writes one typed value of a misc debit / credit row; the first value typed in a row also fills its date with the selected date
export function updateMiscEntryCell(state: RegisterState, selectedDate: string, kind: MiscKind, rowIndex: number, columnIndex: number, newValue: string) {
  state.miscEntries ??= createEmptyRegisterState().miscEntries;
  const row = ((state.miscEntries![kind] ??= [])[rowIndex] ??= []);
  row[columnIndex] = newValue;
  const dateIsEmpty = !(row[miscColumnIndex.date] ?? '').trim();
  if (columnIndex !== miscColumnIndex.date && newValue.trim() && dateIsEmpty) row[miscColumnIndex.date] = dayMonthYear(selectedDate);
}

// one more row in the card
export function addMiscRow(state: RegisterState, kind: MiscKind) {
  const currentRowCount = miscRowCountOf(state, kind);
  state.miscRowCounts = { ...createEmptyRegisterState().miscRowCounts!, ...(state.miscRowCounts ?? {}), [kind]: currentRowCount + 1 };
}
import type { DetailListKind, RegisterState } from '../lib/registerTypes';

// writes one typed value into a list: [date][listKind][rowIndex][columnIndex]
export function updateDetailListCell(state: RegisterState, date: string, listKind: DetailListKind, rowIndex: number, columnIndex: number, newValue: string) {
  state.detailLists ??= {};
  const listsOfDate = (state.detailLists[date] ??= {});
  const listRows = (listsOfDate[listKind] ??= []);
  (listRows[rowIndex] ??= [])[columnIndex] = newValue;
}
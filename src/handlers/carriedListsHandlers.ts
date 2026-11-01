import type { DetailListKind, RegisterState } from '../lib/registerTypes';
import { effectiveDetailListRows } from '../lib/carriedLists';
import { updateDetailListCell } from './detailListHandlers';

// writes one typed value into a list that carries over to later dates.
// The first change on a date copies the carried rows into that date, so the other rows keep their values.
export function updateCarriedDetailListCell(state: RegisterState, date: string, kind: DetailListKind, rowIndex: number, columnIndex: number, newValue: string) {
  state.detailLists ??= {};
  const listsOfDate = (state.detailLists[date] ??= {});
  if (!listsOfDate[kind]) listsOfDate[kind] = effectiveDetailListRows(state, date, kind).map(row => [...row]);
  updateDetailListCell(state, date, kind, rowIndex, columnIndex, newValue);
}
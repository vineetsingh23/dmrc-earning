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

export function addCarriedDetailListRow(
  state: RegisterState,
  date: string,
  kind: DetailListKind,
  defaultRows: string[][],
  newRow: string[],
) {
  const rows = effectiveDetailListRows(state, date, kind).map(row => [...row]);
  while (rows.length < defaultRows.length) rows.push([...defaultRows[rows.length]]);
  rows.push([...newRow]);

  state.detailLists ??= {};
  const listsOfDate = (state.detailLists[date] ??= {});
  listsOfDate[kind] = rows;
}

export function deleteCarriedDetailListRow(
  state: RegisterState,
  date: string,
  kind: DetailListKind,
  rowIndex: number,
  minimumRowCount: number,
) {
  if (rowIndex < minimumRowCount) return;

  const rows = effectiveDetailListRows(state, date, kind).map(row => [...row]);
  rows.splice(rowIndex, 1);

  state.detailLists ??= {};
  const listsOfDate = (state.detailLists[date] ??= {});
  listsOfDate[kind] = rows;
}
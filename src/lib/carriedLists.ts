import type { DetailListKind, RegisterState } from './registerTypes';

// rows of a list that stays visible on the next dates: the list typed for this date, otherwise the one of the latest earlier date that has it
export function effectiveDetailListRows(state: RegisterState, date: string, kind: DetailListKind): string[][] {
  const ownRows = state.detailLists?.[date]?.[kind];
  if (ownRows) return ownRows;
  const earlierDates = Object.keys(state.detailLists ?? {}).filter(savedDate => savedDate < date && state.detailLists[savedDate][kind]).sort();
  const latestDate = earlierDates[earlierDates.length - 1];
  return latestDate ? state.detailLists[latestDate][kind] : [];
}
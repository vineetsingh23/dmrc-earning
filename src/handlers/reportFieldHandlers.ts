import type { RegisterState } from '../lib/registerTypes';

// writes one typed report field of a date
export function updateReportField(state: RegisterState, date: string, fieldKey: string, newValue: string) {
  state.reportFields ??= {};
  (state.reportFields[date] ??= {})[fieldKey] = newValue;
}

// fills the empty report fields of a date with the values of the latest earlier date that has any; typed values stay
export function copyReportFieldsFromPreviousDate(state: RegisterState, date: string): boolean {
  const earlierDates = Object.keys(state.reportFields ?? {}).filter(savedDate => savedDate < date).sort();
  const previousDate = earlierDates[earlierDates.length - 1];
  if (!previousDate) return false;
  state.reportFields![date] = { ...state.reportFields![previousDate], ...(state.reportFields![date] ?? {}) };
  return true;
}
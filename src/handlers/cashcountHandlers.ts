import type { RegisterState } from '../lib/registerTypes';
import { parseNumber } from '../lib/earningColumns';
import { recordCountChange } from '../lib/cashCountHistory';

// writes one note / coin / loose coin count; counts not typed yet start from the automatic ones shown on screen.
// every change is also noted, so it can be reviewed with Back and Next
export function updateCashCount(state: RegisterState, date: string, countsShownOnScreen: Record<string, number>, countKey: string, typedValue: string, now: number = Date.now()) {
  const countsBefore = state.cashCounts[date] ?? countsShownOnScreen;
  const previousValue = countsBefore[countKey] ?? 0;
  const newValue = parseNumber(typedValue);
  state.cashCounts[date] = { ...countsBefore, [countKey]: newValue };
  recordCountChange(state, date, countKey, previousValue, newValue, now);
}
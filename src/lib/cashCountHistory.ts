import type { CashCountHistory, RegisterState } from './registerTypes';

const mergeWithinMilliseconds = 2000;   // digits typed one after the other in the same box count as one change
const changesKeptPerDate = 50;
const datesKept = 31;

const historyOf = (state: RegisterState, date: string): CashCountHistory => (state.cashCountHistory ??= {})[date] ??= { changes: [], position: 0 };

// notes one change of a count; a new change after going back throws away the changes that were undone
export function recordCountChange(state: RegisterState, date: string, countKey: string, from: number, to: number, now: number) {
  if (from === to) return;
  const history = historyOf(state, date);
  history.changes = history.changes.slice(0, history.position);
  const lastChange = history.changes[history.changes.length - 1];
  if (lastChange && lastChange.countKey === countKey && now - lastChange.at <= mergeWithinMilliseconds) {
    lastChange.to = to;
    lastChange.at = now;
    if (lastChange.from === lastChange.to) history.changes.pop();       // typed and changed back: nothing left to review
  } else {
    history.changes.push({ countKey, from, to, at: now });
  }
  if (history.changes.length > changesKeptPerDate) history.changes.splice(0, history.changes.length - changesKeptPerDate);
  history.position = history.changes.length;

  // only the newest dates keep a history
  const savedDates = Object.keys(state.cashCountHistory!).sort();
  savedDates.slice(0, Math.max(0, savedDates.length - datesKept)).forEach(oldDate => delete state.cashCountHistory![oldDate]);
}

const setCount = (state: RegisterState, date: string, countKey: string, value: number) => {
  state.cashCounts[date] = { ...(state.cashCounts[date] ?? {}), [countKey]: value };
};

// Back: puts the count of the last applied change back to what it was before
export function stepCashCountBack(state: RegisterState, date: string): boolean {
  const history = state.cashCountHistory?.[date];
  if (!history || history.position <= 0) return false;
  const change = history.changes[history.position - 1];
  setCount(state, date, change.countKey, change.from);
  history.position--;
  return true;
}

// Next: applies the change that was stepped back
export function stepCashCountForward(state: RegisterState, date: string): boolean {
  const history = state.cashCountHistory?.[date];
  if (!history || history.position >= history.changes.length) return false;
  const change = history.changes[history.position];
  setCount(state, date, change.countKey, change.to);
  history.position++;
  return true;
}

// after a bank transfer the notes were taken out, so older steps no longer fit and are dropped
export function clearCashCountHistory(state: RegisterState, date: string) {
  if (state.cashCountHistory) delete state.cashCountHistory[date];
}
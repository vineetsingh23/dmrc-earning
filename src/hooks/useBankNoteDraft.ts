import { useMemo, useState } from 'react';
import type { BankTransfer } from '../lib/registerTypes';
import { bankNoteValues } from '../lib/businessRules';
import { parseNumber } from '../lib/earningColumns';
import { findNotesExceedingStock, suggestBankNoteCounts, sumNoteCounts } from '../handlers/cashToBankHandlers';

// note counts shown in the cash-to-bank card: automatic until the user types, fixed once sent
export function useBankNoteDraft(date: string, cashCountsInHand: Record<string, number>, amountDueToBank: number, existingTransfer: BankTransfer | undefined) {
  const [typedCounts, setTypedCounts] = useState<{ date: string; counts: Record<string, string> | null } | null>(null);
  const countsForDate = typedCounts?.date === date ? typedCounts.counts : null;

  const suggestedNoteCounts = useMemo(() => suggestBankNoteCounts(cashCountsInHand, amountDueToBank), [cashCountsInHand, amountDueToBank]);
  const noteCountsToSend: Record<number, number> = existingTransfer
    ? (existingTransfer.noteCounts as Record<number, number>)
    : Object.fromEntries(bankNoteValues.map(noteValue => [
      noteValue,
      countsForDate
        ? Math.min(Math.max(0, Math.floor(parseNumber(countsForDate[noteValue]))), cashCountsInHand[String(noteValue)] ?? 0)
        : suggestedNoteCounts[noteValue],
    ]));

  const inputValueFor = (noteValue: number) => {
    if (!countsForDate) return String(suggestedNoteCounts[noteValue] || '');
    const typedValue = countsForDate[noteValue] ?? '';
    if (!typedValue) return '';
    return String(Math.min(
      Math.max(0, Math.floor(parseNumber(typedValue))),
      cashCountsInHand[String(noteValue)] ?? 0,
    ));
  };
  const changeNoteCount = (noteValue: number, typedValue: string) => {
    const startingCounts = countsForDate ?? Object.fromEntries(bankNoteValues.map(value => [value, String(suggestedNoteCounts[value])]));
    const maxAvailable = cashCountsInHand[String(noteValue)] ?? 0;
    const boundedValue = typedValue === ''
      ? ''
      : String(Math.min(Math.max(0, Math.floor(parseNumber(typedValue))), maxAvailable));
    setTypedCounts({ date, counts: { ...startingCounts, [noteValue]: boundedValue } });
  };

  return {
    noteCountsToSend,
    noteTotalToSend: sumNoteCounts(noteCountsToSend),
    notesExceedingStock: findNotesExceedingStock(noteCountsToSend, cashCountsInHand),
    inputValueFor, changeNoteCount,
    resetToSuggestedCounts: () => setTypedCounts({ date, counts: null }),
  };
}
import type { RegisterState } from '../lib/registerTypes';
import { bankNoteValues } from '../lib/businessRules';

// as many ₹500 notes as are in hand, then ₹200, then ₹100
export function suggestBankNoteCounts(cashCountsInHand: Record<string, number>, amountToBank: number): Record<number, number> {
  let remainingAmount = amountToBank;
  const suggestedCounts: Record<number, number> = {};
  bankNoteValues.forEach(noteValue => {
    const notesTaken = Math.min(cashCountsInHand[String(noteValue)] ?? 0, Math.floor(remainingAmount / noteValue));
    suggestedCounts[noteValue] = notesTaken;
    remainingAmount -= notesTaken * noteValue;
  });
  // not enough notes in hand: the rest is still shown in 500 / 200 / 100
  bankNoteValues.forEach(noteValue => {
    const extraNotes = Math.floor(remainingAmount / noteValue);
    suggestedCounts[noteValue] += extraNotes;
    remainingAmount -= extraNotes * noteValue;
  });
  return suggestedCounts;
}

export const sumNoteCounts = (noteCounts: Record<number, number>) =>
  bankNoteValues.reduce((total, noteValue) => total + noteValue * (noteCounts[noteValue] ?? 0), 0);

// notes the user wants to send but does not hold
export const findNotesExceedingStock = (noteCounts: Record<number, number>, cashCountsInHand: Record<string, number>) =>
  bankNoteValues.filter(noteValue => (noteCounts[noteValue] ?? 0) > (cashCountsInHand[String(noteValue)] ?? 0));

export interface BankTransferRequest {
  date: string;
  amountToBank: number;
  slipNumber: string;
  noteCountsToSend: Record<number, number>;
  cashCountsInHand: Record<string, number>;
}

// saves the transfer and takes the sent notes out of cash in possession
export function recordBankTransfer(state: RegisterState, request: BankTransferRequest) {
  const { date, amountToBank, slipNumber, noteCountsToSend, cashCountsInHand } = request;
  state.cashCounts ??= {};
  state.bankTransfers ??= {};
  const remainingCounts = { ...(state.cashCounts[date] ?? cashCountsInHand) };
  bankNoteValues.forEach(noteValue => {
    const key = String(noteValue);
    remainingCounts[key] = Math.max(0, (remainingCounts[key] ?? 0) - (noteCountsToSend[noteValue] ?? 0));
  });
  state.cashCounts[date] = remainingCounts;
  state.bankTransfers[date] = { amount: amountToBank, slipNumber, noteCounts: { ...noteCountsToSend }, sentAt: new Date().toISOString() };
}
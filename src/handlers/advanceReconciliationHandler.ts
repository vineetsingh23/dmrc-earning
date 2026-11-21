
import type { RegisterRow, RegisterState } from "../lib/registerTypes";
import { tomOperators } from "../lib/businessRules";
import { parseNumber } from "../lib/earningColumns";
import { cashDepositedByOperator } from "../lib/shiftEntrycolumns";
import { effectiveDetailListRows } from "../lib/carriedLists";
import { updateCarriedDetailListCell } from "./carriedListsHandlers";

interface AdvanceMatchView {
  eligible: boolean;
  confirmed: boolean;
  display: string;
}

const getOperatorNumber = (value: unknown): string => {
  const match = String(value ?? "").match(/\d+/);
  return match?.[0] ?? "";
};

const getOperatorIndex = (operatorNumber: string): number =>
  tomOperators.findIndex(
    (operator) => operator.tomNumber === operatorNumber
  );

const formatDifference = (difference: number): string =>
  `₹${Math.abs(difference).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${difference > 0 ? "Due" : "Excess"}`;

/**
 * Calculates whether an operator's deposited cash matches
 * their Advance Received amount.
 */
export function getAdvanceMatchView(
  state: RegisterState,
  date: string,
  row: RegisterRow
): AdvanceMatchView {
  const confirmed = row.advanceMatchConfirmed === "true";

  // A confirmed row uses its saved snapshot because its
  // Advance Received amount has already been cleared.
  if (confirmed) {
    return {
      eligible: true,
      confirmed: true,
      display: "",
    };
  }

  const operatorNumber = getOperatorNumber(row.cccNumber);
  const operatorIndex = getOperatorIndex(operatorNumber);

  if (operatorIndex < 0) {
    return {
      eligible: false,
      confirmed: false,
      display: "",
    };
  }

  const advanceRows = effectiveDetailListRows(
    state,
    date,
    "advanceReceived"
  );

  const advanceAmount = parseNumber(
    advanceRows[operatorIndex]?.[1]
  );

  const depositedAmount = cashDepositedByOperator(row);

  const advancePaise = Math.round(advanceAmount * 100);
  const depositedPaise = Math.round(depositedAmount * 100);

  if (advancePaise === 0 && depositedPaise === 0) {
    return {
      eligible: false,
      confirmed: false,
      display: "",
    };
  }

  const difference = (advancePaise - depositedPaise) / 100;

  if (difference === 0 && advancePaise > 0) {
    return {
      eligible: true,
      confirmed: false,
      display: "",
    };
  }

  return {
    eligible: false,
    confirmed: false,
    display: formatDifference(difference),
  };
}

/**
 * Manually confirm or undo the advance reconciliation.
 */
export function toggleAdvanceMatch(
  state: RegisterState,
  date: string,
  rowIndex: number,
  checked: boolean
): void {
  const row = state.shiftEntries?.[date]?.[rowIndex];

  if (!row) return;

  if (checked) {
    // Only permit confirmation when the amounts match.
    const match = getAdvanceMatchView(state, date, row);

    if (!match.eligible || match.confirmed) return;

    const operatorNumber = getOperatorNumber(row.cccNumber);
    const operatorIndex = getOperatorIndex(operatorNumber);

    if (operatorIndex < 0) return;

    const advanceRows = effectiveDetailListRows(
      state,
      date,
      "advanceReceived"
    );

    const advanceAmount = parseNumber(
      advanceRows[operatorIndex]?.[1]
    );

    const depositedAmount = cashDepositedByOperator(row);

    // Verify again immediately before clearing the amount.
    if (
      advanceAmount <= 0 ||
      Math.round(advanceAmount * 100) !==
        Math.round(depositedAmount * 100)
    ) {
      return;
    }

    // Save the original amount and operator in the shift row.
    row.advanceMatchAmountSnapshot = String(advanceAmount);
    row.advanceMatchOperatorSnapshot = operatorNumber;
    row.advanceMatchConfirmed = "true";

    // Clear only this operator's Advance Received amount.
    updateCarriedDetailListCell(
      state,
      date,
      "advanceReceived",
      operatorIndex,
      1,
      ""
    );

    return;
  }

  // Undo confirmation and restore the saved advance.
  if (row.advanceMatchConfirmed !== "true") return;

  const originalAmount = row.advanceMatchAmountSnapshot ?? "";
  const originalOperator =
    row.advanceMatchOperatorSnapshot ?? "";

  const originalOperatorIndex =
    getOperatorIndex(originalOperator);

  if (originalOperatorIndex >= 0) {
    updateCarriedDetailListCell(
      state,
      date,
      "advanceReceived",
      originalOperatorIndex,
      1,
      originalAmount
    );
  }

  // Clear confirmation metadata.
  row.advanceMatchConfirmed = "";
  row.advanceMatchAmountSnapshot = "";
  row.advanceMatchOperatorSnapshot = "";
}

/**
 * Restore the advance before editing a confirmed Shift Entry row.
 */
export function releaseAdvanceMatchBeforeShiftEdit(
  state: RegisterState,
  date: string,
  rowIndex: number
): void {
  const row = state.shiftEntries?.[date]?.[rowIndex];

  if (row?.advanceMatchConfirmed === "true") {
    toggleAdvanceMatch(state, date, rowIndex, false);
  }
}

/**
 * Advance Received is a running daily balance for a TOM. Once a shift's
 * match is confirmed, later entries here belong to subsequent shifts and
 * must not release or uncheck that earlier confirmation.
 */
export function releaseAdvanceMatchBeforeAdvanceEdit(
  _state: RegisterState,
  _date: string,
  _operatorNumber: string
): void {
  // Intentionally keep confirmed shift matches unchanged when the daily
  // Advance Received value is edited for another shift.
}

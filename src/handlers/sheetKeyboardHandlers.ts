
import type { KeyboardEvent } from "react";

// Arrow / Enter / Tab navigation for tables whose cells carry data-grid (table name), data-row and data-column
export function handleSheetKeyDown(event: KeyboardEvent<HTMLElement>) {
  const focusedCell = event.target as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

  const gridName = focusedCell.dataset?.grid;
  if (!gridName) return;

  const pressedKey = event.key;

  if (
    focusedCell.tagName === "SELECT" &&
    (pressedKey === "ArrowUp" || pressedKey === "ArrowDown")
  ) {
    return;
  }

  if (
    focusedCell.tagName === "TEXTAREA" &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(
      pressedKey,
    )
  ) {
    return;
  }

  let rowIndex = Number(focusedCell.dataset.row);
  let columnIndex = Number(focusedCell.dataset.column);

  const gridElement = event.currentTarget;

  const gridColumns = Array.from(
    gridElement.querySelectorAll<HTMLElement>(`[data-grid="${gridName}"]`),
    (cell) => Number(cell.dataset.column),
  );

  const lastColumnIndex = Math.max(...gridColumns);

  if (
    pressedKey === "ArrowDown" ||
    (pressedKey === "Enter" && !event.shiftKey)
  ) {
    rowIndex++;
  } else if (
    pressedKey === "ArrowUp" ||
    (pressedKey === "Enter" && event.shiftKey)
  ) {
    rowIndex--;
  } else if (pressedKey === "ArrowRight") {
    columnIndex++;
  } else if (pressedKey === "ArrowLeft") {
    columnIndex--;
  } else if (pressedKey === "Tab") {
    if (event.shiftKey) {
      columnIndex--;

      if (columnIndex < 0) {
        columnIndex = lastColumnIndex;
        rowIndex--;
      }
    } else {
      columnIndex++;

      if (columnIndex > lastColumnIndex) {
        columnIndex = 0;
        rowIndex++;
      }
    }
  } else {
    return;
  }

  const targetCell =
    gridElement.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[data-grid="${gridName}"][data-row="${rowIndex}"][data-column="${columnIndex}"]`,
    );

  // At the edge of the table, allow normal browser behaviour.
  if (!targetCell) return;

  event.preventPrevent?.();
  event.preventDefault();

  // Prevent native browser focus scrolling. This avoids the large
  // horizontal jump when moving from a frozen cell to the next cell.
  targetCell.focus({ preventScroll: true });

  if (
    targetCell instanceof HTMLInputElement ||
    targetCell instanceof HTMLTextAreaElement
  ) {
    targetCell.select();
  }

  const targetRow = targetCell.closest("tr");
  const targetCellElement = targetCell.closest("td");

  if (!targetRow || !targetCellElement) return;

  const targetStyle = window.getComputedStyle(targetCellElement);

  if (targetStyle.position === "sticky" && targetStyle.left !== "auto") {
    return;
  }

  const cells = Array.from(
    targetRow.querySelectorAll<HTMLElement>("td"),
  );

  const targetIndex = cells.indexOf(targetCellElement);
  if (targetIndex < 0) return;

  const bounds = gridElement.getBoundingClientRect();
  const containerLeft = bounds.left + gridElement.clientLeft;
  const containerRight = bounds.right - gridElement.clientLeft;

  // Calculate only sticky columns to the left of the destination.
  // Pinned-right columns must not contribute to the left scroll boundary.
  const frozenLeft = cells
    .slice(0, targetIndex)
    .filter((cell) => {
      const style = window.getComputedStyle(cell);
      return style.position === "sticky" && style.left !== "auto";
    })
    .reduce(
      (right, cell) =>
        Math.max(right, cell.getBoundingClientRect().right),
      containerLeft,
    );

  const pinnedRight = cells
    .slice(targetIndex + 1)
    .filter((cell) => {
      const style = window.getComputedStyle(cell);
      return style.position === "sticky" && style.right !== "auto";
    })
    .reduce(
      (left, cell) =>
        Math.min(left, cell.getBoundingClientRect().left),
      containerRight,
    );

  const targetRect = targetCellElement.getBoundingClientRect();

  if (targetRect.left < frozenLeft) {
    // Reveal the destination beside the frozen columns without jumping
    // to the next scroll snap position.
    gridElement.scrollLeft -= frozenLeft - targetRect.left;
  } else if (targetRect.right > pinnedRight) {
    gridElement.scrollLeft += targetRect.right - pinnedRight;
  }
}


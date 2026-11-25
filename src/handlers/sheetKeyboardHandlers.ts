import type { KeyboardEvent } from 'react';

/** Center a focused sheet cell in the visible scrollport without moving the page vertically. */
export function keepSheetCellVisible(cell: HTMLElement) {
  const targetCell = cell.closest<HTMLElement>('td');
  const table = cell.closest<HTMLTableElement>('table');
  const scrollContainer = table?.parentElement;
  const row = targetCell?.closest('tr');

  if (!targetCell || !scrollContainer || !row) return;
  if (window.getComputedStyle(targetCell).position === 'sticky') return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const containerLeft = containerRect.left + scrollContainer.clientLeft;
  const containerRight = containerLeft + scrollContainer.clientWidth;
  const stickyCells = Array.from(row.querySelectorAll<HTMLElement>('td')).filter(
    (rowCell) => window.getComputedStyle(rowCell).position === 'sticky',
  );

  const frozenRight = stickyCells
    .filter((rowCell) => window.getComputedStyle(rowCell).left !== 'auto')
    .reduce((right, rowCell) => Math.max(right, rowCell.getBoundingClientRect().right), containerLeft);
  const pinnedLeft = stickyCells
    .filter((rowCell) => window.getComputedStyle(rowCell).right !== 'auto')
    .reduce((left, rowCell) => Math.min(left, rowCell.getBoundingClientRect().left), containerRight);

  const visibleLeft = Math.max(containerLeft, frozenRight);
  const visibleRight = Math.min(containerRight, pinnedLeft);
  const targetRect = targetCell.getBoundingClientRect();
  const targetCenter = (targetRect.left + targetRect.right) / 2;
  const visibleCenter = (visibleLeft + visibleRight) / 2;

  // Centering leaves neighboring columns visible on both sides of the focused cell.
  // The browser clamps scrollLeft at the sheet's start/end, where centering may not be possible.
  scrollContainer.scrollLeft += targetCenter - visibleCenter;
}

// Arrow / Enter / Tab navigation for tables whose cells carry data-grid (table name), data-row and data-column
export function handleSheetKeyDown(event: KeyboardEvent<HTMLElement>) {
  const focusedCell = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const gridName = focusedCell.dataset?.grid;
  if (!gridName) return;
  const pressedKey = event.key;
  if (focusedCell.tagName === 'SELECT' && (pressedKey === 'ArrowUp' || pressedKey === 'ArrowDown')) return;   // keep the dropdown usable
  if (focusedCell.tagName === 'TEXTAREA' && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(pressedKey)) return;
  let rowIndex = Number(focusedCell.dataset.row), columnIndex = Number(focusedCell.dataset.column);
  const gridElement = event.currentTarget;
  const gridColumns = Array.from(
    gridElement.querySelectorAll<HTMLElement>(`[data-grid="${gridName}"]`),
    cell => Number(cell.dataset.column),
  );
  const lastColumnIndex = Math.max(...gridColumns);

  if (pressedKey === 'ArrowDown' || (pressedKey === 'Enter' && !event.shiftKey)) rowIndex++;
  else if (pressedKey === 'ArrowUp' || (pressedKey === 'Enter' && event.shiftKey)) rowIndex--;
  else if (pressedKey === 'ArrowRight') columnIndex++;
  else if (pressedKey === 'ArrowLeft') columnIndex--;
  else if (pressedKey === 'Tab') {
    if (event.shiftKey) { columnIndex--; if (columnIndex < 0) { columnIndex = lastColumnIndex; rowIndex--; } }
    else { columnIndex++; if (columnIndex > lastColumnIndex) { columnIndex = 0; rowIndex++; } }
  } else return;

  const targetCell = gridElement.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[data-grid="${gridName}"][data-row="${rowIndex}"][data-column="${columnIndex}"]`);
  if (!targetCell) return;   // at the edge of the table: let the browser do its normal thing
  event.preventDefault();
  targetCell.focus();
  if (targetCell instanceof HTMLInputElement || targetCell instanceof HTMLTextAreaElement) {
    targetCell.select();
  }
  keepSheetCellVisible(targetCell);
}

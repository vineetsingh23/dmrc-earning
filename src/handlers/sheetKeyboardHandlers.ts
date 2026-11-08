import type { KeyboardEvent } from 'react';

// Arrow / Enter / Tab navigation for tables whose cells carry data-grid (table name), data-row and data-column
export function handleSheetKeyDown(event: KeyboardEvent<HTMLElement>) {
  const focusedCell = event.target as HTMLInputElement | HTMLSelectElement;
  const gridName = focusedCell.dataset?.grid;
  if (!gridName) return;
  const pressedKey = event.key;
  if (focusedCell.tagName === 'SELECT' && (pressedKey === 'ArrowUp' || pressedKey === 'ArrowDown')) return;   // keep the dropdown usable
  let rowIndex = Number(focusedCell.dataset.row), columnIndex = Number(focusedCell.dataset.column);
  const gridElement = event.currentTarget;
  const lastColumnIndex = gridElement.querySelectorAll(`[data-grid="${gridName}"][data-row="0"]`).length - 1;

  if (pressedKey === 'ArrowDown' || (pressedKey === 'Enter' && !event.shiftKey)) rowIndex++;
  else if (pressedKey === 'ArrowUp' || (pressedKey === 'Enter' && event.shiftKey)) rowIndex--;
  else if (pressedKey === 'ArrowRight') columnIndex++;
  else if (pressedKey === 'ArrowLeft') columnIndex--;
  else if (pressedKey === 'Tab') {
    if (event.shiftKey) { columnIndex--; if (columnIndex < 0) { columnIndex = lastColumnIndex; rowIndex--; } }
    else { columnIndex++; if (columnIndex > lastColumnIndex) { columnIndex = 0; rowIndex++; } }
  } else return;

  const targetCell = gridElement.querySelector<HTMLInputElement>(`[data-grid="${gridName}"][data-row="${rowIndex}"][data-column="${columnIndex}"]`);
  if (!targetCell) return;   // at the edge of the table: let the browser do its normal thing
  event.preventDefault();
  targetCell.focus();
  targetCell.select?.();

  const targetRow = targetCell.closest('tr');
  const targetCellElement = targetCell.closest('td');
  const targetStyle = targetCellElement && window.getComputedStyle(targetCellElement);
  if (!targetRow || !targetCellElement || targetStyle?.position === 'sticky') return;

  const frozenRight = Array.from(targetRow.querySelectorAll<HTMLElement>('td'))
    .filter(cell => window.getComputedStyle(cell).position === 'sticky')
    .reduce((right, cell) => Math.max(right, cell.getBoundingClientRect().right), 0);
  const containerLeft = gridElement.getBoundingClientRect().left + gridElement.clientLeft;
  const hiddenWidth = frozenRight - targetCellElement.getBoundingClientRect().left;

  if (frozenRight > containerLeft && hiddenWidth > 0) {
    gridElement.scrollLeft += hiddenWidth;
  }
}
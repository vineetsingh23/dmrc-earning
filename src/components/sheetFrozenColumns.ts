import type { CSSProperties } from 'react';

// widths (rem) of the columns that stay in place when scrolling sideways, from the left: the # column, then the first data columns
export const frozenColumnWidthsRem = [3, 6, 6];

export const frozenBodyCellClass = (rowIndex: number) =>
  rowIndex % 2 === 0
    ? 'bg-white dark:bg-slate-800'
    : 'bg-[#eafdf9] dark:bg-slate-800';

const leftOffsetRem = (frozenIndex: number) => frozenColumnWidthsRem.slice(0, frozenIndex).reduce((total, width) => total + width, 0);

// style of a cell in a frozen column; zIndex keeps it above the cells that scroll under it
export const frozenCellStyle = (frozenIndex: number, zIndex: number): CSSProperties => ({
  position: 'sticky',
  left: `${leftOffsetRem(frozenIndex)}rem`,
  zIndex,
  width: `${frozenColumnWidthsRem[frozenIndex]}rem`,
  minWidth: `${frozenColumnWidthsRem[frozenIndex]}rem`,
  maxWidth: `${frozenColumnWidthsRem[frozenIndex]}rem`,
});
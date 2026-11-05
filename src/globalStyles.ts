export const appShellClass = 'app-shell min-h-screen text-tx transition-colors';
export const appHeaderClass = 'sticky top-0 z-50 border-b border-bd bg-card/95 shadow-sm backdrop-blur';
export const appHeaderContentClass = 'mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-3 py-3 md:px-6';
export const appHeaderGroupClass = 'flex flex-wrap items-center gap-4';
export const navigationClass = 'flex flex-nowrap gap-1.5 overflow-x-auto';
export const navLinkClass = 'rounded-lg px-3 py-2 text-sm font-semibold text-mu transition-colors hover:bg-ca hover:text-tx focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac';
export const navLinkActiveClass = 'rounded-lg bg-ac px-3 py-2 text-sm font-semibold text-onac shadow-sm';
export const appHeaderControlsClass = 'flex flex-wrap items-center gap-3';
export const dateInputClass = 'rounded-lg border border-bd bg-inp px-2 py-1.5 text-sm text-tx focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac';
export const syncStatusClass = 'text-sm text-slate-600 dark:text-slate-400';
export const themeButtonClass = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:outline-blue-400';
export const mainContentClass = 'mx-auto max-w-screen-2xl p-4 md:p-6';
export const dashboardGridClass = 'dashboard-grid grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3';
export const stackedCardsClass = 'flex flex-col gap-4';

// card classes

export const cardContainer = 'brand-card flex w-full gap-4 p-4 transition-shadow duration-200 hover:shadow-md';
export const cardClass = 'brand-card min-w-0 w-full max-w-none p-4 text-tx transition-[border-color,box-shadow] duration-200 hover:border-slate-300 dark:hover:border-slate-600';
export const cardHeadingClass = 'mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-ac';
export const sheetTableClass = 'w-full border-collapse';

//tables classes
export const tableWrapperClass = 'sheet-scroll-area overflow-auto rounded-xl border border-bd bg-card shadow-sm';
export const tableClass = 'w-full border-collapse';
export const tableHeaderRowClass = 'bg-table-head-bg text-table-head-text ';
export const tableHeaderCellClass = 'border border-table-border px-2 py-2.5 text-center text-xs font-bold uppercase tracking-wide ';
export const tableCellClass = 'border border-table-border px-2 py-1.5 text-right text-xs font-medium text-table-row-text transition-colors duration-150 max-w-10';
export const tableCellLeftClass = `${tableCellClass} !text-center px-0`;
export const tableTotalRowClass = 'bg-table-footer-bg font-bold text-table-footer-text';
export const tableTotalCellClass = `${tableCellClass} px-2 py-3 text-sm font-bold`;
export const tableCalculatedCellClass = `${tableCellClass} px-0 font-semibold`;
export const tableMirrorCellClass = `${tableCellClass} px-0 font-semibold`;
export const tableRowClass = 'transition-colors duration-150 even:bg-table-row-alt hover:bg-table-hover';
export const tableInputClass = ' h-full border-0 bg-transparent  text-sm text-tx outline-none transition-colors placeholder:text-mu focus:ring-inset focus:ring-ac';
export const amountInputClass = 'rounded-md border border-bd bg-inp px-1.5 py-0.5 text-right text-tx outline-none transition-colors placeholder:text-mu focus-visible:ring-2 focus-visible:ring-ac';
export const summaryRowClass = 'flex justify-between border-b border-dashed border-slate-200 py-1 text-slate-700 dark:border-slate-700 dark:text-slate-200';
export const primaryButtonClass = 'rounded-lg bg-ac px-4 py-2 text-sm font-semibold text-onac shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac disabled:pointer-events-none disabled:opacity-50';
export const secondaryButtonClass = 'rounded-lg border border-bd bg-card px-4 py-2 text-sm font-semibold text-tx transition hover:border-ac hover:text-ac focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac';
export const pageHeadingClass = 'text-xl font-bold tracking-tight text-tx';
export const dialogOverlayClass = 'fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4';
export const dialogClass = 'w-[min(420px,90%)] rounded-2xl border border-bd bg-card p-5 text-tx shadow-xl';



export const tableHeaderGroupClasses = [
  'sheet-header text-slate-700 text-sm font-semibold dark:bg-slate-800 dark:text-slate-100',
  'bg-sheet-header text-slate-700 text-sm font-semibold dark:bg-slate-800 dark:text-slate-100',

];

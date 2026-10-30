export const appShellClass = 'min-h-screen bg-bg text-tx transition-colors';
export const appHeaderClass = 'sticky top-0 z-50 border-b border-bd bg-card/95 shadow-sm backdrop-blur';
export const appHeaderContentClass = 'mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6';
export const appHeaderGroupClass = 'flex flex-wrap items-center gap-4';
export const navigationClass = 'flex flex-wrap gap-2';
export const navLinkClass = 'rounded-md border border-slate-200 px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:outline-blue-400';
export const navLinkActiveClass = 'rounded-md px-3.5 py-1.5 text-sm font-medium border-blue-600 bg-blue-600 hover:bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-600 dark:text-white dark:hover:border-blue-400 dark:hover:bg-blue-500';
export const appHeaderControlsClass = 'flex flex-wrap items-center gap-3';
export const dateInputClass = 'rounded-lg border border-slate-300 bg-white px-2 text-lg py-1.5 text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:outline-blue-400';
export const syncStatusClass = 'text-sm text-slate-600 dark:text-slate-400';
export const themeButtonClass = 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:outline-blue-400';
export const mainContentClass = 'mx-auto max-w-screen-2xl p-4 md:p-6';
export const dashboardGridClass = 'grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3 ';
export const stackedCardsClass = 'flex flex-col gap-4';

export const cardContainer ='w-full flex gap-4 rounded-2xl border-2 border-slate-200 bg-blue-50 p-4 shadow-md transition-[border-color,box-shadow,bg-color] duration-200 hover-border-slate-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:bg-blue-900/10'
export const cardClass = 'w-full max-w-none rounded-2xl border border-bd bg-card p-4 text-tx shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md';
export const cardHeadingClass = 'mb-2 font-semibold text-tx';
export const tableWrapperClass = 'overflow-auto rounded-xl border border-bd bg-card';
export const tableClass = 'enterprise-table w-full border-collapse';
export const sheetTableClass = 'enterprise-table enterprise-table--sheet w-full border-collapse';
export const tableHeaderRowClass = 'text-xs text-tx';
export const tableHeaderCellClass = 'border border-slate-100 bg-slate-600/20 px-2 py-1 text-center text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100';
export const tableCellClass = 'border border-bd text-right text-xs py-1.5 text-nowrap font-medium text-tx transition-colors duration-150';
export const tableCellLeftClass = `${tableCellClass} !text-left`;
export const tableTotalRowClass = 'font-bold text-tx';
export const tableTotalCellClass = `${tableCellClass} bg-gray-400/50 font-bold dark:bg-slate-700`;
export const tableCalculatedCellClass = `${tableCellClass} font-semibold`;
export const tableMirrorCellClass = `${tableCellClass} font-semibold`;
export const tableRowClass = 'transition-colors duration-200';
export const tableInputClass = 'box-border h-full w-full min-w-[50px] border-0 bg-transparent px-2 py-1 text-sm text-tx outline-none transition-colors placeholder:text-mu focus:bg-blue-50 focus:ring-2 focus:ring-inset focus:ring-ac dark:focus:bg-slate-700';
export const amountInputClass = 'rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-right text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-blue-400';
export const summaryRowClass = 'flex justify-between border-b border-dashed border-slate-200 py-1 text-slate-700 dark:border-slate-700 dark:text-slate-200';
export const primaryButtonClass = 'rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:outline-blue-400';
export const secondaryButtonClass = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:outline-blue-400';
export const pageHeadingClass = 'text-xl font-bold text-blue-700 dark:text-blue-300';
export const dialogOverlayClass = 'fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4';
export const dialogClass = 'w-[min(360px,90%)] rounded-2xl border border-slate-200 bg-white p-5 text-slate-800 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';

// export const tableHeaderGroupClasses = [
//   'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100',
//   'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100',
//   'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
//   'bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100',
//   'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100',
//   'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-100',
// ];

export const tableHeaderGroupClasses = [
  'bg-slate-100 text-slate-700 text-sm font-semibold dark:bg-slate-800 dark:text-slate-100',
  'bg-slate-100 text-slate-700 text-sm font-semibold dark:bg-slate-800 dark:text-slate-100',

];

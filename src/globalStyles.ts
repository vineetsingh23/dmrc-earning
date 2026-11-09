export const dashboardGridClass = 'dashboard-grid grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3';
export const stackedCardsClass = 'flex flex-col gap-4';


// card classes

export const cardContainer = 'brand-card flex w-full gap-4 p-4 transition-shadow duration-200 hover:shadow-md';
export const cardClass = 'overflow-hidden w-full bg-white border border-slate-200 dark:border-slate-700 shadow-md rounded-2xl dark:bg-slate-900  min-w-0 p-4 transition-[border-color,box-shadow] duration-200 border-t-4 border-t-red-400 dark:border-t-red-800';
export const cardHeaderClass ='mb-4 flex items-center justify-between border-b border-bd bg-inp/70 px-6 pb-2 pt-5'
export const cardHeadingClass = 'mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-blue-600 dark:text-sky-500';
export const cardButtonClass ='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 hover:shadow'
export const cardTransition = `${cardClass} transition-transform scale-95 hover:scale-105 duration-300 ease-in-out`
//tables classes
export const tableWrapperClass = 'overflow-hidden rounded-xl border border-gray-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-sky-400';
export const tableClass = 'w-full border-collapse text-tx';
export const tableHeaderRowClass = 'px-2';
export const tableHeaderCellClass = 'border border-bd/50 bg-th px-2 py-2 text-sm font-semibold text-tx';
export const tableRowClass = 'transition-colors duration-150 even:bg-tr/30 hover:bg-tr';
export const tableCellClass = 'max-w-full border border-bd/50 px-2 py-1.5 text-right text-[15px] font-mono text-tx transition-colors duration-150';
export const tableCellLeftClass = `${tableCellClass} !text-center px-0`;
export const tableInputClass = 'box-border min-w-0 w-full rounded border-0 bg-transparent px-1.5 py-1 text-sm text-inherit outline-none transition-all placeholder:text-mu focus:bg-card focus:outline-none focus:ring-2 focus:ring-ac';

export const tableTotalRowClass = 'bg-th font-bold text-tx';
export const tableTotalCellClass = `${tableCellClass} px-2 py-3 text-sm font-bold tracking-wide`;
export const tableCalculatedCellClass = '!bg-sky-100 !text-slate-800 dark:!bg-sky-950/70 dark:!text-sky-100';
export const tableMirrorCellClass = `${tableCellClass} px-0 font-semibold`;

export const amountInputClass = 'rounded-md border border-bd bg-inp px-1.5 py-0.5 text-right text-tx outline-none transition-colors placeholder:text-mu focus-visible:ring-2 focus-visible:ring-ac';
export const summaryRowClass = 'flex justify-between border-b border-dashed border-tx/50 py-1 text-tx/80 tracking-wide';
export const primaryButtonClass = 'flex gap-4 rounded-lg bg-ac px-4 py-2 text-sm text-card shadow-sm transition hover:brightness-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac disabled:pointer-events-none disabled:opacity-50';
export const secondaryButtonClass = 'rounded-lg border border-bd bg-card px-4 py-2 text-sm font-semibold text-tx transition hover:border-ac hover:text-ac focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ac';
export const dialogOverlayClass = 'fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4';
export const dialogClass = 'w-[min(420px,90%)] rounded-2xl border border-bd bg-card p-5 text-tx shadow-xl';



export const tableHeaderGroupClasses = [
  'bg-slate-700 text-sm font-semibold text-white dark:bg-slate-800 dark:text-slate-100',
  'bg-blue-800 text-sm font-semibold text-white dark:bg-slate-800 dark:text-slate-100',
];

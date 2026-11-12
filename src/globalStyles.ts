/*
 * Reusable layout and component classes.
 * Prefer semantic theme utilities so light/dark colors stay centralized.
 */

export const appShellClass =
  "min-h-screen bg-background text-foreground transition-colors";

export const appHeaderClass =
  "sticky top-0 z-50 border-b border-border bg-surface/95 shadow-sm backdrop-blur";

export const appHeaderContentClass =
  "mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-2 py-3 md:px-6";

export const appHeaderGroupClass = "flex flex-wrap items-center gap-4";
export const navigationClass = "flex flex-wrap gap-2";

export const navLinkClass =
  "rounded-md border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const navLinkActiveClass =
  "rounded-md border border-primary bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover";

export const appHeaderControlsClass = "flex flex-wrap items-center gap-3";

export const dateInputClass =
  "rounded-lg border border-border bg-input-background px-2 py-1.5 text-lg text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const syncStatusClass = "text-sm text-muted-foreground";

export const themeButtonClass =
  "rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const mainContentClass = "mx-auto max-w-screen-2xl p-4 md:p-6";

export const dashboardGridClass =
  "dashboard-grid grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3";

export const stackedCardsClass = "flex flex-col gap-4";

/* Cards */
export const cardContainer =
  "card flex w-full gap-4  rounded-2xl border border-border bg-surface shadow-md transition-shadow duration-200 hover:shadow-xl";

export const cardClass =
  "w-full min-w-0 overflow-auto rounded-2xl border border-border border-t-4 border-t-card-accent px-4 py-3 bg-surface text-foreground shadow-md transition-[border-color,box-shadow] duration-200 hover:shadow-lg";

export const cardHeadingClass =
  "mb-4 flex items-center  text-sm font-bold uppercase tracking-[0.12em] text-primary";
export const staticCardClass = "dark:bg-slate-800";

export const cardHeaderClass =
  "mb-2 flex items-center justify-between border-b border-border";

export const cardButtonClass =
  "inline-flex mb-2 items-center gap-1.5 rounded-lg border border-border bg-primary text-white px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:border-danger hover:text-danger hover:shadow";

export const cardTransition = `${cardClass} transition-transform scale-95 hover:scale-105 duration-300 ease-in-out`;

/* Tables */
export const tableWrapperClass =
  "overflow-auto rounded-xl border border-border";

export const tableClass =
  "min-w-full border-collapse px-2 overflow-none bg-surface py-4";
export const sheetTableClass = "w-full border-collapse";

export const tableHeaderRowClass = "text-xs text-foreground";

export const tableHeaderCellClass =
  "border border-border px-2 py-2 text-center text-sm font-bold text-foreground";

export const tableCellClass =
  "border border-border text-right text-xs px-2 py-1 tracking-wide font-medium text-foreground transition-colors duration-150";

export const tableCellLeftClass = `${tableCellClass} !text-center px-0`;
export const tableTotalRowClass = "bg-table-header font-bold text-foreground";

export const tableTotalCellClass = `${tableCellClass} bg-table-header  py-3 text-sm font-bold tracking-wide`;

export const tableCalculatedCellClass = `${tableCellClass} bg-primary-subtle font-semibold `;

export const tableMirrorCellClass = `${tableCellClass} px-0 font-semibold`;

export const tableRowClass =
  "transition-colors duration-200 even:bg-table-row-alt hover:bg-table-row-hover";

export const tableInputClass = `${tableCellClass} rounded-md border-border-border  h-full w-full min-w-[50px] border-0 bg-transparent px-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:bg-surface focus:-ring-inset focus:ring-2 focus:ring-focus`;

export const amountInputClass = `${tableCellClass} text-right text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-focus focus:ring-inset`;

export const summaryRowClass =
  "flex justify-between border-b border-dashed border-border font-semibold py-1 px-2 tracking-wide text-foreground/80";

/* Buttons and dialogs */
export const primaryButtonClass =
  "flex gap-4  rounded-lg bg-primary px-3 py-1.5 font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50";

export const secondaryButtonClass =
  "rounded-lg border border-border bg-linear-to-r from-pink-400 via-violet-500 to-blue-400 px-3 py-1.5 font-semibold text-surface transition-colors hover:border-primary hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const pageHeadingClass = "text-xl font-bold text-primary";

export const dialogOverlayClass =
  "fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4";

export const dialogClass =
  "w-[min(360px,90%)] rounded-2xl border border-border bg-surface p-5 text-foreground shadow-xl";

/*
 * Keep the two entries because callers may select them by index.
 * They now share the same theme-aware visual treatment.
 */
export const tableHeaderGroupClasses = [
  "bg-table-header text-sm font-semibold text-foreground",
  "bg-table-header text-sm font-semibold text-foreground",
];

/*
 * Reusable layout and component classes.
 * Prefer semantic theme utilities so light/dark colors stay centralized.
 */

export const appShellClass ="min-h-screen w-full bg-no-repeat bg-background  transition-colors";
export const appHeaderClass ="sticky top-0 z-50 border-b border-header-border bg-nav-header shadow-lg shadow-header-shadow backdrop-blur";
export const appHeaderContentClass ="mx-auto grid max-w-screen grid-cols-[1fr_auto] items-center gap-x-2 gap-y-2 px-2 py-2 md:min-h-16 md:grid-cols-[1fr_auto_1fr] md:px-4";
export const appHeaderGroupClass = "flex flex-wrap items-center gap-4";

export const navigationClass = "inline-flex shrink-0 items-center rounded-lg px-2 py-1.5 text-sm font-medium transition-color";
// export const navLinkClass ="rounded-md border border-border bg-header px-3.5 py-1.5 text-sm font-medium  transition-colors hover:button-border hover:bg-header-hover  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const linkActiveClass ="bg-isActive text-button-text border";
export const linkNotActiveClass ="border border-button-border bg-button text-button-text hover:bg-button-hover hover:border-focus";
export const datePickerClass = "flex gap-3 items-center justify-center px-2 py-1.5 outline-hidden bg-isActive/80 text-button-text rounded-lg border-button-border hover:bg-isActive/90"
export const appHeaderControlsClass = "col-start-2 row-start-1 flex shrink-0 items-center justify-self-end gap-2 md:col-start-3";
export const themeButtonClass ="rounded-md border border-button-border bg-isActive px-3 py-1.5 text-sm font-medium transition-colors hover:button-border hover:bg-button-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const dateInputClass ="rounded-lg border border-border bg-input-background px-2 py-1.5 text-lg  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const mainContentClass = "mx-auto max-w-screen-2xl p-4 md:p-6";

export const dashboardGridClass ="dashboard-grid grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3";

export const stackedCardsClass = "flex flex-col gap-4";

/* Cards */
export const cardContainer =  " w-full gap-4  rounded-2xl border border-card-border bg-card shadow-md transition-shadow duration-200 hover:shadow-xl";
// export const cardContainer=`min-h-screen flex items-center justify-center p-6 transition-colors duration-300 darK:bg-[#1a1a1a] bg-[#e5e5e5`
export const cardClass = "w-full min-w-0 overflow-auto transition-all duration-300 backdrop-blur-md rounded-2xl bg-card border border-card-border border-t-4 border-t-card-border px-4 py-3 bg-my-gradient shadow-card-shadow  shadow-md hover:shadow-lg transition-[border-color,box-shadow]";

// export const cardClass=`w-80 rounded-[28px] p-5 shadow-xl transition-all duration-300 border dark:bg-[#222222]/80 dark:backdrop-blur-md dark:border-white/10 dark:text-white dark:shadow-black/40   bg-white/90 backdrop-blur-md border-black/5 text-[#111111] shadow-black/10`

export const cardHeadingClass ="mb-4 flex items-center text-header-text  font-bold uppercase tracking-[0.12em]  text-md";


export const cardHeaderClass =
  "mb-2  flex justify-between items-center border-0  bg-card-header  shadow-card-shadow  shadow-md backdrop-blur-md rounded-2xl p-2";

export const cardButtonClass =
  "inline-flex mb-2 items-center gap-1.5 rounded-lg border border-table-border bg-button text-white px-3.5 py-1.5 text-xs font-semibold  shadow-sm transition-all hover:border-danger hover:text-danger hover:shadow";

export const cardTransition = `${cardClass} transition-transform scale-95 hover:scale-100 duration-300 ease-in-out overflow-auto scrollbar-none`;

/* Tables */
export const tableWrapperClass =
  "overflow-auto w-full rounded-xl border-collapse shadow-md shadow-table-shadow";

export const tableClass =
  "w-full border-collapse overflow-none";
export const sheetTableClass = "w-full";

export const tableHeaderRowClass = "bg-table-header border border-table-border";

export const tableHeaderCellClass =
  "px-2 py-2 text-sm text-center  text-table-text";

export const tableCellClass =
  "border border-table-border text-right text-xs px-2 tracking-wide font-medium  transition-colors duration-150";

export const tableCellLeftClass = `${tableCellClass} !text-center px-0 py-2.5`;
export const tableTotalRowClass = " bg-table-footer text-table-text text-right  border border-table-border!";

export const tableTotalCellClass = `${tableCellClass} font-bold!  `

export const tableCalculatedCellClass = `${tableCellClass} font-semibold! bg-calculated/40`;

export const tableMirrorCellClass = `${tableCellClass} px-0 font-semibold bg-calculated/20`;

export const tableRowClass ="transition-colors duration-200 bg-table-body even:bg-table-row-alt hover:bg-table-row-hover ";

export const tableInputClass = `${tableCellClass} rounded-md border-table-border  h-full w-full min-w-[50px] border-0 bg-transparent px-2 text-sm text-table-row-text outline-none transition-colors placeholder:text-table-row-text/30 focus:bg-input-focus focus:ring-inset focus:ring-2 focus:ring-focus`;

export const amountInputClass = `${tableCellClass} text-right text-table-text outline-none placeholder:text-table-row-text/30 focus-visible:ring-2 focus-visible:ring-focus focus:ring-inset`;

export const summaryRowClass ="flex justify-between border-b border-dashed border-border font-semibold py-1 px-2 tracking-wide text-card-text";

/* Buttons and dialogs */
export const primaryButtonClass ="flex gap-4 items-center  rounded-lg bg-button text-button-text px-3 py-1.5 font-semibold  transition-colors hover:bg-button-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:pointer-events-none disabled:opacity-50";

export const secondaryButtonClass ="rounded-lg border border-border bg-linear-to-r from-pink-400 via-violet-500 to-blue-400 px-3 py-1.5 font-semibold text-header transition-colors hover:button-border hover:bg-header-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export const pageHeadingClass = "text-xl font-bold";

export const dialogOverlayClass ="fixed inset-0 z-20 grid place-items-center bg-slate-950/50 p-4";

export const dialogClass ="w-[min(360px,90%)] rounded-2xl border border-border bg-header p-5 shadow-xl";

/*
 * Keep the two entries because callers may select them by index.
 * They now share the same theme-aware visual treatment.
 */
export const tableHeaderGroupClasses = [
  "bg-table-header text-sm font-semibold text-table-text",
 
];

import { useMemo } from "react";
import { useEffect, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import EarningSheetTable from "./stationEarning/earningSheetTable";
import CashInHandCard from "./dashboard/cashInHandCard";
import CashInPossessionCard from "./dashboard/cashInPossessionCard";
import SendToBankDialog from "./dashboard/sentToBankDialog";
import { shiftEntryColumns } from "../lib/shiftEntrycolumns";
import { bankRoundingAmount } from "../lib/businessRules";
import { updateEntryCell } from "../handlers/entryCellHandler";
import { updateCashCount } from "../handlers/cashcountHandlers";
import { recordBankTransfer } from "../handlers/cashToBankHandlers";
import { useRegisterData } from "../hooks/useRegisterData";
import { useDashboardFigures } from "../hooks/useDashboardFigures";
import { useBankNoteDraft } from "../hooks/useBankNoteDraft";
import ImprestIssueCard from "./dashboard/imprestIssueCard";
import AdvanceReceivedCard from "./dashboard/advanceReceivedCard";
import { updateDetailListCell } from "../handlers/detailListHandlers";
import TvmEarningPage from "./stationEarning/tvmEarningPage";
import FinalEarningPage from "./stationEarning/finalEarningPage";
import DailyReportPage from "./dailyReportPage";
// import StationLoginPage from './stationLoginPage';
import {
  appHeaderClass,
  appHeaderContentClass,
  appHeaderControlsClass,
  appHeaderGroupClass,
  appShellClass,
  dashboardGridClass,
  dateInputClass,
  mainContentClass,
  navLinkActiveClass,
  navLinkClass,
  navigationClass,
  stackedCardsClass,
  syncStatusClass,
  themeButtonClass,
} from "../globalStyles";
// import DetailListCard from "./dashboard/detailListCard";
// import {type DetailListKind } from "../lib/registerTypes";
import StationStatisticsCard from "./stationOverview/stationStatistics";
import type { StationRecord } from "../lib/registerTypes";
import { filterByFacilities } from "../lib/earningColumns";
import EarningHistogramCard from "./stationOverview/earningHistogram";
import { useWeeklyBackup } from "../hooks/useWeeklyBackup";
import BackupFolderCard from "./dashboard/backupFolderCard";
import BackupToolbar from "./dashboard/backupToolbar";

// const weeklyBackup = useWeeklyBackup(station.name, registerState , isLoading);

const pages = [
  { label: "Dashboard", path: "/" },
  { label: "Shifts Earning", path: "/shift-entry" },
  { label: "TVM Earning", path: "/tvm-earning" },
  { label: "Final Earning", path: "/final-earning" },
  { label: "Station Overview", path: "/station-overview" },
  { label: "WhatsApp Report", path: "/daily-report" },
];
interface RegisterWorkspaceProps {
  station: StationRecord;
  onLogout: () => void;
}

export default function RegisterWorkspace({
  station,
  onLogout,
}: RegisterWorkspaceProps) {
  const visibleShiftColumns = useMemo(
    () =>
      filterByFacilities(shiftEntryColumns, {
        hasSv4Recharge: station.hasSv4Recharge,
        hasParking: station.hasParking,
      }),
    [station],
  );
  // <EarningSheetTable columns={visibleShiftColumns} ... />
  // ...all of your old App code goes here...

  const {
    registerState,
    updateRegisterState,
    storageStatus,
    storageError,
    isLoaded,
  } = useRegisterData(station.name);
  const weeklyBackup = useWeeklyBackup(station.name, registerState, isLoaded);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const rowsOfSelectedDate = registerState.shiftEntries[selectedDate] ?? {};

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // const renderDetailList = (
  //   title: string,
  //   listKind: DetailListKind,
  //   columnTitles: string[],
  // ) => (
  //   <DetailListCard
  //     title={title}
  //     listKind={listKind}
  //     columnTitles={columnTitles}
  //     listRows={registerState.detailLists?.[selectedDate]?.[listKind] ?? []}
  //     onCellChange={(rowIndex, columnIndex, newValue) =>
  //       updateRegisterState((draftState) =>
  //         updateDetailListCell(
  //           draftState,
  //           selectedDate,
  //           listKind,
  //           rowIndex,
  //           columnIndex,
  //           newValue,
  //         ),
  //       )
  //     }
  //   />
  // );

  const figures = useDashboardFigures(registerState, selectedDate);
  const noteDraft = useBankNoteDraft(
    selectedDate,
    figures.cashCountsInHand,
    figures.amountDueToBank,
    figures.existingTransfer,
  );
  const canSendToBank =
    !figures.existingTransfer && figures.amountDueToBank >= bankRoundingAmount;

  const changeCashCount = (countKey: string, typedValue: string) =>
    updateRegisterState((draftState) =>
      updateCashCount(
        draftState,
        selectedDate,
        figures.cashCountsInHand,
        countKey,
        typedValue,
      ),
    );

  const confirmBankTransfer = (slipNumber: string) => {
    updateRegisterState((draftState) =>
      recordBankTransfer(draftState, {
        date: selectedDate,
        amountToBank: figures.amountDueToBank,
        slipNumber,
        noteCountsToSend: noteDraft.noteCountsToSend,
        cashCountsInHand: figures.cashCountsInHand,
      }),
    );
    setIsSendDialogOpen(false);
  };

  const storageLabel =
    storageStatus === "saved"
      ? "IndexedDB: Saved"
      : storageStatus === "saving"
        ? "IndexedDB: Saving…"
        : storageStatus === "loading"
          ? "IndexedDB: Loading…"
          : "⚠ IndexedDB error";

  if (storageStatus === "loading") {
    return (
      <main className="p-6 text-slate-700 dark:text-slate-200">
        Loading locally saved register data…
      </main>
    );
  }

  if (!isLoaded) {
    return (
      <main role="alert" className="p-6 text-red-700 dark:text-red-300">
        <h1 className="font-bold">Could not load local register data.</h1>
        <p>
          Check that this browser allows IndexedDB for this page, then reload
          the app.
        </p>
        <p className="mt-2 font-mono text-sm">
          Reason: {storageError || "(none reported)"} · status: {storageStatus}{" "}
          · station: {station.name}
        </p>
      </main>
    );
  }
  return (
    <div className={appShellClass}>
      <header className={appHeaderClass}>
        <div className={appHeaderContentClass}>
          <div className={appHeaderGroupClass}>
            <h1 className="text-2xl font-extrabold text-blue-600">
              {station.name}{" "}
              <span className="px-3 text-4xl font-light text-gray-500">|</span>
            </h1>
            <nav aria-label="Main navigation" className={navigationClass}>
              {pages.map((page) => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  end={page.path === "/"}
                  className={({ isActive }) =>
                    `${isActive ? navLinkActiveClass : navLinkClass}`
                  }
                >
                  {page.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className={appHeaderControlsClass}>
            <label className="sr-only" htmlFor="selected-date">
              Selected date
            </label>
            <input
              id="selected-date"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={dateInputClass}
            />
            <span
              role="status"
              className={syncStatusClass}
              title={storageError || undefined}
            >
              {storageLabel}
            </span>
            <button
              type="button"
              onClick={() => setIsDarkMode((theme) => !theme)}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              className={themeButtonClass}
            >
              {isDarkMode ? "☀ Light" : "☾ Dark"}
            </button>
            <button onClick={onLogout} className={themeButtonClass}>
              ⏏ Logout
            </button>
          </div>
        </div>
      </header>

      <main className={mainContentClass}>
        <Routes>
          <Route
            path="/"
            element={
              <div className={dashboardGridClass}>
                <CashInHandCard
                  totalCashInHand={figures.totalCashInHand}
                  previousDaysCash={figures.previousDaysCash}
                  currentDayEarning={figures.currentDayEarning}
                  amountDueToBank={figures.amountDueToBank}
                  existingTransfer={figures.existingTransfer}
                  noteDraft={noteDraft}
                  canSendToBank={canSendToBank}
                  advanceReceivedTotal={figures.advanceReceivedTotal}
                  onSendToBankClick={() => setIsSendDialogOpen(true)}
                />
                <CashInPossessionCard
                  cashCountsInHand={figures.cashCountsInHand}
                  looseCoinAmount={figures.looseCoinsAmount}
                  cashCountsSource={figures.cashCountsSource}
                  denominationTotalAmount={figures.denominationTotalAmount}
                  imprestAndAdvanceIssuedTotal={
                    figures.imprestAndAdvanceIssuedTotal
                  }
                  totalCashInHand={figures.totalCashInHand}
                  onCountChange={changeCashCount}
                />
                <div className={stackedCardsClass}>
                  <ImprestIssueCard
                    listRows={
                      registerState.detailLists?.[selectedDate]?.imprestIssue ??
                      []
                    }
                    onAdvanceChange={(rowIndex, typedValue) =>
                      updateRegisterState((draftState) =>
                        updateDetailListCell(
                          draftState,
                          selectedDate,
                          "imprestIssue",
                          rowIndex,
                          2,
                          typedValue,
                        ),
                      )
                    }
                  />
                  <AdvanceReceivedCard
                    listRows={
                      registerState.detailLists?.[selectedDate]
                        ?.advanceReceived ?? []
                    }
                    onAdvanceChange={(rowIndex, typedValue) =>
                      updateRegisterState((draftState) =>
                        updateDetailListCell(
                          draftState,
                          selectedDate,
                          "advanceReceived",
                          rowIndex,
                          1,
                          typedValue,
                        ),
                      )
                    }
                  />
                </div>

                {/* <div className="mb-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3">
                  {renderDetailList(
                    "Details of out-source earning",
                    "outsourceEarning",
                    ["Item", "Amount"],
                  )}
                  {renderDetailList("Details of misc earning", "miscEarning", [
                    "Reason",
                    "Amount",
                  ])}
                </div>
                <div className="mb-4">
                  {renderDetailList("Penalty details", "penaltyDetails", [
                    "ID",
                    "Date & time",
                    "Penalty section",
                    "Passenger name",
                    "Passenger contact no.",
                    "Address of passenger",
                    "Penalty amount",
                  ])}
                </div> */}
                <section className="col-span-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <h2 className="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Data tools and backups
                  </h2>
                  <BackupToolbar
                    stationName={station.name}
                    date={selectedDate}
                    registerState={registerState}
                    updateRegisterState={updateRegisterState}
                    facilities={{
                      hasSv4Recharge: station.hasSv4Recharge,
                      hasParking: station.hasParking,
                    }}
                  />
                  <BackupFolderCard
                    {...weeklyBackup}
                    onChooseFolder={weeklyBackup.chooseFolder}
                    onBackUpNow={weeklyBackup.backUpNow}
                  />
                </section>
              </div>
            }
          />
          <Route
            path="/shift-entry"
            element={
              <EarningSheetTable
                columns={visibleShiftColumns}
                gridName="shift"
                rowCount={registerState.shiftRowCount}
                readRow={(rowIndex) => rowsOfSelectedDate[rowIndex] ?? {}}
                readEntryValue={(rowIndex, fieldKey) =>
                  rowsOfSelectedDate[rowIndex]?.[fieldKey] ?? ""
                }
                writeEntryValue={(rowIndex, fieldKey, newValue) =>
                  updateRegisterState((draftState) =>
                    updateEntryCell(
                      draftState.shiftEntries,
                      selectedDate,
                      rowIndex,
                      fieldKey,
                      newValue,
                    ),
                  )
                }
              />
            }
          />
          <Route
            path="/tvm-earning"
            element={
              <TvmEarningPage
                registerState={registerState}
                updateRegisterState={updateRegisterState}
                date={selectedDate}
              />
            }
          />
          <Route
            path="/final-earning"
            element={
              <FinalEarningPage
                registerState={registerState}
                date={selectedDate}
              />
            }
          />
          <Route
            path="/daily-report"
            element={
              <DailyReportPage
                registerState={registerState}
                updateRegisterState={updateRegisterState}
                date={selectedDate}
                stationName={station.name}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/station-overview"
            element={
              <div className="flex flex-col gap-4">
                <StationStatisticsCard
                  registerState={registerState}
                  date={selectedDate}
                />
                <EarningHistogramCard
                  registerState={registerState}
                  date={selectedDate}
                />
              </div>
            }
          />
        </Routes>
        {isSendDialogOpen && (
          <SendToBankDialog
            amountDueToBank={figures.amountDueToBank}
            totalCashInHand={figures.totalCashInHand}
            noteTotalToSend={noteDraft.noteTotalToSend}
            onClose={() => setIsSendDialogOpen(false)}
            onConfirm={confirmBankTransfer}
          />
        )}
      </main>
    </div>
  );
}

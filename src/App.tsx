import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import EarningSheetTable from './components/earningSheetTable';
import CashInHandCard from './components/dashboard/cashInHandCard';
import CashInPossessionCard from './components/dashboard/cashInPossessionCard';
import SendToBankDialog from './components/dashboard/sentToBankDialog';
import { sampleColumns } from './lib/earningColumns';
import { bankRoundingAmount } from './lib/businessRules';
import { updateEntryCell } from './handlers/entryCellHandler';
import { updateCashCount } from './handlers/cashcountHandlers';
import { recordBankTransfer } from './handlers/cashToBankHandlers';
import { useRegisterData } from './hooks/useRegisterData';
import { useDashboardFigures } from './hooks/useDashboardFigures';
import { useBankNoteDraft } from './hooks/useBankNoteDraft';
import ImprestIssueCard from './components/dashboard/imprestIssueCard';
import AdvanceReceivedCard from './components/dashboard/advanceReceivedCard';
import { updateDetailListCell } from './handlers/detailListHandlers';
import TvmEarningPage from './components/tvmEarningPage';
import FinalEarningPage from './components/fianlEarningPage';
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
} from './globalStyles';

const pages = [
  { label: 'Dashboard', path: '/' },
  { label: 'Shift Entry', path: '/shift-entry' },
  { label: 'TVM Earning', path: '/tvm-earning' },
  { label: 'Final Earning', path: '/final-earning' },
];

export default function App() {
  const { registerState, updateRegisterState, storageStatus, storageError, isLoaded } = useRegisterData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const rowsOfSelectedDate = registerState.shiftEntries[selectedDate] ?? {};

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const figures = useDashboardFigures(registerState, selectedDate);
  const noteDraft = useBankNoteDraft(selectedDate, figures.cashCountsInHand, figures.amountDueToBank, figures.existingTransfer);
  const canSendToBank = !figures.existingTransfer && figures.amountDueToBank >= bankRoundingAmount;

  const changeCashCount = (countKey: string, typedValue: string) =>
    updateRegisterState(draftState => updateCashCount(draftState, selectedDate, figures.cashCountsInHand, countKey, typedValue));

  const confirmBankTransfer = (slipNumber: string) => {
    updateRegisterState(draftState => recordBankTransfer(draftState, {
      date: selectedDate, amountToBank: figures.amountDueToBank, slipNumber,
      noteCountsToSend: noteDraft.noteCountsToSend, cashCountsInHand: figures.cashCountsInHand,
    }));
    setIsSendDialogOpen(false);
  };

  const storageLabel = storageStatus === 'saved' ? 'IndexedDB: Saved'
    : storageStatus === 'saving' ? 'IndexedDB: Saving…'
      : storageStatus === 'loading' ? 'IndexedDB: Loading…'
        : '⚠ IndexedDB error';

  if (storageStatus === 'loading') {
    return <main className="p-6 text-slate-700 dark:text-slate-200">Loading locally saved register data…</main>;
  }

  if (!isLoaded) {
    return (
      <main role="alert" className="p-6 text-red-700 dark:text-red-300">
        <h1 className="font-bold">Could not load local register data.</h1>
        <p>Check that this browser allows IndexedDB for this page, then reload the app.</p>
        {storageError && <p className="mt-2">{storageError}</p>}
      </main>
    );
  }

  return (
    <div className={appShellClass}>
      <header className={appHeaderClass}>
        <div className={appHeaderContentClass}>
          <div className={appHeaderGroupClass}>
            <h1 className="text-xl font-extrabold text-blue-600">Earning Register</h1>
            <nav aria-label="Main navigation" className={navigationClass}>
              {pages.map(page => (
                <NavLink
                  key={page.path}
                  to={page.path}
                  end={page.path === '/'}
                  className={({ isActive }) =>
                    `${navLinkClass} ${isActive ? navLinkActiveClass : ''}`
                  }
                >
                  {page.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className={appHeaderControlsClass}>
            <label className="sr-only" htmlFor="selected-date">Selected date</label>
            <input
              id="selected-date"
              type="date"
              value={selectedDate}
              onChange={event => setSelectedDate(event.target.value)}
              className={dateInputClass}
            />
            <span role="status" className={syncStatusClass} title={storageError || undefined}>{storageLabel}</span>
            <button
              type="button"
              onClick={() => setIsDarkMode(theme => !theme)}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              className={themeButtonClass}
            >
              {isDarkMode ? '☀ Light' : '☾ Dark'}
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
                  denominationTotalAmount={figures.denominationTotalAmount}
                  imprestAndAdvanceIssuedTotal={figures.imprestAndAdvanceIssuedTotal}
                  totalCashInHand={figures.totalCashInHand}
                  onCountChange={changeCashCount}
                />
                <div className={stackedCardsClass}>
                  <ImprestIssueCard
                    listRows={registerState.detailLists?.[selectedDate]?.imprestIssue ?? []}
                    onAdvanceChange={(rowIndex, typedValue) =>
                      updateRegisterState(draftState =>
                        updateDetailListCell(draftState, selectedDate, 'imprestIssue', rowIndex, 2, typedValue))}
                  />
                  <AdvanceReceivedCard
                    listRows={registerState.detailLists?.[selectedDate]?.advanceReceived ?? []}
                    onAdvanceChange={(rowIndex, typedValue) =>
                      updateRegisterState(draftState =>
                        updateDetailListCell(draftState, selectedDate, 'advanceReceived', rowIndex, 1, typedValue))}
                  />
                </div>
              </div>
            }
          />
          <Route
            path="/shift-entry"
            element={
              <EarningSheetTable
                columns={sampleColumns}
                rowCount={registerState.shiftRowCount}
                readRow={rowIndex => rowsOfSelectedDate[rowIndex] ?? {}}
                readEntryValue={(rowIndex, fieldKey) => rowsOfSelectedDate[rowIndex]?.[fieldKey] ?? ''}
                writeEntryValue={(rowIndex, fieldKey, newValue) =>
                  updateRegisterState(draftState => updateEntryCell(draftState.shiftEntries, selectedDate, rowIndex, fieldKey, newValue))}
              />
            }
          />
          <Route
            path="/tvm-earning"
            element={<TvmEarningPage registerState={registerState} updateRegisterState={updateRegisterState} date={selectedDate} />}
          />
          <Route path="/final-earning" element={<FinalEarningPage registerState={registerState} date={selectedDate} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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

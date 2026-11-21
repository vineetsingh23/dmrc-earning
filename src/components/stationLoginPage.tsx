import { useState } from 'react';
import { ArrowRight, ChevronDown, HardDrive, MapPin, Moon, Sun } from 'lucide-react';
import type { StationRecord } from '../lib/registerTypes';
import { useThemeMode } from '../hooks/useThemeMode';

interface StationLoginPageProps { stations: StationRecord[]; onLogin: (stationName: string) => void }

// decorative metro line with station stops, drawn in the two accent colors
function MetroLineDecoration() {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 48" className="block h-auto w-full">
      <path d="M0 16 H150 Q170 16 180 26 L196 40 Q204 46 216 46 H400" fill="none" stroke="var(--login-line-2)" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <path d="M0 30 H120 Q140 30 152 20 L166 8 Q174 2 186 2 H400" fill="none" stroke="var(--login-accent)" strokeWidth="5" strokeLinecap="round" />
      {[40, 250, 340].map(x => <circle key={`a${x}`} cx={x} cy={x < 150 ? 30 : 2} r="5" fill="var(--login-input)" stroke="var(--login-accent)" strokeWidth="3" />)}
      {[90, 290].map(x => <circle key={`b${x}`} cx={x} cy={x < 150 ? 16 : 46} r="5" fill="var(--login-input)" stroke="var(--login-line-2)" strokeWidth="3" />)}
    </svg>
  );
}

export default function StationLoginPage({ stations, onLogin }: StationLoginPageProps) {
  const [selectedStationName, setSelectedStationName] = useState(stations[0]?.name ?? '');
  const { isDarkMode, toggleDarkMode } = useThemeMode();
  const themeLabel = `Switch to ${isDarkMode ? 'light' : 'dark'} mode`;

  return (
    <main className="login-backdrop relative grid min-h-screen place-items-center overflow-hidden p-4 text-login-text sm:p-8">
      <div aria-hidden="true" className="login-glow-1 pointer-events-none absolute -left-40 -top-40 size-[28rem] rounded-full blur-3xl" />
      <div aria-hidden="true" className="login-glow-2 pointer-events-none absolute -bottom-48 -right-40 size-[34rem] rounded-full blur-3xl" />

      <button
        type="button"
        onClick={toggleDarkMode}
        aria-label={themeLabel}
        title={themeLabel}
        className="login-card absolute right-4 top-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-login-text transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-login-accent sm:right-6 sm:top-6"
      >
        {isDarkMode
          ? <Sun className="size-4 text-amber-300" aria-hidden="true" />
          : <Moon className="size-4 text-login-line-2" aria-hidden="true" />}
        <span>{isDarkMode ? 'Light' : 'Dark'}</span>
      </button>

      <section className="login-card relative w-full max-w-md overflow-hidden rounded-3xl">
        <div className="px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm ring-1 ring-login-card-border">
                <img src="/Delhi_Metro.png" alt="Delhi Metro" className="max-h-full w-auto object-contain" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-login-accent">DMRC</p>
                <p className="text-sm font-semibold">Earning Register</p>
              </div>
            </div>
            <span className="rounded-full bg-login-chip px-3 py-1 text-xs font-semibold text-login-muted">
              {stations.length} {stations.length === 1 ? 'station' : 'stations'}
            </span>
          </div>
        </div>

        <div className="mt-4 px-2"><MetroLineDecoration /></div>

        <div className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-login-muted">Station workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-login-muted">Choose your station to open its daily earning register and cash summary.</p>

          <label htmlFor="station-selection" className="mb-2 mt-7 block text-sm font-semibold">Station</label>
          <div className="relative mb-5">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-login-accent" aria-hidden="true" />
            <select
              id="station-selection"
              value={selectedStationName}
              onChange={event => setSelectedStationName(event.target.value)}
              className="login-select min-h-12 w-full appearance-none rounded-xl border border-login-input-border bg-login-input pl-10 pr-10 text-sm font-medium text-login-text outline-none transition focus:border-login-accent focus:ring-4 focus:ring-login-ring"
            >
              {stations.map(station => <option key={station.name} value={station.name}>{station.name}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-login-muted" aria-hidden="true" />
          </div>

          <button
            type="button"
            disabled={!selectedStationName}
            onClick={() => selectedStationName && onLogin(selectedStationName)}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-login-accent px-4 py-3 text-sm font-bold text-login-accent-text shadow-lg shadow-login-ring transition hover:-translate-y-0.5 hover:bg-login-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-login-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open register <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-login-muted">
            <HardDrive className="size-3.5" aria-hidden="true" />
            Your register data is stored locally in this browser.
          </p>
        </div>
      </section>
    </main>
  );
}

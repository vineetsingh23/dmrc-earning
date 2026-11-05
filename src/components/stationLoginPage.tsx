import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import type { StationRecord } from '../lib/registerTypes';

interface StationLoginPageProps { stations: StationRecord[]; onLogin: (stationName: string) => void }

export default function StationLoginPage({ stations, onLogin }: StationLoginPageProps) {
  const [selectedStationName, setSelectedStationName] = useState(stations[0]?.name ?? '');
  return (
    <main className="app-shell relative grid min-h-screen place-items-center overflow-hidden p-4 sm:p-8">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 -top-40 size-96 rounded-full bg-ac/5 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-32 size-[32rem] rounded-full bg-ac2/10 blur-3xl" />
      <section className="brand-card relative w-full max-w-md overflow-hidden">
        <div className="h-1.5 bg-linear-to-r from-ac via-rose-500 to-ac2" />
        <div className="p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-bd bg-white p-2 shadow-sm dark:bg-slate-100">
              <img src="/Delhi_Metro.png" alt="Delhi Metro" className="max-h-full w-auto object-contain" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ac">DMRC</p>
              <p className="text-sm font-semibold text-tx">Earning Register</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="page-eyebrow">Station workspace</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-tx">Welcome back</h1>
            <p className="mt-2 text-sm leading-6 text-mu">Choose your station to open its daily earning register and cash summary.</p>
          </div>

          <label htmlFor="station-selection" className="mb-2 block text-sm font-semibold text-tx">Station</label>
          <div className="relative mb-5">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mu" aria-hidden="true" />
            <select
              id="station-selection"
              value={selectedStationName}
              onChange={event => setSelectedStationName(event.target.value)}
              className="min-h-12 w-full appearance-none rounded-xl border border-bd bg-inp pl-10 pr-3 text-sm font-medium text-tx outline-none transition focus:border-ac focus:ring-2 focus:ring-ac/20"
            >
              {stations.map(station => <option key={station.name} value={station.name}>{station.name}</option>)}
            </select>
          </div>
          <button
            type="button"
            disabled={!selectedStationName}
            onClick={() => selectedStationName && onLogin(selectedStationName)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ac px-4 py-3 text-sm font-bold text-onac shadow-sm transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Open register <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <p className="mt-5 text-center text-xs text-mu">Your register data is stored locally in this browser.</p>
        </div>
      </section>
    </main>
  );
}
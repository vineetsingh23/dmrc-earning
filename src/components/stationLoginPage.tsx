import { useState } from 'react';
import type { StationRecord } from '../lib/registerTypes';

interface StationLoginPageProps { stations: StationRecord[]; onLogin: (stationName: string) => void }

export default function StationLoginPage({ stations, onLogin }: StationLoginPageProps) {
  const [selectedStationName, setSelectedStationName] = useState(stations[0]?.name ?? '');
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-bd bg-card p-6 shadow-lg">
        <h1 className="bg-linear-to-r from-blue-500 to-violet-500 bg-clip-text text-2xl font-extrabold text-transparent">Station login</h1>
        <p className="mb-3 mt-1 text-sm text-mu">Select your station to continue.</p>
        <select value={selectedStationName} onChange={event => setSelectedStationName(event.target.value)}
          className="mb-4 w-full rounded-lg border border-bd bg-inp px-2 py-1.5 text-tx outline-none focus:ring-2 focus:ring-ac">
          {stations.map(station => <option key={station.name}>{station.name}</option>)}
        </select>
        <button onClick={() => selectedStationName && onLogin(selectedStationName)}
          className="w-full rounded-xl bg-ac px-3.5 py-1.5 font-medium text-onac transition hover:-translate-y-0.5">Login</button>
      </div>
    </div>
  );
}
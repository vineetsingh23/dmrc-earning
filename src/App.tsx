import { useState } from 'react';
import StationLoginPage from './components/stationLoginPage';
import RegisterWorkspace from './components/registerWorkspace';
import PwaUpdatePrompt from './components/pwaUpdatePrompt';
import { stations } from './lib/registerTypes';

const selectedStationStorageKey = 'selected-station';

export default function App() {
  const [loggedInStationName, setLoggedInStationName] = useState(() => localStorage.getItem(selectedStationStorageKey) ?? '');
  const loggedInStation = stations.find(station => station.name === loggedInStationName);

  const page = loggedInStation ? (
    <RegisterWorkspace
      key={loggedInStation.name}
      station={loggedInStation}
      onLogout={() => { localStorage.removeItem(selectedStationStorageKey); setLoggedInStationName(''); }}
    />
  ) : (
    <StationLoginPage stations={stations} onLogin={stationName => { localStorage.setItem(selectedStationStorageKey, stationName); setLoggedInStationName(stationName); }} />
  );

  return (
    <>
      {page}
      {import.meta.env.MODE !== 'file' && <PwaUpdatePrompt />}
    </>
  );
}
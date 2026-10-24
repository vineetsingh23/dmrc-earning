import { useState } from 'react';
import StationLoginPage from './components/stationLoginPage';
import RegisterWorkspace from './components/registerWorkspace';
import { stations } from './lib/registerTypes';

const selectedStationStorageKey = 'selected-station';

export default function App() {
  const [loggedInStationName, setLoggedInStationName] = useState(() => localStorage.getItem(selectedStationStorageKey) ?? '');
  const loggedInStation = stations.find(station => station.name === loggedInStationName);

  if (!loggedInStation) {
    return <StationLoginPage stations={stations} onLogin={stationName => { localStorage.setItem(selectedStationStorageKey, stationName); setLoggedInStationName(stationName); }} />;
  }
  return (
    <RegisterWorkspace
      key={loggedInStation.name}                       // a new key makes React reset all state when the station changes
      station={loggedInStation}
      onLogout={() => { localStorage.removeItem(selectedStationStorageKey); setLoggedInStationName(''); }}
    />
  );
}
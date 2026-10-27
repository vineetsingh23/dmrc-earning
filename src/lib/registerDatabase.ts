import { createEmptyRegisterState, type BankTransfer, type RegisterRow, type RegisterState } from './registerTypes';

const databaseName = 'dmrc-earning';
const settingsStoreName = 'register';      // per station: row counts, cash counts, detail lists (and data saved by the first versions)
const shiftStoreName = 'shiftRows';        // one record per shift entry row:   [station, date, rowIndex]
const tvmStoreName = 'tvmRows';            // one record per TVM entry row:     [station, date, rowIndex]
const bankStoreName = 'bankTransfers';     // one record per cash-to-bank day:  [station, date]  (amount, slip number, notes)
const requiredStoreNames = [settingsStoreName, shiftStoreName, tvmStoreName, bankStoreName];

// data saved before stations existed was kept under the key 'current'
const legacyStateKey = 'current';
const legacyStationName = 'Noida Electronic City';   // the station that receives that old data
const settingsKeyOfStation = (stationName: string) => `station:${stationName}`;

let databasePromise: Promise<IDBDatabase> | undefined;

// opens the database at its current version (or creates it); the version is raised when a store is missing
function openRequestToPromise(version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = version ? indexedDB.open(databaseName, version) : indexedDB.open(databaseName);
    request.onupgradeneeded = () => {
      requiredStoreNames.forEach(storeName => {
        if (!request.result.objectStoreNames.contains(storeName)) request.result.createObjectStore(storeName);
      });
    };
    request.onsuccess = () => {
      const openedDatabase = request.result;
      openedDatabase.onversionchange = () => { openedDatabase.close(); databasePromise = undefined; };   // another tab upgrades the database
      resolve(openedDatabase);
    };
    request.onerror = () => reject(new Error(`Could not open the local database: ${request.error?.name} ${request.error?.message}`));
    request.onblocked = () => reject(new Error('The local database is blocked by another open tab or window of this app. Close the other ones and reload.'));
  });
}

async function openDatabaseWithStores(): Promise<IDBDatabase> {
  const database = await openRequestToPromise();
  if (requiredStoreNames.every(storeName => database.objectStoreNames.contains(storeName))) return database;
  const upgradedVersion = database.version + 1;
  database.close();
  return openRequestToPromise(upgradedVersion);
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') return Promise.reject(new Error('IndexedDB is not available in this browser context.'));
  if (databasePromise) return databasePromise;
  const openingPromise = openDatabaseWithStores();
  databasePromise = openingPromise;
  openingPromise.catch(() => { databasePromise = undefined; });   // a failed open can be tried again
  return openingPromise;
}

const requestToPromise = <Result>(request: IDBRequest<Result>) =>
  new Promise<Result>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('A database request failed.'));
  });

// ---- what is stored for each station, to save only what changed ----
interface StoredRecord { storeName: string; key: IDBValidKey; serializedValue: string }
const savedRecordsOfStation = new Map<string, Map<string, StoredRecord>>();

// every record of the state, ready to be put into the stores
function recordsOfState(stationName: string, state: RegisterState): { recordId: string; storeName: string; key: IDBValidKey; value: unknown }[] {
  const records: { recordId: string; storeName: string; key: IDBValidKey; value: unknown }[] = [];
  const addRows = (storeName: string, rowsByDate: Record<string, Record<number, RegisterRow>>) =>
    Object.entries(rowsByDate ?? {}).forEach(([date, rowsByIndex]) => Object.entries(rowsByIndex).forEach(([rowIndex, row]) =>
      records.push({ recordId: `${storeName}|${date}|${rowIndex}`, storeName, key: [stationName, date, Number(rowIndex)], value: row })));
  addRows(shiftStoreName, state.shiftEntries);
  addRows(tvmStoreName, state.tvmEntries);
  Object.entries(state.bankTransfers ?? {}).forEach(([date, transfer]) =>
    records.push({ recordId: `${bankStoreName}|${date}`, storeName: bankStoreName, key: [stationName, date], value: transfer }));
  return records;
}

// the data of one station (undefined when nothing was saved for it yet)
export async function readRegisterState(stationName: string): Promise<RegisterState | undefined> {
  const database = await openDatabase();
  const transaction = database.transaction(requiredStoreNames, 'readonly');
  const stationRange = IDBKeyRange.bound([stationName], [stationName, []]);   // every key that starts with the station name
  const shiftStore = transaction.objectStore(shiftStoreName), tvmStore = transaction.objectStore(tvmStoreName), bankStore = transaction.objectStore(bankStoreName);
  const settingsStore = transaction.objectStore(settingsStoreName);

  const [stationSettings, legacySettings, shiftKeys, shiftValues, tvmKeys, tvmValues, bankKeys, bankValues] = await Promise.all([
    requestToPromise(settingsStore.get(settingsKeyOfStation(stationName))) as Promise<RegisterState | undefined>,
    stationName === legacyStationName ? (requestToPromise(settingsStore.get(legacyStateKey)) as Promise<RegisterState | undefined>) : Promise.resolve(undefined),
    requestToPromise(shiftStore.getAllKeys(stationRange)), requestToPromise(shiftStore.getAll(stationRange)),
    requestToPromise(tvmStore.getAllKeys(stationRange)), requestToPromise(tvmStore.getAll(stationRange)),
    requestToPromise(bankStore.getAllKeys(stationRange)), requestToPromise(bankStore.getAll(stationRange)),
  ]);

  const savedSettings = stationSettings ?? legacySettings;      // the first versions kept everything in these
  const hasRecords = shiftKeys.length + tvmKeys.length + bankKeys.length > 0;
  if (!savedSettings && !hasRecords) return undefined;

  // remember what the record stores hold now, so the next save sends only the changes
  const knownRecords = new Map<string, StoredRecord>();
  const state: RegisterState = { ...createEmptyRegisterState(), ...(savedSettings ?? {}) };
  if (hasRecords) { state.shiftEntries = {}; state.tvmEntries = {}; state.bankTransfers = {}; }   // the records win over data kept by older versions

  const readRows = (keys: IDBValidKey[], values: unknown[], storeName: string, target: Record<string, Record<number, RegisterRow>>) =>
    keys.forEach((key, position) => {
      const [, date, rowIndex] = key as [string, string, number];
      (target[date] ??= {})[rowIndex] = values[position] as RegisterRow;
      knownRecords.set(`${storeName}|${date}|${rowIndex}`, { storeName, key, serializedValue: JSON.stringify(values[position]) });
    });
  readRows(shiftKeys, shiftValues, shiftStoreName, state.shiftEntries);
  readRows(tvmKeys, tvmValues, tvmStoreName, state.tvmEntries);
  bankKeys.forEach((key, position) => {
    const [, date] = key as [string, string];
    state.bankTransfers[date] = bankValues[position] as BankTransfer;
    knownRecords.set(`${bankStoreName}|${date}`, { storeName: bankStoreName, key, serializedValue: JSON.stringify(bankValues[position]) });
  });
  savedRecordsOfStation.set(stationName, knownRecords);
  return state;
}

// saves the changes of the state in one transaction: all of it is saved, or none of it
export async function writeRegisterState(stationName: string, state: RegisterState): Promise<void> {
  const database = await openDatabase();
  const knownRecords = savedRecordsOfStation.get(stationName) ?? new Map<string, StoredRecord>();
  const nextRecords = new Map<string, StoredRecord>();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(requiredStoreNames, 'readwrite');
    recordsOfState(stationName, state).forEach(({ recordId, storeName, key, value }) => {
      const serializedValue = JSON.stringify(value);
      nextRecords.set(recordId, { storeName, key, serializedValue });
      if (knownRecords.get(recordId)?.serializedValue !== serializedValue) transaction.objectStore(storeName).put(value, key);
    });
    knownRecords.forEach((record, recordId) => {            // records that no longer exist
      if (!nextRecords.has(recordId)) transaction.objectStore(record.storeName).delete(record.key);
    });
    // the settings record holds everything except the records above
    transaction.objectStore(settingsStoreName).put(
      { ...state, shiftEntries: {}, tvmEntries: {}, bankTransfers: {} }, settingsKeyOfStation(stationName));

    transaction.oncomplete = () => { savedRecordsOfStation.set(stationName, nextRecords); resolve(); };
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save to the local database.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving to the local database was cancelled.'));
  });
}
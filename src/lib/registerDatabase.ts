import type { RegisterState } from './registerTypes';

const databaseName = 'dmrc-earning';
const storeName = 'register';

// data saved before stations existed was kept under the key 'current'
const legacyStateKey = 'current';
const legacyStationName = 'Noida Electronic City';   // the station that receives that old data

const stateKeyOfStation = (stationName: string) => `station:${stationName}`;

let databasePromise: Promise<IDBDatabase> | undefined;

// opens the database; if a version is given, the database is upgraded to that version
function openRequestToPromise(version?: number): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = version ? indexedDB.open(databaseName, version) : indexedDB.open(databaseName);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => {
      const openedDatabase = request.result;
      // another tab wants to upgrade the database: let it
      openedDatabase.onversionchange = () => { openedDatabase.close(); databasePromise = undefined; };
      resolve(openedDatabase);
    };
    request.onerror = () => reject(new Error(`Could not open the local database: ${request.error?.name} ${request.error?.message}`));
    request.onblocked = () => reject(new Error('The local database is blocked by another open tab or window of this app. Close the other ones and reload.'));
  });
}

// opens the current database (or creates a new one); if it exists without the store, upgrades it once to create the store
async function openDatabaseWithStore(): Promise<IDBDatabase> {
  const database = await openRequestToPromise();
  if (database.objectStoreNames.contains(storeName)) return database;
  const upgradedVersion = database.version + 1;
  database.close();
  return openRequestToPromise(upgradedVersion);
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser context.'));
  }
  if (databasePromise) return databasePromise;

  const openingPromise = openDatabaseWithStore();
  databasePromise = openingPromise;
  openingPromise.catch(() => { databasePromise = undefined; });   // a failed open can be tried again
  return openingPromise;
}

// reads the value saved under one key
async function readValue(stateKey: string): Promise<RegisterState | undefined> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).get(stateKey);
    let state: RegisterState | undefined;

    request.onsuccess = () => {
      state = request.result as RegisterState | undefined;
    };
    transaction.oncomplete = () => resolve(state);
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not read the local database.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Reading the local database was cancelled.'));
  });
}

// the data of one station; the old single-station data is handed to legacyStationName the first time
export async function readRegisterState(stationName: string): Promise<RegisterState | undefined> {
  const stationState = await readValue(stateKeyOfStation(stationName));
  if (stationState || stationName !== legacyStationName) return stationState;
  return readValue(legacyStateKey);
}

export async function writeRegisterState(stationName: string, state: RegisterState): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(state, stateKeyOfStation(stationName));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save to the local database.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving to the local database was cancelled.'));
  });
}
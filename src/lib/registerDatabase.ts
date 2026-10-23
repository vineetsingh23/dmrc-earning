import type { RegisterState } from './registerTypes';

const databaseName = 'dmrc-earning';
const databaseVersion = 1;
const storeName = 'register';
const stateKey = 'current';

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser context.'));
  }

  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open the local database.'));
    request.onblocked = () => reject(new Error('The local database is blocked by another open app tab.'));
  });

  return databasePromise;
}

export async function readRegisterState(): Promise<RegisterState | undefined> {
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

export async function writeRegisterState(state: RegisterState): Promise<void> {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(state, stateKey);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not save to the local database.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Saving to the local database was cancelled.'));
  });
}

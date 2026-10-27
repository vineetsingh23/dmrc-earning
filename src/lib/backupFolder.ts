import type { RegisterState } from './registerTypes';

// Browsers other than Chrome and Edge cannot write into a folder of the user's choice
export const isFolderBackupSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

// the few parts of the File System Access API that are used here
interface BackupFolderHandle {
  name: string;
  queryPermission(options: { mode: 'readwrite' }): Promise<PermissionState>;
  requestPermission(options: { mode: 'readwrite' }): Promise<PermissionState>;
  getFileHandle(fileName: string, options: { create: boolean }): Promise<{ createWritable(): Promise<{ write(text: string): Promise<void>; close(): Promise<void> }> }>;
  removeEntry(fileName: string): Promise<void>;
  values(): AsyncIterable<{ kind: string; name: string }>;
}

const settingsDatabaseName = 'dmrc-earning-settings';   // a small database of its own: the register database stays untouched
const settingsStoreName = 'settings';
const folderHandleKey = 'backupFolderHandle';
const lastBackupTimeKey = 'lastBackupTime';
export const backupIntervalDays = 7;
const backupFilesKept = 12;

function openSettingsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(settingsDatabaseName, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(settingsStoreName); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function readSetting<Value>(settingKey: string): Promise<Value | undefined> {
  const database = await openSettingsDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(settingsStoreName, 'readonly').objectStore(settingsStoreName).get(settingKey);
    request.onsuccess = () => resolve(request.result as Value | undefined);
    request.onerror = () => reject(request.error);
  });
}
async function writeSetting(settingKey: string, value: unknown): Promise<void> {
  const database = await openSettingsDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(settingsStoreName, 'readwrite');
    transaction.objectStore(settingsStoreName).put(value, settingKey);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export const readBackupFolder = () => readSetting<BackupFolderHandle>(folderHandleKey);
export const readLastBackupTime = () => readSetting<string>(lastBackupTimeKey);

// the user picks the folder once (for example D:\EarningBackups)
export async function chooseBackupFolder(): Promise<BackupFolderHandle> {
  const pickFolder = (window as unknown as { showDirectoryPicker: (options: { id: string; mode: 'readwrite' }) => Promise<BackupFolderHandle> }).showDirectoryPicker;
  const folder = await pickFolder.call(window, { id: 'earning-register-backup', mode: 'readwrite' });
  await writeSetting(folderHandleKey, folder);
  return folder;
}

// true when the app may write now; asking the user needs a click (askUser = true)
export async function hasFolderPermission(folder: BackupFolderHandle, askUser: boolean): Promise<boolean> {
  if ((await folder.queryPermission({ mode: 'readwrite' })) === 'granted') return true;
  return askUser && (await folder.requestPermission({ mode: 'readwrite' })) === 'granted';
}

export const isBackupDue = (lastBackupTime: string | undefined) =>
  !lastBackupTime || Date.now() - new Date(lastBackupTime).getTime() >= backupIntervalDays * 24 * 60 * 60 * 1000;

// writes one backup file, e.g. "Noida Electronic City-backup-2026-10-18.json", and keeps the newest 12 files of that station
export async function writeBackupFile(folder: BackupFolderHandle, stationName: string, state: RegisterState): Promise<string> {
  const filePrefix = `${stationName}-backup-`;
  const fileName = `${filePrefix}${new Date().toISOString().slice(0, 10)}.json`;
  const fileHandle = await folder.getFileHandle(fileName, { create: true });
  const writer = await fileHandle.createWritable();
  await writer.write(JSON.stringify({ station: stationName, exportedAt: new Date().toISOString(), data: state }, null, 2));
  await writer.close();
  await writeSetting(lastBackupTimeKey, new Date().toISOString());

  const oldFiles: string[] = [];
  for await (const entry of folder.values()) if (entry.kind === 'file' && entry.name.startsWith(filePrefix)) oldFiles.push(entry.name);
  oldFiles.sort();                                                              // file names hold the date, so this is oldest first
  for (const oldFileName of oldFiles.slice(0, Math.max(0, oldFiles.length - backupFilesKept))) await folder.removeEntry(oldFileName);
  return fileName;
}
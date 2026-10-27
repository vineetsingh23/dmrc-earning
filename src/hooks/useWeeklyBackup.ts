import { useCallback, useEffect, useRef, useState } from 'react';
import type { RegisterState } from '../lib/registerTypes';
import {
  chooseBackupFolder, hasFolderPermission, isBackupDue, isFolderBackupSupported, readBackupFolder, readLastBackupTime, writeBackupFile,
} from '../lib/backupFolder';

export type BackupStatus = 'unsupported' | 'noFolder' | 'upToDate' | 'needsPermission' | 'working' | 'error';

// writes the weekly backup file by itself when the app opens and a week has passed
export function useWeeklyBackup(stationName: string, registerState: RegisterState, isLoaded: boolean) {
  const [backupStatus, setBackupStatus] = useState<BackupStatus>(isFolderBackupSupported ? 'noFolder' : 'unsupported');
  const [folderName, setFolderName] = useState('');
  const [lastBackupTime, setLastBackupTime] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const latestStateReference = useRef(registerState);
  latestStateReference.current = registerState;

  // askUser: this call comes from a click, so the browser may ask for permission; onlyIfDue: skip when a backup is recent
  const runBackup = useCallback(async (askUser: boolean, onlyIfDue: boolean) => {
    try {
      const folder = await readBackupFolder();
      if (!folder) { setBackupStatus('noFolder'); return; }
      setFolderName(folder.name);
      const savedBackupTime = await readLastBackupTime();
      setLastBackupTime(savedBackupTime ?? '');
      if (onlyIfDue && !isBackupDue(savedBackupTime)) { setBackupStatus('upToDate'); return; }
      if (!(await hasFolderPermission(folder, askUser))) { setBackupStatus('needsPermission'); return; }
      setBackupStatus('working');
      const fileName = await writeBackupFile(folder, stationName, latestStateReference.current);
      setLastBackupTime(new Date().toISOString());
      setBackupMessage(`Saved ${fileName}`);
      setBackupStatus('upToDate');
    } catch (error) {
      console.error(error);
      setBackupMessage(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
      setBackupStatus('error');
    }
  }, [stationName]);

  // once the register has loaded: back up silently if a week has passed
  useEffect(() => { if (isFolderBackupSupported && isLoaded) void runBackup(false, true); }, [isLoaded, runBackup]);

  const chooseFolder = useCallback(async () => {
    try {
      await chooseBackupFolder();
      await runBackup(true, false);          // the first backup is written straight after choosing the folder
    } catch (error) {
      if ((error as Error).name !== 'AbortError') { setBackupMessage(String(error)); setBackupStatus('error'); }   // AbortError = the user closed the picker
    }
  }, [runBackup]);

  return { backupStatus, folderName, lastBackupTime, backupMessage, chooseFolder, backUpNow: () => runBackup(true, false) };
}
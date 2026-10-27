import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyRegisterState, type RegisterState } from '../lib/registerTypes';
import { readRegisterState, writeRegisterState } from '../lib/registerDatabase';

export type SaveStatus = 'loading' | 'saving' | 'saved' | 'error';

// data of one station, kept in IndexedDB
export function useRegisterData(stationName: string) {
  const [registerState, setRegisterState] = useState<RegisterState>(createEmptyRegisterState);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('loading');
  const [storageError, setStorageError] = useState<string>();
  const [loadedStationName, setLoadedStationName] = useState<string>();
  const [hasLoadedState, setHasLoadedState] = useState(false);
  const isLoaded = loadedStationName === stationName && hasLoadedState;
  const storageStatus = loadedStationName === stationName ? saveStatus : 'loading';
  const latestStateReference = useRef(registerState);
  latestStateReference.current = registerState;

  useEffect(() => {
  if (!isLoaded) return;
  const saveBeforeLeaving = () => {
    if (document.visibilityState === 'hidden') void writeRegisterState(stationName, latestStateReference.current);
  };
  document.addEventListener('visibilitychange', saveBeforeLeaving);
  window.addEventListener('pagehide', saveBeforeLeaving);
  return () => {
    document.removeEventListener('visibilitychange', saveBeforeLeaving);
    window.removeEventListener('pagehide', saveBeforeLeaving);
  };
}, [isLoaded, stationName]);

  // 1. load this station's data when the station opens
  useEffect(() => {
    let isStillCurrent = true;
    (async () => {
      try {
        const savedState = await readRegisterState(stationName);
        if (!isStillCurrent) return;
        setRegisterState(savedState ? { ...createEmptyRegisterState(), ...savedState } : createEmptyRegisterState());
        setStorageError(undefined);
        setLoadedStationName(stationName);
        setHasLoadedState(true);
        setSaveStatus('saved');
      } catch (error) {
        console.error(error);
        if (isStillCurrent) {
          setStorageError(error instanceof Error ? error.message : String(error));
          setLoadedStationName(stationName);
          setHasLoadedState(false);
          setSaveStatus('error');
        }
      }
    })();
    // browsers may delete site data when disk space is low; this asks them to keep it
    navigator.storage?.persist?.();
    return () => { isStillCurrent = false; };
  }, [stationName]);

  // 2. save half a second after the last change
  useEffect(() => {
    if (!isLoaded) return;
    const delayedSave = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await writeRegisterState(stationName, registerState);
        setStorageError(undefined);
        setSaveStatus('saved');
      } catch (error) {
        console.error(error);
        setStorageError(error instanceof Error ? error.message : String(error));
        setSaveStatus('error');
      }
    }, 500);
    return () => clearTimeout(delayedSave);
  }, [isLoaded, registerState, stationName]);

  const updateRegisterState = useCallback((applyChange: (draftState: RegisterState) => void) => {
    setRegisterState(previousState => {
      const draftState = structuredClone(previousState);
      applyChange(draftState);
      return draftState;
    });
  }, []);

  return {
    registerState,
    updateRegisterState,
    storageStatus,
    storageError,
    isLoaded,
  };
}


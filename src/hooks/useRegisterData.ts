import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyRegisterState, type RegisterState } from '../lib/registerTypes';
import { readRegisterState, writeRegisterState } from '../lib/registerDatabase';

const browserStorageKey = 'earning-register-data';
export type StorageStatus = 'loading' | 'saving' | 'saved' | 'error';

function readLegacyState(): RegisterState {
  const serializedState = localStorage.getItem(browserStorageKey);
  if (!serializedState) return createEmptyRegisterState();

  const parsedState: unknown = JSON.parse(serializedState);
  if (!parsedState || typeof parsedState !== 'object' || Array.isArray(parsedState)) {
    throw new Error('The saved browser data has an invalid format.');
  }

  return { ...createEmptyRegisterState(), ...parsedState } as RegisterState;
}

export function useRegisterData() {
  const [registerState, setRegisterState] = useState<RegisterState>(createEmptyRegisterState);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('loading');
  const [storageError, setStorageError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const saveVersion = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const savedState = await readRegisterState();
        const state = savedState ?? readLegacyState();

        if (!savedState) {
          await writeRegisterState(state);
        }

        if (cancelled) return;
        setRegisterState(state);
        setIsLoaded(true);
        setStorageStatus('saved');
      } catch (error) {
        console.error('Failed to load local register data:', error);
        if (cancelled) return;
        setStorageError(error instanceof Error ? error.message : String(error));
        setStorageStatus('error');
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const version = ++saveVersion.current;
    const delayedSave = setTimeout(async () => {
      setStorageStatus('saving');
      setStorageError('');
      try {
        await writeRegisterState(registerState);
        if (version === saveVersion.current) setStorageStatus('saved');
      } catch (error) {
        console.error('Failed to save local register data:', error);
        if (version !== saveVersion.current) return;
        setStorageError(error instanceof Error ? error.message : String(error));
        setStorageStatus('error');
      }
    }, 400);

    return () => clearTimeout(delayedSave);
  }, [isLoaded, registerState]);

  const updateRegisterState = useCallback((applyChange: (draftState: RegisterState) => void) => {
    setRegisterState(previousState => {
      const draftState = structuredClone(previousState);
      applyChange(draftState);
      return draftState;
    });
  }, []);

  return { registerState, updateRegisterState, storageStatus, storageError, isLoaded };
}
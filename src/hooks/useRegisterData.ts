import { useCallback, useEffect, useRef, useState } from 'react';
import { createEmptyRegisterState, type RegisterState } from '../lib/registerTypes';
import { pullShiftEntries, pushShiftEntries, supabaseClient } from '../lib/supabaseSync';

const browserStorageKey = 'earning-register-data';
export type SyncStatus = 'localOnly' | 'loading' | 'saving' | 'synced' | 'error';

export function useRegisterData() {
  const [registerState, setRegisterState] = useState<RegisterState>(() => {
    try {
      return { ...createEmptyRegisterState(), ...JSON.parse(localStorage.getItem(browserStorageKey) || '{}') };
    } catch {
      return createEmptyRegisterState();
    }
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(supabaseClient ? 'loading' : 'localOnly');
  const latestStateReference = useRef(registerState);
  latestStateReference.current = registerState;
  const firstLoadFinished = useRef(!supabaseClient);   // nothing is sent before the first load ends

  // 1. load from Supabase once, when the app opens
  useEffect(() => {
    if (!supabaseClient) return;
    (async () => {
      try {
        const pulledEntries = await pullShiftEntries();
        if (Object.keys(pulledEntries).length) {
          setRegisterState(previousState => ({ ...previousState, shiftEntries: pulledEntries }));
        } else {
          await pushShiftEntries(latestStateReference.current.shiftEntries);   // empty database: upload this device's data
        }
        firstLoadFinished.current = true;
        setSyncStatus('synced');
      } catch (error) {
        console.error(error);
        setSyncStatus('error');
      }
    })();
  }, []);

  // 2. after every change: save in the browser now, send to Supabase 1 second later
  useEffect(() => {
    localStorage.setItem(browserStorageKey, JSON.stringify(registerState));
    if (!supabaseClient || !firstLoadFinished.current) return;
    setSyncStatus('saving');
    const delayedSend = setTimeout(async () => {
      try {
        await pushShiftEntries(registerState.shiftEntries);
        setSyncStatus('synced');
      } catch (error) {
        console.error(error);
        setSyncStatus('error');
      }
    }, 1000);
    return () => clearTimeout(delayedSend);
  }, [registerState]);

  const updateRegisterState = useCallback((applyChange: (draftState: RegisterState) => void) => {
    setRegisterState(previousState => {
      const draftState = structuredClone(previousState);
      applyChange(draftState);
      return draftState;
    });
  }, []);

  return { registerState, updateRegisterState, syncStatus };
}
import { useCallback, useEffect, useState } from 'react';
import { createEmptyRegisterState, type RegisterState } from '../lib/registerTypes';

const browserStorageKey = 'earning-register-data';

export function useRegisterData() {
  const [registerState, setRegisterState] = useState<RegisterState>(() => {
    try {
      return { ...createEmptyRegisterState(), ...JSON.parse(localStorage.getItem(browserStorageKey) || '{}') };
    } catch {
      return createEmptyRegisterState();
    }
  });

  // after every change, keep a copy in the browser
  useEffect(() => {
    localStorage.setItem(browserStorageKey, JSON.stringify(registerState));
  }, [registerState]);

  // copy the data, let the caller change the copy, give React the new copy
  const updateRegisterState = useCallback((applyChange: (draftState: RegisterState) => void) => {
    setRegisterState(previousState => {
      const draftState = structuredClone(previousState);
      applyChange(draftState);
      return draftState;
    });
  }, []);

  return { registerState, updateRegisterState };
}

// Puedes crear un custom hook para abstraer las llamadas
import { useCallback } from 'react';

export function useBcrypt() {
  const hashPassword = useCallback(async (password) => {
    return window.electron.hashPassword(password);
  }, []);

  const comparePassword = useCallback(async (password, hash) => {
    return window.electron.comparePassword(password, hash);
  }, []);

  return { hashPassword, comparePassword };
}
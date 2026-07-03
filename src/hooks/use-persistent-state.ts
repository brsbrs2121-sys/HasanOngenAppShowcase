
'use client';

import { useState, useEffect, useCallback } from 'react';

// A custom hook to persist state in localStorage
export function usePersistentState<T>(key: string, initialState: T, reviver?: (key: string, value: any) => any): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    // This function is only executed on the initial render on the client side.
    if (typeof window === 'undefined') {
      return initialState;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue, reviver);
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
    return initialState;
  });

  useEffect(() => {
    // This effect runs on the client after every render where `state` changes.
    if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
          console.error(`Error writing to localStorage key “${key}”:`, error);
        }
    }
  }, [key, state]);

  // This effect handles changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
            setState(JSON.parse(e.newValue, reviver));
        } catch(error) {
             console.error(`Error parsing storage change for key “${key}”:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, reviver]);


  return [state, setState];
}

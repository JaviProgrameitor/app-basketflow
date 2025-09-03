import { useState } from "react";

function useLocalStorage(key, initialValue) {
  // Lee el valor inicial desde localStorage o usa initialValue
  const readValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error leyendo la key "${key}" desde localStorage`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Actualiza el valor en estado y en localStorage
  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error estableciendo la key "${key}" en localStorage`, error);
    }
  };

  return [storedValue, setValue];
}

export { useLocalStorage };
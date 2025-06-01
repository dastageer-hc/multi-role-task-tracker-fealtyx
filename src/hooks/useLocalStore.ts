// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

interface StorageValue<T> {
  value: T;
  timestamp: number;
}

export function useLocalStore<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem: StorageValue<T> = JSON.parse(item);
      const now = new Date().getTime();

      // Check if the stored value is expired (older than 24 hours)
      if (now - parsedItem.timestamp > 24 * 60 * 60 * 1000) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore: StorageValue<T> = {
        value: storedValue,
        timestamp: new Date().getTime(),
      };
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth-token",
  CURRENT_USER: "current-user",
} as const;

// // In any component:
// import { useLocalStorage, STORAGE_KEYS } from "@/hooks/useLocalStorage";

// const MyComponent = () => {
//   const { setItem, getItem, removeItem } = useLocalStorage();

//   // Save data
//   setItem("my-key", { some: "data" });

//   // Get data
//   const data = getItem<MyDataType>("my-key");

//   // Remove data
//   removeItem("my-key");
// };

// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const setItem = (key: string, value: any) => {
    if (!isClient) return;
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  const getItem = <T>(key: string): T | null => {
    if (!isClient) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  };

  const removeItem = (key: string) => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  };

  const clear = () => {
    if (!isClient) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
    clear,
    isClient,
  };
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
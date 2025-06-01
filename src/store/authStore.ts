// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types/auth";

// Dummy users data
const DUMMY_USERS: User[] = [
  {
    id: "1",
    email: "developer@example.com",
    name: "John Developer",
    role: "developer",
  },
  {
    id: "2",
    email: "manager@example.com",
    name: "Jane Manager",
    role: "manager",
  },
];

// Dummy credentials
const VALID_CREDENTIALS = [
  { email: "developer@example.com", password: "dev123" },
  { email: "manager@example.com", password: "man123" },
];

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "auth-token",
  CURRENT_USER: "current-user",
};

// LocalStorage helper functions
const storage = {
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      isAuthenticated: false,
      isLoading: true,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Find matching credentials
        const credentialIndex = VALID_CREDENTIALS.findIndex(
          (cred) => cred.email === email && cred.password === password
        );

        if (credentialIndex !== -1) {
          const user = DUMMY_USERS[credentialIndex];

          // Save to localStorage
          storage.setItem(STORAGE_KEYS.AUTH_TOKEN, "dummy-token");
          storage.setItem(STORAGE_KEYS.CURRENT_USER, user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        // Remove from localStorage
        storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        storage.removeItem(STORAGE_KEYS.CURRENT_USER);

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initializeAuth: () => {
        try {
          const token = storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
          const user = storage.getItem<User>(STORAGE_KEYS.CURRENT_USER);

          if (token && user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

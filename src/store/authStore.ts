// src/store/authStore.ts
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { User } from "@/types/auth";

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

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

interface Storage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (credentials) => {
        console.log("Login attempt:", {
          email: credentials.email,
          password: credentials.password,
        });

        // Check developer credentials
        if (
          credentials.email === "developer@example.com" &&
          credentials.password === "dev123"
        ) {
          const user = DUMMY_USERS[0]; // Developer user
          console.log("Developer login successful:", user);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
          set({
            user,
            isAuthenticated: true,
          });
          return;
        }

        // Check manager credentials
        if (
          credentials.email === "manager@example.com" &&
          credentials.password === "man123"
        ) {
          const user = DUMMY_USERS[1]; // Manager user
          console.log("Manager login successful:", user);
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
          set({
            user,
            isAuthenticated: true,
          });
          return;
        }

        console.log("Login failed - invalid credentials");
        throw new Error("Invalid credentials");
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        set({ user: null, isAuthenticated: false });
      },
      initializeAuth: async () => {
        try {
          const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
          if (storedUser) {
            const user = JSON.parse(storedUser);
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      } as PersistStorage<AuthState>,
    }
  )
);

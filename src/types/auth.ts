// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "manager" | "developer";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

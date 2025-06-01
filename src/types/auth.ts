// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: "manager" | "developer";
}

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
}

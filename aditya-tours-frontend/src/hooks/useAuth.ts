import { createContext, createElement, useContext, useMemo, useState, type ReactNode } from 'react';
import { adminLogin } from '../services/adminService';

interface AuthState {
  token: string;
  username: string;
  name: string;
}

interface AuthContextValue {
  auth: AuthState | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'aditya_admin_auth';
const TOKEN_KEY = 'aditya_admin_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthState) : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      isAuthenticated: !!auth?.token,
      async login(username, password) {
        const data = await adminLogin(username, password);
        const nextAuth: AuthState = {
          token: data.token,
          username: data.admin.username,
          name: data.admin.name,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
        localStorage.setItem(TOKEN_KEY, data.token);
        setAuth(nextAuth);
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
        setAuth(null);
      },
    }),
    [auth],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

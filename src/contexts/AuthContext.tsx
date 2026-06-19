import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, isDemoMode, setDemoUser } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = isDemoMode();

  const refreshUser = async () => {
    try {
      const u = await authAPI.getCurrentUser();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    await authAPI.login(email, password);
    await refreshUser();
  };

  const register = async (email: string, password: string, displayName: string) => {
    const u = await authAPI.register(email, password, displayName);
    if (isDemo) {
      setDemoUser(u as UserProfile);
      setUser(u as UserProfile);
    } else {
      await refreshUser();
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isDemo, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

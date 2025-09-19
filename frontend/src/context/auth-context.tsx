'use client';

import type { User } from '../lib/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  register: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for a mock user in local storage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    // Mock user creation based on email
    const mockUser: User = {
      id: 'mock-user-id',
      email: email,
      fullName: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
    };
    
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
    router.push('/dashboard');
  }, [router]);

  const register = useCallback(async (email: string) => {
    // In a mock setup, register can just log the user in.
    await login(email);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('mockUser');
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
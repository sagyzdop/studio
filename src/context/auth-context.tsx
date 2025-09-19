'use client';

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  register: (fullName: string, email: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock checking for a logged-in user in localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string) => {
    setLoading(true);
    // Mock login logic
    const role = email.includes('admin') ? 'admin' : 'user';
    const fullName = role === 'admin' ? 'Admin User' : 'Corporate User';
    const newUser: User = { id: '1', email, fullName, role };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const register = (fullName: string, email: string) => {
    setLoading(true);
    // Mock registration logic
    const newUser: User = { id: '2', email, fullName, role: 'user' };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

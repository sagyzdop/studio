'use client';

import type { User } from '../lib/types';
import * as api from '../lib/api';
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  }, [router]);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api.fetchCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user, token might be expired.', error);
        logout(); // Log out if the token is invalid
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const response = await api.loginUser(email, password);
    localStorage.setItem('authToken', response.data.access_token);
    await fetchUser(); // Fetch user details after getting the token
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    // You might want to get the full name from the form in a real app
    await api.registerUser(email, password);
    await login(email, password); // Automatically log in after registration
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};


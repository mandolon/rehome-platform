'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { apiClient } from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth_token');
      if (token) {
        try {
          const response = await apiClient.get<{ user: User }>('/user');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          Cookies.remove('auth_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{
        access_token: string;
        user: User;
      }>('/login', { email, password });
      
      const { access_token, user: userData } = response.data;
      
      // Store token in cookie
      Cookies.set('auth_token', access_token, { expires: 7 }); // 7 days
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    // Optionally call logout endpoint
    apiClient.post('/logout').catch(console.error);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{
        access_token: string;
        user: User;
      }>('/register', { name, email, password });
      
      const { access_token, user: userData } = response.data;
      
      // Store token in cookie
      Cookies.set('auth_token', access_token, { expires: 7 }); // 7 days
      setUser(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
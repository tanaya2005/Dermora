import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from './lib/auth-client';

const API_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "http://localhost:5000") : "";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (
    name: string, 
    email: string, 
    password: string, 
    role?: "ADMIN" | "BUYER" | "SELLER" | "DERMATOLOGIST",
    sellerData?: {
      phone: string;
      address: string;
      bankAccount: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
        bankName: string;
      };
    }
  ) => Promise<{ data: any, error: any }>;
  login: (email: string, password: string) => Promise<{ data: any, error: any }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  apiRequest: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const setToken = (token: string) => localStorage.setItem('token', token);
  const removeToken = () => localStorage.removeItem('token');

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const checkAuth = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await apiRequest('/api/auth/me');
      setUser(data.user || null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "ADMIN" | "BUYER" | "SELLER" | "DERMATOLOGIST" = "BUYER",
    sellerData?: {
      phone: string;
      address: string;
      bankAccount: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
        bankName: string;
      };
    }
  ) => {
    try {
      const payload: any = { name, email, password, role };
      
      // Add seller data if provided
      if (sellerData) {
        payload.phone = sellerData.phone;
        payload.address = sellerData.address;
        payload.bankAccount = sellerData.bankAccount;
      }

      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.token) {
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.token) {
        setToken(data.token);
      }
      if (data.user) {
        setUser(data.user);
      }
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      removeToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, checkAuth, apiRequest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

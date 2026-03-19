import { useEffect, useState } from "react";
import type { User } from "../lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
  };

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
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
    role: "BUYER" | "SELLER" = "BUYER"
  ) => {
    try {
      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
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

  return { user, loading, signup, login, logout, checkAuth };
}

export type { User };
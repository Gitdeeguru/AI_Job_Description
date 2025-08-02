'use client';

import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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
    // In a real app, you'd verify password here.
    const userData: User = { 
      email,
      name: email.split('@')[0], // simple name from email
      initials: (email.split('@')[0]?.[0] || '').toUpperCase(),
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/profile');
  };

  const signup = (email: string, name: string) => {
    const userData: User = { 
      email,
      name,
      initials: (name[0] || '').toUpperCase(),
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/profile');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
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

'use client';

import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';


interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  signup: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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

  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const login = (email: string) => {
    // In a real app, you'd verify password here.
    // We'll simulate fetching a user. If they don't exist, we create them.
    const storedUser = localStorage.getItem('user');
    let userData: User | null = null;
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
            userData = parsedUser;
        }
    }

    if (!userData) {
      // For demo purposes, if user doesn't exist, create one on login
       userData = { 
        email,
        name: email.split('@')[0], 
        initials: (email.split('@')[0]?.[0] || '').toUpperCase(),
      };
    }
    
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/profile');
    toast({
        title: `Welcome back, ${userData.name}!`,
        description: "You have been successfully logged in.",
    });
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
     toast({
        title: `Welcome, ${userData.name}!`,
        description: "Your account has been created successfully.",
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out. Thanks for visiting!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
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

'use client';

import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';


interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => void;
  signup: (email: string, name: string, password?: string) => void;
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

  const login = (email: string, password?: string) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      if (parsedUser.email === email && parsedUser.password === password) {
        setUser(parsedUser);
        router.push('/profile');
        toast({
          title: `Welcome back, ${parsedUser.name}!`,
          description: "You have been successfully logged in.",
        });
        return;
      }
    }
    
    toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
    });
  };

  const signup = (email: string, name: string, password?: string) => {
    const userData: User = { 
      email,
      name,
      initials: (name[0] || '').toUpperCase(),
      password,
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

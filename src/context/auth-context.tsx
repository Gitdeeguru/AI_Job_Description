'use client';

import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';


interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
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
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = (updatedUserData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUserData };
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      try {
        const storedUsers = localStorage.getItem('users');
        const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
        const userIndex = users.findIndex(u => u.email === newUser.email);
        if (userIndex !== -1) {
          users[userIndex] = newUser;
          localStorage.setItem('users', JSON.stringify(users));
        }
      } catch (error) {
         console.error('Failed to update user in users list', error);
      }

    }
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
     try {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const foundUser = users.find(u => u.email === email);

      if (foundUser && foundUser.password === password) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        router.push('/profile');
        toast({
          title: `Welcome back, ${foundUser.name}!`,
          description: "You have been successfully logged in.",
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
        return false;
      }
    } catch (error) {
        console.error('Failed to process login', error);
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "An unexpected error occurred. Please try again.",
        });
        return false;
    }
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    try {
      const storedUsers = localStorage.getItem('users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
         // Don't inform the user that the email already exists to prevent email enumeration.
         // Just redirect to login as if signup was successful.
         router.push('/login');
         toast({
          title: `Account Created!`,
          description: "Your account has been created successfully. Please log in.",
         });
        return true;
      }

      const userData: User = { 
        email,
        name,
        initials: (name[0] || '').toUpperCase(),
        password,
      };

      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));
      
      router.push('/login');
       toast({
          title: `Account Created!`,
          description: "Your account has been created successfully. Please log in.",
      });
      return true;
    } catch(error) {
      console.error('Failed to process signup', error);
       toast({
            variant: "destructive",
            title: "Signup Error",
            description: "An unexpected error occurred. Please try again.",
        });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
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

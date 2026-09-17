'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, role?: UserRole) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  updateProfile: (updated: Partial<User>) => void;
}

const AUTH_STORAGE_KEY = 'olato_auth_user_v1';

const DEFAULT_USER: User = {
  id: 'user-1',
  name: 'Hamza Malik',
  email: 'hamza@example.com',
  role: 'USER',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  studentVerified: true,
  preferredLocation: 'Gulberg III, Lahore',
  savedDiscountIds: ['disc-1', 'disc-3'],
  createdAt: '2026-06-15T10:00:00Z',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  };

  const signIn = (email: string, role: UserRole = 'USER') => {
    const newUser: User = {
      ...DEFAULT_USER,
      email,
      name: email.split('@')[0].replace('.', ' '),
      role,
    };
    persistUser(newUser);
  };

  const signUp = (name: string, email: string) => {
    const newUser: User = {
      ...DEFAULT_USER,
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'USER',
    };
    persistUser(newUser);
  };

  const signOut = () => {
    persistUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    const newU = { ...user, ...updated };
    persistUser(newU);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

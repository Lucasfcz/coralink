'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authService } from '@/services/auth';
import { AuthModal } from '@/components/auth/AuthModal';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  requireAuth: (callback: () => void) => void;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const requireAuth = (callback: () => void) => {
    if (user) {
      callback();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    // Hidratação da sessão persistida em microtask para evitar cascading renders síncronos
    queueMicrotask(() => {
      try {
        const storedUser = localStorage.getItem('coralink_user');
        const storedToken = localStorage.getItem('coralink_token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch {
        localStorage.removeItem('coralink_user');
        localStorage.removeItem('coralink_token');
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const handleAuthSuccess = (res: { accessToken: string; user: User }) => {
    setUser(res.user);
    setToken(res.accessToken);
    try {
      localStorage.setItem('coralink_user', JSON.stringify(res.user));
      localStorage.setItem('coralink_token', res.accessToken);
    } catch {
      // Ignora erro de cota de storage
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setIsLoading(true);
    try {
      const res = await authService.loginWithGoogle(idToken);
      handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, pass);
      handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, pass);
      handleAuthSuccess(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('coralink_user');
      localStorage.removeItem('coralink_token');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}

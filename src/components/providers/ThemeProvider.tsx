'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): Theme {
  try {
    const savedTheme = localStorage.getItem('coralink-theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function getServerSnapshot(): Theme {
  return 'light';
}

function applyThemeClass(t: Theme) {
  if (typeof document === 'undefined') return;
  if (t === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [userTheme, setUserTheme] = useState<Theme | null>(null);
  const storedTheme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);
  const theme = userTheme ?? storedTheme;

  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    const isReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const changeTheme = () => {
      applyThemeClass(newTheme);
      setUserTheme(newTheme);
      try {
        localStorage.setItem('coralink-theme', newTheme);
        window.dispatchEvent(new Event('storage'));
      } catch {
        // Ignora erro de escrita no localStorage
      }
    };

    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as { startViewTransition?: (cb: () => void) => void }).startViewTransition ===
        'function' &&
      !isReducedMotion
    ) {
      (document as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        changeTheme();
      });
    } else {
      changeTheme();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

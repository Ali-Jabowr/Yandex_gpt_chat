'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'purple' | 'ocean' | 'forest';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Record<Theme, ThemeConfig>;
}

interface ThemeConfig {
  name: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  gradient: string;
}

const themes: Record<Theme, ThemeConfig> = {
  dark: {
    name: 'Dark',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    surface: 'bg-slate-900/90',
    surfaceHover: 'hover:bg-slate-800/70',
    border: 'border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    primary: 'bg-indigo-500',
    primaryHover: 'hover:bg-indigo-600',
    accent: 'text-purple-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600'
  },
  light: {
    name: 'Light',
    background: 'from-gray-100 via-white to-gray-100',
    surface: 'bg-white/90',
    surfaceHover: 'hover:bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    accent: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  purple: {
    name: 'Purple Haze',
    background: 'from-purple-900 via-violet-900 to-purple-900',
    surface: 'bg-purple-900/90',
    surfaceHover: 'hover:bg-purple-800/70',
    border: 'border-purple-700/50',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    primary: 'bg-purple-500',
    primaryHover: 'hover:bg-purple-600',
    accent: 'text-violet-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-rose-400',
    gradient: 'bg-gradient-to-r from-purple-500 to-violet-600'
  },
  ocean: {
    name: 'Ocean Breeze',
    background: 'from-blue-900 via-cyan-900 to-blue-900',
    surface: 'bg-blue-900/90',
    surfaceHover: 'hover:bg-blue-800/70',
    border: 'border-blue-700/50',
    text: 'text-white',
    textSecondary: 'text-blue-200',
    primary: 'bg-cyan-500',
    primaryHover: 'hover:bg-cyan-600',
    accent: 'text-cyan-400',
    success: 'text-teal-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-600'
  },
  forest: {
    name: 'Forest',
    background: 'from-green-900 via-emerald-900 to-green-900',
    surface: 'bg-green-900/90',
    surfaceHover: 'hover:bg-green-800/70',
    border: 'border-green-700/50',
    text: 'text-white',
    textSecondary: 'text-green-200',
    primary: 'bg-emerald-500',
    primaryHover: 'hover:bg-emerald-600',
    accent: 'text-emerald-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    gradient: 'bg-gradient-to-r from-emerald-500 to-green-600'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
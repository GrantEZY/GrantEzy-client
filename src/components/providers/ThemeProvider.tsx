"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  mounted: false
});

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.className = newTheme;
    }
  };

  useEffect(() => {
    // Get the initial theme from sessionStorage or default to light
    try {
      const savedTheme = sessionStorage.getItem('theme-mode') as Theme | null;
      const initialTheme = (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) ? savedTheme : 'light';
      setThemeState(initialTheme);
      applyTheme(initialTheme);
    } catch (error) {
      // Fallback to light mode if sessionStorage is not available
      setThemeState('light');
      applyTheme('light');
    }
    
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try {
      sessionStorage.setItem('theme-mode', newTheme);
    } catch (error) {
      // Handle cases where sessionStorage is not available
      console.warn('Could not save theme to sessionStorage');
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    mounted
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  return context;
}

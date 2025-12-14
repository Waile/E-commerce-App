import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../theme/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;
  const isDark = themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

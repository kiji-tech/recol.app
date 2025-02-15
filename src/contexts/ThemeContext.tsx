import React, { createContext, useContext, useEffect, useState } from 'react';
import { colorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, useColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@theme_mode';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  isThemeLoaded: boolean;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const themeToApply = (savedTheme as ThemeMode) || systemColorScheme || 'light';

        if (Platform.OS === 'ios') {
          colorScheme.set(themeToApply);
        } else {
          // Androidの場合は遅延実行
          await new Promise((resolve) => setTimeout(resolve, 0));
          colorScheme.set(themeToApply);
        }

        setThemeState(themeToApply);
        setIsDarkMode(themeToApply === 'dark');
        setIsThemeLoaded(true);
      } catch (error) {
        console.error('テーマ設定の読み込みに失敗しました:', error);
        setThemeState('light');
        setIsDarkMode(false);
        setIsThemeLoaded(true);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      if (Platform.OS === 'ios') {
        colorScheme.set(newTheme);
      } else {
        // Androidの場合は遅延実行
        await new Promise((resolve) => setTimeout(resolve, 100));
        colorScheme.set(newTheme);
      }
      setThemeState(newTheme);
    } catch (error) {
      console.error('テーマの保存に失敗しました:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isThemeLoaded, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

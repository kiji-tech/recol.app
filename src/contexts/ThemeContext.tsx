import React, { createContext, useContext, useEffect, useState } from 'react';
import { colorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, useColorScheme } from 'react-native';
import { LogUtil } from '../libs/LogUtil';

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
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY).catch((e) => {
          if (e && e.message) LogUtil.log(e.message, { level: 'error' });
        });
        const themeToApply = (savedTheme as ThemeMode) || systemColorScheme || 'light';

        if (Platform.OS === 'ios') {
          colorScheme.set(themeToApply);
        } else {
          // Androidの場合は遅延実行
          await new Promise((resolve) => setTimeout(resolve, 0)).catch((e) => {
            if (e && e.message) {
              LogUtil.log(e.message, { level: 'error' });
            }
          });
          colorScheme.set(themeToApply);
        }

        setThemeState(themeToApply);
        setIsDarkMode(themeToApply === 'dark');
        setIsThemeLoaded(true);
      } catch {
        setThemeState('light');
        setIsDarkMode(false);
        setIsThemeLoaded(true);
      }
    };

    loadTheme().catch((e) => {
      if (e && e.message) LogUtil.log(e.message, { level: 'error' });
    });
  }, [systemColorScheme]);

  const setTheme = async (newTheme: ThemeMode) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme).catch((e) => {
      if (e && e.message) LogUtil.log(e.message, { level: 'error' });
    });
    if (Platform.OS === 'ios') {
      colorScheme.set(newTheme);
    } else {
      // Androidの場合は遅延実行
      await new Promise((resolve) => setTimeout(resolve, 0)).catch((e) => {
        if (e && e.message) {
          LogUtil.log(e.message, { level: 'error' });
        }
      });
      colorScheme.set(newTheme);
    }
    setThemeState(newTheme);
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

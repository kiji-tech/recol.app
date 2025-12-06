import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts';
import generateI18nMessage from '@/src/libs/i18n';

export default function SettingDarkMode() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // テーマ切り替え処理
  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  return (
    <View className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
      <View className="flex-row items-center">
        <Ionicons name="moon-outline" size={24} color={isDarkMode ? 'white' : 'black'} />
        <Text className="ml-3 text-light-text dark:text-dark-text">
          {generateI18nMessage('COMMON.DARK_MODE')}
        </Text>
      </View>
      <Switch value={isDarkMode} onValueChange={handleThemeChange} />
    </View>
  );
}

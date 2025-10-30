import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

type Props = {
  icon: React.ReactNode;
  theme?: 'info' | 'danger' | 'warn' | 'theme' | 'background';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};
export default function IconButton({
  icon,
  theme = 'theme',
  onPress,
  disabled = false,
  loading = false,
}: Props) {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        className={`
        h-12 w-12 rounded-full
        flex justify-center items-center
        bg-light-${theme} dark:bg-dark-${theme}
        ${disabled ? 'opacity-50' : ''}
        `}
      >
        {loading && <ActivityIndicator size="small" color={isDarkMode ? 'white' : 'black'} />}
        {!loading && icon}
      </View>
    </TouchableOpacity>
  );
}

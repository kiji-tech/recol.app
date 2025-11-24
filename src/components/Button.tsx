import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  text: string;
  theme?: 'theme' | 'info' | 'warn' | 'danger' | 'background';
  disabled?: boolean;
  loading?: boolean;
  size?: 'full' | 'fit' | string;
  onPress: () => void;
}

const Button = ({
  text,
  theme = 'background',
  disabled = false,
  loading = false,
  size = 'full',
  onPress = () => void 0,
}: Props) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      className={`
            ${disabled ? 'opacity-20' : ''}
            ${size === 'fit' ? 'w-fit' : 'w-full'}
            rounded-md flex justify-center item-center py-4 px-8 bg-light-${theme} dark:bg-dark-${theme}
            `}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex flex-row justify-center items-center">
        {loading && <ActivityIndicator className="mr-2" color={isDarkMode ? 'white' : 'black'} />}
        <Text className={`text-light-text dark:text-dark-text text-lg text-center`}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

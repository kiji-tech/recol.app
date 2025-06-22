import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  text: string;
  theme?: 'theme' | 'info' | 'warn' | 'danger' | 'background';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
}

const Button = ({
  text,
  theme = 'background',
  disabled = false,
  loading = false,
  onPress = () => void 0,
}: Props) => {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity
      className="flex flex-row justify-center items-center"
      onPress={onPress}
      disabled={disabled}
    >
      {loading && <ActivityIndicator className="mr-2" color={isDarkMode ? 'white' : 'black'} />}
      <View
        className={`
            ${disabled ? 'opacity-20' : ''}
            rounded-md w-full flex justify-center item-center py-4 px-8 bg-light-${theme} dark:bg-dark-${theme}
            `}
      >
        <Text className={`text-light-text dark:text-dark-text text-lg text-center`}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

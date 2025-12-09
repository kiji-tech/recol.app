import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/src/contexts';

export default function DevelopmentBar() {
  const isDevelopment = process.env.EXPO_PUBLIC_APP_ENV == 'development';
  const { isDarkMode } = useTheme();

  if (!isDevelopment) return null;

  return (
    <View className="absolute top-0 right-0 z-50">
      <View
        className="w-32 h-6 justify-center items-center"
        style={{
          backgroundColor: isDarkMode ? '#17AC38' : '#B5F3C3',
          transform: [{ rotate: '45deg' }],
          marginTop: 8,
          marginRight: -16,
        }}
      >
        <Text
          className="text-xs font-bold"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#2A2A2A',
            transform: [{ rotate: '-45deg' }],
          }}
        >
          DEV
        </Text>
      </View>
    </View>
  );
}

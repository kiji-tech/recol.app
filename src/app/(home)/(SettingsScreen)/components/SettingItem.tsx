import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  isDarkMode: boolean;
}

export default function SettingItem({
  icon,
  title,
  value,
  onPress,
  showArrow = true,
  isDarkMode,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 border-b border-light-border dark:border-dark-border"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={24} color={isDarkMode ? 'white' : 'black'} />
        <Text className="ml-3 text-light-text dark:text-dark-text">{title}</Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="mr-2 text-light-text dark:text-dark-text">{value}</Text>}
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
      </View>
    </TouchableOpacity>
  );
}

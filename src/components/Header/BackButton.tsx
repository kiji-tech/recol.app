import { TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
type Props = {
  onPress: () => void;
};
export default function BackButton({ onPress }: Props) {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-12 h-12 rounded-3xl justify-center flex items-center bg-light-background dark:bg-dark-background">
        <MaterialIcons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
      </View>
    </TouchableOpacity>
  );
}

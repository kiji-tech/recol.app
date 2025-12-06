import React from 'react';
import { View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { IconButton } from '@/src/components';
type Props = {
  onClose: () => void;
};
export default function PlaceBottomSheetHeader({ onClose }: Props) {
  const { isDarkMode } = useTheme();

  return (
    <View className="px-2 py-4 flex flex-row items-center justify-between">
      {/* 閉じるボタン */}
      <IconButton
        icon={<FontAwesome5 name="times" size={16} color={isDarkMode ? 'white' : 'black'} />}
        theme="background"
        onPress={onClose}
      />
    </View>
  );
}

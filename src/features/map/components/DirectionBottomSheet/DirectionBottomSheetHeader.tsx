import React from 'react';
import { View } from 'react-native';
import IconButton from '@/src/components/IconButton';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { DirectionMode } from '../../types/Direction';
type Props = {
  selectedMode: DirectionMode;
  onSelectedMode: (mode: DirectionMode) => void;
  onClose: () => void;
};
export default function DirectionBottomSheetHeader({
  onClose,
  selectedMode,
  onSelectedMode,
}: Props) {
  const { isDarkMode } = useTheme();

  return (
    <View className="px-2 py-4 flex flex-row items-center justify-between">
      {/* 閉じるボタン */}
      <IconButton
        icon={<FontAwesome5 name="times" size={16} color={isDarkMode ? 'white' : 'black'} />}
        theme="background"
        onPress={onClose}
      />
      {/* 移動手段の切替ボタン */}
      <View className="flex flex-row items-center gap-4">
        <IconButton
          icon={<FontAwesome5 name="walking" size={16} color={isDarkMode ? 'white' : 'black'} />}
          theme={selectedMode === 'walking' ? 'theme' : 'background'}
          onPress={() => onSelectedMode('walking')}
        />
        <IconButton
          icon={<FontAwesome5 name="car" size={16} color={isDarkMode ? 'white' : 'black'} />}
          theme={selectedMode === 'driving' ? 'theme' : 'background'}
          onPress={() => onSelectedMode('driving')}
        />
        <IconButton
          icon={<FontAwesome5 name="bicycle" size={16} color={isDarkMode ? 'white' : 'black'} />}
          theme={selectedMode === 'bicycling' ? 'theme' : 'background'}
          onPress={() => onSelectedMode('bicycling')}
        />
      </View>
    </View>
  );
}

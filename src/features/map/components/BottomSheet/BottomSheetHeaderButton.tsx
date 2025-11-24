import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

type HeaderCategoryButtonProps = {
  id: string;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: (id: string) => void;
};

export default function BottomSheetHeaderButton({
  id,
  label,
  selected,
  disabled = false,
  onPress,
}: HeaderCategoryButtonProps) {
  return (
    <TouchableOpacity key={id} onPress={() => onPress(id)} disabled={disabled}>
      <View
        className={`px-4 py-4 mr-2 rounded-xl ${selected ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'}`}
      >
        <Text className={`text-light-text dark:text-dark-text`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

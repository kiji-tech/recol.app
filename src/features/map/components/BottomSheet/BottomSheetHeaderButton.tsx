import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

type HeaderCategoryButtonProps = {
  id: string;
  label: string;
  selected: boolean;
  onPress: (id: string) => void;
};

export default function BottomSheetHeaderButton({
  id,
  label,
  selected,
  onPress,
}: HeaderCategoryButtonProps) {
  return (
    <TouchableOpacity key={id} onPress={() => onPress(id)}>
      <View
        className={`px-4 py-2 mr-2 rounded-xl ${selected ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'}`}
      >
        <Text className={`text-light-text dark:text-dark-text`}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

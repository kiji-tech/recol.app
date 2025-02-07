import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SearchSelectedButtonProps = {
  id: string;
  label: string;
  selected: boolean;
  onPress: (id: string) => void;
};

type Props = {
  selectedCategory: string;
  onSelectedCategory: (id: string) => void;
};
export default function PlaceCardHeader({ selectedCategory, onSelectedCategory }: Props) {
  // === Member ====
  // === Method ====
  const handleOnSelectedCategory = (id: string) => {
    onSelectedCategory(id);
  };
  const checkSelectedCategory = useCallback(
    (id: string) => selectedCategory === id,
    [selectedCategory]
  );

  const categoryButtonList = [
    { id: 'meal', label: '食事・カフェ', selected: false, onPress: handleOnSelectedCategory },
    { id: 'hotel', label: 'ホテル・旅館', selected: true, onPress: handleOnSelectedCategory },
    { id: 'spot', label: '観光スポット', selected: false, onPress: handleOnSelectedCategory },
    { id: 'selected', label: '選択中', selected: false, onPress: handleOnSelectedCategory },
  ];

  // === Render ====
  const SearchSelectedButton = ({ id, label, onPress }: SearchSelectedButtonProps) => {
    return (
      <View key={id}>
        <TouchableOpacity onPress={() => onPress(id)}>
          <View
            className={`px-4 py-2 rounded-xl ${checkSelectedCategory(id) ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'}`}
          >
            <Text>{label}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex flex-row justify-between items-center w-full px-4 py-2">
      {categoryButtonList.map((button) => SearchSelectedButton(button))}
    </View>
  );
}

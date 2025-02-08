import { MapCategory } from '@/src/entities/MapCategory';
import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SearchSelectedButtonProps = {
  id: MapCategory;
  label: string;
  onPress: (id: MapCategory) => void;
};

type Props = {
  selectedCategory: MapCategory;
  onSelectedCategory: (id: MapCategory) => void;
};
export default function PlaceCardHeader({ selectedCategory, onSelectedCategory }: Props) {
  // === Member ====
  // === Method ====
  const handleOnSelectedCategory = (id: MapCategory) => {
    onSelectedCategory(id);
  };
  const checkSelectedCategory = useCallback(
    (id: string) => selectedCategory === id,
    [selectedCategory]
  );

  const categoryButtonList: SearchSelectedButtonProps[] = [
    { id: 'meal', label: '食事・カフェ', onPress: handleOnSelectedCategory },
    { id: 'hotel', label: 'ホテル・旅館', onPress: handleOnSelectedCategory },
    { id: 'spot', label: '観光スポット', onPress: handleOnSelectedCategory },
    { id: 'selected', label: '選択中', onPress: handleOnSelectedCategory },
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

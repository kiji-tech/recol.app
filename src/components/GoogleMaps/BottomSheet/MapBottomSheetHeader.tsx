import { MapCategory } from '@/src/entities/MapCategory';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
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
    { id: 'text', label: '検索結果', onPress: () => {} },
    { id: 'meal', label: '食事・カフェ', onPress: handleOnSelectedCategory },
    { id: 'hotel', label: 'ホテル・旅館', onPress: handleOnSelectedCategory },
    { id: 'spot', label: '観光スポット', onPress: handleOnSelectedCategory },
    { id: 'selected', label: '選択中', onPress: handleOnSelectedCategory },
  ];

  // === Render ====
  const SearchSelectedButton = ({ id, label, onPress }: SearchSelectedButtonProps) => {
    if (id === 'text' && selectedCategory != 'text') return;
    return (
      <TouchableOpacity key={id} onPress={() => onPress(id)}>
        <View
          className={`px-4 py-2 mr-2 rounded-xl ${checkSelectedCategory(id) ? 'bg-light-info dark:bg-dark-info' : 'bg-light-background dark:bg-dark-background'}`}
        >
          <Text className={`text-light-text dark:text-dark-text`}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="py-4 px-2">
      <BottomSheetScrollView
        className="w-screen"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {categoryButtonList.map((button) => SearchSelectedButton(button))}
      </BottomSheetScrollView>
    </View>
  );
}

import { MapCategory } from '@/src/features/map/types/MapCategory';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import BottomSheetHeaderButton from './BottomSheetHeaderButton';

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
    { id: 'selected', label: '選択中', onPress: handleOnSelectedCategory },
    { id: 'cafe', label: 'カフェ', onPress: handleOnSelectedCategory },
    { id: 'meal', label: '食事', onPress: handleOnSelectedCategory },
    { id: 'hotel', label: 'ホテル・旅館', onPress: handleOnSelectedCategory },
    { id: 'spot', label: '観光スポット', onPress: handleOnSelectedCategory },
  ];

  // === Render ====

  return (
    <View className="py-4 px-2">
      <BottomSheetScrollView
        className="w-screen"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {categoryButtonList.map((button) => {
          if (button.id === 'text' && selectedCategory != 'text') return;

          return (
            <BottomSheetHeaderButton
              key={button.id}
              id={button.id}
              label={button.label}
              selected={checkSelectedCategory(button.id)}
              onPress={(id: string) => button.onPress(id as MapCategory)}
            />
          );
        })}
      </BottomSheetScrollView>
    </View>
  );
}

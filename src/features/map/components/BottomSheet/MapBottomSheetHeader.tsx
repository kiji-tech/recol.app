import React, { useCallback } from 'react';
import { MapCategory, useMap, BottomSheetHeaderButton } from '@/src/features/map';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import generateI18nMessage from '@/src/libs/i18n';

type CategoryButton = {
  id: MapCategory;
  label: string;
  onPress: (id: MapCategory) => void;
};

type MapBottomSheetHeaderProps = {
  onPress: (id: MapCategory) => void;
};
export default function MapBottomSheetHeader({ onPress }: MapBottomSheetHeaderProps) {
  // === Member ====
  const { selectedCategory, isSearchLoading } = useMap();
  // === Method ====
  const checkSelectedCategory = useCallback(
    (id: string) => selectedCategory === id,
    [selectedCategory]
  );

  const categoryButtonList: CategoryButton[] = [
    {
      id: 'selected',
      label: generateI18nMessage('FEATURE.MAP.CATEGORY.SELECTED'),
      onPress,
    },
    { id: 'cafe', label: generateI18nMessage('FEATURE.MAP.CATEGORY.CAFE'), onPress },
    { id: 'meal', label: generateI18nMessage('FEATURE.MAP.CATEGORY.MEAL'), onPress },
    {
      id: 'hotel',
      label: generateI18nMessage('FEATURE.MAP.CATEGORY.HOTEL'),
      onPress,
    },
    { id: 'spot', label: generateI18nMessage('FEATURE.MAP.CATEGORY.SPOT'), onPress },
  ];
  if (selectedCategory == 'text') {
    categoryButtonList.unshift({
      id: 'text',
      label: generateI18nMessage('FEATURE.MAP.CATEGORY.SEARCH_RESULT'),
      onPress: () => {},
    });
  }
  // === Render ====

  return (
    <View className="py-4 px-2">
      <BottomSheetFlatList
        className="w-screen"
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 4, marginHorizontal: 4 }}
        data={categoryButtonList}
        renderItem={({ item }) => (
          <BottomSheetHeaderButton
            key={item.id}
            id={item.id}
            label={item.label}
            disabled={isSearchLoading}
            selected={checkSelectedCategory(item.id)}
            onPress={(id: string) => item.onPress(id as MapCategory)}
          />
        )}
      />
    </View>
  );
}

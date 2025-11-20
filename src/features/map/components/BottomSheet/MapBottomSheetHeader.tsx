import { MapCategory } from '@/src/features/map/types/MapCategory';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import BottomSheetHeaderButton from './BottomSheetHeaderButton';
import i18n from '@/src/libs/i18n';
import { useMap } from '../../hooks/useMap';

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
      label: i18n.t('SCREEN.MAP.CATEGORY.SELECTED'),
      onPress,
    },
    { id: 'cafe', label: i18n.t('SCREEN.MAP.CATEGORY.CAFE'), onPress },
    { id: 'meal', label: i18n.t('SCREEN.MAP.CATEGORY.MEAL'), onPress },
    {
      id: 'hotel',
      label: i18n.t('SCREEN.MAP.CATEGORY.HOTEL'),
      onPress,
    },
    { id: 'spot', label: i18n.t('SCREEN.MAP.CATEGORY.SPOT'), onPress },
  ];
  if (selectedCategory == 'text') {
    categoryButtonList.unshift({
      id: 'text',
      label: i18n.t('SCREEN.MAP.CATEGORY.SEARCH_RESULT'),
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

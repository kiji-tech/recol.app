import { Place } from '@/src/entities/Place';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PlaceCard from './PlaceCard';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type Props = {
  placeList: Place[];
  selectedPlaceList: Place[];
  onAddPlace: (place: Place) => void;
  onRemovePlace: (place: Place) => void;
};
export default function PlaceCardBody({
  placeList,
  selectedPlaceList,
  onAddPlace,
  onRemovePlace,
}: Props) {
  // ==== Member ====
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // ==== Method ====

  // ==== Render ====
  return (
    <BottomSheetScrollView className="w-full flex-1">
      {/* 詳細モードの場合は切り替え */}
      {placeList &&
        placeList.map((place: Place) => (
          <PlaceCard
            key={place.id}
            place={place}
            selected={false}
            // onDetailView={() => { }}
            onAddPlace={onAddPlace}
            onRemovePlace={onRemovePlace}
          />
        ))}
      {/* 一番下がアクションバーに隠れるので高さ調整 */}
      <View className="h-20"></View>
    </BottomSheetScrollView>
  );
}

import { Place } from '@/src/entities/Place';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PlaceCard from './PlaceCard';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

type Props = {
  placeList: Place[];
  selectedPlaceList: Place[];
  onSelect: (place: Place) => void;
  onAdd: (place: Place) => void;
  onRemove: (place: Place) => void;
};
export default function PlaceCardBody({
  placeList,
  selectedPlaceList,
  onSelect,
  onAdd,
  onRemove,
}: Props) {
  // ==== Member ====
  // ==== Method ====
  // ==== Render ====
  return (
    <BottomSheetScrollView className="w-full flex-1">
      {placeList &&
        placeList.map((place: Place) => (
          <PlaceCard
            key={place.id}
            place={place}
            selected={false}
            // onDetailView={() => { }}
            onSelect={onSelect}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
    </BottomSheetScrollView>
  );
}

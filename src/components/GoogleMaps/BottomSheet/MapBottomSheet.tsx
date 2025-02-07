import React, { useState } from 'react';
import BottomSheetLayout from '../../BottomSheetLayout';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import { Place } from '@/src/entities/Place';

type Props = {
  placeList: Place[];
  selectedPlaceList: Place[];
  isSelected: boolean;
  selectedCategory: string;
  onAddPlace: (place: Place) => void;
  onRemovePlace: (place: Place) => void;
  onSelectedCategory: (id: string) => void;
};
export default function MapBottomSheet({
  placeList,
  selectedPlaceList,
  selectedCategory,
  isSelected = false,
  onAddPlace,
  onRemovePlace,
  onSelectedCategory,
}: Props) {
  // ==== Member ====

  // ==== Method ====

  // ==== Render ====
  return (
    <BottomSheetLayout>
      <MapBottomSheetHeader
        selectedCategory={selectedCategory}
        onSelectedCategory={onSelectedCategory}
      />
      <MapBottomSheetBody
        placeList={isSelected ? selectedPlaceList : placeList}
        selectedPlaceList={selectedPlaceList}
        onAddPlace={onAddPlace}
        onRemovePlace={onRemovePlace}
      />
    </BottomSheetLayout>
  );
}

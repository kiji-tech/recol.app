import React, { useState } from 'react';
import BottomSheetLayout from '../../BottomSheetLayout';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import { Place } from '@/src/entities/Place';

type Props = {
  placeList: Place[];
  selectedPlaceList: Place[];
  isSelected: boolean;
  onAddPlace: (place: Place) => void;
  onRemovePlace: (place: Place) => void;
  onSelectedList: (selected: boolean) => void;
};
export default function MapBottomSheet({
  placeList,
  selectedPlaceList,
  isSelected = false,
  onAddPlace,
  onRemovePlace,
  onSelectedList,
}: Props) {
  // ==== Member ====

  // ==== Method ====

  // ==== Render ====
  return (
    <BottomSheetLayout>
      <MapBottomSheetHeader onSelectedList={onSelectedList} />
      <MapBottomSheetBody
        placeList={isSelected ? selectedPlaceList : placeList}
        selectedPlaceList={selectedPlaceList}
        onAddPlace={onAddPlace}
        onRemovePlace={onRemovePlace}
      />
    </BottomSheetLayout>
  );
}

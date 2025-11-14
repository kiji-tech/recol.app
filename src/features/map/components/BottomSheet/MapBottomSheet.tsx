import React from 'react';
import { Place } from '@/src/features/map/types/Place';
import { MapCategory } from '@/src/features/map/types/MapCategory';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';

type Props = {
  placeList: Place[];
  selectedPlace: Place | null;
  selectedPlaceList: Place[];
  isSelected: boolean;
  isLoading: boolean;
  selectedCategory: MapCategory;
  onSelectedPlace: (place: Place) => void;
  onSelectedCategory: (id: MapCategory) => void;
  bottomSheetRef?: React.RefObject<BottomSheet>;
  scrollRef?: React.RefObject<BottomSheetScrollViewMethods>;
};
const MapBottomSheet = ({
  placeList,
  selectedPlace,
  selectedPlaceList,
  selectedCategory,
  isSelected = false,
  isLoading = false,
  onSelectedPlace,
  onSelectedCategory,
  bottomSheetRef,
  scrollRef,
}: Props) => {
  return (
    <BottomSheetLayout ref={bottomSheetRef}>
      <MapBottomSheetHeader
        selectedCategory={selectedCategory}
        onSelectedCategory={onSelectedCategory}
      />
      <MapBottomSheetBody
        placeList={isSelected ? selectedPlaceList : placeList}
        selectedPlace={selectedPlace}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
        onSelect={onSelectedPlace}
        ref={scrollRef}
      />
    </BottomSheetLayout>
  );
};
MapBottomSheet.displayName = 'MapBottomSheet';
export default MapBottomSheet;

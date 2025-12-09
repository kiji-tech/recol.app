import React from 'react';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { BottomSheetLayout } from '@/src/components';
import { MapBottomSheetHeader, MapBottomSheetBody, Place, MapCategory } from '@/src/features/map';

type Props = {
  bottomSheetRef?: React.RefObject<BottomSheet>;
  scrollRef?: React.RefObject<BottomSheetScrollViewMethods>;
  onSelectedPlace: (place: Place) => void;
  onSelectedCategory: (category: MapCategory) => void;
};
const MapBottomSheet = ({
  bottomSheetRef,
  scrollRef,
  onSelectedPlace,
  onSelectedCategory,
}: Props) => {
  return (
    <BottomSheetLayout ref={bottomSheetRef}>
      <MapBottomSheetHeader onPress={onSelectedCategory} />
      <MapBottomSheetBody ref={scrollRef} onSelectedPlace={onSelectedPlace} />
    </BottomSheetLayout>
  );
};
MapBottomSheet.displayName = 'MapBottomSheet';
export default MapBottomSheet;

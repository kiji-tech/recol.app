import React from 'react';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { BottomSheetLayout } from '@/src/components';
import { Place } from '../../types/Place';
import { MapCategory } from '../../types/MapCategory';

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

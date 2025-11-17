import React from 'react';
import MapBottomSheetHeader from './MapBottomSheetHeader';
import MapBottomSheetBody from './MapBottomSheetBody';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import { Place } from '../../types/Place';

type Props = {
  bottomSheetRef?: React.RefObject<BottomSheet>;
  scrollRef?: React.RefObject<BottomSheetScrollViewMethods>;
  onSelectedPlace: (place: Place) => void;
};
const MapBottomSheet = ({ bottomSheetRef, scrollRef, onSelectedPlace }: Props) => {
  return (
    <BottomSheetLayout ref={bottomSheetRef}>
      <MapBottomSheetHeader />
      <MapBottomSheetBody ref={scrollRef} onSelectedPlace={onSelectedPlace} />
    </BottomSheetLayout>
  );
};
MapBottomSheet.displayName = 'MapBottomSheet';
export default MapBottomSheet;

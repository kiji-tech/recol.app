import React from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import DirectionBottomSheetHeader from './DirectionBottomSheetHeader';
import DirectionBottomSheetBody from './DirectionBottomSheetBody';
import { DirectionMode } from '../../types/Direction';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedPlace: Place;
  selectedMode: DirectionMode;
  onSelectedMode: (mode: DirectionMode) => void;
  onClose: () => void;
};

export default function DirectionBottomSheet({
  bottomSheetRef,
  selectedPlace,
  selectedMode,
  onSelectedMode,
  onClose,
}: Props) {
  return (
    <>
      <BottomSheetLayout ref={bottomSheetRef}>
        <DirectionBottomSheetHeader
          onSelectedMode={onSelectedMode}
          selectedMode={selectedMode}
          onClose={onClose}
        />
        <DirectionBottomSheetBody selectedPlace={selectedPlace} />
      </BottomSheetLayout>
    </>
  );
}

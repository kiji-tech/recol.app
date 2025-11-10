import React from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import DirectionBottomSheetHeader from './DirectionBottomSheetHeader';
import DirectionBottomSheetBody from './DirectionBottomSheetBody';
import { DirectionMode, Step } from '../../types/Direction';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedPlace: Place;
  selectedMode: DirectionMode;
  stepList: Step[];
  selectedStepIndex?: number | null;
  isLoading?: boolean;
  onSelectedMode: (mode: DirectionMode) => void;
  onStepSelect?: (index: number) => void;
  onClose: () => void;
};

export default function DirectionBottomSheet({
  bottomSheetRef,
  selectedPlace,
  selectedMode,
  stepList,
  selectedStepIndex = null,
  isLoading = false,
  onSelectedMode,
  onStepSelect = () => void 0,
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
        <DirectionBottomSheetBody
          selectedPlace={selectedPlace}
          stepList={stepList}
          selectedStepIndex={selectedStepIndex}
          isLoading={isLoading}
          onStepSelect={onStepSelect}
        />
      </BottomSheetLayout>
    </>
  );
}

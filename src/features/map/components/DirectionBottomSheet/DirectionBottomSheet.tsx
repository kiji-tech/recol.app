import React, { useEffect } from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import DirectionBottomSheetHeader from './DirectionBottomSheetHeader';
import DirectionBottomSheetBody from './DirectionBottomSheetBody';
import { DirectionMode, Step } from '../../types/Direction';
import { BackHandler } from 'react-native';
import { LogUtil } from '@/src/libs/LogUtil';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedPlace: Place;
  selectedMode: DirectionMode;
  stepList: Step[];
  selectedStepIndex?: number | null;
  isLoading?: boolean;
  onSelectedMode: (mode: DirectionMode) => void;
  onShowCurrentLocation?: () => void;
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
  onShowCurrentLocation = () => void 0,
  onStepSelect = () => void 0,
  onClose,
}: Props) {
  // === Effect ===
  /**
   * バックボタンを押した場合は､経路表示ボトムシートを閉じるイベントハンドラを追加
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      LogUtil.log('DirectionBottomSheet hardwareBackPress', { level: 'info' });
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <BottomSheetLayout ref={bottomSheetRef}>
        <DirectionBottomSheetHeader
          onSelectedMode={onSelectedMode}
          selectedMode={selectedMode}
          onShowCurrentLocation={onShowCurrentLocation}
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

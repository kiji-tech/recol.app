import React, { useEffect } from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import PlaceBottomSheetHeader from './PlaceBottomSheetHeader';
import PlaceBottomSheetBody from './PlaceBottomSheetBody';
import { BackHandler } from 'react-native';
import { LogUtil } from '@/src/libs/LogUtil';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  isEdit?: boolean;
  onDirection?: () => void;
  onClose: () => void;
};
export default function PlaceBottomSheet({
  bottomSheetRef,
  isEdit = false,
  onDirection,
  onClose,
}: Props) {
  // === Effect ===
  /**
   * バックボタンを押した場合は､経路表示ボトムシートを閉じるイベントハンドラを追加
   */
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      LogUtil.log('PlaceBottomSheet hardwareBackPress', { level: 'info' });
      onClose();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <BottomSheetLayout ref={bottomSheetRef}>
        <PlaceBottomSheetHeader onClose={onClose} />
        <PlaceBottomSheetBody isEdit={isEdit} onDirection={onDirection} />
      </BottomSheetLayout>
    </>
  );
}

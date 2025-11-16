import React, { useEffect } from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import BottomSheet from '@gorhom/bottom-sheet';
import { Place } from '../../types/Place';
import PlaceBottomSheetHeader from './PlaceBottomSheetHeader';
import PlaceBottomSheetBody from './PlaceBottomSheetBody';
import { BackHandler } from 'react-native';
import { LogUtil } from '@/src/libs/LogUtil';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedPlace: Place;
  isEdit?: boolean;
  selected?: boolean;
  idLoading?: boolean;
  onAdd?: (place: Place) => void;
  onRemove?: (place: Place) => void;
  onDirection?: () => void;
  onClose: () => void;
};
export default function PlaceBottomSheet({
  bottomSheetRef,
  selectedPlace,
  isEdit = false,
  selected = false,
  idLoading = false,
  onAdd,
  onRemove,
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
        <PlaceBottomSheetBody
          place={selectedPlace}
          isEdit={isEdit}
          selected={selected}
          idLoading={idLoading}
          onAdd={onAdd}
          onRemove={onRemove}
          onDirection={onDirection}
        />
      </BottomSheetLayout>
    </>
  );
}

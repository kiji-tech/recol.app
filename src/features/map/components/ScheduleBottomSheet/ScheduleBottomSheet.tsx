import React, { ForwardedRef, forwardRef, useCallback } from 'react';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import { Place } from '@/src/features/map/types/Place';
import BottomSheet, { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import { Schedule } from '@/src/features/schedule';
import SelectedMapBottomSheetBody from './ScheduleBottomSheetBody';
import { useFocusEffect } from '@react-navigation/native';
import { SCROLL_EVENT_TIMEOUT } from '@/src/libs/ConstValue';
import SelectedMapBottomSheetHeader from './ScheduleBottomSheetHeader';

type Props = {
  scrollRef: React.RefObject<BottomSheetScrollViewMethods>;
  scheduleList: Schedule[];
  selectedPlace: Place | null;
  selectedSchedule: Schedule | null;
  selectedSchedulePlaceList: Place[];
  onSelectedSchedule: (schedule: Schedule) => void;
  onSelectedPlace: (place: Place) => void;
};

const ScheduleBottomSheet = forwardRef(
  (
    {
      scrollRef,
      scheduleList,
      selectedPlace,
      selectedSchedule,
      selectedSchedulePlaceList,
      onSelectedSchedule,
      onSelectedPlace,
    }: Props,
    ref: ForwardedRef<BottomSheet>
  ) => {
    // === Member ===
    // ==== Method ===
    /**
     * スケジュールを選択 イベントハンドラ
     * @param schedule {Schedule} スケジュール
     * @returns {void}
     */
    const handleSelectSchedule = (schedule: Schedule) => {
      onSelectedSchedule(schedule);
    };

    /** マップ選択時のスクロール位置計算 */
    const calcScrollHeight = (selectedPlace: Place) => {
      const PLACE_HEIGHT = 113;
      const index =
        selectedSchedule?.place_list?.findIndex((place) => place === selectedPlace.id) || 0;
      return index * PLACE_HEIGHT;
    };

    useFocusEffect(
      useCallback(() => {
        if (!selectedPlace) return;
        // ボトムシートが開いている状態じゃないと､スクロールイベントが発生しない
        (ref as React.RefObject<BottomSheet>).current?.expand({});
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: 0,
            y: calcScrollHeight(selectedPlace),
            animated: true,
          });
        }, SCROLL_EVENT_TIMEOUT);
      }, [selectedPlace])
    );

    return (
      <BottomSheetLayout ref={ref}>
        {/* ヘッダー */}
        <SelectedMapBottomSheetHeader
          scheduleList={scheduleList}
          selectedSchedule={selectedSchedule}
          onSelectedSchedule={handleSelectSchedule}
        />
        {/* コンテンツ */}
        <SelectedMapBottomSheetBody 
          ref={scrollRef}
          selectedPlace={selectedPlace}
          selectedSchedule={selectedSchedule}
          selectedSchedulePlaceList={selectedSchedulePlaceList}
          onSelectedPlace={onSelectedPlace}
        />
      </BottomSheetLayout>
    );
  }
);

ScheduleBottomSheet.displayName = 'ScheduleBottomSheet';

export default ScheduleBottomSheet;

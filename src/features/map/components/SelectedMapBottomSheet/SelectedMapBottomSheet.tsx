import React, { ForwardedRef, forwardRef, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import BottomSheetLayout from '@/src/components/BottomSheetLayout';
import { Place } from '@/src/features/map/types/Place';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import { usePlan } from '@/src/contexts/PlanContext';
import { Schedule } from '@/src/features/schedule';
import BottomSheetHeaderButton from '../BottomSheet/BottomSheetHeaderButton';
import dayjs from 'dayjs';
import SelectedMapBottomSheetBody from './SelectedMapBottomSheetBody';
import { useFocusEffect } from '@react-navigation/native';
import { SCROLL_EVENT_TIMEOUT } from '@/src/libs/ConstValue';

type Props = {
  scrollRef: React.RefObject<BottomSheetScrollViewMethods>;
  selectedPlace: Place | null;
  onSelectedPlace: (place: Place) => void;
};

const SelectedMapBottomSheet = forwardRef(
  ({ scrollRef, selectedPlace, onSelectedPlace }: Props, ref: ForwardedRef<BottomSheet>) => {
    // === Member ===
    const { plan } = usePlan();
    const viewScheduleList: Schedule[] = useMemo(() => {
      return (
        plan?.schedule
          .filter((schedule) => schedule.place_list?.length > 0)
          .sort((a, b) => dayjs(a.from).diff(dayjs(b.from))) || []
      );
    }, [plan]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
      viewScheduleList[0] || null
    );

    // ==== Method ===
    /**
     * スケジュールを選択 イベントハンドラ
     * @param schedule {Schedule} スケジュール
     * @returns {void}
     */
    const handleSelectSchedule = (schedule: Schedule) => {
      setSelectedSchedule(schedule);
    };

    /**
     * スケジュールヘッダーコンポーネント
     * @param schedule {Schedule} スケジュール
     * @returns {React.ReactNode} スケジュールヘッダーコンポーネント
     */
    const renderHeaderItem = (schedule: Schedule) => {
      if (schedule.place_list.length == 0) return <></>;
      return (
        <BottomSheetHeaderButton
          id={schedule.uid}
          label={`${dayjs(schedule.from).format('HH:mm')} ~ ${dayjs(schedule.to).format('HH:mm')}  ${schedule.title || 'No Title'}`}
          selected={selectedSchedule?.uid === schedule.uid}
          onPress={() => handleSelectSchedule(schedule)}
        />
      );
    };

    /** マップ選択時のスクロール位置計算 */
    const calcScrollHeight = (selectedPlace: Place) => {
      const PLACE_HEIGHT = 113;
      const index =
        selectedSchedule?.place_list?.findIndex((place: Place) => place.id === selectedPlace.id) ||
        0;
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
        <View className="px-2 py-4">
          <BottomSheetFlatList
            className="w-screen"
            data={viewScheduleList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollToOverflowEnabled={false}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => renderHeaderItem(item)}
          />
        </View>
        {/* コンテンツ */}
        <SelectedMapBottomSheetBody
          ref={scrollRef}
          selectedPlace={selectedPlace}
          selectedSchedule={selectedSchedule}
          onSelectedPlace={onSelectedPlace}
        />
      </BottomSheetLayout>
    );
  }
);

SelectedMapBottomSheet.displayName = 'SelectedMapBottomSheet';

export default SelectedMapBottomSheet;

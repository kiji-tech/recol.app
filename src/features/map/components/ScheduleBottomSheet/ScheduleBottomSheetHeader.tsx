import React from 'react';
import { View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Schedule } from '@/src/features/schedule';
import BottomSheetHeaderButton from '../BottomSheet/BottomSheetHeaderButton';
import dayjs from 'dayjs';

type Props = {
  scheduleList: Schedule[];
  selectedSchedule: Schedule | null;
  onSelectedSchedule: (schedule: Schedule) => void;
};

export default function ScheduleBottomSheetHeader({
  scheduleList,
  selectedSchedule,
  onSelectedSchedule,
}: Props) {
  // === Member ===
  // === Method ===
  /**
   * スケジュールを選択 イベントハンドラ
   * @param schedule {Schedule} スケジュール
   * @returns {void}
   */
  const handleSelectSchedule = (schedule: Schedule) => {
    onSelectedSchedule(schedule);
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

  return (
    <View className="px-2 py-4">
      <BottomSheetFlatList
        className="w-screen"
        data={scheduleList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 4, marginHorizontal: 4 }}
        renderItem={({ item }) => renderHeaderItem(item)}
      />
    </View>
  );
}

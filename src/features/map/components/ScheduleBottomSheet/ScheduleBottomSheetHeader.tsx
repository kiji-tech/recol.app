import React from 'react';
import { View } from 'react-native';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
import i18n from '@/src/libs/i18n';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '@/src/contexts/ThemeContext';
import { isIOS } from 'toastify-react-native/utils/helpers';

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
  const { isDarkMode } = useTheme();

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
  return (
    <View
      className={`m-2 px-4 border border-light-border dark:border-dark-border rounded-lg ${isIOS && 'py-2'}`}
    >
      {/* セレクタ */}
      <RNPickerSelect
        items={scheduleList.map((s) => ({
          key: s.uid,
          label: `${dayjs(s.from).format('M/D HH:mm')} ~ ${s.title || 'No Title'}`,
          value: s.uid,
        }))}
        placeholder={{
          key: 'placeholder',
          label: i18n.t('SCREEN.MAP.SELECT_SCHEDULE'),
          value: 'placeholder',
          color: isDarkMode ? '#5A5A5A' : '#D7D7D7',
        }}
        style={{
          inputIOS: {
            fontSize: 12,
            color: isDarkMode ? '#ECECEC' : '#2A2A2A',
          },
          inputAndroid: {
            fontSize: 12,
            color: isDarkMode ? '#ECECEC' : '#2A2A2A',
          },
        }}
        value={selectedSchedule?.uid}
        onValueChange={(value: string) => {
          handleSelectSchedule(
            scheduleList.find((schedule) => schedule.uid === value) || scheduleList[0]
          );
        }}
      />
    </View>
  );
}

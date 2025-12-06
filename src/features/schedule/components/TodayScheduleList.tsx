import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { Plan } from '@/src/features/plan';
import { Schedule } from '../types/Schedule';
import { useTheme, usePlan } from '@/src/contexts';
import dayjs from 'dayjs';
import generateI18nMessage from '@/src/libs/i18n';
import CategoryIcon from './CategoryIcon';

/**
 * 本日の予定を表示するコンポーネント
 * @param schedule {Schedule} - 予定
 * @param onPress {Function} - 予定を押した時の処理
 * @returns {React.ReactNode}
 */
const TodayScheduleItem = ({
  schedule,
  onPress,
}: {
  schedule: Schedule;
  onPress: (schedule: Schedule) => void;
}) => {
  const { isDarkMode } = useTheme();
  const isDone = useMemo(
    () => schedule.to && dayjs(schedule.to).isBefore(dayjs(), 'hour'),
    [schedule.to]
  );

  return (
    <TouchableOpacity
      onPress={() => onPress(schedule)}
      className={`flex flex-col justify-start items-start w-48 h-32 rounded-md p-4 gap-2 bg-light-background dark:bg-dark-background`}
    >
      {/* 日時 */}
      <View className="flex flex-row justify-start items-center gap-2">
        <CategoryIcon schedule={schedule} isDarkMode={isDarkMode} />
        <Text className={`text-light-text dark:text-dark-text text-sm ${isDone && 'line-through'}`}>
          {dayjs(schedule.from).format('H:mm')}~ {dayjs(schedule.to).format('H:mm')}
        </Text>
      </View>
      {/* 予定タイトル */}
      <Text
        className={`text-light-text dark:text-dark-text text-md font-bold whitespace-pre-wrap ${isDone && 'line-through'}`}
      >
        {schedule.title}
      </Text>
      <Text
        className={`text-light-text dark:text-dark-text text-xs opacity-70 ${isDone && 'line-through'}`}
        numberOfLines={2}
      >
        {schedule.description}
      </Text>
    </TouchableOpacity>
  );
};

type Props = {
  planList: Plan[];
};
export default function TodayScheduleList({ planList }: Props) {
  // 直近7日にある予定を取得して表示する
  // === Member ===
  const { setEditSchedule, setPlanId } = usePlan();
  // === Method ===
  const handlePress = (schedule: Schedule) => {
    setPlanId(schedule.plan_id!);
    setEditSchedule(schedule);
    router.push(`/(plan)/ScheduleScreen`);
  };

  // === Memo ===
  const scheduleList = useMemo(() => {
    return planList
      .map((plan: Plan) => plan.schedule)
      .flat()
      .sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)))
      .filter((s: Schedule) => dayjs(s.from).isSame(dayjs(), 'day'));
  }, [planList]);

  if (scheduleList.length === 0) {
    return (
      <Text className="text-light-text dark:text-dark-text text-sm">
        {generateI18nMessage('FEATURE.PLAN.NO_SCHEDULE_TODAY')}
      </Text>
    );
  }

  return (
    <FlatList
      data={scheduleList}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }: { item: Schedule }) => (
        <TodayScheduleItem schedule={item} onPress={handlePress} />
      )}
      keyExtractor={(item: Schedule) => item.uid!}
    />
  );
}

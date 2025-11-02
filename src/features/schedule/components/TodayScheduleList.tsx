import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { usePlan } from '@/src/contexts/PlanContext';
import { Plan } from '@/src/features/plan';
import { Schedule } from '../types/Schedule';
import { Loading } from '@/src/components';
import dayjs from 'dayjs';
import CategoryIcon from './CategoryIcon';
import { useTheme } from '@/src/contexts/ThemeContext';

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
      className={`flex flex-col justify-start items-start border-[1px] w-48 h-32 border-light-border dark:border-dark-border rounded-md p-4 gap-2 bg-light-background dark:bg-dark-background`}
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

export default function TodayScheduleList() {
  // 直近7日にある予定を取得して表示する
  // === Member ===
  const { planList, setPlan, planLoading } = usePlan();

  // === Method ===
  const handlePress = (schedule: Schedule) => {
    const selectedPlan = planList.find((p: Plan) => p.uid === schedule.plan_id!);
    setPlan(selectedPlan!);
    router.push('/(plan)/ScheduleScreen');
  };

  // === Memo ===
  const scheduleList = useMemo(() => {
    return planList
      .map((plan: Plan) => plan.schedule)
      .flat()
      .sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)))
      .filter((s: Schedule) => dayjs(s.from).isSame(dayjs(), 'day'));
  }, [planList]);

  if (planLoading) {
    return (
      <View className="w-full flex justify-center items-center">
        <Loading />
      </View>
    );
  }

  if (scheduleList.length === 0) {
    return (
      <Text className="text-light-text dark:text-dark-text text-sm">本日の予定はありません</Text>
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
      keyExtractor={(item: Schedule) => item.uid}
    />
  );
}

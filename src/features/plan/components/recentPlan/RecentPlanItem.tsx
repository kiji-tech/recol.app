import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plan } from '../../index';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';
import { RecentPlanDays } from '../../hooks/useRecentPlanDays';

/**
 * 直近プランのカードコンポーネント
 * @param plan {Plan} - プラン
 * @param onPress {Function} - プランを押した時の処理
 * @returns {React.ReactNode}
 */
export default function RecentPlanItem({
  plan,
  days,
  onPress,
}: {
  plan: Plan;
  days: RecentPlanDays;
  onPress: (plan: Plan) => void;
}) {
  const isFilteredPlan = (plan: Plan): boolean => {
    const now = dayjs();
    const cutoffDate = dayjs().add(days, 'day');

    if (!plan.schedule || plan.schedule.length === 0) {
      return false;
    }
    // プランに含まれるスケジュールのfromの最小値を取得
    const minScheduleDate = plan.schedule.reduce(
      (min: dayjs.Dayjs | null, schedule: Schedule) => {
        const scheduleDate = dayjs(schedule.from);
        return min === null || scheduleDate.isBefore(min) ? scheduleDate : min;
      },
      null as dayjs.Dayjs | null
    );

    if (!minScheduleDate) {
      return false;
    }

    // 当日以降で、かつn日以内かどうかを判定
    return !minScheduleDate.isBefore(now, 'day') && minScheduleDate.isBefore(cutoffDate);
  };

  /**
   * プランの日付範囲を取得
   */
  const planDates = useMemo(() => {
    if (!plan.schedule || plan.schedule.length === 0) {
      return null;
    }
    const sortedSchedules = plan.schedule.sort((a: Schedule, b: Schedule) =>
      dayjs(a.from).diff(dayjs(b.from))
    );
    const startDate = dayjs(sortedSchedules[0].from).format('MM/DD');
    const endDate = dayjs(sortedSchedules[sortedSchedules.length - 1].from).format('MM/DD');
    return sortedSchedules.length > 1 ? `${startDate} ~ ${endDate}` : startDate;
  }, [plan]);

  if (!isFilteredPlan(plan)) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => onPress(plan)}
      className={`flex flex-col justify-start items-start w-60 h-40 rounded-md p-4 gap-2 bg-light-background dark:bg-dark-background mr-4`}
    >
      {/* タイトル */}
      <Text className={`text-light-text dark:text-dark-text text-lg font-bold`} numberOfLines={2}>
        {plan.title || 'タイトルなし'}
      </Text>
      {/* メモ */}
      {plan.memo ? (
        <Text className="text-light-text dark:text-dark-text text-sm opacity-80" numberOfLines={2}>
          {plan.memo}
        </Text>
      ) : (
        <Text className="text-light-text dark:text-dark-text text-sm opacity-50">
          メモがありません
        </Text>
      )}
      {/* 日付 */}
      {planDates && (
        <View className="flex flex-row justify-start items-center mt-auto">
          <Text className="text-light-text dark:text-dark-text text-xs opacity-70">
            {planDates}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

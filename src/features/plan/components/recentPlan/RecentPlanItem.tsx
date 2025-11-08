import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Plan } from '../../index';
import { Schedule } from '@/src/features/schedule';
import dayjs from 'dayjs';

/**
 * 直近プランのカードコンポーネント
 * @param plan {Plan} - プラン
 * @param onPress {Function} - プランを押した時の処理
 * @returns {React.ReactNode}
 */
export default function RecentPlanItem({
  plan,
  onPress,
}: {
  plan: Plan;
  onPress: (plan: Plan) => void;
}) {
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

  return (
    <TouchableOpacity
      onPress={() => onPress(plan)}
      className={`flex flex-col justify-start items-start border-[1px] w-64 h-40 border-light-border dark:border-dark-border rounded-md p-4 gap-2 bg-light-background dark:bg-dark-background`}
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

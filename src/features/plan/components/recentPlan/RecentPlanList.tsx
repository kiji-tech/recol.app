import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { usePlanList } from '../../hooks/usePlanList';
import { useRecentPlanDays, RecentPlanDays } from '../../hooks/useRecentPlanDays';
import { usePlan } from '@/src/contexts/PlanContext';
import { Plan } from '../../index';
import { Schedule } from '@/src/features/schedule';
import { Loading } from '@/src/components';
import dayjs from 'dayjs';
import RecentPlanItem from './RecentPlanItem';
import i18n from '@/src/libs/i18n';

/**
 * 直近n日のプランリストコンポーネント
 * @returns {React.ReactNode}
 */
export default function RecentPlanList() {
  // === Member ===
  const { planList, planLoading } = usePlanList();
  const { days, setDays, isLoading: isDaysLoading, availableDays } = useRecentPlanDays();
  const { setPlan } = usePlan();

  // === Method ===
  /**
   * プラン選択処理
   * @param {Plan} plan - 選択されたプラン
   */
  const handlePress = (plan: Plan): void => {
    // スケジュールを取得して設定
    setPlan(plan);
    router.push({
      pathname: '/(plan)/ScheduleScreen',
      params: {
        uid: plan.uid,
      },
    });
  };

  /**
   * 日数選択処理
   * @param {RecentPlanDays} selectedDays - 選択された日数
   */
  const handleDaysSelect = async (selectedDays: RecentPlanDays): Promise<void> => {
    await setDays(selectedDays);
  };

  // === Memo ===
  /**
   * 未来n日以内のプランをフィルタリング
   */
  const recentPlanList = useMemo(() => {
    if (isDaysLoading) {
      return [];
    }

    const now = dayjs();
    const cutoffDate = dayjs().add(days, 'day');
    return planList.filter((plan: Plan) => {
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
    });
  }, [planList, days, isDaysLoading]);

  // === Render ===
  if (planLoading || isDaysLoading) {
    return (
      <View className="w-full flex justify-center items-center">
        <Loading />
      </View>
    );
  }

  return (
    <View className="w-full flex flex-col gap-4">
      {/* 日数選択UI */}
      <View className="flex flex-row gap-2">
        {availableDays.map((availableDay) => (
          <TouchableOpacity
            key={availableDay}
            onPress={() => handleDaysSelect(availableDay)}
            className={`px-4 py-2 rounded-md border-[1px] ${
              days === availableDay
                ? 'bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary'
                : 'bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                days === availableDay ? 'text-white' : 'text-light-text dark:text-dark-text'
              }`}
            >
              {availableDay}
              {i18n.t('COMMON.DAYS')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* プランリスト */}
      {recentPlanList.length === 0 ? (
        <Text className="text-light-text dark:text-dark-text text-sm">
          {i18n.t('COMPONENT.PLAN.NO_PLAN_RECENT').replace('#days#', days.toString())}
        </Text>
      ) : (
        <FlatList
          data={recentPlanList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }: { item: Plan }) => (
            <RecentPlanItem plan={item} onPress={handlePress} />
          )}
          keyExtractor={(item: Plan) => item.uid}
        />
      )}
    </View>
  );
}

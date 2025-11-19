import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useRecentPlanDays, RecentPlanDays } from '../../hooks/useRecentPlanDays';
import { usePlan } from '@/src/contexts/PlanContext';
import { Plan } from '../../index';
import RecentPlanItem from './RecentPlanItem';
import i18n from '@/src/libs/i18n';
import dayjs from 'dayjs';
type Props = {
  planList?: Plan[];
};

/**
 * 直近n日のプランリストコンポーネント
 * @returns {React.ReactNode}
 */
export default function RecentPlanList({ planList }: Props) {
  // === Member ===
  const { days, setDays, availableDays } = useRecentPlanDays();
  const { setPlanId } = usePlan();
  // === Method ===
  /**
   * プラン選択処理
   * @param {Plan} plan - 選択されたプラン
   */
  const handlePress = (plan: Plan): void => {
    // スケジュールを取得して設定
    setPlanId(plan.uid);
    router.push({
      pathname: '/(plan)/ScheduleScreen',
    });
  };

  /**
   * 日数選択処理
   * @param {RecentPlanDays} selectedDays - 選択された日数
   */
  const handleDaysSelect = async (selectedDays: RecentPlanDays): Promise<void> => {
    await setDays(selectedDays);
  };

  return (
    <View className="w-full flex flex-col gap-4 justify-start items-start">
      {/* 日数選択UI */}
      <View className="flex flex-row gap-2">
        {availableDays.map((availableDay) => (
          <TouchableOpacity
            key={availableDay}
            onPress={() => handleDaysSelect(availableDay)}
            className={`px-4 py-2 rounded-md ${
              days === availableDay
                ? 'bg-light-primary dark:bg-dark-primary'
                : 'bg-light-background dark:bg-dark-background'
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
      {!planList || planList.length === 0 ? (
        <Text className="text-light-text dark:text-dark-text text-sm">
          {i18n.t('COMPONENT.PLAN.NO_PLAN_RECENT').replace('#days#', days.toString())}
        </Text>
      ) : (
        <FlatList
          data={planList.sort((a: Plan, b: Plan) =>
            dayjs(a.schedule[0]?.from).diff(dayjs(b.schedule[0]?.from))
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: Plan }) => (
            <RecentPlanItem
              plan={item}
              days={days as RecentPlanDays}
              onPress={(plan: Plan) => handlePress(plan)}
            />
          )}
          keyExtractor={(item: Plan) => item.uid}
        />
      )}
    </View>
  );
}

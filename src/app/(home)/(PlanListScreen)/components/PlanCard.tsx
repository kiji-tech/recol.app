import React from 'react';
import { Schedule } from '@/src/entities/Plan';
import { Plan } from '@/src/entities/Plan';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { usePlan } from '@/src/contexts/PlanContext';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { deletePlan } from '@/src/libs/ApiService';

export default function PlanCard({ plan }: { plan: Plan }) {
  // === Member ===
  const router = useRouter();
  const { session } = useAuth();
  const { setPlan, fetchPlan } = usePlan();

  const planDates = useMemo(() => {
    return plan.schedule
      .sort((a: Schedule, b: Schedule) => dayjs(a.from).diff(dayjs(b.from)))
      .map((schedule: Schedule) => dayjs(schedule.from).format('YYYY/M/D'));
  }, [plan]);

  // === Method ===
  /** プラン選択処理 */
  const handleSelectPlan = (plan: Plan) => {
    // スケジュールを取得して設定
    setPlan(plan);
    router.push({
      pathname: '/(plan)/ScheduleScreen',
      params: {
        uid: plan.uid,
      },
    });
  };

  /** プランの削除 */
  const handleDeletePlan = (plan: Plan) => {
    Alert.alert(
      '削除しますか？',
      '年間プラン消費量は戻りません。\nそれでも削除してもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          onPress: async () => {
            deletePlan(plan.uid, session)
              .then(() => {
                fetchPlan();
              })
              .catch((e) => {
                if (e && e.message) {
                  Alert.alert(e.message);
                }
              });
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      key={plan.uid}
      className={`py-4 w-full h-16 border-light-border dark:border-dark-border`}
      onPress={() => handleSelectPlan(plan)}
      onLongPress={() => handleDeletePlan(plan)}
    >
      <View className="flex flex-row gap-2 justify-between items-start">
        <View className="flex flex-row gap-4 justify-start items-start">
          {/*  TODO: メンバー */}
          <View className="w-10 h-10 bg-light-info rounded-full"></View>
          <View className="flex flex-col gap-2 justify-start items-start">
            {/* タイトル */}
            <Text className={`font-bold text-md text-light-text dark:text-dark-text`}>
              {plan.title}
            </Text>
            {/* メモ */}
            <Text className="text-light-text dark:text-dark-text text-sm line-clamp-2">
              {plan.memo || 'メモがありません'}
            </Text>
          </View>
        </View>
        {/* 日付 */}
        <View className="flex flex-col items-end">
          <Text
            className={`text-sm text-light-text dark:text-dark-text ${planDates.length > 1 && 'mr-4'}`}
          >
            {planDates[0]}
          </Text>
          <Text className={`text-sm text-light-text dark:text-dark-text`}>
            {planDates.length > 1 && ' ~ ' + planDates[planDates.length - 1]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

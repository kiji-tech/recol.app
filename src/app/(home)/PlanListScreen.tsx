import React, { useMemo } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackgroundView, Button, Header } from '@/src/components';
import IconButton from '@/src/components/Common/IconButton';
import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { usePlan } from '@/src/contexts/PlanContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { deletePlan } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';

function PlanCard({ plan }: { plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] } }) {
  // === Member ===
  const router = useRouter();
  const { session } = useAuth();
  const { setPlan, fetchPlan } = usePlan();

  const planDates = useMemo(() => {
    return plan.schedule
      .sort((a, b) => dayjs(a.from).diff(dayjs(b.from)))
      .map((schedule) => dayjs(schedule.from).format('M/D'));
  }, [plan]);

  // === Method ===
  /** プラン選択処理 */
  const handleSelectPlan = (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => {
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
  const handleDeletePlan = (plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => {
    Alert.alert('削除しますか？', '削除すると元に戻すことはできません。', [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除',
        onPress: async () => {
          await deletePlan(plan.uid, session);
          await fetchPlan();
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      key={plan.uid}
      className={`
                py-4 w-full
                border-light-border dark:border-dark-border`}
      onPress={() => handleSelectPlan(plan)}
      onLongPress={() => handleDeletePlan(plan)}
    >
      <View className="flex flex-row gap-2 justify-between items-start">
        <View className="flex flex-row gap-4 justify-start items-center">
          {/*  アイコン（TODO） */}
          <View className="w-10 h-10 bg-light-info rounded-full"></View>
          <View className="flex flex-col gap-2 justify-start items-start">
            <Text className={`font-bold text-md text-light-text dark:text-dark-text`}>
              {plan.title}
            </Text>
            <Text className="text-light-text dark:text-dark-text text-xs"></Text>
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className={`text-sm text-light-text dark:text-dark-text`}>
            {planDates.length > 1
              ? `${planDates[0]} - ${planDates[planDates.length - 1]}`
              : planDates[0]}
          </Text>
        </View>
        {/* TODO: メンバー */}
        {/* <View className="flex flex-row justify-start items-center gap-2">
                  <View className={`h-8 w-8 bg-light-info rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-warn rounded-full `}></View>
                  <View className={`h-8 w-8 bg-light-danger rounded-full `}></View>
                  </View> */}
      </View>
    </TouchableOpacity>
  );
}

export default function PlanListScreen() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { planList, fetchPlan } = usePlan();

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      const ctrl = new AbortController();
      init(ctrl);
      return () => {
        ctrl.abort();
      };
    }, [])
  );

  // === Method ===
  const init = async (ctrl?: AbortController) => {
    await fetchPlan(ctrl);
  };

  // === Render ===
  const addButton = () => {
    return (
      <IconButton
        icon={<MaterialIcons name="add" size={18} color={isDarkMode ? 'white' : 'black'} />}
        theme="info"
        onPress={() => {
          router.push('/(addPlan)/AddPlan');
        }}
      />
    );
  };

  return (
    <BackgroundView>
      <Header title="計画一覧" rightComponent={addButton()} />
      {/* プランがない場合 */}
      {planList.length === 0 && (
        <View className="flex flex-col justify-center items-center h-full">
          <Text className="text-light-text dark:text-dark-text text-lg font-bold">
            プランがありません
          </Text>
          <Button
            text={'プランを追加する'}
            theme={'info'}
            onPress={() => router.push('/(addPlan)/AddPlan')}
          />
        </View>
      )}
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start gap-4">
        {planList &&
          planList.map((plan: Tables<'plan'> & { schedule: Tables<'schedule'>[] }) => (
            <PlanCard key={plan.uid} plan={plan} />
          ))}
      </View>
    </BackgroundView>
  );
}

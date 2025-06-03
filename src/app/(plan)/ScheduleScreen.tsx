import React, { ReactNode, useCallback, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Schedule from '@/src/components/Schedule';
import { BackgroundView, Header, IconButton } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import { useRouter } from 'expo-router';
import { deleteSchedule, fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Alert } from 'react-native';
import dayjs from 'dayjs';
import { useTheme } from '@/src/contexts/ThemeContext';
import PlanInformation from '@/src/components/PlanInformation';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { plan, setEditSchedule } = usePlan();
  const { session } = useAuth();
  const [viewPlan, setViewPlan] = useState<
    (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null
  >(null);

  // === Method ===
  const initView = () => {
    if (!plan?.uid || !session) {
      Alert.alert('エラー', 'プランの情報が取得できませんでした。');
      router.back();
      return;
    }

    setViewPlan(null);
    const ctrl = new AbortController();

    fetchPlan(plan.uid, session, ctrl)
      .then((data) => {
        if (!data) {
          throw new Error('プランデータの取得に失敗しました');
        }
        setViewPlan({ ...data } as Tables<'plan'> & { schedule: Tables<'schedule'>[] });
      })
      .catch((e) => {
        if (e)
          Alert.alert(
            'エラー',
            'プランの読み込み中にエラーが発生しました。もう一度お試しください。'
          );
      });

    return () => {
      ctrl.abort();
    };
  };

  /** 予定の追加 */
  const handleAddPress = () => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs().add(1, 'hour').set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Tables<'schedule'>;
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /** 予定の削除 */
  const handleDeleteSchedule = async (schedule: Tables<'schedule'>) => {
    try {
      if (!session) {
        throw new Error('セッションが無効です');
      }
      await deleteSchedule(schedule.uid, session);
      initView();
    } catch (error) {
      if (error)
        Alert.alert(
          'エラー',
          'スケジュールの削除中にエラーが発生しました。もう一度お試しください。'
        );
    }
  };

  // === Effect ===
  useFocusEffect(useCallback(initView, [plan, session]));

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        title={`${viewPlan?.title || plan?.title || 'スケジュール'}の予定`}
        onBack={() => router.back()}
        //   TODO: アクションボタン（共有・予定の削除など）
        rightComponent={
          <IconButton
            icon={<MaterialIcons name="add" size={18} color={isDarkMode ? 'white' : 'black'} />}
            onPress={handleAddPress}
            theme="info"
          ></IconButton>
        }
      />
      {/* Plan Information */}
      <PlanInformation plan={viewPlan} />
      {/* Schedule */}
      <Schedule plan={viewPlan} onDelete={handleDeleteSchedule} />
    </BackgroundView>
  );
}

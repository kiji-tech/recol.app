import React, { ReactNode, useCallback, useState } from 'react';
import { BackgroundView, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import Schedule from '@/src/components/Schedule';
import { useRouter } from 'expo-router';
import { deleteSchedule, fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Alert } from 'react-native';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { plan } = usePlan();
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
        console.error('Plan fetch error:', e);
        Alert.alert('エラー', 'プランの読み込み中にエラーが発生しました。もう一度お試しください。');
      });

    return () => {
      ctrl.abort();
    };
  };

  const handleDeleteSchedule = async (schedule: Tables<'schedule'>) => {
    try {
      if (!session) {
        throw new Error('セッションが無効です');
      }
      await deleteSchedule(schedule.uid, session);
      initView();
    } catch (error) {
      console.error('Schedule deletion error:', error);
      Alert.alert('エラー', 'スケジュールの削除中にエラーが発生しました。もう一度お試しください。');
    }
  };

  // === Effect ===
  useFocusEffect(useCallback(initView, [plan]));

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        title={`${viewPlan?.title || plan?.title || 'スケジュール'}の予定`}
        onBack={() => router.back()}
        //   TODO: アクションボタン（共有・予定の削除など）
        //   rightComponent={<></>}
      />
      <Schedule plan={viewPlan} onDelete={handleDeleteSchedule} />
    </BackgroundView>
  );
}

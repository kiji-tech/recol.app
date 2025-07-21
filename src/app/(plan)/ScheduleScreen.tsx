import React, { ReactNode, useCallback, useState } from 'react';
import ScheduleComponents from '@/src/components/Schedule';
import { BackgroundView, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import { useRouter } from 'expo-router';
import { deleteSchedule, fetchPlan } from '@/src/libs/ApiService';
import { useFocusEffect } from '@react-navigation/native';
import { Tables } from '@/src/libs/database.types';
import { useAuth } from '@/src/contexts/AuthContext';
import { Plan } from '@/src/entities/Plan';
import { LogUtil } from '@/src/libs/LogUtil';
import MaskLoading from '@/src/components/MaskLoading';
import ToastManager, { Toast } from 'toastify-react-native';
import PlanInformation from '@/src/components/PlanInformation';
import ScheduleMenu from './components/(ScheduleScreen)/ScheduleMenu';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { plan, planLoading } = usePlan();
  const { session } = useAuth();
  const [viewPlan, setViewPlan] = useState<Plan | null>(plan || null);

  // === Method ===
  const initView = () => {
    if (!session) {
      Toast.warn('ログイン情報が見つかりませんでした');
      router.navigate('/(auth)/SignIn');
      return;
    }

    if (!plan?.uid) {
      Toast.warn('プランの情報が取得できませんでした');
      router.back();
      return;
    }

    const ctrl = new AbortController();

    fetchPlan(plan.uid, session, ctrl)
      .then((data) => {
        if (!data) {
          Toast.warn('プランの情報が取得できませんでした');
        }
        setViewPlan({ ...data } as Plan);
      })
      .catch((e) => {
        if (e && e.message.includes('Aborted')) {
          LogUtil.log('Aborted', { level: 'info' });
          return;
        }
        LogUtil.log(JSON.stringify({ fetchPlan: e }), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn('プランの情報が取得に失敗しました');
        }
      });

    return () => {
      ctrl.abort();
    };
  };

  /** 予定の削除 */
  const handleDeleteSchedule = async (schedule: Tables<'schedule'>) => {
    deleteSchedule(schedule.uid, session)
      .then(() => {
        Toast.success(`${schedule.title} を削除しました`);
        initView();
      })
      .catch((e) => {
        LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn(e.message);
        }
      });
  };

  // === Effect ===
  useFocusEffect(useCallback(initView, [plan, session]));

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        onBack={() => router.back()}
        rightComponent={viewPlan ? <ScheduleMenu plan={viewPlan} /> : undefined}
      />
      {/* Plan Information */}
      {viewPlan && (
        <>
          <PlanInformation plan={viewPlan} />
          {/* Schedule */}
          <ScheduleComponents plan={viewPlan} onDelete={handleDeleteSchedule} />
        </>
      )}
      {planLoading && <MaskLoading />}
      <ToastManager />
    </BackgroundView>
  );
}

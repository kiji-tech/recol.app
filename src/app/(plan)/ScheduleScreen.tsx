import React, { ReactNode, useCallback, useState } from 'react';
import ScheduleComponents from '../../features/schedule/components/ScheduleComponent';
import { BackgroundView, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import { useRouter } from 'expo-router';
import { Plan, fetchPlan } from '@/src/features/plan';
import { useFocusEffect } from '@react-navigation/native';
import { deleteSchedule, Schedule } from '@/src/features/schedule';

import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';
import PlanInformation from '../../features/schedule/components/PlanInformation';
import ScheduleMenu from '../../features/schedule/components/ScheduleMenu';
import { ScrollView } from 'react-native-gesture-handler';
import { BackHandler } from 'react-native';
import i18n from '@/src/libs/i18n';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { plan, setPlan, planLoading } = usePlan();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // === Method ===
  /**
   * 初期表示処理
   */
  const initView = () => {
    if (!session) {
      Toast.warn(i18n.t('SCREEN.SCHEDULE.NO_LOGIN'));
      router.navigate('/(auth)/SignIn');
      return;
    }

    if (!plan?.uid) {
      Toast.warn(i18n.t('SCREEN.SCHEDULE.PLAN_NOT_FOUND'));
      router.back();
      return;
    }

    const ctrl = new AbortController();
    setIsLoading(true);

    fetchPlan(plan.uid, session, ctrl)
      .then((data) => {
        if (!data) {
          Toast.warn(i18n.t('SCREEN.SCHEDULE.PLAN_NOT_FOUND'));
        }
        setPlan({ ...data } as Plan);
      })
      .catch((e) => {
        if (e && e.message.includes('Aborted')) {
          LogUtil.log('Aborted', { level: 'info' });
          return;
        }
        LogUtil.log(JSON.stringify({ fetchPlan: e }), { level: 'error', notify: true });
        if (e && e.message) {
          Toast.warn(i18n.t('SCREEN.SCHEDULE.FETCH_FAILED'));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      ctrl.abort();
    };
  };

  /**
   * 予定の削除処理
   */
  const handleDeleteSchedule = async (schedule: Schedule) => {
    deleteSchedule(schedule, session)
      .then(() => {
        Toast.success(`${schedule.title} ${i18n.t('SCREEN.SCHEDULE.DELETE_SUCCESS')}`);
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
  /**
   * 初回ロード
   */
  useFocusEffect(useCallback(initView, [session]));

  /**
   * バックボタンを押した場合は､画面を閉じるイベントハンドラを追加
   */
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
      return () => backHandler.remove();
    }, [])
  );

  // === Render ===
  return (
    <BackgroundView>
      {/* ヘッダー */}
      <Header
        onBack={() => router.back()}
        rightComponent={plan ? <ScheduleMenu plan={plan} /> : undefined}
      />
      {/* Plan Information */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {plan && (
          <>
            <PlanInformation plan={plan} />
            {/* Schedule */}
            <ScheduleComponents
              isLoading={planLoading || isLoading}
              plan={plan}
              onDelete={handleDeleteSchedule}
            />
          </>
        )}
      </ScrollView>
      <ToastManager />
    </BackgroundView>
  );
}

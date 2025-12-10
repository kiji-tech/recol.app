import React, { ReactNode, useCallback } from 'react';
import { BackgroundView, Header, MaskLoading } from '@/src/components';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
  deleteSchedule,
  Schedule,
  PlanInformation,
  ScheduleMenu,
  ScheduleComponent,
} from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { BackHandler } from 'react-native';
import { Toast } from 'toastify-react-native';
import { usePlan } from '@/src/contexts';
import generateI18nMessage from '@/src/libs/i18n';
import { ApiErrorResponse } from '@/src/features/commons/apiService';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { session, user } = useAuth();
  const { plan, planId, refetchPlan, refetchPlanList, planLoading } = usePlan();

  // === Method ===
  /**
   * 初期表示処理
   */
  const initView = () => {
    if (!session) {
      Toast.warn(generateI18nMessage('FEATURE.SCHEDULE.NO_LOGIN'));
      router.navigate('/(auth)/SignIn');
      return;
    }

    if (!planId) {
      Toast.warn(generateI18nMessage('FEATURE.SCHEDULE.PLAN_NOT_FOUND'));
      router.back();
      return;
    }
  };

  /**
   * 予定の削除処理
   * @param schedule {Schedule}
   */
  const handleDeleteSchedule = async (schedule: Schedule) => {
    await deleteSchedule(schedule, session).catch((e: ApiErrorResponse) => {
      LogUtil.log(JSON.stringify({ deleteScheduleError: e }), {
        level: 'error',
        notify: true,
        user,
      });
      if (e && e.code == 'C007') {
        Toast.warn(
          generateI18nMessage(`MESSAGE.${e.code}`, [{ key: 'param1', value: schedule.title || '' }])
        );
        return;
      }
      Toast.warn(generateI18nMessage('MESSAGE.O001'));
      throw new Error(e.message);
    });
    refetchPlan();
    refetchPlanList();
    Toast.info(
      generateI18nMessage('FEATURE.SCHEDULE.DELETE_SUCCESS', [
        { key: 'title', value: schedule.title || '' },
      ])
    );
    initView();
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
      // 画面に来たときにプランを取り直す
      refetchPlan();
      refetchPlanList();
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
      {planLoading && <MaskLoading />}
      {/* ヘッダー */}
      <Header
        onBack={() => router.back()}
        rightComponent={plan ? <ScheduleMenu plan={plan} /> : undefined}
      />
      {/* Plan Information */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {plan && (
          <>
            <PlanInformation />
            {/* Schedule */}
            <ScheduleComponent onDelete={handleDeleteSchedule} />
          </>
        )}
      </ScrollView>
    </BackgroundView>
  );
}

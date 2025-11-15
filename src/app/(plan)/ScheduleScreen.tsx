import React, { ReactNode, useCallback } from 'react';
import ScheduleComponents from '../../features/schedule/components/ScheduleComponent';
import { BackgroundView, Header } from '@/src/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Plan, fetchPlan } from '@/src/features/plan';
import { useFocusEffect } from '@react-navigation/native';
import { deleteSchedule, Schedule } from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';
import { LogUtil } from '@/src/libs/LogUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { BackHandler } from 'react-native';
import PlanInformation from '../../features/schedule/components/PlanInformation';
import ScheduleMenu from '../../features/schedule/components/ScheduleMenu';
import { Toast } from 'toastify-react-native';
import i18n from '@/src/libs/i18n';
import { useQuery } from 'react-query';

export default function ScheduleScreen(): ReactNode {
  const router = useRouter();
  const { session } = useAuth();
  const { uid: planId } = useLocalSearchParams<{ uid: string }>();

  const {
    data: plan,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['plan', planId],
    queryFn: () => fetchPlan(planId, session),
  });

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

    if (!planId) {
      Toast.warn(i18n.t('SCREEN.SCHEDULE.PLAN_NOT_FOUND'));
      router.back();
      return;
    }
    refetch();
  };

  /**
   * 予定の削除処理
   */
  const handleDeleteSchedule = async (schedule: Schedule) => {
    const text = i18n.t('SCREEN.SCHEDULE.DELETE_SUCCESS').replace('#title#', schedule.title || '');
    await deleteSchedule(schedule, session).catch((e) => {
      LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
      if (e && e.message) {
        Toast.warn(e.message);
      }
      throw new Error(e.message);
    });

    Toast.info(text);
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
              isLoading={isLoading}
              plan={plan || ({ schedule: [] } as unknown as Plan)}
              onDelete={handleDeleteSchedule}
            />
          </>
        )}
      </ScrollView>
    </BackgroundView>
  );
}

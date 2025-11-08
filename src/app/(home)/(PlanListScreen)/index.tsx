import React from 'react';
import { BackgroundView, Header } from '@/src/components';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { usePlan } from '@/src/contexts/PlanContext';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';
import { Plan } from '@/src/features/plan/types/Plan';
import NotFoundPlanView from '../../../features/plan/components/NotFoundPlanView';
import PlanCard from '../../../features/plan/components/PlanCard';
import PlanListMenu from '@/src/features/plan/components/PlanListMenu';


export default function PlanListScreen() {
  // === Member ===
  const { planList, fetchPlan, planLoading } = usePlan();

  // === Method ===
  const init = async (ctrl?: AbortController) => {
    await fetchPlan(ctrl).catch((e) => {
      if (e.message.includes('Aborted')) {
        LogUtil.log('Aborted', { level: 'warn' });
        return;
      }
      LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
      Toast.warn('プランの取得に失敗しました');
    });
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      LogUtil.log('plan list init');
      const ctrl = new AbortController();
      init(ctrl);
      return () => {
        ctrl.abort();
      };
    }, [])
  );

  return (
    <BackgroundView>
      <Header title="予定一覧" rightComponent={<PlanListMenu />} />
      {/* プランがない場合 */}
      {!planLoading && planList.length === 0 && <NotFoundPlanView />}
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start bg-light-background dark:bg-dark-background rounded-xl">
        {planList && planList.map((plan: Plan) => <PlanCard key={plan.uid} plan={plan} />)}
      </View>
      <ToastManager />
    </BackgroundView>
  );
}

import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BackgroundView, Header } from '@/src/components';
import IconButton from '@/src/components/Common/IconButton';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { usePlan } from '@/src/contexts/PlanContext';
import { useTheme } from '@/src/contexts/ThemeContext';
import { LogUtil } from '@/src/libs/LogUtil';
import ToastManager, { Toast } from 'toastify-react-native';
import { Plan } from '@/src/entities/Plan';
import NotFoundPlanView from './components/NotFoundPlanView';
import PlanCard from './components/PlanCard';

export default function PlanListScreen() {
  // === Member ===
  const router = useRouter();
  const { isDarkMode } = useTheme();
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

  // === Render ===
  /** プラン追加ボタン */
  const addButton = () => {
    return (
      <IconButton
        icon={<MaterialIcons name="add" size={18} color={isDarkMode ? 'white' : 'black'} />}
        theme="info"
        onPress={() => {
          router.push('/(modal)/PlanCreator');
        }}
      />
    );
  };

  return (
    <BackgroundView>
      <Header title="計画一覧" rightComponent={addButton()} />
      {/* プランがない場合 */}
      {!planLoading && planList.length === 0 && <NotFoundPlanView />}
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start">
        {planList && planList.map((plan: Plan) => <PlanCard key={plan.uid} plan={plan} />)}
      </View>
      <ToastManager />
    </BackgroundView>
  );
}

import React, { useState } from 'react';
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
import PlanSortModal from '@/src/features/plan/components/PlanSortModal';
import { PlanSortType, PLAN_SORT_TYPE_STORAGE_KEY } from '@/src/features/plan/types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/libs/i18n';

export default function PlanListScreen() {
  // === Member ===
  const { planList, fetchPlan, planLoading } = usePlan();
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  // === Method ===
  /**
   * 初期化処理
   * @param {AbortController} ctrl - アボートコントローラー
   * @param {PlanSortType} targetSortType - ソート条件（指定がない場合はLocalStorageから読み込む）
   */
  const init = async (ctrl?: AbortController) => {
    await fetchPlan(ctrl).catch((e) => {
      if (e.message.includes('Aborted')) {
        LogUtil.log('Aborted', { level: 'warn' });
        return;
      }
      LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
      Toast.warn(i18n.t('SCREEN.PLAN_LIST.FETCH_FAILED'));
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

  /**
   * 並び替えボタン イベントハンドラ
   */
  const handleSortPress = () => {
    setIsSortModalVisible(true);
  };

  /**
   * ソート条件を保存する
   * @param {PlanSortType} savedSortType - 保存されたソート条件
   */
  const handleSaveSortType = async (savedSortType: PlanSortType) => {
    await AsyncStorage.setItem(PLAN_SORT_TYPE_STORAGE_KEY, savedSortType).catch(() => {
      Toast.warn(i18n.t('SCREEN.PLAN_LIST.SORT_SAVE_FAILED'));
    });
    setIsSortModalVisible(false);
    await init();
  };

  return (
    <BackgroundView>
      <Header
        title={i18n.t('SCREEN.PLAN.LIST_TITLE')}
        rightComponent={<PlanListMenu onSortPress={handleSortPress} />}
      />
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start bg-light-background dark:bg-dark-background rounded-xl">
        {planList && planList.map((plan: Plan) => <PlanCard key={plan.uid} plan={plan} />)}
      </View>
      {/* プランソートモーダル */}
      <PlanSortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        onSave={handleSaveSortType}
      />
      {/* プランがない場合 */}
      {!planLoading && planList.length === 0 && <NotFoundPlanView />}
      <ToastManager />
    </BackgroundView>
  );
}

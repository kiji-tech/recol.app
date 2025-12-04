import React, { useState, useCallback } from 'react';
import { BackgroundView, Header } from '@/src/components';
import { useFocusEffect } from 'expo-router';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';
import { Plan } from '@/src/features/plan/types/Plan';
import NotFoundPlanView from '../../../features/plan/components/NotFoundPlanView';
import PlanCard from '../../../features/plan/components/PlanCard';
import PlanListMenu from '@/src/features/plan/components/PlanListMenu';
import PlanSortModal from '@/src/features/plan/components/PlanSortModal';
import { PlanSortType, PLAN_SORT_TYPE_STORAGE_KEY } from '@/src/features/plan/types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateI18nMessage from '@/src/libs/i18n';
import { deletePlan } from '@/src/features/plan';
import { useMutation } from 'react-query';
import { useAuth } from '@/src/features/auth';
import { usePlan } from '@/src/contexts/PlanContext';
import { sortPlanSchedule } from '@/src/features/plan/libs/sortPlanSchedule';

export default function PlanListScreen() {
  // === Member ===
  const { session } = useAuth();
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const { planList, storagePlanList, planLoading, refetchPlanList, setSortType, sortType } =
    usePlan();

  /**
   * プランの削除
   * @param {string} planId - 削除するプランのID
   * @returns {void}
   */
  const deletePlanMutation = useMutation({
    mutationFn: (planId: string) => deletePlan(planId, session),
    onSuccess: () => {
      refetchPlanList();
    },
    onError: (error) => {
      if (error && error instanceof Error && error.message) {
        Toast.warn(error.message);
      }
    },
  });

  // === Method ===
  /**
   * ソート条件を保存する
   * @param {PlanSortType} savedSortType - 保存されたソート条件
   */
  const handleSaveSortType = async (savedSortType: PlanSortType) => {
    await AsyncStorage.setItem(PLAN_SORT_TYPE_STORAGE_KEY, savedSortType).catch(() => {
      Toast.warn(generateI18nMessage('FEATURE.PLAN_LIST.SORT_SAVE_FAILED'));
    });
    setSortType(savedSortType);
    setIsSortModalVisible(false);
    refetchPlanList();
  };

  /**
   * 並び替えボタン イベントハンドラ
   */
  const handleSortPress = () => {
    setIsSortModalVisible(true);
  };

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      refetchPlanList();
    }, [])
  );

  return (
    <BackgroundView>
      <Header
        title={generateI18nMessage('FEATURE.PLAN.LIST_TITLE')}
        rightComponent={<PlanListMenu onSortPress={handleSortPress} />}
      />
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start bg-light-background dark:bg-dark-background rounded-xl">
        {sortPlanSchedule(planList || storagePlanList || [], sortType).map((plan: Plan) => {
          return <PlanCard key={plan.uid} plan={plan} onDelete={deletePlanMutation.mutate} />;
        })}
      </View>
      {/* プランソートモーダル */}
      <PlanSortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        onSave={handleSaveSortType}
      />
      {/* プランがない場合 */}
      {!planLoading && storagePlanList?.length === 0 && <NotFoundPlanView />}
    </BackgroundView>
  );
}

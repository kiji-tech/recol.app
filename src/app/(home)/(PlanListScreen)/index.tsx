import React, { useState } from 'react';
import { BackgroundView, Header } from '@/src/components';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';
import { Plan } from '@/src/features/plan/types/Plan';
import NotFoundPlanView from '../../../features/plan/components/NotFoundPlanView';
import PlanCard from '../../../features/plan/components/PlanCard';
import PlanListMenu from '@/src/features/plan/components/PlanListMenu';
import PlanSortModal from '@/src/features/plan/components/PlanSortModal';
import {
  PlanSortType,
  PLAN_SORT_TYPE_STORAGE_KEY,
  DEFAULT_PLAN_SORT_TYPE,
} from '@/src/features/plan/types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/libs/i18n';
import { deletePlan } from '@/src/features/plan';
import { useMutation, useQuery } from 'react-query';
import { useAuth } from '@/src/features/auth';
import { fetchPlanList } from '@/src/features/plan/apis/fetchPlanList';

export default function PlanListScreen() {
  // === Member ===
  const { session } = useAuth();
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [sortType, setSortType] = useState<PlanSortType>(DEFAULT_PLAN_SORT_TYPE);
  const {
    data: planList,
    isLoading: planLoading,
    refetch: refetchPlanList,
  } = useQuery({
    queryKey: ['planList', sortType],
    queryFn: () => fetchPlanList(session, undefined, sortType),
  });

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

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      // ソート条件を取得してstateに設定
      AsyncStorage.getItem(PLAN_SORT_TYPE_STORAGE_KEY)
        .then((storedSortType) => {
          const validSortType: PlanSortType =
            (storedSortType as PlanSortType) || DEFAULT_PLAN_SORT_TYPE;
          setSortType(validSortType);
        })
        .catch(() => {
          setSortType(DEFAULT_PLAN_SORT_TYPE);
        });
      refetchPlanList();
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
    setSortType(savedSortType);
    setIsSortModalVisible(false);
    refetchPlanList();
  };

  return (
    <BackgroundView>
      <Header
        title={i18n.t('SCREEN.PLAN.LIST_TITLE')}
        rightComponent={<PlanListMenu onSortPress={handleSortPress} />}
      />
      {/* プラン一覧 */}
      <View className="flex flex-col justify-start items-start bg-light-background dark:bg-dark-background rounded-xl">
        {planList &&
          planList.map((plan: Plan) => (
            <PlanCard key={plan.uid} plan={plan} onDelete={deletePlanMutation.mutate} />
          ))}
      </View>
      {/* プランソートモーダル */}
      <PlanSortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
        onSave={handleSaveSortType}
      />
      {/* プランがない場合 */}
      {!planLoading && planList && planList.length === 0 && <NotFoundPlanView />}
    </BackgroundView>
  );
}

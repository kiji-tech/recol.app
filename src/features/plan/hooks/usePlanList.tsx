import { useCallback, useEffect, useState } from 'react';
import { fetchPlanList } from '../index';
import { useAuth } from '../../auth';
import { LogUtil } from '../../../libs/LogUtil';
import { Plan } from '../index';
import { PlanSortType } from '../types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLAN_LIST_STORAGE_KEY = '@plan_list';

export const usePlanList = (plan?: Plan | null, setPlan?: (plan: Plan) => void) => {
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    const ctrl = new AbortController();
    fetchStoragePlan();
    fetchPlan(ctrl);
    return () => {
      ctrl.abort();
    };
  }, [session]);

  const fetchStoragePlan = async () => {
    const list = JSON.parse((await AsyncStorage.getItem(PLAN_LIST_STORAGE_KEY)) || '[]');
    if (list && list.length > 0) {
      LogUtil.log('Hit! plan storage.', { level: 'info' });
      setPlanList(list);
    }
  };

  const setStoragePlan = async (planList: Plan[]) => {
    await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, JSON.stringify(planList));
  };

  const fetchPlan = useCallback(
    async (ctrl?: AbortController, sortType?: PlanSortType) => {
      if (!session) return;
      setPlanLoading(true);
      fetchPlanList(session, ctrl, sortType)
        .then(async (response) => {
          setPlanList(response);
          await setStoragePlan(response);
          if (plan && setPlan) {
            const updatePlan = response.find((p) => p.uid === plan.uid);
            if (updatePlan) setPlan(updatePlan);
          }
        })
        .catch((e) => {
          if (e && e.message.includes('Aborted')) {
            LogUtil.log('Aborted', { level: 'info' });
            return;
          }
          LogUtil.log(JSON.stringify({ fetchPlanList: e }), { level: 'error', notify: true });
          throw e;
        })
        .finally(() => {
          setPlanLoading(false);
        });
    },
    [session, setPlan]
  );

  const clearStoragePlan = async () => {
    await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, '[]');
  };

  return {
    planList,
    setPlanList,
    planLoading,
    fetchPlan,
    clearStoragePlan,
  };
};

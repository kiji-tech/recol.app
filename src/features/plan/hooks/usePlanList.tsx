import { fetchPlanList } from '../index';
import { useAuth } from '../../auth';
import { LogUtil } from '../../../libs/LogUtil';
import { Plan } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from 'react-query';
import { PLAN_SORT_TYPE_STORAGE_KEY } from '../types/PlanSortType';
import { PlanSortType } from '../types/PlanSortType';
import { useStoragePlanList } from './useStoragePlanList';
import { useEffect, useState } from 'react';
import { DEFAULT_PLAN_SORT_TYPE } from '../types/PlanSortType';

export const PLAN_LIST_STORAGE_KEY = '@plan_list';

export const usePlanList = (plan?: Plan | null, setPlan?: (plan: Plan) => void) => {
  const { session } = useAuth();
  const { setStoragePlan, refetch: refetchStoragePlanList } = useStoragePlanList();
  const [sortType, setSortType] = useState<PlanSortType>(DEFAULT_PLAN_SORT_TYPE);

  const fetchPlan = async (sortType?: PlanSortType, ctrl?: AbortController) => {
    if (!session) return [];
    const response = await fetchPlanList(session, ctrl, sortType).catch((e) => {
      LogUtil.log('Failed to fetch plan list.', { level: 'error', error: e });
      return [];
    });

    await setStoragePlan(response);
    refetchStoragePlanList();
    if (plan && setPlan) {
      const updatePlan = response.find((p) => p.uid === plan.uid);
      if (updatePlan) setPlan(updatePlan);
    }
    LogUtil.log(JSON.stringify({ response: response.map((p: Plan) => p.title) }), {
      level: 'info',
    });
    return response;
  };

  useEffect(() => {
    const sortType = async () => {
      const savedSortType = await AsyncStorage.getItem(PLAN_SORT_TYPE_STORAGE_KEY);
      setSortType((savedSortType as PlanSortType) || DEFAULT_PLAN_SORT_TYPE);
    };
    sortType();
  }, []);

  return {
    ...useQuery({
      queryKey: ['planList', sortType],
      queryFn: () => fetchPlan(sortType),
    }),
    setSortType,
  };
};

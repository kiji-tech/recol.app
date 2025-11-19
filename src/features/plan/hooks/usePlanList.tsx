import { fetchPlanList } from '../index';
import { useAuth } from '../../auth';
import { LogUtil } from '../../../libs/LogUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from 'react-query';
import { PLAN_SORT_TYPE_STORAGE_KEY } from '../types/PlanSortType';
import { PlanSortType } from '../types/PlanSortType';
import { useEffect, useState } from 'react';
import { DEFAULT_PLAN_SORT_TYPE } from '../types/PlanSortType';
import { useStoragePlanList } from './useStoragePlanList';

export const PLAN_LIST_STORAGE_KEY = '@plan_list';

export const usePlanList = () => {
  const { session, user } = useAuth();
  const { setStoragePlan, refetch: refetchStoragePlanList } = useStoragePlanList();
  const [sortType, setSortType] = useState<PlanSortType>(DEFAULT_PLAN_SORT_TYPE);

  const fetchPlan = async (sortType?: PlanSortType, ctrl?: AbortController) => {
    if (!session) return [];
    const response = await fetchPlanList(session, ctrl, sortType).catch((e) => {
      LogUtil.log(JSON.stringify({ fetchPlanListError: e }), { level: 'error', user });
      return [];
    });

    setStoragePlan(response);
    refetchStoragePlanList();
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
      queryKey: ['planList', session, sortType],
      queryFn: () => fetchPlan(sortType),
    }),
    sortType,
    setSortType,
  };
};

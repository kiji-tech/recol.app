import { Plan } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from 'react-query';

export const PLAN_LIST_STORAGE_KEY = '@plan_list';

export const useStoragePlanList = () => {
  const fetchStoragePlan = async () => {
    const list = JSON.parse((await AsyncStorage.getItem(PLAN_LIST_STORAGE_KEY)) || '[]');
    if (list && list.length > 0) {
      return list;
    }
    return [];
  };

  const setStoragePlan = async (planList: Plan[]) => {
    await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, JSON.stringify(planList));
  };

  const clearStoragePlan = async () => {
    await AsyncStorage.setItem(PLAN_LIST_STORAGE_KEY, '[]');
  };

  return {
    ...useQuery({
      queryKey: ['storagePlanList'],
      queryFn: () => fetchStoragePlan(),
    }),
    setStoragePlan,
    clearStoragePlan,
  };
};

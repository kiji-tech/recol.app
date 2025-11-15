import { apiRequest } from '../../commons/apiService';
import { Plan } from '../types/Plan';
import { Session } from '@supabase/supabase-js';
import {
  DEFAULT_PLAN_SORT_TYPE,
  PLAN_SORT_TYPE_STORAGE_KEY,
  PlanSortType,
} from '../types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogUtil } from '../../../libs/LogUtil';
/**
 * プラン一覧の取得
 * @param {Session | null} session - セッション情報
 * @param {AbortController} ctrl - アボートコントローラー
 * @return {Promise<Plan[]>} プラン一覧
 */
export async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController
): Promise<Plan[]> {
  const validSortType: PlanSortType =
    ((await AsyncStorage.getItem(PLAN_SORT_TYPE_STORAGE_KEY)) as PlanSortType) ||
    DEFAULT_PLAN_SORT_TYPE;
  LogUtil.log(JSON.stringify({ validSortType }), { level: 'info' });
  const response = await apiRequest<Plan[]>('/plan/list', {
    method: 'POST',
    session,
    ctrl,
    body: validSortType ? { sortType: validSortType } : undefined,
  });
  return response.data!;
}

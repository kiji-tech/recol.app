import { apiRequest } from '../../commons/apiService';
import { Plan } from '../types/Plan';
import { Session } from '@supabase/supabase-js';
import { PlanSortType } from '../types/PlanSortType';

/**
 * プラン一覧の取得
 * @param {Session | null} session - セッション情報
 * @param {AbortController} ctrl - アボートコントローラー
 * @param {PlanSortType} sortType - ソート条件（オプショナル、デフォルトはcreated_at）
 * @return {Promise<Plan[]>} プラン一覧
 */
export async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController,
  sortType?: PlanSortType
): Promise<Plan[]> {
  const response = await apiRequest<Plan[]>('/plan/list', {
    method: 'POST',
    session,
    ctrl,
    body: sortType ? { sortType } : undefined,
  });
  return response.data!;
}

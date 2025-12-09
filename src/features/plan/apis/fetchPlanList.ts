import { apiRequest } from '@/src/features/commons/apiService';
import { Plan } from '@/src/features/plan';
import { Session } from '@supabase/supabase-js';
import { PlanSortType } from '@/src/features/plan';

/**
 * プラン一覧の取得
 * @param {Session | null} session - セッション情報
 * @param {AbortController} ctrl - アボートコントローラー
 * @param {PlanSortType} sortType - ソート条件（オプショナル、提供されない場合はAsyncStorageから読み取る）
 * @return {Promise<Plan[]>} プラン一覧
 */
export async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController,
  sortType?: PlanSortType
): Promise<Plan[]> {
  const response = await apiRequest<Plan[]>('/v1/plan/list', {
    method: 'POST',
    session,
    ctrl,
    body: sortType ? { sortType: sortType } : undefined,
  });
  return response.data!;
}

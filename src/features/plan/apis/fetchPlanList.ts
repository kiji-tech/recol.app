import { apiRequest } from '../../commons/apiService';
import { Plan } from '../types/Plan';
import { Session } from '@supabase/supabase-js';

/**
 * プラン一覧の取得
 */
export async function fetchPlanList(
  session: Session | null,
  ctrl?: AbortController
): Promise<Plan[]> {
  const response = await apiRequest<Plan[]>('/plan/list', { method: 'POST', session, ctrl });
  return response.data!;
}

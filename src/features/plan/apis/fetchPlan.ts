import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Plan } from '../types/Plan';

/**
 * プラン情報の取得
 */
export async function fetchPlan(planId: string, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>(`/v1/plan/${planId}`, { method: 'GET', session, ctrl });
  return response.data!;
}

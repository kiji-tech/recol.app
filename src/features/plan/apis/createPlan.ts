import { apiRequest } from '../../commons/apiService';
import { Plan } from '../types/Plan';
import { Session } from '@supabase/supabase-js';

/**
 * プランの作成
 */
export async function createPlan(plan: Plan, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>('/plan', {
    method: 'POST',
    session,
    body: plan as Plan,
    ctrl,
  });
  return response.data!;
}

import { apiRequest } from '../../commons/apiService';
import { Plan } from '../types/Plan';
import { Session } from '@supabase/supabase-js';

/**
 * プランの更新
 */
export async function updatePlan(plan: Plan, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>('/plan', {
    method: 'PUT',
    session,
    body: plan as Plan,
    ctrl,
  });
  return response.data!;
}

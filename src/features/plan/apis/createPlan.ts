import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Plan } from '@/src/features/plan';

/**
 * プランの作成
 */
export async function createPlan(plan: Plan, session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Plan>('/v1/plan', {
    method: 'POST',
    session,
    body: plan as Plan,
    ctrl,
  });
  return response.data!;
}

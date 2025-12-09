import { apiRequest } from '@/src/features/commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * プランの削除
 */
export async function deletePlan(planId: string, session: Session | null, ctrl?: AbortController) {
  await apiRequest<void>('/v1/plan/delete', {
    method: 'POST',
    session,
    body: { planId },
    ctrl,
  });
}

export default deletePlan;

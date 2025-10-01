import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';

export async function syncPremiumPlan(
  isPremium: boolean,
  endAt: Date | null,
  session: Session | null
) {
  await apiRequest<void>('/profile/sync-premium-plan', {
    method: 'PUT',
    session,
    body: {
      isPremium,
      endAt,
    },
  });
  return;
}

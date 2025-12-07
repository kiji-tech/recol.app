import { Session } from '@supabase/supabase-js';
import { apiRequest } from '@/src/features/commons/apiService';
import { Profile } from '@/src/features/profile';

export async function syncPremiumPlan(
  isPremium: boolean,
  endAt: Date | null,
  session: Session | null
) {
  const response = await apiRequest<Profile>('/v1/profile/sync-premium-plan', {
    method: 'PUT',
    session,
    body: {
      isPremium,
      endAt,
    },
  });
  return new Profile(response.data!);
}

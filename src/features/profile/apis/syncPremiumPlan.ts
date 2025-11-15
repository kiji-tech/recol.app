import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import { Profile } from '../types/Profile';

export async function syncPremiumPlan(
  isPremium: boolean,
  endAt: Date | null,
  session: Session | null
) {
  const response = await apiRequest<Profile>('/profile/sync-premium-plan', {
    method: 'PUT',
    session,
    body: {
      isPremium,
      endAt,
    },
  });
  return new Profile(response.data!);
}

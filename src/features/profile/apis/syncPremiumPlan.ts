import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import { Profile, ProfileType } from '../types/Profile';
import { SubscriptionType } from '@/src/entities';

export async function syncPremiumPlan(
  isPremium: boolean,
  endAt: Date | null,
  session: Session | null
) {
  const response = await apiRequest<ProfileType & { subscription: SubscriptionType[] }>(
    '/profile/sync-premium-plan',
    {
      method: 'PUT',
      session,
      body: {
        isPremium,
        endAt,
      },
    }
  );
  return new Profile(response.data!);
}

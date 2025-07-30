import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import { Profile, ProfileType } from '@/src/features/profile';
import { SubscriptionType } from '@/src/features/payment';

/**
 * プロフィールの取得
 */
export async function getProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<ProfileType & { subscription: SubscriptionType[] }>(
    '/profile',
    {
      method: 'GET',
      session,
      ctrl,
    }
  );
  return new Profile(response.data!);
}

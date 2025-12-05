import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types/Profile';

/**
 * プロフィールの更新
 */
export async function updateProfile(
  profile: Profile,
  session: Session | null,
  ctrl?: AbortController
) {
  const response = await apiRequest<Profile>('/v1/profile', {
    method: 'PUT',
    session,
    body: {
      ...profile,
      avatar_url: profile?.avatar_url || null,
    },
    ctrl,
  });
  return new Profile(response.data!);
}

import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import { Profile } from '@/src/features/profile';

/**
 * プロフィールの取得
 */
export async function fetchProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Profile>('/v1/profile', {
    method: 'GET',
    session,
    ctrl,
  });
    console.log({ profile: response.data});
  return new Profile(response.data!);
}

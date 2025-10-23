import { Session } from '@supabase/supabase-js';
import { apiRequest } from '../../commons/apiService';
import { Profile, ProfileType } from '@/src/features/profile';

/**
 * プロフィールの取得
 */
export async function fetchProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<ProfileType>('/profile', {
    method: 'GET',
    session,
    ctrl,
  });
  return new Profile(response.data!);
}

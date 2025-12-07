import { Session } from '@supabase/supabase-js';
import { apiRequest } from '@/src/features/commons/apiService';
import { Profile } from '@/src/features/profile/types/Profile';

/**
 * プロフィールの作成
 * @param session {Session | null} - セッション
 * @param ctrl {AbortController | undefined} - コントローラー
 */
export async function createProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Profile>('/v1/profile', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

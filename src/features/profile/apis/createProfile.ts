import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';
import { Profile } from '../types/Profile';

/**
 * プロフィールの作成
 * @param session {Session | null} - セッション
 * @param ctrl {AbortController | undefined} - コントローラー
 */
export async function createProfile(session: Session | null, ctrl?: AbortController) {
  const response = await apiRequest<Profile>('/profile', {
    method: 'POST',
    session,
    ctrl,
  });
  return response.data!;
}

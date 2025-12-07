import { Session } from '@supabase/supabase-js';
import { Profile, fetchProfile } from '../../profile';
3
/**
 * プロフィール取得
 */
export const getProfile = async (session: Session): Promise<Profile | null> => {
  return await fetchProfile(session);
};

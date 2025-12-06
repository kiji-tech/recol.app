import { Session } from '@supabase/supabase-js';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { Profile } from '../../profile/types/Profile';

/**
 * プロフィール取得
 */
export const getProfile = async (session: Session): Promise<Profile | null> => {
  return await fetchProfile(session);
};

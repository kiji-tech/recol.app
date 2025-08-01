import { Session } from '@supabase/supabase-js';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';

/**
 * プロフィール取得
 */
export const getProfile = async (
  session: Session
): Promise<(Profile & { subscription: Subscription[] }) | null> => {
  try {
    return await fetchProfile(session);
  } catch (e) {
    if (e && typeof e === 'object' && 'message' in e) {
      return null;
    }
    throw e;
  }
};

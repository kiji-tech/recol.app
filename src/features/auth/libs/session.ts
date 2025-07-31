import { Session } from '@supabase/supabase-js';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';
import { getProfile as getProfileApi } from '../apis/getProfile';
import { getSession as getSessionApi } from '../apis/getSession';
import { isRecoverySession as isRecoverySessionApi } from '../apis/isRecoverySession';

/**
 * プロフィール取得
 */
export const getProfile = async (
  session: Session
): Promise<(Profile & { subscription: Subscription[] }) | null> => {
  return await getProfileApi(session);
};

/**
 * セッション取得
 */
export const getSession = async (): Promise<Session | null> => {
  return await getSessionApi();
};

/**
 * リカバリーセッションかどうかチェック
 */
export const isRecoverySession = async (): Promise<boolean> => {
  return await isRecoverySessionApi();
};

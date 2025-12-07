import { Session } from '@supabase/supabase-js';
import { Profile } from '@/src/features/profile';
import { getProfile as getProfileApi, getSession as getSessionApi, isRecoverySession as isRecoverySessionApi } from '@/src/features/auth';

/**
 * プロフィール取得
 */
export const getProfile = async (session: Session): Promise<Profile | null> => {
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

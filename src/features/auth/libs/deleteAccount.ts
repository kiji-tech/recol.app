import { deleteAccount as deleteAccountApi } from '../apis/deleteAccount';
import { Session } from '@supabase/supabase-js';

/**
 * アカウント削除
 */
export const deleteAccount = async (session: Session | null): Promise<void> => {
  return await deleteAccountApi(session);
};

import { apiRequest } from '../../commons/apiService';
import { Session } from '@supabase/supabase-js';

/**
 * アカウント削除
 */
export const deleteAccount = async (session: Session | null): Promise<void> => {
  try {
    await apiRequest('/delete-account', {
      method: 'DELETE',
      session,
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      throw new Error(error.message as string);
    }
    throw new Error('アカウント削除に失敗しました');
  }
};

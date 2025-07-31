import { User } from '@supabase/supabase-js';
import { resetPassword as resetPasswordApi } from '../apis/resetPassword';
import { updateUserPassword as updateUserPasswordApi } from '../apis/updateUserPassword';

/**
 * パスワードリセット
 */
export const resetPassword = async (email: string): Promise<void> => {
  return await resetPasswordApi(email);
};

/**
 * ユーザーパスワード更新
 */
export const updateUserPassword = async (password: string): Promise<User> => {
  return await updateUserPasswordApi(password);
};

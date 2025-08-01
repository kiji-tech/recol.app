import { User } from '@supabase/supabase-js';
import { supabase } from '../../../libs/supabase';

/**
 * ユーザーパスワード更新
 */
export const updateUserPassword = async (password: string): Promise<User> => {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  if (!data.user) throw new Error('User not found');
  return data.user;
};

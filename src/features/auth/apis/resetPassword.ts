import { supabase } from '../../../libs/supabase';
import * as Linking from 'expo-linking';
import { LogUtil } from '../../../libs/LogUtil';

/**
 * パスワードリセット
 */
export const resetPassword = async (email: string): Promise<void> => {
  const resetPasswordURL = Linking.createURL('/(auth)/ResetPassword');
  LogUtil.log('resetPasswordURL: ' + resetPasswordURL, { level: 'info' });
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetPasswordURL,
  });
  if (error) throw error;
};

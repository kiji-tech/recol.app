import { supabase } from '../../../libs/supabase';
import * as Linking from 'expo-linking';

/**
 * パスワードリセット
 */
export const resetPassword = async (email: string): Promise<void> => {
  const resetPasswordURL = Linking.createURL('/(auth)/ResetPassword');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetPasswordURL,
  });
  if (error) throw error;
};

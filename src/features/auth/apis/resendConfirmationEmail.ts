import { supabase } from '../../../libs/supabase';
import { AuthResult } from '../types/Auth';

/**
 * 確認メールを再送信
 */
export const resendConfirmationEmail = async (email: string): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: 'recol://(auth)/CompleteNewAccount',
    },
  });

  if (error) throw error;

  return { session: null, user: null, profile: null };
};

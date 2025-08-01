import { supabase } from '../../../libs/supabase';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';
import { AuthResult } from '../types/Auth';

/**
 * メールアドレスとパスワードでサインアップ
 */
export const signupWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'recol://(auth)/CompleteNewAccount',
    },
  });
  if (error) throw error;

  const session = data.session;
  const user = data.session?.user ?? null;
  let profile: (Profile & { subscription: Subscription[] }) | null = null;

  if (session) {
    try {
      profile = await fetchProfile(session);
    } catch {
      profile = null;
    }
  }

  return { session, user, profile };
};

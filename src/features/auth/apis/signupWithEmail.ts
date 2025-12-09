import { supabase } from '@/src/libs/supabase';
import { fetchProfile, Profile } from '@/src/features/profile';
import { AuthResult } from '@/src/features/auth/types/Auth';

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
  let profile: Profile | null = null;

  if (session) {
    try {
      profile = await fetchProfile(session);
    } catch {
      profile = null;
    }
  }

  return { session, user, profile };
};

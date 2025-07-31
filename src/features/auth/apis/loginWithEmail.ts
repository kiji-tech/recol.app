import { supabase } from '../../../libs/supabase';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResult } from '../types/Auth';

/**
 * メールアドレスとパスワードでログイン
 */
export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  await AsyncStorage.removeItem('sessionType');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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

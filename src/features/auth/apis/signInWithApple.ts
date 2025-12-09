import { supabase } from '@/src/libs/supabase';
import { fetchProfile, Profile } from '@/src/features/profile';
import { LogUtil } from '@/src/libs/LogUtil';
import { AuthResult } from '@/src/features/auth/types/Auth';
import * as AppleAuthentication from 'expo-apple-authentication';

/**
 * Appleサインイン
 */
export const signInWithApple = async (): Promise<AuthResult> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
  });

  if (!credential.identityToken) {
    LogUtil.log('signInWithApple error: no identity token present!', {
      level: 'error',
      notify: true,
    });
    throw new Error('no identity token present!');
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  });

  if (error) {
    LogUtil.log(JSON.stringify({ signInWithAppleError: error }), {
      level: 'error',
      notify: true,
    });
    throw error;
  }

  LogUtil.log(JSON.stringify({ signInWithAppleData: data }), { level: 'info' });

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

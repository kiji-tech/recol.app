import { supabase } from '../../../libs/supabase';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { LogUtil } from '../../../libs/LogUtil';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Profile } from '../../profile/types/Profile';
import { AuthResult } from '../types/Auth';

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
    LogUtil.log('signInWithApple error: ' + JSON.stringify(error), {
      level: 'error',
      notify: true,
    });
    throw error;
  }

  LogUtil.log('signInWithApple data: ' + JSON.stringify(data), { level: 'info' });

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

import { supabase } from '../../../libs/supabase';
import { fetchProfile } from '../../profile/apis/fetchProfile';
import { LogUtil } from '../../../libs/LogUtil';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Profile } from '../../profile/types/Profile';
import { AuthResult } from '../types/Auth';

/**
 * Googleサインイン
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  GoogleSignin.configure({
    // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  });
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  LogUtil.log('userInfo: ' + JSON.stringify(userInfo), { level: 'info' });

  if (!userInfo?.data?.idToken) {
    LogUtil.log('signInWithIdToken error: no ID token present!', {
      level: 'error',
      notify: true,
    });
    throw new Error('no ID token present!');
  }
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: userInfo.data.idToken,
  });

  if (error) {
    LogUtil.log('signInWithIdToken error: ' + JSON.stringify(error), {
      level: 'error',
      notify: true,
    });
    throw error;
  }

  LogUtil.log('signInWithIdToken data: ' + JSON.stringify(data), { level: 'info' });

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

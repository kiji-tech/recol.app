import React from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/src/libs/supabase';
import { LogUtil } from '@/src/libs/LogUtil';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function GoogleSignInButton() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '264549282449-siu16baee5bbs7f2i599eu0ul0kgfst4.apps.googleusercontent.com',
  });
  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Icon}
      color={isDarkMode ? GoogleSigninButton.Color.Dark : GoogleSigninButton.Color.Light}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          LogUtil.log('userInfo: ' + JSON.stringify(userInfo), { level: 'info' });
          if (!userInfo?.data?.idToken) {
            throw new Error('no ID token present!');
          }
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo?.data?.idToken,
          });

          if (error) {
            LogUtil.log('signInWithIdToken error: ' + JSON.stringify(error), { level: 'error' });
            throw error;
          }
          LogUtil.log('signInWithIdToken data: ' + JSON.stringify(data), { level: 'info' });
          router.navigate('/(home)');
        } catch (error: unknown) {
          if (error instanceof Error) {
            LogUtil.log(JSON.stringify(error), { level: 'error' });
          }
          if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            }
          } else {
            // some other error happened
          }
        }
      }}
    />
  );
}

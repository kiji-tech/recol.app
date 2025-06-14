import React from 'react';
import { TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTheme } from '@/src/contexts/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '@/src/contexts/AuthContext';

export default function GoogleSignInButton() {
  const { isDarkMode } = useTheme();
  const { signInWithGoogle } = useAuth();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  });

  return (
    <TouchableOpacity
      onPress={signInWithGoogle}
      className="flex flex-row items-center justify-center p-4 rounded-full border-light-border dark:border-dark-border border"
    >
      <AntDesign name="google" size={18} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
}

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useAuth } from '@/src/features/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function AppleSignInButton({ disabled }: { disabled: boolean }) {
  const { isDarkMode } = useTheme();
  const { signInWithApple } = useAuth();

  // Appleでサインインが利用可能かチェック
  const isAppleSignInAvailable = AppleAuthentication.isAvailableAsync();

  if (!isAppleSignInAvailable) {
    return null; // Appleでサインインが利用できない場合は表示しない
  }

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={signInWithApple}
      className="flex flex-row items-center justify-center p-4 rounded-full border-light-border dark:border-dark-border border"
    >
      <AntDesign name="apple1" size={18} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
}

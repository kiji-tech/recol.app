import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/contexts';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '@/src/features/auth';

export default function GoogleSignInButton({ disabled }: { disabled: boolean }) {
  const { isDarkMode } = useTheme();
  const { signInWithGoogle } = useAuth();

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={signInWithGoogle}
      className="flex flex-row items-center justify-center p-4 rounded-full border-light-border dark:border-dark-border border"
    >
      <AntDesign name="google" size={18} color={isDarkMode ? 'white' : 'black'} />
    </TouchableOpacity>
  );
}

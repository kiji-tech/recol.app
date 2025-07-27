import React from 'react';
import { View } from 'react-native';
import GoogleSignInButton from '@/src/components/Common/GoogleSignInButton';
import AppleSignInButton from '@/src/components/Common/AppleSignInButton';

export default function ExternalSignInButton({ isLoading }: { isLoading: boolean }) {
  return (
    <View className="flex flex-row justify-center items-center gap-2 mb-4">
      {/* Googleでサインイン */}
      <GoogleSignInButton disabled={isLoading} />
      {/* Appleでサインイン */}
      <AppleSignInButton disabled={isLoading} />
    </View>
  );
}

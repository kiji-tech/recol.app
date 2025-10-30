import React from 'react';
import { Platform, View } from 'react-native';
import { GoogleSignInButton, AppleSignInButton } from '../';

export default function ExternalSignInButton({ isLoading }: { isLoading: boolean }) {
  return (
    <View className="flex flex-row justify-center items-center gap-2 mb-4">
      {/* Googleでサインイン */}
      {Platform.OS === 'android' && <GoogleSignInButton disabled={isLoading} />}
      {/* Appleでサインイン */}
      {Platform.OS === 'ios' && <AppleSignInButton disabled={isLoading} />}
    </View>
  );
}

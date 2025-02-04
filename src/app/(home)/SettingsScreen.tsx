import React from 'react';
import { BackgroundView, Button } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/libs/supabase';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.navigate('/(auth)/SignIn');
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        {/* ユーザー情報 */}
        <Text className="text-2xl font-bold">{user?.email}</Text>
        {/* サインアウト */}
        <Button theme="danger" text="サインアウト" onPress={handleSignOut} />
      </BackgroundView>
    </SafeAreaView>
  );
}

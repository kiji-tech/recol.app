import { BackgroundView, Button } from '@/src/components';
import { supabase } from '@/src/libs/supabase';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.navigate('/(auth)/SignIn');
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        <Text>title</Text>
        {/* サインアウト */}
        <Button theme="warn" text="サインアウト" onPress={handleSignOut} />
      </BackgroundView>
    </SafeAreaView>
  );
}

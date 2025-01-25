import { BackgroundView, Button } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/src/libs/supabase';
import { Alert } from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const verify = (): boolean => {
    if (!email || !password) {
      alert('入力してください');
      return false;
    }
    return true;
  };

  const signInWithPassword = async () => {
    // verify
    if (!verify()) return;
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert(error.message);
      return;
    }
    router.navigate('/(home)');
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        <View className="flex flex-col items-center gap-8 w-full">
          <Text className="text-4xl font-bold">Welcome to the Voyx</Text>
          {/* 画像 */}
          <View className="bg-light-theme h-96 w-96 rounded-xl mb-4"></View>
          {/* form */}
          <TextInput
            className="w-full h-10 p-2 border border-gray-50 dark:border-gray-70 rounded-lg bg-gray-100 dark:bg-dark-primary-base dark:text-gray-100 shadow-md"
            keyboardType="email-address"
            placeholder={'メールアドレス'}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            className="w-full h-10 p-2 border border-gray-50 dark:border-gray-70 rounded-lg bg-gray-100 dark:bg-dark-primary-base dark:text-gray-100 shadow-md"
            keyboardType="visible-password"
            placeholder={'パスワード'}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          {/* サインイン */}
          <View className="w-full flex flex-col gap-4 ">
            <Button theme={'theme'} text="サインイン" onPress={signInWithPassword} />
            <Button theme={'theme'} text="新規登録" onPress={() => router.push('/(auth)/SignUp')} />
            {/* TODO: Googleでサインイン */}
            {/* 新規登録 */}
          </View>
          {/* パスワードを忘れた */}
          <Link href="/(auth)/ForgetPassword" className="text-xs border-b-[1px] ">
            パスワードを忘れた方はこちら
          </Link>
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}

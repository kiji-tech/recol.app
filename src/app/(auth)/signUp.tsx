import { BackgroundView, Button } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/src/libs/supabase';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const verify = (): boolean => {
    if (!email || !password || !password2) {
      alert('入力してください');
      return false;
    }
    if (password != password2) {
      alert('パスワードが一致しません');
      return false;
    }
    return true;
  };

  const signUpWithPassword = async () => {
    // verify
    if (!verify()) return;

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert(error.message);
      return;
    }
    if (!session) Alert.alert('Please check your inbox for email verification!');
    router.navigate('/(home)');
  };

  return (
    <SafeAreaView>
      <BackgroundView>
        <View className="flex flex-col justify-start items-center gap-4 w-[80%]">
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
          <TextInput
            className="w-full h-10 p-2 border border-gray-50 dark:border-gray-70 rounded-lg bg-gray-100 dark:bg-dark-primary-base dark:text-gray-100 shadow-md"
            keyboardType="visible-password"
            placeholder={'パスワード（確認）'}
            value={password2}
            onChangeText={(text) => setPassword2(text)}
          />
          <View className="w-full flex flex-col gap-4 ">
            {/* 新規登録 */}
            <Button theme="primary" text="新規登録" onPress={signUpWithPassword} />
            {/* TODO: Googleでサインイン */}
            {/* ログイン画面に戻る */}
          </View>
          <Link href="/(auth)/signIn" className="text-xs border-b-[1px] ">
            ログイン画面に戻る
          </Link>
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}

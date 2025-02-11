import { BackgroundView, Button } from '@/src/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/src/libs/supabase';

export default function SignUpScreen() {
  // ==== Member ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  // ==== Method ===
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
        <View className="flex flex-col items-center w-full gap-8 ">
          <Text className="text-4xl font-bold">Welcome to the Voyx</Text>
          {/* 画像 */}
          <View className="bg-light-theme h-96 w-96 rounded-xl mb-4"></View>
          {/* form */}
          <TextInput
            placeholder="メールアドレス"
            className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            placeholder="パスワード"
            className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            placeholder="パスワード（確認）"
            className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background border-light-border dark:border-dark-border
                `}
            value={password2}
            secureTextEntry={true}
            onChangeText={(text) => setPassword2(text)}
          />

          {/* サインイン */}
          <View className="w-full flex flex-col gap-4 ">
            <Button theme={'theme'} text="新規登録" onPress={signUpWithPassword} />
          </View>
          <Link href="/(auth)/SignIn" className="text-xs border-b-[1px] ">
            ログイン画面に戻る
          </Link>
        </View>
      </BackgroundView>
    </SafeAreaView>
  );
}
